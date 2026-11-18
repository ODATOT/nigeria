# Gitea로 대용량 자료 업로드 운영하기

ACE AI SW 과정에서 학생들이 올리는 과제·발표 자료·데모 영상·프로젝트 압축 파일을 **강사용 맥북의 Gitea**에 모아 두는 방법입니다.
`upload.html` 페이지는 그대로 쓰고, 파일이 저장되는 곳만 Gitea로 바뀝니다.

---

## 1. 왜 Gitea인가

| | 기존 방식 (uploads 폴더) | Gitea 방식 |
|---|---|---|
| 저장 위치 | `ODA_AI_SW/uploads/` 폴더 | Gitea 패키지 저장소 (조직 `ace-uploads`) |
| 파일 확인 | Finder에서 폴더 열기 | 웹 화면에서 팀별 · 분류별 목록, 다운로드 |
| 대용량 | 단일 파일 저장 | 수 GB 파일도 스트리밍 저장, 프로젝트는 Git LFS |
| 정리 단위 | 파일 이름 앞 팀명 | **팀(패키지) → 분류(버전) → 파일** 구조 |
| 권한 | 없음 | 계정 · 조직 · 팀 권한, 액세스 토큰 |
| 백업 | 폴더 복사 | `gitea dump` 한 번으로 전체 백업 |
| 공개 범위 | 웹 폴더 안이면 노출 가능 | 조직을 비공개로 두면 로그인한 사람만 열람 |

---

## 2. 전체 구조

```
학생 브라우저
  └─ upload.html  (http://devhj.local/ODA_AI_SW/docs/NA/LMS2/docs/upload.html)
       │  드래그앤드롭 · 이름/팀 · 제출 분류
       ▼
  upload_server.py  (맥북 :8787)        ← Gitea 토큰은 여기에만 보관
       │  PUT /api/packages/ace-uploads/generic/<팀>/<분류>/<파일>
       ▼
  Gitea  (맥북 :3000)  →  조직 ace-uploads  →  Packages
```

- **브라우저가 Gitea에 직접 올리지 않는 이유:** Gitea의 CORS 설정은 `/api/v1`에는 적용되지만 패키지 API(`/api/packages`)에는 적용되지 않아 다른 주소의 페이지에서 바로 호출할 수 없습니다. 또 토큰을 페이지에 넣으면 누구나 볼 수 있습니다. 그래서 맥북의 업로드 서버가 중계합니다.
- **저장 규칙:** 팀명 → 패키지 이름, 제출 분류 → 버전, 파일 → 파일 이름
  - 예: `team-spark` / `day10-final` / `final-deck.pdf`
  - Gitea 이름에는 영문 · 숫자 · `. - + _`만 쓸 수 있습니다. 한글이 섞이면 영문 부분 + 짧은 구분 코드로 바뀝니다 (`팀 스파크` → `team-ea7f58`). **팀명은 영문을 권장**합니다.
  - 같은 이름의 파일이 이미 있으면 `파일-1.pdf`, `파일-2.pdf`로 저장되어 덮어쓰지 않습니다.

---

## 3. Gitea 설치 (맥북, 1회)

```bash
brew install gitea
brew services start gitea        # 로그인할 때마다 자동 실행
# 중지: brew services stop gitea
```

1. 브라우저에서 `http://localhost:3000` 접속 → 초기 설정 화면
2. **데이터베이스: SQLite3** 선택 (별도 설치 불필요)
3. **서버 도메인:** `devhj.local`, **Gitea 기본 URL:** `http://devhj.local:3000/`
4. 아래쪽 **관리자 계정 설정**에서 관리자 계정을 만들고 설치

> macOS에서는 Homebrew 설치가 공식 지원 방법입니다.

---

## 4. 대용량 설정 (app.ini)

설정 파일 위치는 **사이트 관리 → 구성(Configuration)** 화면 상단에서 확인합니다.
(Homebrew 설치 시 보통 Apple Silicon: `/opt/homebrew/var/gitea/custom/conf/app.ini`, Intel: `/usr/local/var/gitea/custom/conf/app.ini`)

