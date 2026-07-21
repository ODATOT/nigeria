# Day 04. Technical design (API design and interface definition)

In a startup's MVP (Minimum Viable Product) development process, after screen design and database modeling are completed, the key link that actually connects the backend and frontend is **"API design and interface definition"**. If you do not clearly agree and standardize the format in which data will be exchanged (Request/Response) between the screen and the DB, communication errors will occur frequently and communication costs between front-back developers will snowball.

Day 4 practice utilizes Codex AI to automatically create an API contract based on requirements and screen design (Task 01), automatically detect missing functions and inconsistencies between design documents (Task 02), and track the scope of influence of API specification modifications due to business changes (Task 03). Furthermore, you will experience a practice-oriented API interface development pipeline that examines API quality from an architectural perspective, derives improvement plans (Mission 01), and designs API test scenarios that cover various exception cases (Mission 02).

---

# Task 01. API Contract Generation

## 1. Story and practice background

Once the screen design is completed in a project, front-end and back-end developers must first discuss what data will be exchanged. However, when defining the API at the oral meeting or notepad level, essential data fields are omitted, or the English names and data types (String, Number, Boolean) of the fields are defined differently, so when drawing the actual screen, API communication errors often cause the screen to turn white.

In this exercise, you will learn a workflow that uses Codex to automatically create a standardized **API Contract** that is 100% mapped to the planning intent based on an unstructured planning requirements definition and screen definition, and helps you start development without friction by having the front-end and back-end share the same specifications.

---

## 2. Learning objectives

* Business actions (Endpoints) to be exposed in API form can be derived from unstructured requirements specifications.
* You can define the mapping relationship between screen UI components and API Request/Response fields.
* Using AI, you can quickly build a draft API specification that does not violate RESTful rules.

---

## 3. Practice mission

The learner prepares `day4_requirements.md` and `day4_screen_definition.md` in the local project folder and sends the prompt below to Codex Client to derive the API contract.

> "Based on the provided requirements definition and screen definition, please derive a list of required APIs and create a standard API contract by defining the types of Request and Response fields and English variable names."

---

## 4. Example of results

Codex comprehensively analyzes specification data and creates a standardized API contract as follows.

### API Contract (API contract example)

#### [POST] /api/v1/reservations (Consultation reservation application)
* **Description**: General members apply for a reservation by selecting the desired expert and time slot.
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Request Body (JSON)**:
```json
{
  "expert_id": "EXP-091",
  "reservation_date": "2026-07-20T14:00:00Z",
  "payment_amount": 50000
}
```
* **Response Body (JSON) - 201 Created**:
```json
{
  "reservation_id": "RES-2026-0001",
  "status": "WAIT_APPROVE",
  "created_at": "2026-07-16T10:00:00Z"
}
```

---

## 5. AI utilization points

* **Screen-data field reverse inference**: Identify backend response fields without omission based on UI information (e.g. expert information, date) that should be displayed in screen planning.
* **Apply RESTful naming rules**: Automatically converts verb-oriented actions into noun-type endpoint rules (`/api/v1/reservations`) and appropriate HTTP Methods (POST, GET).
* **Data type voluntary regulation**: Data types such as date string (ISO-8601), amount (Integer), and ID identifier (String) are defined according to business characteristics.

---

## 6. Learning points

The first thing that must be agreed upon for parallel development of front-end and back-end is the API contract. By using an AI assistant to agree on clear field names and specifications in advance, the front-end can immediately code components based on virtual mock data even if the back-end is not complete, significantly reducing the overall lead time of the project.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Task 02. API Consistency Check (API Consistency Check)

## 1. Story and practice background

Integration testing period for startups. A bug report comes in from a planner saying, “The rating and specialty hashtags do not appear on the expert list screen!” When I checked, there was a rating (star_rating) field in the front-end plan, but the API specification written by the back-end developer was developed with rating information completely missing. 

When project documents are fragmented like this, a phenomenon called **API Inconsistency** occurs in which the essential requirements of the plan or required fields on the screen are not reflected in the developed API specifications, which causes overall development rework.

In this exercise, you will operate Codex to cross-verify the requirements definition, screen definition, and currently distributed API specification draft, and learn a consistency audit technique that automatically detects planning omissions and data inconsistencies.

---

## 2. Learning objectives

* Functional omissions between requirements definitions and API specifications can be systematically inspected.
* Discrepancies between screen UI required data and actual API response specifications can be identified.
* AI audit assistant can prevent review omissions that occur when humans manually compare.

---

## 3. Practice mission

The learner places the three mixed documents in a local folder and builds the command below in the Codex Client.

