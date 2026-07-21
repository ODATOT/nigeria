# Day 06. Development (Creating screens with AI)

What frustrates learners the most when they first start developing is **"the vagueness of not knowing what to code on a blank page"**. Even though I have learned grammar and seen examples, when I actually try to implement the screen I envisioned with code, even writing the first line seems like a huge obstacle.

The purpose of the Day 6 course is not simply to mechanically copy completed code or to acquire skills in handling frameworks. Instead, the focus is on experiencing **"a series of collaborative development processes that use AI as a capable pair programmer to quickly create drafts from a blank screen, self-diagnose and resolve errors encountered during development, and organize code for readability."**

With the help of AI, learners quickly convert the content of the plan into a workable screen draft (Task 01), train a debugging guide to read error messages and find solutions (Task 02), and neatly organize complex and difficult code (Task 03). Additionally, you will take your first steps as a smart software builder in the AI ​​era by delving into virtual and actual error cases with AI (Mission 01) and reviewing the completed final code from various angles to improve its quality (Mission 02).

---

# Task 01. Quickly create a screen draft (Prototype Generation)

## 1. Story and practice background

A junior at a startup was tasked with developing a reservation management system. The plan had a colorful calendar and list view for each reservation status, but when I opened the local editor and saw an empty HTML file, I felt at a loss. The day passed by just thinking about how to create the layout grid and how to separate the CSS style files.

When you first start development, drawing the initial structure (boilerplate) and component layout skeleton is very inefficient and demoralizing. In this exercise, you will learn how to explain a screen planning specification (Figma layout) to Codex in text and generate a workable responsive screen draft and component code in just a few seconds, dramatically speeding up the initial development process.

---

## 2. Learning objectives

* Using AI, screen drafts (HTML/CSS) can be automatically created from requirements specifications.
* Planning contents and layout definitions can be converted into a screen structure that operates in an actual browser.
* Understand the basic boilerplate structure of a project and be able to quickly start the first stage of development.

---

## 3. Practice mission

Learners prepare a screen requirements statement, `day6_layout_spec.md`, within their local project folder and build the screen draft code by sending the below prompt to the Codex Client.

> "Based on the provided layout specification, please create a draft HTML markup and CSS grid style for a responsive dashboard screen to view reservation status. Please suggest an initial project structure, including a left navigation bar and waiting/approved/complete card components to indicate reservation status."

---

## 4. Example of results

Codex analyzes the layout specification and derives the web page structure and workable prototype code shown below.

### 1) Prototype screen structure (HTML skeleton)
```html
<div class="dashboard-container">
  <aside class="sidebar">
    <nav class="nav-menu">...</nav>
  </aside>
  <main class="content-area">
    <header class="dashboard-header">...</header>
    <section class="stats-grid">
      <div class="card status-pending">12 waiting</div>
      <div class="card status-approved">8 approved</div>
      <div class="card status-completed">done 24</div>
    </section>
    <section class="booking-table">...</section>
  </main>
</div>
```

