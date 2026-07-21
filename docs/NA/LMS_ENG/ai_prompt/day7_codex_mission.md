# Day 07. Development (Completing functions with AI)

The most dynamic moment in web service development is the **"function implementation and integration phase"**, which breathes life into static screens. If you succeeded in drawing the form of the dashboard and cards in the browser using HTML and CSS in the Day 6 session, the Day 7 session is a process of learning how to organically connect functions so that the system responds appropriately when the user presses the reservation button and enters data.

Teaching back-end database communication or server API architecture from beginning to end in a beginner's curriculum can be a barrier that reduces interest in learning. Therefore, the Day 7 course is centered around **"the integrated flow of actual service operation, from button click to success feedback"**. In other words, the concept goes one step further from “drawing the screen (Day 6)” to **“making the screen come alive according to the user’s actions (Day 7)”**.

Participants use Codex AI as a competent functional assistant and verification partner to connect static elements with events (Task 01), verify the virtual sign-up/reservation application flow from the user's perspective (Task 02), and preemptively block logic defects (errors) hidden in complex state transition conditions (Task 03). In addition, you will practice the workflow of asking an AI coach to check the overall service quality (Mission 01) and tracking and improving the scenario to the end by imitating the behavior patterns of actual users (Mission 02).

---

# Task 01. Feature Integration

## 1. Story and practice background

A junior planner completed a prototype of the login screen and reservation list screen. However, when the representative pressed the login button during the meeting, nothing happened and the screen remained static. “The screen is pretty, but when I click on it, it doesn’t proceed to the next step. When will the actual reservation data be saved and the member information recorded in the session be connected?” After hearing the feedback, I realized that linking screen configuration and data control logic was urgently needed.

In this exercise, you will learn how to use Codex AI to attach event listeners (Click, Submit Event) to the static login form and reservation registration card components, and to connect data storage (Local Storage, etc.) and virtual API function calls organically so that the screen performs click response and data loading operations normally.

---

## 2. Learning objectives

* HTML elements and JavaScript events (Event Listener) can be properly connected.
* Data entered by the user in the input form can be collected and loaded into virtual API or storage.
* By referring to AI's suggestions, you can self-complement the missing or missing exception event processing steps during function connection.

---

## 3. Practice mission

The learner prepares `day7_unconnected_feature.html`, a static UI component code that does not work, locally and asks Codex Client to complete the logic.

> "I am trying to connect a JavaScript function to the membership sign-up screen code of the provided `day7_unconnected_feature.html`. Please write an integrated script that 1) checks the validity of the input value when the sign-up complete button is clicked, 2) saves the information in the browser's local storage, and 3) moves to the dashboard screen when successful. Please also suggest the missing cancel button response or duplicate sign-up check logic."

---

## 4. Example of results

Codex builds JavaScript logic containing input form information extraction and storage synchronization flows.

### 1) Event connection script (JavaScript Interaction)
```javascript
// Connect to the sign up form submission event
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Block the default form submission action
  
  const email = document.getElementById('user-email').value.trim();
  const nickname = document.getElementById('user-nickname').value.trim();
  
  // 1. Simple validation (Validation)
  if (!email || !nickname) {
    alert('Please enter both email and nickname.');
    return;
  }
  
  // 2. Load local storage data (Save to LocalStorage)
  const userData = { email, nickname, status: 'active', createdAt: new Date().toISOString() };
  localStorage.setItem('currentUser', JSON.stringify(userData));
  
  // 3. Page transition feedback
  alert('Sign up has been completed!');
  window.location.href = '../day6/day6-ai-classroom.html';
});
```

---

## 5. AI utilization points

* **Action flow guide**: Derives the state change steps that occur in the browser background when a screen button is pressed using a sequential algorithm.
* **Auxiliary Branch Detection**: In addition to processing successful registration, it also preemptively suggests 'validation check' statements, such as when a user accidentally leaves a blank field and hits the submit button repeatedly.

---

## 6. Learning points

When first learning coding, it is very effective to strengthen logic composition by controlling `localStorage` or memory variables provided by the browser before connecting complex back-end APIs. Gain experience in assembling event listeners step by step according to the AI ​​assistant's order prescriptions.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 25-35 minutes
* **Practical usability:** ★★★★★

---

# Task 02. Verifying the user scenario (User Scenario Review)

## 1. Story and practice background

The development team has announced that they have perfected the reservation details creation feature. However, one beta tester selected a detailed reservation to make a reservation, and then clicked 'back' to check the rating of the expert before confirming the reservation. Then, all the reservation slot date information that had just been entered was reset to blank, and the user became angry and closed the app.