> "Please cross-check the provided day4_requirements.md, day4_screen_definition.md, and day4_api_specification_v1.md files to find API endpoints and fields that are inconsistent or missing from the planning requirements or screen UI design, and write a review report."

---

## 4. Example of results

### API Review Report (Inconsistency Report)

| Category | Detected discrepancies/omissions | Risk level | Recommended Action |
|---|---|---|---|
| **Missing field** | The list of ratings (`star_rating`) and hashtags (`tags`) should be displayed in the expert card of `day4_screen_definition.md`, but the corresponding data is missing from the API response field. | **High** | Add the `star_rating` and `tags` fields to the `GET /api/v1/experts` API Response as an array. |
| **Missing Endpoint** | There is a specification in `day4_requirements.md` that the agent must be able to approve/reject reservations, but there is no API for updating the reservation approval status for professionals in the API list. | **Fatal (High)** | A new status change API in the form of `PATCH /api/v1/reservations/{reservation_id}/status` is requested. |

---

## 5. AI utilization points

* **Multiple document context comparison**: By semantically understanding the hierarchical relationship of multiple documents (Markdown), logical 'lack of data field mapping' is detected beyond the level of text match rate search.
* **Autonomous creation of supplementary recommendations**: Provides a RESTful response design plan applicable to points where inconsistencies are detected and a detailed code schema to be added.

---

## 6. Learning points

Quickly catching planning inconsistencies and API design inconsistencies before the testing and deployment stages has a dramatic effect in lowering development costs. Using AI as a requirements consistency detection tool ensures that planning and APIs run accurately like cogs in complex, distributed system specifications.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Intermediate)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Task 03. API Change Impact Analysis (API Impact Analysis)

## 1. Story and practice background

As the service gets back on track, changes to new business specifications are issued. "Previously, the payment amount was sent immediately at the time of reservation creation, but for transparency in the payment process, please separate the flow so that the payment amount field is excluded when creating a reservation and the amount is entered when a separate payment is made after creating the reservation."

Accordingly, the backend developer decided to remove the `payment_amount` field from the reservation request API `POST /api/v1/reservations` request value. However, this change was not disseminated in advance to the front-end development team and the test scenario document creation team, so the front-end sent fields that did not exist, causing a communication error and breaking the test code build pipeline.

In this exercise, we will use Codex to automatically backtrack all screen components and document areas that are affected when API parameters or status flows change, and how to configure a team-shared report that can be distributed without failure.

---

## 2. Learning objectives

* You can analyze the impact that minor changes (deletion, addition, name change) in API contract specifications will have on the system.
* You can identify front-end views that are affected by changes and require immediate revision or modification.
* You can create an impact report to quickly share recommended fixes with fellow developers and the planning team.

---

## 3. Practice mission

The learner prepares a change request and sends the analysis command below to the Codex Client.

> "By analyzing the contents of the provided API change request (day4_api_change_request.md), derive a list of other system areas and documents that are affected when modifying the reservation request API, and write an API impact analysis that can immediately share the work with team members."

---

## 4. Example of results

### API Impact Analysis Report

#### 1. Summary of changes
- **Target API**: `POST /api/v1/reservations` (create reservations)
- **Changes**: Deletion of `payment_amount` field in Request Body

#### 2. Chain influence range and action items
* **Frontend UI**: The input field for entering the payment amount on the member reservation application form screen is hidden or transferred to the `Payment API` stage.
* **Payment integration API**: After creating a reservation, transfer the `amount` transmission logic to the new API `POST /api/v1/payments` that requests payment.
* **Design Document**: Immediate update of `POST /api/v1/reservations` template fields in existing planning specifications and Swagger spec files.

---

## 5. AI utilization points

* **Interface propagation dependency inference**: Automatically extracts the functional impact that an API schema change will have on the front-end UI state and domain flow of back-end logic.
* **Worker-customized action mapping**: Planners, publishers, front-end developers, and QA testers divide and define tasks that need to be fixed in their respective specifications.

---

## 6. Learning points

An API is a collaborative commitment within a development team. To prevent changes on one side from breaking the work of the other, you can develop an architectural awareness of prevention that eliminates unnecessary friction between the front and backend by predicting the impact of changes when modifying an API and responding preemptively.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Intermediate)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Mission 01. API review and improvement (API Review)

## 1. Story and practice background

This is pointed out by an external architecture advisor who saw the API documentation of the startup that first built it. "The URL structure is made up of verbs like `/api/v1/getUsers`, and when an error occurs, an error message is sent in the response body with HTTP Status set to 200 Ok. And when modifying resources, PUT and PATCH are used together. This structure does not comply with scalability and general developer tool standards, resulting in enormous refactoring costs during future advancement."

