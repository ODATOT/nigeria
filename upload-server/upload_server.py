#!/usr/bin/env python3
"""ACE AI SW · 자료 업로드 서버 (Python 표준 라이브러리만 사용)

브라우저(upload.html) → 이 서버(:8787) → 저장소
  - STORAGE=gitea  : Gitea Generic Package Registry 로 스트리밍 업로드 (대용량 권장)
  - STORAGE=local  : ODA_AI_SW/uploads/ 폴더에 저장
  - STORAGE=both   : 두 곳 모두 저장
  (기본값: Gitea 토큰이 설정되어 있으면 gitea, 없으면 local)

실행 (ODA_AI_SW 폴더에서):
    python3 upload-server/upload_server.py

설정은 환경 변수 또는 upload-server/gitea.env 파일(KEY=VALUE)로 지정합니다.
    UPLOAD_PORT        8787
    UPLOAD_MAX_MB      파일 1개 최대 크기 MB (기본 4096)
    UPLOAD_ORIGINS     허용할 페이지 호스트 (기본 devhj.local,localhost,127.0.0.1)
    STORAGE            gitea | local | both
    GITEA_URL          이 맥에서 Gitea에 접속하는 주소 (기본 http://127.0.0.1:3000)
    GITEA_PUBLIC_URL   학생 브라우저에 보여 줄 Gitea 주소 (기본 http://devhj.local:3000)
    GITEA_OWNER        파일을 보관할 조직 이름 (기본 ace-uploads)
    GITEA_USER         업로드용 계정 (기본 upload-bot)
    GITEA_TOKEN        액세스 토큰 (또는 upload-server/.gitea_token 파일)
"""
import base64
import hashlib
import http.client
import json
import os
import re
import socket
import sys
import time
import unicodedata
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, unquote, urlparse

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent                                   # ODA_AI_SW


def load_env_file():
    f = HERE / "gitea.env"
    if f.exists():
        for line in f.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


load_env_file()
UPLOAD_DIR = ROOT / "uploads"
PORT = int(os.environ.get("UPLOAD_PORT", "8787"))
MAX_BYTES = int(float(os.environ.get("UPLOAD_MAX_MB", "4096")) * 1024 * 1024)
ALLOWED_HOSTS = {h.strip().lower() for h in os.environ.get("UPLOAD_ORIGINS", "devhj.local,localhost,127.0.0.1").split(",") if h.strip()}
GITEA_URL = os.environ.get("GITEA_URL", "http://127.0.0.1:3000").rstrip("/")
GITEA_PUBLIC_URL = os.environ.get("GITEA_PUBLIC_URL", "http://devhj.local:3000").rstrip("/")
GITEA_OWNER = os.environ.get("GITEA_OWNER", "ace-uploads")
GITEA_USER = os.environ.get("GITEA_USER", "upload-bot")
_tok_file = HERE / ".gitea_token"
GITEA_TOKEN = os.environ.get("GITEA_TOKEN") or (_tok_file.read_text(encoding="utf-8").strip() if _tok_file.exists() else "")
STORAGE = os.environ.get("STORAGE", "gitea" if GITEA_TOKEN else "local").lower()
if STORAGE not in {"gitea", "local", "both"}:
    STORAGE = "local"
USE_GITEA = STORAGE in {"gitea", "both"}
USE_LOCAL = STORAGE in {"local", "both"}

# 업로드 결과가 웹으로 열릴 수 있으므로 실행·스크립트 파일은 차단 (ZIP 압축은 허용)
BLOCKED_EXT = {".php", ".phtml", ".html", ".htm", ".shtml", ".js", ".mjs", ".svg", ".xhtml", ".cgi", ".pl", ".py", ".sh", ".htaccess"}
CATEGORIES = {"general", "day07-midterm", "day08-integration", "day09-poc", "day10-final", "homework"}
CHUNK = 1024 * 1024


# ---------- name helpers ----------
def display_name(raw: str) -> str:
    name = unicodedata.normalize("NFC", unquote(raw or "")).replace("\\", "/").split("/")[-1]
    name = re.sub(r"[\x00-\x1f<>:\"|?*]", "_", name).strip().strip(".")
    stem, ext = os.path.splitext(name or "file")
    return (stem[:150] or "file") + ext[:20]


def gitea_safe(text: str, fallback: str) -> str:
    """Gitea generic package/file 이름: 영문·숫자·. - + _ 만 허용."""
    ascii_part = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    s = re.sub(r"[^A-Za-z0-9._+-]+", "-", ascii_part).strip("-._")
    if s != text:                                   # 한글 등 변환된 경우 원래 이름의 짧은 해시를 붙여 구분
        s = (s or fallback) + "-" + hashlib.sha1(text.encode("utf-8")).hexdigest()[:6]
    return (s or fallback)[:120]


