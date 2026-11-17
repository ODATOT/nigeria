# Nigeria LMS login recorder

이 Apps Script 웹 앱은 `TOT 출석부`의 `출석부` 탭 B:D 열에서 참가자 명부를 읽고, 로그인 성공 기록을 `로그인기록` 탭 A:P 열에 추가합니다.

## API

- `GET ?action=students`: `AI-TOT-*` 참가자 ID, 이름, 소속/기관 반환
- `POST`: 참가자 ID 검증 후 로그인 기록 추가
- 동일 `eventId`는 6시간 동안 중복 저장하지 않음
- 동시 요청은 `LockService`로 직렬화

## 배포

1. Apps Script 새 프로젝트에서 `Code.gs`와 `appsscript.json`을 동일하게 구성합니다.
2. 웹 앱으로 배포하고 실행 사용자는 본인, 액세스 권한은 모든 사용자로 설정합니다.
3. 배포 URL을 `docs/login/login.js`의 `APP_SCRIPT_URL`에 입력합니다.

배포된 웹 앱 URL:

`https://script.google.com/macros/s/AKfycbwPNW10w782cWrajXBFC4f7X1vhC_Qf_gLIWWgnCvPoc0khX9WUKkjpt6grzBcqGqbs/exec`

수집 항목은 서버/클라이언트 시각, 참가자 정보, 이벤트/세션 ID, 페이지 경로와 브라우저가 제공하는 기기 유형·User Agent·플랫폼·언어·시간대·화면 해상도·메모리·CPU 코어입니다. Apps Script 웹 앱은 접속자의 IP 주소를 제공하지 않으므로 IP는 저장하지 않습니다.