Failure to adhere to standard API design philosophy and style rules (REST API standards, naming conventions, and consistent exception specifications) in the early design stages will cause development barriers during external integration (Payment PG, external partnerships).

In this mission, you will delegate the written API specification document to Codex to receive a thorough review for compliance with REST standards, and learn the process of deriving improvements outside of the code to improve the quality of the interface to enable global collaboration.

---

## 2. Practice mission

Learners inject the currently written API specification into the Codex Client and request quality review and improvement suggestions as shown below.

> "Please review the provided API specification of day4_api_specification_v1.md, analyze improvements based on REST API design standards (HTTP Method usage, URL naming), consistent error handling structure, and extensibility, and write an API review report."

---

## 3. Example of results

### API Review Report (API review and proposal)

#### [Review Item 1] Endpoint naming improvements
* **AS-IS**: `GET /api/v1/getExperts`, `POST /api/v1/createReservation`
- **TO-BE**: `GET /api/v1/experts`, `POST /api/v1/reservations`
- **Reason**: According to the RESTful specification, actions (get, create) are defined as HTTP Methods, and URL paths are unified as noun plural forms of resources.

#### [Review Item 2] Unification of HTTP status codes and exception specifications
- **AS-IS**: When an error occurs, HTTP Status `200 OK` response and JSON body `{"error": "true", "message": "Auth Fail"}`
- **TO-BE**: Unification of HTTP Status `401 Unauthorized` response and RFC 7807 standard specification error schema.
```json
{
  "type": "https://api.experts.com/errors/unauthorized",
  "title": "Unauthorized Request",
  "status": 401,
  "detail": "Bearer token is missing or has expired."
}
```

---

## 4. AI utilization points

* **Global architecture rule mapping**: Based on the REST API standard (RESTful Maturity Model), all rule-violating items in designs with legacy coding habits are detected.
* **Establishing an error response architecture**: Constructing a standard RFC-compliant exception model so that client developers can consistently try-catch errors.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★★☆ (Advanced)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Mission 02. Create an API test scenario (API Test Scenario)

## 1. Story and practice background

Finally, the backend developer completed the API implementation and uploaded it to the staging server. The front-end developer happily calls the reservation API, but keeps getting a 500 Internal Server Error. When I searched for the cause, I found that only `YYYY-MM-DD` should be entered in the date format, but the data came in as `YYYY-MM-DDTHH:mm:ssZ` and the backend server parser generated an error. The back-end developer only explored the normal situation (happy path) and completed development.

In actual services, numerous edge cases occur, such as abnormal user input, incorrect format transmission, missing required keys, and unauthorized unauthorized requests. If you do not carefully prepare and build a corresponding API test scenario in advance, the real-time monitoring window will be filled with red alarms after release.

In this mission, we automatically create **API test scenarios** that verify not only normal flows but also exceptional conditions and boundary values based on the completed API specification contract, increasing the ability to defend error-free and stable services.

---

## 2. Practice mission

The learner provides the completed API contract specification to the Codex Client and requests the creation of the test scenario below.

> "Based on the currently defined reservation and payment API specification, please create an API test scenario and verification checklist that includes both the normal registration flow (Happy Path) and exception cases such as missing required parameters, date format errors, limit exceeded, and permission expiration."

---

## 3. Example of results

### API testing scenarios and checklists

#### [Scenario ID]: `TC-API-RES-001` (Reservation creation normal flow)
- **Prerequisite**: Normally verified member (with JWT Bearer token)
- **Test procedure**: Send valid `expert_id` and `reservation_date` to Request Body
- **Expected result**: HTTP Status 201 Created and confirmation of creation of new `reservation_id`

#### [Scenario ID]: `TC-API-RES-002` (Required parameter missing exception)
- **Prerequisite**: Normally verified member
- **Test procedure**: Send empty or missing `expert_id` field in Request Body.
- **Expected result**: HTTP Status 400 Bad Request is returned and 'expert_id is required' is specified in the response body.

#### [Scenario ID]: `TC-API-RES-003` (Date format error exception)
- **Prerequisite**: Normally verified member
- **Test procedure**: Sending abnormal string `2026-99-99` to `reservation_date` value
- **Expected result**: Check HTTP Status 400 Bad Request and invalid date format error.

---

## 4. AI utilization points

* **White box-based limit value estimation**: Autonomous calculation of abnormal input values that will induce errors by analyzing the type characteristics of parameters (date format, string limit, number range).
* **Happy/Sad Path separation design**: Derive a structured test matrix by separating the normal processing flow that the system must guarantee and the exception processing flow that must be defended.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Intermediate)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Day 04 Training Organization and Milestones