```ini
[server]
DOMAIN           = devhj.local
ROOT_URL         = http://devhj.local:3000/
HTTP_PORT        = 3000
LFS_START_SERVER = true        ; Git LFS 사용 (대용량 프로젝트 저장소)
LFS_MAX_FILE_SIZE = 0          ; 0 = LFS 파일 크기 제한 없음

[packages]
ENABLED            = true
LIMIT_SIZE_GENERIC = -1        ; Generic 패키지 파일 크기 제한 (-1 = 없음, 예: 8 GiB)

[repository.upload]
FILE_MAX_SIZE = 1024           ; 웹 화면에서 저장소에 직접 올릴 때 파일당 MB (기본 50)
MAX_FILES     = 20

[attachment]
MAX_SIZE  = 2048               ; 이슈 · 릴리스 첨부 파일당 MB
MAX_FILES = 20
```

저장 후 재시작: `brew services restart gitea`

> 설정 이름과 기본값은 Gitea 버전에 따라 다를 수 있으니 설치한 버전의 Configuration Cheat Sheet를 함께 확인하세요.
> Gitea 앞에 nginx · Apache 같은 프록시를 둔다면 프록시의 업로드 크기 제한(`client_max_body_size`, `LimitRequestBody`)도 함께 늘려야 합니다. 업로드 서버는 Gitea에 `127.0.0.1:3000`으로 직접 연결하므로 기본 구성에서는 해당 없음.

---

## 5. 조직 · 업로드 계정 · 토큰 (1회)

1. **조직 만들기:** 오른쪽 위 `+` → 새 조직 → 이름 `ace-uploads`, 공개 범위 **비공개** 권장
2. **업로드 전용 계정:** 사이트 관리 → 사용자 계정 → `upload-bot` 생성
3. **권한:** `ace-uploads` 조직 → 팀 → 새 팀 `uploaders` → 권한에서 **패키지(Packages) 쓰기** 허용 → `upload-bot` 추가
   (간단히 하려면 `upload-bot`을 Owners 팀에 넣어도 됩니다)
4. **토큰 발급:** `upload-bot`으로 로그인 → 설정 → 애플리케이션 → 새 토큰 → 권한 **package: 읽기 및 쓰기** → 생성된 값 복사
5. **토큰 저장:** 맥북 터미널에서

```bash
cd ~/workspace/ODA_AI_SW/upload-server
cp gitea.env.example gitea.env      # 필요하면 값 수정
printf '%s' '여기에_토큰_붙여넣기' > .gitea_token
chmod 600 .gitea_token gitea.env
```

`.gitea_token`과 `gitea.env`는 `.gitignore`로 Git 커밋에서 제외되어 있습니다.

---

## 6. 업로드 서버 실행

```bash
cd ~/workspace/ODA_AI_SW
python3 upload-server/upload_server.py
```

정상이라면 터미널에 다음처럼 표시됩니다.

```
[ACE Upload] 저장 방식: gitea
[ACE Upload] Gitea: http://127.0.0.1:3000 · 조직 ace-uploads · 계정 upload-bot → 연결됨 1.xx.x
```

- 토큰이 있으면 자동으로 **gitea** 방식, 없으면 기존 **local**(uploads 폴더) 방식으로 동작합니다.
- 두 곳 모두 저장하려면 `gitea.env`에 `STORAGE=both`
- 업로드 페이지 상단에 **업로드 서버 연결됨 · 저장소: Gitea**가 보이면 준비 완료입니다.

| 설정 (gitea.env 또는 환경 변수) | 기본값 | 설명 |
|---|---|---|
| `STORAGE` | 토큰 있으면 `gitea` | `gitea` · `local` · `both` |
| `GITEA_URL` | `http://127.0.0.1:3000` | 업로드 서버가 Gitea에 접속하는 주소 |
| `GITEA_PUBLIC_URL` | `http://devhj.local:3000` | 학생 화면의 "Gitea에서 보기" 링크 주소 |
| `GITEA_OWNER` | `ace-uploads` | 파일을 보관할 조직 |
| `GITEA_USER` | `upload-bot` | 토큰을 발급한 계정 |
| `UPLOAD_MAX_MB` | `4096` | 파일 1개 최대 크기 (MB) |
| `UPLOAD_PORT` | `8787` | 바꾸면 `upload.html`의 `UPLOAD_PORT`도 같이 변경 |

---

## 7. 올라온 파일 확인 · 내려받기

