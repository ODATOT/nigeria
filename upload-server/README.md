# 자료 업로드 서버

`docs/NA/LMS2/docs/upload.html`에서 드래그앤드롭으로 올린 파일을 받아 저장합니다.

- **Gitea 방식 (대용량 권장):** Gitea 패키지 저장소(조직 `ace-uploads`)에 팀 → 분류 → 파일로 저장
- **로컬 방식:** `ODA_AI_SW/uploads/<분류>/` 폴더에 저장

Gitea 토큰이 설정되어 있으면 Gitea 방식, 없으면 로컬 방식으로 동작합니다.
Gitea 설치 · 설정 · 운영은 **[GITEA_GUIDE.md](GITEA_GUIDE.md)**를 참고하세요.

## 실행

```bash
cd ~/workspace/ODA_AI_SW
python3 upload-server/upload_server.py
```

- 또는 Finder에서 `upload-server/start-upload-server.command`를 더블클릭해도 됩니다.
- 실행 확인: 브라우저에서 `http://localhost:8787/health` → `"ok": true`
- 터미널을 열어 둔 동안만 업로드가 동작합니다 (종료: `Ctrl+C`). 추가 설치 불필요 (Python 3 표준 라이브러리).
- 설정은 `gitea.env.example`을 `gitea.env`로 복사해 수정합니다.
- 처음 실행할 때 macOS가 들어오는 연결 허용을 물으면 허용합니다.
