# Minutes of architectural design and database normalization decisions

* **Attendees**: PM_David, Dev_Lead, DB_Admin
* **Agenda**: Review of the feasibility of managing reservation cancellation history and separating payment tables 1:1
* **Meeting Notes**:
  - **Dev_Lead**: Wouldn't it be convenient to just open the 'canceled_at' and 'cancel_reason' columns in the existing Reservations table and set the status value to 'CANCELED'?
  - **DB_Admin**: Due to the nature of the service, users may change schedules and cancel multiple times, so direct addition of columns is not possible for multiple history processing. Also, the number of cancellation log views is significantly lower than the daily number of reservations, but if you continue to pile up data in the main table, a lock bottleneck will occur in the entire table.
  - **Dev_Lead**: Ah, I see. Then, it would be reasonable to keep the main reservation table up to date, and separate cancellation and history 1:N into the 'Reservation_Histories' table.
  - **PM_David**: Good idea. For statistical aggregation performance and security audit purposes, let's proceed with that alternative. I make the final confirmation and approve it.