- 웹: `http://devhj.local:3000/ace-uploads/-/packages` → 팀(패키지) → 분류(버전) → 파일
- 업로드 완료 목록의 **Gitea에서 보기 ↗** 링크로도 바로 이동합니다.
- 명령줄로 받기:

```bash
curl --user 관리자:토큰 -O \
  http://devhj.local:3000/api/packages/ace-uploads/generic/team-spark/day10-final/final-deck.pdf
```

- 잘못 올린 파일 삭제: 웹 화면의 패키지 설정에서 삭제하거나
  `curl --user 관리자:토큰 -X DELETE <위 주소>`

제출 분류(버전) 값: `general` · `homework` · `day07-midterm` · `day08-integration` · `day09-poc` · `day10-final`

---

## 8. 아주 큰 파일 · 프로젝트 전체는 Git LFS로

수 GB 단위 영상이나 데이터셋, 프로젝트 저장소 전체는 브라우저 업로드보다 Git + LFS가 안정적입니다 (중간에 끊겨도 다시 push).

```bash
# 학생 PC (학생 Gitea 계정 필요)
git lfs install
git lfs track "*.mp4" "*.zip" "*.psd"
git add .gitattributes
git add . && git commit -m "final: 발표 자료와 데모 영상"
git remote add gitea http://devhj.local:3000/ace-uploads/team-spark.git
git push gitea main
```

- 저장소를 `ace-uploads` 조직 아래 팀별로 만들고 학생 계정에 쓰기 권한을 줍니다.
- 웹 화면에서 직접 파일을 올리는 경우는 `[repository.upload] FILE_MAX_SIZE` 제한을 받습니다.

---

## 9. 백업

```bash
# Gitea 데이터 전체(DB · 저장소 · 패키지 · LFS)를 zip으로
gitea dump -c <app.ini 경로>
```

수료 후에는 `ace-uploads` 조직의 패키지를 내려받아 보관하고, 필요하면 조직을 정리합니다.

---

## 10. 문제 해결

| 증상 | 원인 · 해결 |
|---|---|
| 페이지에 "업로드 서버에 연결할 수 없음" | `upload_server.py`가 실행 중인지, 같은 Wi-Fi인지, macOS 방화벽에서 Python 허용 여부 확인 |
| "Gitea 연결 안 됨 · 연결 실패" | `brew services start gitea`, `http://localhost:3000` 접속 확인 |
| `Gitea HTTP 401` | 토큰 · `GITEA_USER` 불일치. 토큰을 발급한 계정 이름을 `GITEA_USER`에 |
| `Gitea HTTP 403` | `upload-bot`에 조직 패키지 쓰기 권한이 없음 (5단계 3번) |
| `Gitea HTTP 404` | 조직 `ace-uploads`가 없거나 `[packages] ENABLED = false` |
| `Gitea HTTP 413` | `LIMIT_SIZE_GENERIC` 또는 프록시 업로드 제한 초과 |
| "파일이 너무 큽니다" | `UPLOAD_MAX_MB` 값 증가 |
| 형식 차단 | `.html .js .php .py .sh .svg` 등은 ZIP으로 압축해서 업로드 |
| 팀명이 `team-xxxxxx`로 보임 | 한글 팀명 → 영문 팀명 사용 권장 |

---

## 11. 보안 메모

- 토큰은 맥북의 `upload-server/.gitea_token`에만 두고, 페이지나 Git에 넣지 않습니다.
- 업로드 서버는 `UPLOAD_ORIGINS`(기본 devhj.local · localhost)에서 열린 페이지의 요청만 받습니다.
- 업로드 페이지에는 로그인이 없으므로, 같은 네트워크에서 주소를 아는 사람은 업로드할 수 있습니다. 수업 시간에만 서버를 켜 두는 것을 권장합니다.
- 조직을 비공개로 두면 업로드된 파일은 Gitea에 로그인한 권한 있는 사람만 볼 수 있습니다.

---

참고: [Gitea 설치(패키지)](https://docs.gitea.com/installation/install-from-package/) · [Generic Package Registry](https://docs.gitea.com/usage/packages/generic/) · [Configuration Cheat Sheet](https://docs.gitea.com/administration/config-cheat-sheet/) · [Git LFS setup](https://docs.gitea.com/administration/git-lfs-setup/)