### 2) CSS layout structure (CSS Grid/Flex)
```css
.dashboard-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

---

## 5. AI utilization points

* **Automatically generate boilerplate**: Provides a suitable basic HTML structure and responsive CSS Flexbox/Grid structure framework so that you don't get tired of configuring the development environment.
* **Component abstraction**: Generates elements such as 'state summary card' or 'table list' in the text description by standardizing them as class-level components.

---

## 6. Learning points

When you're just getting started with coding, it's important to train yourself to focus more of your brain resources on using AI to create a framework and figure out the architectural flow, rather than wasting time unnecessarily on typing speed or typos.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 25-35 minutes
* **Practical usability:** ★★★★★

---

# Task 02. Error Resolution Assistant (AI Debug Assistant)

## 1. Story and practice background

I wrote JavaScript code to pop up the screen and have fun fetching API data. However, when I clicked refresh on the browser, the screen froze white and the console window was filled with a red error message: `TypeError: Cannot read properties of undefined (reading 'map')`. The junior developer looked at the code dozens of times without knowing the cause, and even when he typed a message in the Google search box, he only got answers in English that did not fit his situation, which ultimately left him frustrated.

More than half of development is the 'debugging' process of finding and fixing errors. Beginners waste a lot of time because they lack the ability to read and interpret error logs, which are clues to errors. In this exercise, we will deliver the error phenomenon, error log, and execution code that occurred to Codex to accurately pinpoint the fundamental point of occurrence of the problem and prescribe measures to correct it immediately.

---

## 2. Learning objectives

* You can determine the type of problem by reading error messages in the browser console and server log.
* Develop logical debugging habits that analyze the cause and path of errors (Stack Trace).
* Safe defensive coding can be directly applied based on the error analysis report proposed by AI.

---

## 3. Practice mission

The learner opens the local code `day6_debug_source.js` that causes an error when running, checks the console error log, and requests diagnosis to the Codex Client.

> "An error 'TypeError: Cannot read properties of undefined (reading 'map')' occurred in the code you wrote. Compare the provided source code `day6_debug_source.js` and the console error log to explain the cause (why) of the error from a beginner's perspective. Please provide a modified source with defense code that can completely control the error."

---

## 4. Example of results

Codex reads the context of the error log and clearly writes out the occurrence point and prescription.

### Error Analysis & Solution Report (Debugging Diagnosis Report)

#### 1. Cause of error
* **Cause**: An error occurred because the `.map()` repeat function was executed immediately before data was received from the server after calling the `fetch` API, or when the data was empty (`undefined`) due to network delay.

#### 2. Defense code application guide
* You must control the app from crashing even at the moment when there is no data by combining an optional chaining (`?.`) pattern that safely verifies the presence or absence of a data array in advance or an empty array precaution (`|| []`).

#### 3. Code recommended for modification
```javascript
// AS-IS: Dangerous Direct Access
const renderList = (data) => {
  return data.map(item => `<li>${item.name}</li>`);
};

// TO-BE: Apply safe defensive code
const renderList = (data) => {
  if (!data) return '<p>Loading or no data</p>';
  return data.map(item => `<li>${item.name}</li>`).join('');
};
```

---

## 5. AI utilization points

* **Error context analysis**: Infers the context of not only simple typo errors, but also atypical runtime exceptions that occur due to call order or asynchronous execution timing (Asynchronous Flow).
* **Debugging process guide**: Rather than providing simple solution code, it provides conceptual educational explanation on “Why did an error occur in this line?”

---

## 6. Learning points

An error message is not a warning window to scold the developer, but rather the kindest hint to indicate a problem. If you develop the ability to track clues to errors using an AI assistant as a guide, you can quickly learn even unfamiliar technology stacks.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-45 minutes
* **Practical usability:** ★★★★★

---

# Task 03. Code Refactoring

## 1. Story and practice background

After many twists and turns, I completed a code that displayed the screen well and produced no errors. It worked well, so I thought everything was over, but the team leader sighed after checking the code. “There are too many redundant functions written here, and I have no idea what the variable names mean. If you distribute it like this, it will become trash code that even you will find difficult to fix in just a month.”

Proper operation of the program is only a 'minimum requirement' for development, and if the code is messy and twisted like spaghetti, it will hinder business expansion. In this exercise, we will review the code written by Codex, group duplicate logic into reusable functions, and apply intuitive naming conventions to create clean code that maximizes readability and maintainability.

---

## 2. Learning objectives

* You can understand the structural difference between complex code that only works and maintainable code that is easy to read.
* Overlapping functions and hard-coded values ​​can be extracted and improved into a reusable structure.
* Variable/function names can be clearly changed and refactored based on AI’s code review suggestions.

---

## 3. Practice mission

The learner prepares a `day6_dirty_code.js` file in which multiple identical functions are intertwined, and requests Codex Client to organize the code and improve its structure.

> "Please analyze the source of the provided `day6_dirty_code.js` file and refactor it into an improved version of clean code by 1) separating the duplicate markup binding logic into a common utility function, 2) correcting ambiguous variable names (ex: `a`, `temp`, `fn`) with practical words, and 3) writing appropriate one-line comments to facilitate future maintenance."

---

## 4. Example of results

Codex extracts improvement points from messy code and returns a refactored version, like this:

### Refactored Clean Code (improved version)

#### 1. Major refactoring details
* **Remove duplication**: Consolidated repeated HTML manipulation code when rendering reservation card information into a common `createCardTemplate` helper function.
* **Ensuring readability**: The variable `fn`, whose meaning was difficult to understand, was renamed to `formatUserPhoneNumber` and `a` to `activeReservations`.

#### 2. Refactoring result source
```javascript
// 1. Helper function for processing numeric phone number format
const formatUserPhoneNumber = (phone) => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