| Category | Topic | Codex AI Core Actions | Learning Expected Outcomes |
|---|---|---|---|
| **Task 01** | Create API contract | Automatically derive API specifications (Req/Res) from planning requirements and screen definitions | `api-contract.md` |
| **Task 02** | API mismatch detection | Cross-compare planning documents and API specifications to identify missing function contradictions | `api-consistency-report.md` |
| **Task 03** | API change impact analysis | Tracking UI and associated module wavelength range when changing business logic and parameters | `api-impact-analysis.md` |
| **Mission 01** | API reviews and improvements | Review REST architecture rule compliance and propose exception schema standards | `api-review-report.md` |
| **Mission 02** | Create an API test scenario | Creating test cases based on normal operation and various abnormal inputs and boundary values ​​| `api-test-scenario.md` |

---

# Day 04 Original file data history for practice

## 📄 day4_requirements.md
```markdown
# Expert consultation matching service Define functional requirements (v1.0)

* **REQ-001 (Consultation Reservation Application)**:
  - General members search for the desired counselor in the expert list and then apply for a reservation.
  - When applying for a reservation, the counselor identifier and desired reservation date and time must be provided as required information.
  - Non-members who are not registered cannot apply for a reservation, and the authentication token must be valid.

* **REQ-002 (Consultation Reservation Approval)**:
  - Registered experts (counselors) can view reservation applications submitted to them and approve or reject them.
  - Upon approval, the reservation status changes to ‘waiting for payment’.
  - When rejecting, the reason for rejection must be entered as required, and the status becomes 'rejection done'.
```

## 📄 day4_screen_definition.md
```markdown
# Expert consultation reservation service Screen UI definition specification

* **SCR-010 (Expert List and Card UI)**:
  - Card notation elements: expert nickname, counseling expert tag (Example: #psychology, #career), expert average rating (star rating).
  - When you click the ‘Consultation Request’ button, you will be taken to the detailed reservation form screen.

* **SCR-020 (Reservation Application Detail Form)**:
  - Input elements: Reservation date selector (calendar), reservation time selection slot, estimated payment amount information window.
  - When you click the 'Request Reservation' button, reservation information is sent to the server and a waiting done toast pop-up is displayed.
```

## 📄 day4_api_specification_v1.md
```markdown
# Expert consultation matching system backend API specification draft (v1.0)

* **GET /api/v1/getExperts**
  - **Description**: Search the list of registered experts.
  - **Response (JSON)**:
    ```json
    [
      {
        "expert_id": "EXP-091",
        "name": "Jane Doe"
      }
    ]
    ```

* **POST /api/v1/createReservation**
  - **Description**: A member applies for a reservation with a counselor.
  - **Request (JSON)**:
    ```json
    {
      "reservation_date": "2026-07-20T14:00:00Z"
    }
    ```
  - **Response (JSON)**:
    ```json
    {
      "reservation_id": "RES-2026-0001",
      "status": "WAIT_APPROVE"
    }
    ```
```

## 📄 day4_api_change_request.md
```markdown
# API change request according to requirement changes (Change Request)

* **Requester**: Lead Product Manager
* **Reason for change**: 
  - Previously, when creating a reservation, `payment_amount` was included in the reservation request data and received all at once, but due to the advancement of pricing policy (coupon application, etc.), the amount field was removed when creating a reservation (Reservations).
  - After the reservation is successfully created and approved by an expert, the payment request stage API `POST /api/v1/payments` is clearly called separately and the structure has been reorganized to transmit the final discounted amount (`amount`) at this stage.
* **Changes**:
  - Completely delete the `payment_amount` field in the `POST /api/v1/reservations` Request Body.
```

## 📄 day4_api_review_dialogue.md
```markdown
# API design standard review meeting minutes (2nd week of July)

* **Participants**: Front-end developer A, back-end developer B
* **Transcript**:
  - **Developer A**: Current backend API error handling is inconsistent. Even if a token expires error occurs, HTTP Status returns 200 OK, and only the response body JSON contains `{"success": false, "message": "Expired token"}`, so it is not detected by the common interceptor exception filter of the front-end communication library (Axios). In case of an error, we would appreciate it if you could send an appropriate HTTP Status code (Example: 401, 400, 500) and format the error in a single structure.
  - **Developer B**: Yes, I understand. In accordance with RESTful rules, we will adjust the resource path to the noun plural form (experts) instead of the verb form (getExperts), and modify the structure so that pagination meta information can be expanded to the response data when searching the list.
```