def gitea_file_name(name: str) -> str:
    stem, ext = os.path.splitext(name)
    ext = re.sub(r"[^A-Za-z0-9.]", "", ext)[:15]
    return gitea_safe(stem, "file") + ext


def unique_local(name: str) -> Path:
    target = UPLOAD_DIR / name
    stem, ext = os.path.splitext(name)
    n = 1
    while target.exists():
        target = UPLOAD_DIR / f"{stem} ({n}){ext}"
        n += 1
    return target


# ---------- gitea ----------
def _gitea_conn():
    u = urlparse(GITEA_URL)
    cls = http.client.HTTPSConnection if u.scheme == "https" else http.client.HTTPConnection
    return cls(u.hostname, u.port or (443 if u.scheme == "https" else 80), timeout=600), (u.path or "").rstrip("/")


def _auth():
    return "Basic " + base64.b64encode(f"{GITEA_USER}:{GITEA_TOKEN}".encode()).decode()


def gitea_status():
    if not USE_GITEA:
        return {"enabled": False}
    if not GITEA_TOKEN:
        return {"enabled": True, "ok": False, "error": "GITEA_TOKEN 미설정"}
    try:
        conn, base = _gitea_conn()
        conn.request("GET", base + "/api/v1/version", headers={"Authorization": _auth()})
        r = conn.getresponse()
        body = r.read()
        conn.close()
        if r.status == 200:
            return {"enabled": True, "ok": True, "version": json.loads(body).get("version"), "owner": GITEA_OWNER, "url": GITEA_PUBLIC_URL}
        return {"enabled": True, "ok": False, "error": f"HTTP {r.status}"}
    except OSError as exc:
        return {"enabled": True, "ok": False, "error": f"연결 실패: {exc}"}


def gitea_put(src_path: Path, package: str, version: str, file_name: str, size: int):
    """임시 파일을 Gitea generic package 로 스트리밍 업로드. 같은 이름이면 -1, -2 … 를 붙여 재시도."""
    stem, ext = os.path.splitext(file_name)
    for attempt in range(0, 50):
        fname = file_name if attempt == 0 else f"{stem}-{attempt}{ext}"
        path = "/api/packages/{}/generic/{}/{}/{}".format(*(quote(x, safe="") for x in (GITEA_OWNER, package, version, fname)))
        conn, base = _gitea_conn()
        conn.putrequest("PUT", base + path)
        conn.putheader("Authorization", _auth())
        conn.putheader("Content-Type", "application/octet-stream")
        conn.putheader("Content-Length", str(size))
        conn.endheaders()
        with open(src_path, "rb") as f:
            while True:
                chunk = f.read(CHUNK)
                if not chunk:
                    break
                conn.send(chunk)
        r = conn.getresponse()
        detail = r.read().decode("utf-8", "replace")[:300]
        conn.close()
        if r.status in (200, 201):
            return {
                "file": fname,
                "page": f"{GITEA_PUBLIC_URL}/{GITEA_OWNER}/-/packages/generic/{quote(package)}/{quote(version)}",
                "download": f"{GITEA_PUBLIC_URL}{path}",
            }
        if r.status == 409:
            continue
        hint = {401: "토큰 또는 계정이 올바르지 않습니다", 403: "업로드 계정에 패키지 쓰기 권한이 없습니다",
                404: f"조직 '{GITEA_OWNER}'이 없거나 패키지 기능이 꺼져 있습니다", 413: "Gitea 또는 프록시의 크기 제한을 초과했습니다"}.get(r.status, "")
        raise RuntimeError(f"Gitea HTTP {r.status} {hint} {detail}".strip())
    raise RuntimeError("같은 이름의 파일이 너무 많습니다")


