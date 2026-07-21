# Day 05. Service Design (UI/UX Review)

Creating a service is not just about creating a pretty design or working code, but designing it logically so that users can use the product easily and conveniently. No matter how great the backend API and DB are, the service will fail if users are confused about how to sign up or cannot find the payment button on the first screen.

Day 5 practice focuses on objectively reviewing the screen specifications and flows created using Codex AI in a user-centered manner. From the perspective of a first-time user, we discover areas where usability is inconvenient (Task 01), uncover elements that hinder consistency where rules are broken between multiple screens (Task 02), and optimize the user journey to reach business goals (Task 03). In addition, the learning goal is to conduct a persona-based usability review by setting Codex as a virtual 'first user' (Mission 01) and to evaluate UI/UX quality based on a comprehensive convenience evaluation matrix (Mission 02) to acquire a UI/UX eye from a true planning and architecture perspective.

---

# Task 01. Review the screen from the user’s perspective (User Experience Review)

## 1. Story and practice background

A startup has deployed a mobile app that it developed over a long period of time. However, on the day of launch, the number of subscribers increased, but the number leading to actual service use was abnormally low. When we checked the cause, we found that the 'Find a Counselor' button on the main dashboard screen was not intuitive and was hidden in a complicated sub-hamburger menu, so users ended up quitting the app after just looking at the first screen. Developers and designers were so accustomed to the screen structure they created that they did not notice the inconvenience experienced by novice users at all.

In this exercise, we will practice how to preemptively derive UX vulnerabilities that are difficult to recognize in the planning stage by sending the planned reservation process screen specification to Codex and objectively reviewing the screen from the perspective of a virtual novice user persona.

---

## 2. Learning objectives

* You can look at the screen from the user's perspective and understand the priority of information hierarchy.
* Elements that confuse users or cause cognitive load can be identified within the screen specification.
* Using AI, UX improvement recommendations and wireframe modification ideas can be derived from an objective perspective.

---

## 3. Practice mission

Learners prepare `day5_signup_flow.md` within the local project folder and send the below prompt to Codex Client to create a screen review report from the user's perspective.

> "Based on the screen specifications of the reservation application details form provided, please review whether the information structure is clear from the perspective of a novice user who is new to the service, point out elements that impede usability, and write a report suggesting improvements (UX Review Report)."

---

## 4. Example of results

Codex reviews screen specifications from various angles and creates a systematic review report as shown below.

### UX Review Report (User Perspective Review)

| Review Area | Factors hindering usability (points of inconvenience) | Impact on users | Recommended Improvement Plan |
|---|---|---|---|
| **Agent Profile Area** | Expert ratings (stars) and one-line introduction are located in the bottom scroll area. | Hesitation in making a choice due to delayed recognition of information needed to trust the counselor. | Place a star rating and a one-line introduction to the right of the nickname at the top of the card to expose it at first glance. |
| **Select time slot** | The visual contrast (brightness contrast) between the already reserved inactive time slot and the selectable active time slot is ambiguous. | Repeatedly clicking on closed slots causes error pop-ups, causing discomfort. | Disabled slots are outlined in muted gray and a strikethrough is applied to the text. |
| **Payment Induction** | When you click the 'Request Reservation' button at the bottom, the detailed reservation fee information is hidden in a pop-up and then moves to the payment screen. | They leave the payment stage because they are unable to intuitively recognize the final billing amount in advance. | Fixed a layout that always states the 'estimated final payment amount' in font at the top of the button. |

---

## 5. AI utilization points

* **Cognitive load estimation**: Calculates the complexity of the screen and the visual cognitive hierarchy of essential information to detect omission and reverse placement of important information.
* **UX heuristic evaluation**: Based on Jacob Nielsen's top 10 usability heuristics, cross-mapping of system state notation and compliance with user freedom.

---

## 6. Learning points

Just because the code runs without problems doesn't mean the design is finished. The key to true design verification is to create a feedback loop that uses an AI assistant to completely objectify the ease of use of the product from the perspective of others (users), breaking away from the subjective stubbornness of the developer (planning/development team).

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Task 02. Screen Consistency Review

## 1. Story and practice background