From the developer's perspective, he thought that individual functions that saved reservation data in the database worked well, but when actual users use the app to go through a long scenario (User Journey Flow) from signing up to expert search, time reservation, and payment, information omissions and learning flow disruptions often occur. In this exercise, we will use Codex AI to track all functional flows from the beginning and end of a scenario in one breath, and how to find and correct disconnected sections in the flow.

---

## 2. Learning objectives

* Beyond fragmentary functional unit tests, you can look at the user’s journey (Scenario Flow) three-dimensionally.
* The flow can be diagnosed to see how previous state values ​​are maintained and lost within a continuous function call structure.
* Using AI guides, you can formalize essential checklists that are easy to miss when checking scenarios.

---

## 3. Practice mission

The learner enters `day7_user_flow.md` specifying the member journey scenario specifications and requests the Codex Client to verify the overall connection.

> "By analyzing the step-by-step call sequence of the provided `day7_user_flow.md` specification (signup ➔ expert search ➔ detailed reservation ➔ virtual payment), diagnose the two key sections where information loss is most likely to occur when a user takes this route, and suggest a state preservation logic structure as an alternative code to prevent this."

---

## 4. Example of results

Codex returns weak points and TO-BE complementary patterns based on scenario analysis.

### User Flow Vulnerability Review

#### 1. Vulnerable point 1: Filter reset when regressing expert list
- **Phenomena**: When returning to the list after entering the details page, the previously set filter category information is initialized, causing user re-search fatigue.
- **Solution**: Improved to back up temporary state values ​​in `sessionStorage` and restore them when going back.

#### 2. State maintenance proposal code
```javascript
// Back up filter settings before moving to the details page
function saveFilterState(filter) {
  sessionStorage.setItem('last_filter', JSON.stringify(filter));
}

// Restore filter when loading list
function restoreFilterState() {
  const saved = sessionStorage.getItem('last_filter');
  return saved ? JSON.parse(saved) : { category: 'all', rating: 0 };
}
```

---

## 5. AI utilization points

* **Identify Scenario Gaps**: Uncover data movement bottlenecks and resiliency factors between multi-screen specifications that single-source reports may not notice.
* **User Experience Threat Mapping**: AI points out “procedures that tire users” hidden behind “developmentally perfect logic” with a third-party perspective.

---

## 6. Learning points

Simply not having errors is not the end of functional completion. It expands the perspective to consider the overall context to ensure that the status flows safely in accordance with the actual user's movement path.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 30-40 minutes
* **Practical usability:** ★★★★★

---

# Task 03. Find feature errors (Feature Validation)

## 1. Story and practice background

On the night of deployment of the reservation app, which had completed connecting payment functions, an alarm went off. Server errors were occurring due to multiple reservations for the same time slot for the same person in the database reservation list. When I opened the source code, the reservation registration function worked honestly, but when an impatient customer double-clicked the 'Confirm Reservation' button on the payment confirmation page, there was no lock device to prevent duplicate submissions, so duplicate data was inserted into the DB.

Even if you press the development completion button, if abnormal or exceptional behavior intervenes, the function will be instantly broken. In this exercise, Codex AI is used as an auditor to conduct a mock test on the completed reservation and login processing function file `day7_feature_validation.js`, assuming abnormal symptoms such as duplicate clicks, insertion of special characters, and abnormal session expiration. Tips for blocking points that can cause defects are provided.

---

## 2. Learning objectives

* In addition to correct data input scenarios, functional defects caused by anomalies (exceptional situations) can be predicted.
* Can explain the guard code for preventing duplicate entry of the same data (Debounce/Throttle) and blocking input values.
* By using AI vulnerability analysis results, you can create robust logic that preemptively prevents errors.

---

## 3. Practice mission

The learner opens and checks the `day7_feature_validation.js` file containing the error vulnerability and then requests the Codex Client for diagnosis.

> "Please review the reservation application logic in the provided `day7_feature_validation.js` file. 1) Vulnerabilities in duplicate inflow of reservation requests (button presses), 2) Detect the possibility of application errors in the past of the reservation date, and to prevent this, please suggest a final verification code with disabled state processing and date validity period check added."

---

## 4. Example of results

Codex pinpoints defects in weak logic and returns a complete copy with a debugging lock.

