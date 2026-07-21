# 프로젝트 파편화 용어 관리 문서

* **Figma UI 기획서의 표기**:
  - 사용자 정보 화면: '고객명', '탈퇴회원'
  - 전문가 매칭 카드: '선생님 프로필', '전문 상담사 분야'
  - 예약 폼: '상담 신청 시간', '예약 구분'

* **백엔드 API 명세서의 표기**:
  - GET /user/profile -> 'nickname', 'MemberStatus'
  - POST /counselor/register -> 'CounselorName', 'category'
  - GET /book/history -> 'book_id', 'status'

* **데이터베이스 SQL DDL의 표기**:
  - TABLE members -> 'member_id', 'email', 'nick_name'
  - TABLE counselors -> 'counselor_id', 'name'
  - TABLE reservations -> 'res_id', 'user_id', 'counselor_id'