Ahead of the product launch, as multiple screens were coded separately by planners and publishers, consistency began to break down. On some screens, the 'Save' button was placed in blue at the bottom right, while on other screens, it was designed as a green button at the top left with the name 'Register'. Additionally, terms for the same membership status were used differently, such as 'membership active status' on some pages and 'active status' on other pages, causing users to get lost.

If the screen layout, tone and manner, and terminology are inconsistent, users will experience severe stress as they have to learn new ways to use the product each time they use it. In this exercise, you will learn how to use Codex to compare and analyze multiple individually designed screen planning documents at a glance, find inconsistent structures, words, and design rules, and build a common UI rule proposal.

---

## 2. Learning objectives

* You can catch word inconsistencies in layout composition and common functions between multiple screen planning documents.
* Inconsistent button, menu, and feedback status specifications can be discovered and accumulated into an improvement list.
* Together with AI, we can propose draft standard UI/UX guidelines to be applied to the entire project.

---

## 3. Practice mission

Learners deploy materials containing multiple screen specifications locally and ask the Codex Client to check consistency.

> "Please compare the design details of each screen in the provided day5_signup_flow.md and analyze elements that lack consistency in button placement rules, terms used, and feedback messages to create a screen comparison report."

---

## 4. Example of results

### UI consistency improvement report

#### 1. Name and terminology inconsistency
- **Sign up screen**: User identifier is displayed as `'ID'`.
- **Reservation application form**: User identifier is indicated as `'Customer ID'`.
- **Actions**: All customer-facing UI and specifications must be standardized as a single term called ‘ID’.

#### 2. Violation of action button design rules
- **Login page**: `'Login'` blue main button placed at the bottom full width.
- **Member information revision page**: Green placement of ''Edit completed'' with the small button at the top right.
- **Actions**: Fixed the CSS class to apply the primary color (`--primary`) to the main action button at the bottom at 100% width.

---

## 5. AI utilization points

* **Multi-Screen Cross-Contrast**: Clustering discordant words in buttons and labels with similar actions by text mining sentences from multiple screen design templates.
* **Standard design system recommendation**: Design consistent alignment templates with reference to global design guides (Material Design, Human Interface Guidelines).

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Intermediate)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Task 03. Improving user journey (User Journey Review)

## 1. Story and practice background

After the product was completed and the payment conversion rate was analyzed, it was dismal. The rate of subscribers completing payment after pressing the reservation button remains at only 5%. When we checked why users were giving up on reservations, we found that the user journey was too long and tedious. I had to click as many as 9 times to [Select an expert ➔ Check detailed introduction ➔ Select reservation date ➔ Select reservation time slot ➔ Agree to personal information collection ➔ Confirm refund policy ➔ Enter payment information ➔ Enter card number ➔ Complete reservation confirmation]. 

Users get tired of the number of screens and clicks they have to go through to complete their desired goal (booking a consultation), so they quit the app. 

In this exercise, we will use Codex's powerful flow inference ability to understand the user journey step by step from entering the app to completing the final payment, and learn the optimal flow design method to reduce user clicks by half by merging or simplifying unnecessarily fragmented screens and redundant input requirements.

---

## 2. Learning objectives

* The user's scenario movement flow can be defined in diagrams and sequences.
* Duplicate consent and input steps that cause bottlenecks (friction) before users reach their destination can be discovered.
* Through AI’s schematic suggestions, a compact route improvement plan that can improve usability can be planned.

---

## 3. Practice mission

Learners send user scenario specifications to the Codex Client to generate route optimization proposals.

> "Please analyze the reservation detailed scenario flow in the provided day5_signup_flow.md and create a user journey improvement report (User Journey Report) that can minimize the click steps and screen movement until the user completes the consultation reservation."

---

## 4. Example of results

### User Journey Improvement Report

#### [AS-IS movement flow (step 9)]
```text
List of counselors ➔ View detailed information ➔ Select reservation date ➔ Select time ➔ Enter information ➔ Agree to refund ➔ Select payment method ➔ Approve payment ➔ done
```

#### [TO-BE improved movement flow (Step 4 - 50% reduction)]
```text
Counselor list ➔ Detail/reservation calendar integration page ➔ Easy consent and simple payment ➔ done
```

#### [Major improvements]
1. **Screen integration**: Two-step reduction by integrating ‘reservation calendar and time slot’ at the bottom of ‘View detailed information’ as an accordion component on one screen rather than a tab/pop-up.
2. **Simplified consent process**: When clicking the reservation button, consent to personal information and refund terms is checked all at once in the modal pop-up, eliminating the single screen movement step.