### 1) Code to block duplicate influx and improve time comparison
```javascript
// AS-IS: Code created redundantly when called continuously
// TO-BE: Introduce loading lock variable and apply past date filtering
let isSubmitting = false;

function requestReservation(bookingData) {
  if (isSubmitting) {
    console.warn("Reservation is currently being processed.");
    return;
  }
  
  const today = new Date().setHours(0, 0, 0, 0);
  const targetDate = new Date(bookingData.date).setHours(0, 0, 0, 0);
  
  if (targetDate < today) {
    alert("Reservations cannot be made with past dates.");
    return;
  }
  
  isSubmitting = true; // lock settings
  document.getElementById('confirm-btn').disabled = true; // disable button
  
  // Virtual server communication simulation
  setTimeout(() => {
    console.log("Reservation Done:", bookingData);
    isSubmitting = false; // release lock
    document.getElementById('confirm-btn').disabled = false;
  }, 2000);
}
```

---

## 5. AI utilization points

* **Abuse prediction**: Estimates the script crash point that will be induced by user behavior (multiple hitting, empty input, incorrect format) rather than normal data path.
* **Effectiveness policy design**: Checks and creates in advance the logical structure (Logic Boundary) that must be blocked due to business logic, such as past visual blocking.

---

## 6. Learning points

A good application is not simply a functional app, but a solid app that does not crash or emit errors no matter what the user does wrong. Learn the philosophy of building reliable features through training in setting exception boundaries with AI.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-45 minutes
* **Practical usability:** ★★★★★

---

# Mission 01. Check service completeness with AI (Usability & Quality Review)

## 1. Mission Overview

After completing the basic assembly of the dashboard, subscription, and reservation linkage logic, we request a multidimensional completeness audit with Codex as a 'service QA partner' to check if any missing sections or detailed input barriers remain in operation, and obtain comprehensive supplementary guidelines.

---

## 2. Detailed tasks

1. **Prepare local source specifications**: Load the event scripts you wrote (`day7_feature_validation.js`, etc.) in one place.
2. **Quality Auditing Delegation**: Enter the entire code amount and screen movement flow in the Codex Client and then send a comprehensive quality audit.
3. **Virtual evaluation feedback analysis**: Collects warnings pointed out by AI (e.g., missing loading feedback (Spinner), omitting information confirmation process in cancellation modal, etc.).
4. **Save inspection report**: Build a `day7_service_audit.md` report file including the collected audit notes and priorities.

---

## 3. Result form (`day7_service_audit.md`)

```markdown
# [Day 7] AI service completeness inspection report

## 1. Comprehensive completeness diagnosis results
- **Completeness Score:** 85%
- **Overall review:** The input form and storage are excellent, but when the user performs an operation with a long waiting time, the browser does not provide any response, so there is a high probability that the user will mistakenly believe that communication has stopped.

## 2. Major improvements and priorities
1. **[Priority: High]** When sending a reservation request, add a 'Loading (Spinner)' indicator to prevent the illusion of a hard screen.
2. **[Priority: Medium]** Added exception handling statement (`try-catch`) when local storage limit capacity is exceeded.
3. **[Priority: Low]** Enhancing psychological rewards with animated congratulations on joining.
```

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-45 minutes
* **Practical usability:** ★★★★★

---

# Mission 02. End-to-End Walkthrough Scenario

## 1. Mission Overview

By simulating an end-to-end scenario (end-to-end) in which an actual customer receives the app from the App Store, opens the service for the first time, and completes the final reservation, using Codex's persona and chat format, we finally prove the flawless service that flows without interruption.

---

## 2. Detailed tasks

1. **Comprehensive scenario definition**: Configure the entire user scenario from sign-up ➔ profile view ➔ slot reservation ➔ local save confirmation ➔ result confirmation page regression.
2. **Perform E2E chat test**: Give Codex a “new user persona who is most unfamiliar with using digital tools” and conduct a virtual full-path usage test role-play to collect responses.
3. **Application of bottleneck solution**: Check the state transfer guard logic at the point where the AI ​​user felt embarrassed (e.g., “When I press back, the reservation disappears”) and insert it into the source code.
4. **Save E2E validation**: Submit validation log and TO-BE state transition matrix as `day7_e2e_validation.md` file.

---

## 3. Result form (`day7_e2e_validation.md`)

```markdown
# [Day 7] E2E user scenario comprehensive verification result

## 1. Verification scenario overview
- **Target user persona:** Beginner self-employed person in his 50s who is not good at making smartphone reservation payments
- **Itinerary scope:** Sign up ➔ Filter search expert list ➔ Fill out reservation form ➔ Check local storage preservation

## 2. List of verification results by section
- **Sign up step:** Check email typos and confirm that error guard is working (OK)
- **Filtering step:** Category settings are lost when going back (NG ➔ SessionStorage caching action done)
- **Reservation stage:** When Reservation is confirmed, loading spinner and duplicate lock (disabled) operate normally (OK)
```

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 35-50 minutes
* **Practical usability:** ★★★★★