# ---------- http ----------
class Handler(BaseHTTPRequestHandler):
    server_version = "AceUpload/2.0"

    def _origin_ok(self):
        origin = self.headers.get("Origin")
        if not origin:
            return None
        host = (urlparse(origin).hostname or "").lower()
        return origin if host in ALLOWED_HOSTS else False

    def _send(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        origin = self._origin_ok()
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        origin = self._origin_ok()
        self.send_response(204 if origin else 403)
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, X-File-Name, X-Uploader, X-Category")
            self.send_header("Access-Control-Max-Age", "600")
            self.send_header("Vary", "Origin")
        self.end_headers()

    def do_GET(self):
        if urlparse(self.path).path == "/health":
            g = gitea_status()
            ok = (not USE_GITEA) or g.get("ok", False)
            return self._send(200, {"ok": ok, "storage": STORAGE, "maxMB": MAX_BYTES // (1024 * 1024),
                                    "blocked": sorted(BLOCKED_EXT), "categories": sorted(CATEGORIES), "gitea": g})
        self._send(404, {"ok": False, "error": "not found"})

    def do_POST(self):
        if urlparse(self.path).path != "/upload":
            return self._send(404, {"ok": False, "error": "not found"})
        if self._origin_ok() is False:
            return self._send(403, {"ok": False, "error": "허용되지 않은 페이지에서의 요청입니다."})
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = -1
        if length <= 0:
            return self._send(400, {"ok": False, "error": "빈 파일이거나 크기를 알 수 없습니다."})
        if length > MAX_BYTES:
            return self._send(413, {"ok": False, "error": f"파일이 너무 큽니다 (최대 {MAX_BYTES // (1024 * 1024)}MB)."})
        name = display_name(self.headers.get("X-File-Name", ""))
        if os.path.splitext(name)[1].lower() in BLOCKED_EXT or name.lower() == ".htaccess":
            return self._send(415, {"ok": False, "error": "보안상 이 형식의 파일은 업로드할 수 없습니다. ZIP으로 압축해서 올려 주세요."})
        uploader = display_name(self.headers.get("X-Uploader", ""))[:40] if self.headers.get("X-Uploader") else ""
        category = (self.headers.get("X-Category") or "general").strip().lower()
        if category not in CATEGORIES:
            category = "general"

        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        tmp = UPLOAD_DIR / f".incoming-{int(time.time() * 1000)}-{os.getpid()}-{id(self)}.part"
        remaining = length
        try:
            with open(tmp, "wb") as f:
                while remaining > 0:
                    chunk = self.rfile.read(min(CHUNK, remaining))
                    if not chunk:
                        raise ConnectionError("업로드가 중간에 끊겼습니다")
                    f.write(chunk)
                    remaining -= len(chunk)
            result = {"ok": True, "name": name, "size": length, "storage": STORAGE}
            if USE_GITEA:
                pkg = gitea_safe(uploader, "team") if uploader else "unnamed"
                result["gitea"] = gitea_put(tmp, pkg, category, gitea_file_name(name), length)
                result["name"] = f"{pkg}/{category}/{result['gitea']['file']}"
            if USE_LOCAL:
                local_name = (f"{uploader}_" if uploader else "") + name
                sub = UPLOAD_DIR / category
                sub.mkdir(exist_ok=True)
                target = unique_local(f"{category}/{local_name}")
                os.replace(tmp, target)
                result["local"] = str(target.relative_to(ROOT))
                if not USE_GITEA:
                    result["name"] = target.name
        except Exception as exc:  # noqa: BLE001
            return self._send(502 if USE_GITEA else 500, {"ok": False, "error": f"저장 실패: {exc}"})
        finally:
            if tmp.exists():
                try:
                    tmp.unlink()
                except OSError:
                    pass
        self.log_message("saved %s (%d bytes) -> %s", result["name"], length, STORAGE)
        self._send(201, result)


class DualStackServer(ThreadingHTTPServer):
    """IPv4 + IPv6 동시 수신 (devhj.local 이 IPv6 주소로 연결되는 경우 대비)."""
    address_family = socket.AF_INET6

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except (AttributeError, OSError):
            pass
        super().server_bind()


def make_server():
    try:
        return DualStackServer(("::", PORT), Handler)
    except OSError:
        return ThreadingHTTPServer(("0.0.0.0", PORT), Handler)


def main():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    try:
        httpd = make_server()
    except OSError as exc:
        print(f"[ACE Upload] 포트 {PORT}를 열 수 없습니다: {exc}")
        print("[ACE Upload] 이미 실행 중인 업로드 서버가 있는지 확인하세요:  lsof -i :%d" % PORT)
        sys.exit(1)
    print(f"[ACE Upload] 저장 방식: {STORAGE}")
    if USE_GITEA:
        g = gitea_status()
        print(f"[ACE Upload] Gitea: {GITEA_URL} · 조직 {GITEA_OWNER} · 계정 {GITEA_USER} → {'연결됨 ' + str(g.get('version')) if g.get('ok') else '연결 안 됨 (' + str(g.get('error')) + ')'}")
    if USE_LOCAL:
        print(f"[ACE Upload] 로컬 폴더: {UPLOAD_DIR}")
    print(f"[ACE Upload] 서버 실행 중: 포트 {PORT}  · 확인: http://localhost:{PORT}/health  (허용 페이지: {', '.join(sorted(ALLOWED_HOSTS))}) · 종료: Ctrl+C")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[ACE Upload] 종료합니다.")
        sys.exit(0)


if __name__ == "__main__":
    main()