---

## 5. AI utilization points

* **Task Friction Measurement**: Automatically derives the simplification target area by quantifying click depth and attention distribution factors based on user behavior.
* **Generation of usability alternative flows**: Propose alternative flows by analyzing exemplary simple payment design patterns of various commerce/reservation platforms.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Intermediate)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Mission 01. Become a first-time user

## 1. Story and practice background

Product developers have a terrible confirmation bias in the programs they write. “Isn’t this a trend these days to have at least 12 characters and a mix of upper and lower case letters and special symbols?” Apply the same thinking without hesitation. However, when a middle-aged user who is not familiar with digital devices or a user who is busy requesting consultation without even 5 seconds to spare turns on this app, the moment the password sign-up error is repeated three times, they get angry and delete the app.

In this mission, Codex Client is given the persona **"A personal counseling customer in his 50s who downloaded and ran this counseling app for the first time"**. We then hone AI persona research techniques that autonomously uncover vivid first impression feedback and a list of embarrassing inconveniences that this virtual novice user experiences during the process of signing up, selecting an expert, and attempting to make a reservation.

---

## 2. Practice mission

The learner injects the user persona condition into the Codex Client's system prompt or main dialog as shown below and requests a usability review.

> "You are a self-employed person in your 50s who is somewhat awkward at using digital smartphone apps. While looking at the membership sign-up and first screen UI specifications written in the provided day5_signup_flow.md statement, please write down what you find most confusing and difficult when signing up, your emotional reaction, and any requests for improvement."

---

## 3. Example of results

### AI Virtual User Persona Review Report

* **Reviewer Persona**: 53-year-old self-employed (mainly uses only smartphone messenger and YouTube)
* **Live User First Impressions & Predicaments List**:
  1. *Confusion over ID duplication check*: "I entered the ID and just moved to the next step, but an error window pops up saying that I have to press the duplicate check button separately to proceed. It's inconvenient why they don't write 'Available' in real time under the input window in advance."
  2. *Trouble with font size recognition*: "The morning/afternoon time zone letters under the calendar days are so small and tightly packed that it's difficult to tell whether I pressed 2 o'clock or 3 o'clock without using a magnifying glass."
  3. *Data reset when going back*: "I picked the wrong time and pressed back, and all the name and contact information I had entered so hard was gone and I had to start over from the beginning, which made my blood pressure rise."

---

## 4. AI utilization points

* **Persona Empathy Verification**: Reproduce behavioral barriers that product developers cannot recognize themselves by simulating a specific age group, skill level, and device environment.
* **Microcopy feedback**: Autonomous derivation of points to replace stiff error messages (e.g. `ERR_DUPLICATE_ID`) with friendly guidance phrases.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Mission 02. Evaluate service quality with AI

## 1. Story and practice background

Before distributing a product, the planning department of a large company spends a long time and a huge amount of money to form a UX expert evaluation group (FGI - Focus Group Interview) to conduct usability tests and write an evaluation report. However, small startups or solo developers cannot afford to operate such a professional UX evaluation infrastructure, so they often rely on intuition to launch products and suffer disastrous quality failures.

In this mission, we will establish Codex as a professional UX consultant equipped with international usability standards and quality standards. In addition, the completeness of all screen plans within the plan is evaluated numerically (Usability Scoring) using specialized items such as understandability, accessibility, ease of operation, and presence of unnecessary steps, and comprehensive practice is conducted to build a high-quality roadmap evaluation to become a premium UI/UX with a rating of 9.0 or higher.

---

## 2. Practice mission

Learners attach a complete list of planning specification data and build the standard usability evaluation prompts below.

> "Based on the provided day5_signup_flow.md specification, please give a score out of 5 for each item such as 1) information readability, 2) operation accessibility, 3) error resilience, and 4) movement efficiency, and build a service quality evaluation (Usability Evaluation) that points out the strengths and painful points of improvement along with the overall evaluation score."

---

## 3. Example of results

### Usability Evaluation (Service Quality Evaluation)

