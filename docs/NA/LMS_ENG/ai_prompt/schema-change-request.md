# Requirements Change Request

* **Request Title**: Enhancing the reservation confirmation process and introducing an approval stage to prevent fraud
* **Before change (v1.0)**:
  - When users apply for a reservation, they enter the payment amount and proceed with payment immediately. Reservation is confirmed upon completion of payment.
* **After changes (v2.0)**:
  - Users just ‘apply’ for a reservation and wait. (DB: status = 'WAIT_APPROVE')
  - The user's payment window will be activated only after the expert reviews the topic of the consultation request and processes 'Approve'.
  - Only when the user completes the payment does the reservation status change to ‘CONFIRMED’.