// 2. Reservation status card HTML template create common utility
const createCardTemplate = (reservation) => {
  const formattedPhone = formatUserPhoneNumber(reservation.phone);
  return `
    <article class="reservation-card" data-id="${reservation.id}">
      <h3>${reservation.userName}</h3>
      <p>Contact: ${formattedPhone}</p>
      <span class="status-tag">${reservation.status}</span>
    </article>
  `;
};
```

---

## 5. AI utilization points

* **Code Smell Detection**: Find long methods that are difficult to read, duplicate branch statements, and inappropriate parameter structures.
* **Automatically generate comments**: Instead of complex explanations, add summary comments to core algorithms or status judgment statements that other developers can understand at a glance.

---

## 6. Learning points

What is more important than creating working code is **"creating code that tomorrow's self can easily read and modify"**. Learn a professional attitude by actively accepting the AI ​​assistant's code auditing opinions and gradually adjusting the completeness of the code.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Mission 01. Error Troubleshooting Session with AI

## 1. Mission Overview

After creating a screen prototype, implementing the API data fetch function and testing virtual server integration, a series of unexpected errors occurred. We receive Codex's diagnostic prescription for the error in question, trace the error cause, and ultimately prove that the result runs stably.

---

## 2. Detailed tasks

1. **Situation log collection**: Copy the red error sentences (e.g. `CORS policy`, `SyntaxError: Unexpected token < in JSON`) from the console window of the browser developer tool and save them as text.
2. **Cause Identification Chat**: Pass the collected error sentences and your original code to Codex Client to help explain the structural causal relationship of the problem.
3. **Apply patch code**: AI diagnoses the cause and applies suggested correction instructions to local sources by manually modifying them.
4. **Organizing learning notes**: Organize the background, solution, and disaster prevention plan for similar problems in the error analysis report form and save it as a `day6_error_report.md` file.

---

## 3. Result form (`day6_error_report.md`)

```markdown
# [Day 6] AI Debugging Result Report

## 1. Problem situation
- **Error Occurring:** `SyntaxError: Unexpected token < in JSON at position 0`
- **Time of occurrence:** Syntax for parsing API Response data when refreshing the list

## 2. Fundamental cause of error (Why)
- A 404 HTML error page was returned due to a typo in the endpoint URL path on the server side. This phenomenon occurred when the client misunderstood this as a normal JSON data format and attempted to perform `JSON.parse` while parsing `<`, the starting character of HTML.

## 3. Action details & correction code
- The server call URL has been corrected to `/api/reservations`, and a conditional expression has been inserted to check in advance whether the `content-type` header of the response is json.
```

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-45 minutes
* **Practical usability:** ★★★★★

---

# Mission 02. Get AI code review (AI-Assisted Code Quality Review)

## 1. Mission Overview

The learner implements the dashboard reservation control logic and requests Codex to receive a full audit by a professional code reviewer of the final source code that was written in a somewhat haphazard manner. The improvement recommendations that were pointed out are fully integrated into the modified code and a high-quality code refactoring version is submitted.

---

## 2. Detailed tasks

1. **Code feedback request**: Send the source code you wrote yourself and successfully operate to Codex and ask questions such as “Is it easy to read?”, “Are the variable names intuitive to others?”, “Are there any hard coding or duplicate codes?” Request a multi-faceted evaluation, etc.
2. **Review Analysis**: Analyze structural improvement points provided by Codex (ex: recommendations to simplify complex ternary operators and minimize global variable pollution).
3. **Code advancement**: Based on the comments, we finalize the code and complete a stable and elegant version that prevents possible bugs.
4. **Save review notes**: Save the pointed out code smells and the improved final version as a `day6_code_review.md` file.

---

## 3. Result form (`day6_code_review.md`)

```markdown
# [Day 6] AI code review feedback & refactoring summary

## 1. Code reviewer feedback (main point)
- **Global variable abuse**: There is a high risk of arbitrary damage from other modules by indiscriminately referencing the reservation count status as a global object variable.
- **Repeated branch statement**: `if (status === 'wait') ... else if` format is confusing, making it difficult to expand when new status codes increase.

## 2. Final improvement code
- To minimize global contamination, encapsulation is done with an immediate execution function (IIFE) or reserved status management object module structure, and status processing is converted to an object mapping map (Map) format.
```

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-40 minutes
* **Practical usability:** ★★★★★
