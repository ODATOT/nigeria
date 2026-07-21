# Day 04 Training Content Summary (Codex AI Workspace)

This summary is the final summary guideline for instructors and participants of the Day 4 **"Technical Design (API Design and Interface Definition)"** training session. It contains key summary information on the state-of-the-art interface collaboration architecture that creates an API Contract, which is a promise to connect planning and development, based on the requirements definition and screen definition, identifies inconsistencies and missing items between each document, and automates analysis and testing of UI and API dependency impacts due to changes.

---

## 📌 Part 1. Introduction background and necessity

### 1. Bottlenecks in API design
* **Development inconsistency**: The fields of the planning document or screen design and the actual distributed API specification are different, resulting in communication errors or defects in which certain values ​​are not displayed on the screen.
* **Communication error**: Fields are defined and developed only through verbal agreements between front-end and back-end developers, but the names (Camel vs. Snake Case) and format do not match, so the meeting is repeated every time.
* **Change management bottleneck**: Even if a single business requirement, such as price or order stage, changes, a huge analysis cost is incurred to check the scope of modifications to the API, front screen, and test code connected to it.

### 2. ChatGPT vs Codex Client (Workspace-based)
| Comparison Items | ChatGPT (General Conversational AI) | Codex Client (Workspace-based AI) |
|---|---|---|
| **Context Awareness** | Just roughly configures a one-time API code template | Cross-verification of actual field mapping and functional compliance between plan, screen design, and back-end API specification file |
| **Automatically detect mismatches** | Audit only single text manually entered by the user | Three-dimensional detection of ratings, missing error codes, etc. by tracking the properties of multiple outputs leading to planning-screen-API |
| **Test Scenario** | Creating dummy scenarios focusing on simple success (200 OK) | Build various Sad Path verification plans for 400 Bad Request, unauthorized errors, etc. by analyzing essential constraints and boundary values ​​of API specifications |

---

## 📌 Part 2. Summary of goals and results of today’s practice

### 1. Final result to be created today
* **Task 01. API contract creation**: **RESTful API specification specification** created by analyzing screen UI and planning requirements (output: `api-contract.md`)
* **Task 02. API inconsistency detection**: **API consistency review report** that investigates and summarizes all differences between planning-screen-API documents (output: `api-consistency-report.md`)
* **Task 03. API change impact analysis**: **API change impact analysis** that derives revision targets and UI modification actions when the reservation process step granularity changes (output: `api-impact-analysis.md`)
* **Mission 01. API review and improvement**: **API Review Report** correcting naming violations, HTTP status code fragmentation, etc. (Output: `api-review-report.md`)
* **Mission 02. Create an API test scenario**: **API Test Scenario & Checklist** (output: `api-test-scenario.md`) that structures authentication expiration, limit exceeded, and format error verification items.

---

## 📌 Part 3. Follow along (Step-by-Step practice guide)

### STEP 1. Task 01 - Create API contract
* **Action**: Prepare `day4_requirements.md` and `day4_screen_definition.md` and then send the command below to Codex.
  > "Based on the provided requirements definition and screen definition, please derive a list of required APIs and create a standard API contract by defining the types of Request and Response fields and English variable names."
* **Check**: Check whether the API list and Request/Response JSON specifications, which are key to screen display such as reservations and expert inquiries, are derived from the REST standard structure.

### STEP 2. Task 02 - API mismatch detection
* **Action**: Compare the planning requirements, screen design, and draft API specification (`day4_api_specification_v1.md`) and give the command below.
  > "Please cross-check the provided day4_requirements.md, day4_screen_definition.md, and day4_api_specification_v1.md files to find API endpoints and fields that are inconsistent or missing from the planning requirements or screen UI design, and write a review report."
* **Check**: Check whether the report clearly indicates that the expert screen card has a rating, but the rating data is missing from the API Response, and the reservation approval/rejection API is missing from the specifications.

### STEP 3. Task 03 - Analysis of API change impact
* **Action**: Present a change request (`day4_api_change_request.md`) where the amount information is transferred from the reservation request to the payment stage and build the command below.
  > "By analyzing the contents of the provided API change request (day4_api_change_request.md), derive a list of other system areas and documents that are affected when modifying the reservation request API, and write an API impact analysis that can immediately share the work with team members."
