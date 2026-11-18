#!/bin/bash
# Finder에서 더블클릭하면 업로드 서버가 실행됩니다. 창을 닫으면 서버도 종료됩니다.
cd "$(dirname "$0")/.." || exit 1
echo "ACE AI SW 업로드 서버를 시작합니다..."
exec python3 upload-server/upload_server.py
