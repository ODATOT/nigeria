# Project fragmentation terminology management document

* **Notation in Figma UI plan**:
  - User information screen: ‘Customer name’, ‘Withdrawal member’
  - Expert matching card: ‘Teacher profile’, ‘Professional counselor field’
  - Reservation form: ‘Consultation application time’, ‘Reservation type’

* **Notation in backend API specification**:
  - GET /user/profile -> 'nickname', 'MemberStatus'
  - POST /counselor/register -> 'CounselorName', 'category'
  - GET /book/history -> 'book_id', 'status'

* **Notation of database SQL DDL**:
  - TABLE members -> 'member_id', 'email', 'nick_name'
  - TABLE counselors -> 'counselor_id', 'name'
  - TABLE reservations -> 'res_id', 'user_id', 'counselor_id'