* **Check**: Verify that the impact domain and task list are structured, such as changing the Reservations table specification, hiding the front-end input form, and creating a new payment processing API.

### Mission 1. API review and improvement (API Review)
* **Action**: Launch the review meeting minutes (`day4_api_review_dialogue.md`) and send the prompt below.
  > "Please review the provided API specification of day4_api_specification_v1.md, analyze improvements based on REST API design standards (HTTP Method usage, URL naming), consistent error handling structure, and extensibility, and write an API review report."
* **Check**: Check whether the resource-oriented naming supplementation of `/api/v1/getExperts` ➔ `/api/v1/experts` and the recommendation for introducing RFC standard error specifications such as HTTP 401 Unauthorized are described.

### Mission 2. Create an API test scenario (API Test Scenario)
* **Action**: Build the verification command below based on the completed API contract specification.
  > "Based on the currently defined reservation and payment API specification, please create an API test scenario and verification checklist that includes both the normal registration flow (Happy Path) and exception cases such as missing required parameters, date format errors, limit exceeded, and permission expiration."
* **Check**: Check whether Happy/Sad Paths such as normal flow (201 Created), date format error (400 Bad Request), and unauthorized request (401 Unauthorized) are listed logically with verification procedures and expected results.

---

## 📌 Part 4. Principle of operation and significance

### 1. Interface contract automation (API First Architecture)
* This is an intelligent parsing method that automatically creates a contract by inferring the logical API endpoint and transmission data specifications (Schema) of the backend from the screen flow and function definition written in natural language.

### 2. Multi-Dimensional Spec Auditing
* It is a semantic consistency mapping technology that cross-contrasts the inconsistencies between the three different documents of plan ➔ screen ➔ API into logical units, and catches 100% of the ‘deceptive omissions’ that occur when humans compare.

### 3. Technical design synergy of five tasks/missions
```text
[API interface contract] (Task 01. Derive specifications)
         │
         ▼
[Planning-API discrepancy verification] (Task 02. Consistency audit)
         │
         ▼
[Automatic tracking of design change aftermath] (Task 03. Impact management)
         │
         ▼
[Improvement of REST architecture quality] (Mission 01. Structure review)
         │
         ▼
[Happy/Sad Path Test Coverage] (Mission 02. Scenario Defense)
```
This interface verification pipeline removes all errors and design inconsistencies before writing a single line of code, ensuring high-quality interface so that the front and backend can successfully build integration at once.

---

## 📌 Part 5. Training Session Guide

### 💡 Instructional design specifications
* **Difficulty**: ★★★★☆ (Advanced - includes RESTful architecture and HTTP exception design)
* **Estimated lab time**: 1 hour 30 minutes to 2 hours (comprehensive interface lab)
* **Practical usability**: ★★★★★
* **Learner Questions/Discussion Topics**:
  1. “When an error occurs, what are the pros and cons from a microservice architecture (MSA) perspective between the custom error of sending the HTTP Status as 200 OK and displaying the detailed error code in the body (Custom Error) and using the HTTP standard Status (4xx, 5xx)?”
  2. “When an API change occurs, how should we configure a build system that can automate real-time synchronization of actual code and documents in the Swagger/OpenAPI Spec file without manually modifying the plan?”

---

## 📌 Part 6. Technical design (API interface) stage final training task

| Task | Topic | AI utilization |
|---|---|---|
| Task 01 | Create API contract | Automatically derive RESTful API contract specifications by analyzing the plan and screen design |
| Task 02 | API mismatch detection | Automatically detects discrepancies (missing ratings, etc.) between planning specifications and API specifications and generates a report |
| Task 03 | API change impact analysis | Tracking the chain effects of screens and specifications that need to be linked when changing API parameters or status |
| Mission 01 | API reviews and improvements | Improving the quality of RESTful standards, including noun naming conventions and consistent RFC exception schema |
| Mission 02 | Create an API test scenario | Deriving an exception test matrix that responds to missing essential keys and format errors as well as normal operating flow |