#### 1. Evaluation scores by area
* **Information readability**: 3.5 / 5.0 (Expert tag information is useful, but information density is too high)
* **Accessibility to operation**: 3.0 / 5.0 (Payment amount display is hidden in the payment pop-up, resulting in lack of intuitive operation)
* **Error Resiliency**: 2.5 / 5.0 (all existing text input values ​​are reset when backtracking or validation fails)
* **Movement efficiency**: 2.0 / 5.0 (9 steps in total from registration to completion, typical churn-inducing output structure)

* **Comprehensive usability rating: 2.75 / 5.0 (required improvement level)**

#### 2. Core improvement action plan
* Modified logic to temporarily preserve input information in memory (Local Storage) in case of an input error.
* Simplify the recognition process by consistently structuring the sign-up form and reservation time slot in a slide-type multi-step format.

---

## 4. AI utilization points

* **UX Matrix Quantification**: Converts potentially subjective UI/UX opinions into consistency scores (Metrics Score) to visualize improvement priorities in numbers.
* **Global UX pattern prescription**: Feedback loop, recommendation of ready-to-use UI component patterns (e.g. Autofill, Session Save) to overcome usability limitations.

---

# Day 05 Training Organization and Milestones

| Category | Topic | Codex AI Core Actions | Learning Expected Outcomes |
|---|---|---|---|
| **Task 01** | Reviewing the screen from the user's perspective | Analysis of usability impediments and cognitive load factors from the perspective of novice users | `ux-review-report.md` |
| **Task 02** | Review screen consistency | Detecting inconsistencies in terminology and button placement in multiple proposals | `ui-consistency-report.md` |
| **Task 03** | Improving user movement | Path depth optimization proposal to shorten the 9-step movement route to 4 steps | `user-journey-report.md` |
| **Mission 01** | Become a first-time user | Extracting real-time usage trouble logs by imitating a persona of a beginner in his 50s | `first-user-review.md` |
| **Mission 02** | Evaluating service quality with AI | Write a comprehensive evaluation report that converts usability scores such as readability and recovery | `usability-evaluation.md` |

---

# Day 05 Original file data history for practice

## 📄 day5_signup_flow.md
```markdown
# Consultation matching service all screen design specification (v1.0)

## screen 1: Login and Sign up page (LOGIN-001)
* **UI Layout**:
  - Top: Logo image
  - Input window 1: ‘ID’ input field
  - Input window 2: ‘Password’ input field (no rule information text)
  - Button: 'Login' button (bottom 100% width, blue)
  - Link: ‘Is this your first time? 'Sign up'
* **Sign up modal**:
  - When clicking the ‘Sign Up’ link, a modal pop-up is displayed that covers all of the screen.
  - Input elements: name, phone number, email, ID (click the duplicate check button required), password.
  - 'done' button in modal: placed as a small button in the upper right corner (green).
  - Validity error: If the password is less than 12 characters or is missing a special symbol, an error window (“Password rule violation!”) pops up and the modal is forced to close (all the characters you wrote are lost and you have to open the sign-up modal again).

## screen 2: Expert list and matching card (EXPERT-LIST)
* **UI Layout**:
  - The morning/afternoon time zone text is very dense at 10px in size below the days of the calendar.
  - Card notation elements: expert name, category tag.
  - Only when you scroll all the way to the bottom of the card will the star rating and one-line introduction appear in a small format.
  - The outline thickness of the deactivated non-reservable slots and the reservable slots are almost similar, so they do not appear to be categories at first glance.

## screen 3: Detailed reservation request and payment inducement (BOOKING-PAY)
* **User Journey Specification**:
  Step 1: Click on the counselor you like from the list of counselors
  Step 2: Go to the detailed profile view page
  Step 3: Click the ‘Consultation Reservation’ button at the bottom to go to the reservation calendar
  Step 4: Select date
  Step 5: Choose your favorite time zone
  Step 6: When you click the ‘Reservation Request’ button, you will be taken to the personal information collection consent screen.
  Step 7: After agreeing, move back to the consent screen for detailed refund policy information.
  Step 8: When clicking the Agree button, a layer pop-up for payment method selection is displayed.
  Step 9: After manually entering the final credit card number, the final done page toast is displayed.
* **Payment exception situations**:
  - The user cannot always check the final payment amount on the screen until just before the Step 8 payment method selection pop-up is displayed (the unapplied coupon amount is revealed only when the Step 8 pop-up is displayed).
```
