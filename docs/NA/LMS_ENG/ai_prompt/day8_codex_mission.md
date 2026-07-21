# Day 08. Creating member services (User Management)

Almost all online services include a mandatory **"User Management"** function to verify the user's identity and provide a personalized experience. However, if you focus only on technical mechanisms such as back-end database encryption (Hashing), token-based authentication (JWT), and session security cookies at the introductory stage of development, it is easy to miss the most important **"optimal user experience (UX) that allows users to sign up and log in easily, safely, and without interruption"**.

The Day 8 course is not a day to learn how to mechanically code the membership authentication function, but a day to design and review with AI the onboarding journey where users first encounter our service and become members. From the planning stage of the membership function, we will practice to lower the psychological barrier to user registration (Task 01), eliminate the complexity of the registration form and unnecessary input steps (Task 02), and thoroughly supplement missing elements such as exception measures in case of duplicate registration or password loss (Task 03).

Learners use Codex AI as a competent service planning advisor and simulated user (Persona User) to collect the difficulties of customers who sign up for the first time (Mission 01) and learn the collaborative process of improving the completeness of the established member service structure by evaluating it with multidimensional quality indicators (Mission 02). Through this, non-development positions obtain a practical, user-centered guide that allows them to intuitively understand and participate in the entire design process.

---

# Task 01. Designing member functions (User Feature Planning)

## 1. Story and practice background

The startup's co-founders are meeting to discuss the membership registration method needed for the new consultation reservation platform. One team member argued, “For security purposes, you must receive email verification, mobile phone verification, address and detailed profile when signing up,” and another team member countered by saying, “70% of customers will leave even if the registration step goes beyond 5 seconds. We only need to provide a 1-second easy login to SNS.” Time passed by with conflicting opinions and no idea which function to build first and which to postpone until later.

The first step in member service planning is to compile a list of required features and prioritize them by considering the balance between development resources and user convenience. In this exercise, you will learn how to write a functional design that delivers virtual service specifications to Codex AI, neatly classifies essential basic membership functions (sign up/login) and optional extension functions (SNS integration, My Page), and derives priorities.

---

## 2. Learning objectives

* A list of membership features suitable for the business model of our service can be defined through discussion.
* Must-have and nice-to-have functions can be classified according to development urgency and user value.
* Using AI recommendations, you can quickly update core function specifications and checklists such as membership registration, login, and password management.

---

## 3. Practice mission

The learner prepares the service overview `day8_service_intro.md` locally and instructs the Codex Client to design the member function list and organize priorities.

> "Based on the provided service overview (`day8_service_intro.md`), please brainstorm a list of member management functions required for the reservation platform. Organize the list by dividing it into 1) essential basic functions and 2) optional extended functions, and return the priority implementation checklist in table form to check development progress."

---

## 4. Example of results

Codex analyzes service requirements and returns a prioritized list of member function designs.

### 1) Membership feature design list and priorities
* **Must-Have**: Email sign-up, email login, password recovery (virtual reissue link).
* **Optional extension features (Nice-to-Have)**: Simple SNS login (Google/Kakao), My Page (membership information modification, withdrawal), real-time validation of incorrect email format input.

### 2) Implementation Checklist
| Priority | Function name | Key Requirements and Details | Expected output |
|---|---|---|---|
| 1 | Email Sign Up | Password rule verification, duplicate subscription blocking | Sign-up screen form UI, DB storage loading |
| 2 | General Login | Check member status value (active), mismatch warning | Login session maintenance script |
| 3 | Edit My Page Information | Nickname change and membership withdrawal | Edit form, update withdrawal flag |
| 4 | Change/Find Password | Temporary password mail issuance simulation | Link to password reset page |

---

## 5. AI utilization points

* **Reverse recommendation of missing functions**: Reminds people of essential regulatory specifications for each domain, such as 'processing expiration of existing session when resetting password' or 'processing pending immediate destruction of personal information when withdrawing membership' that people may not have thought of.
* **Resource Priority Alignment**: Contrast development difficulty with business urgency to guide a feature roadmap that juniors can begin immediately.

---

## 6. Learning points

Before you start coding, having an architectural specification in place that prioritizes which features should be built first and why is like a preventative shot to prevent wasteful code writing between collaborators. Learn how to critically accept recommendations from your AI assistant to determine final priorities that are right for your team.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Task 02. Review membership functions from the user’s perspective (User Flow Review)

## 1. Story and practice background

After distributing the online shopping mall app, a serious phenomenon occurred where users deleted the app before even making a purchase once they entered the sign-up page. When I turned on the sign-up screen to find the cause, in addition to ID, password, and nickname, there were over 15 input fields lined up on the screen, including 'Zip code search', 'Sign up path', 'Recommender ID', and 'Consent to marketing SMS (not required)'. If even one was incorrect, the previously entered password would be erased and a red warning would be displayed.

From the developer's perspective, you may think that form input has been carefully guided to fit the database structure, but for users, this is a 'friction block' that causes them to give up signing up and leave. In this exercise, you will learn how to use Codex AI to analyze the entire membership registration and login process from the user's perspective and write a UX improvement report that greatly simplifies the input stage to maximize member attraction efficiency.

---

## 2. Learning objectives

* Unnecessary elements that cause cognitive overload and withdrawal of users can be pointed out in complex membership registration procedures (Input Forms).
* A TO-BE user flow alternative can be proposed that simplifies the login process (e.g., minimizes the process of finding ID/password).
* Based on AI usability analysis opinions, a user-friendly movement improvement plan can be established.

---

## 3. Practice mission

The learner prepares `day8_signup_spec.md` containing the previously designed complex signup form specification and requests the Codex Client to review its usability.

> "By analyzing the provided membership registration specification `day8_signup_spec.md`, please point out three usability impediments that general users who sign up for the first time will encounter. Also, please suggest an improvement report (User Flow Report) that reduces the number of input forms and prevents password resets in the event of an error."

---

## 4. Example of results

Codex audits the input specifications and returns a report detailing availability bottlenecks and alternative routes.

### User Flow Review Report

#### 1. Cognitive Friction Points
- **Excessive requirement of required values**: 'Detailed address' and 'Recommender ID', which are not required immediately upon registration, are bundled as mandatory registration steps, causing users to give up entering information midway.
- **Lack of guidance feedback**: Password rules (including special characters, etc.) are not informed in advance before the user enters them in the input window, creating a barrier that causes more than 3 failures.

#### 2. Proposal to improve the subscription process (TO-BE Flow)
- **Step 1 (Immediate Sign-up)**: Sign-up is approved immediately by entering your email address, password, and nickname (completes 3 seconds).
- **Step 2 (Additional Input)**: Detailed address and profile photo are encouraged to be entered at the time of first reservation application after entering the dashboard (Friction Delay).

---

## 5. AI utilization points

* **Quantification of exit barriers**: Cognitive limitations in the planning stage, such as “average fatigue rate when filling 15 input fields,” are logically explained based on user behavioral psychology.
* **De-coupling design**: Abandoning the desire to receive everything at once, we present a smart screen connection scenario that separates the registration and profile completion steps by time point.

---

## 6. Learning points

The best virtue in service planning is **“minimalism, removing all unnecessary things”**. We train sophisticated onboarding screen flows that have users sign up with a smile based on AI guidelines that simulate customer fatigue out of my sight.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 25-35 minutes
* **Practical usability:** ★★★★★

---

# Task 03. Check member features (User Feature Review)

## 1. Story and practice background

After coding the login and sign-up screens, a junior developer proudly reported, “Membership functionality works flawlessly!” However, a few hours after deployment, when a duplicate subscription request was sent to one email account, two users were sent the same email, and a major consistency bug occurred where the details of the wrong user were recorded at the time of payment. In addition, when sending temporary passwords, it was not checked whether the existing user's account was activated, which resulted in a continuous failure of mail issuance to deactivated accounts.

Ensuring the success of a button click on a simple login screen and the consistency of the member account life cycle is a completely different problem. In this exercise, Codex AI is assigned as an auditor, and a checklist is built for the implemented virtual member service file `day8_user_service.js` by finding account security and consistency exceptions that are easy to miss, such as email duplication check, special character injection security, password search, and temporary session expiration.

---

## 2. Learning objectives

* Data consistency defects (duplicate subscriptions, etc.) inherent behind the success of subscription and authentication logic operations can be discovered.
* Can explain business rules related to security quality, such as password reset and account lockout conditions.
* You can create a virtual member logic omission prevention inspection report by referring to the AI function auditing findings.

---

## 3. Practice mission

The learner uploads the `day8_user_service.js` file, which is vulnerable to security due to missing redundancy checks or guards, and requests a completeness check from the Codex Client.

> "Please audit the provided `day8_user_service.js` membership sign-up and login script to identify defects such as 1) the risk of missing duplicate sign-up checks, 2) immediate discarding of existing passwords when passwords are lost, and suggest a final JavaScript improvement with reinforced effective guards to increase service stability."

---

## 4. Example of results

Codex diagnoses weak subscription logic and returns consistency-controlled code.

### 1) Vulnerability enhancement improvement source
```javascript
// AS-IS: Simple data insertion without duplicate checking
// TO-BE: Check for duplicate emails and add security exception handling
const userDatabase = [];

function registerUser(email, password, nickname) {
  // 1. Duplicate Guard
  const isDuplicated = userDatabase.some(user => user.email === email);
  if (isDuplicated) {
    return { success: false, message: "This email address has already been registered." };
  }
  
  // 2. Input format guard (Email Validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "The email format is not valid." };
  }
  
  // 3. Safe loading of user data
  const newUser = { email, password, nickname, status: 'active' };
  userDatabase.push(newUser);
  return { success: true, user: newUser };
}
```

---

## 5. AI utilization points

* **Point out security vulnerabilities**: It reminds you of the security barrier points between backend and frontend to prevent account misuse, such as whether there is a restriction on login attempts (brute force defense) and the risk of storing plaintext passwords.
* **Consistency rule check**: Finds call sequences that compromise data storage integrity during subscription processing and prescribes fixes.

---

## 6. Learning points

The login function doesn't just end with a button click event. Through training that thoroughly takes care of redundancy checks and formal validity guards at the design stage, the developer's perspective on responsibility for protecting users' personal information and service reliability is expanded.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-45 minutes
* **Practical usability:** ★★★★★

---

# Mission 01. Become a first-time user (First-Time User Walkthrough)

## 1. Mission Overview

By turning on the action flow of the membership registration and login linked browser screen that we built ourselves, we anthropomorphized and simulated the reactions of an extreme novice virtual user who is experiencing the service for the first time through Codex, and tracked the emotional friction section of registration onboarding.

---

## 2. Detailed tasks

1. **Submission of screen form plan**: Provide Codex Client with an HTML structure or design plan with login and sign-up fields defined.
2. **Persona Matching Chat**: Codex is given “the persona of the digitally underprivileged class who most complicates the registration process” and collects the difficulties experienced from accessing the virtual first screen to successful registration in chat format.
3. **Guide security point correction**: After receiving a user complaint saying, “It’s frustrating because it only throws an error because I didn’t use a special character in the password and doesn’t tell me why it doesn’t work,” we apply the real-time validity text feedback display code to the source.
4. **Save review report**: Save the collected reaction logs and UX improvement suggestions as `day8_first_user_review.md` file.

---

## 3. Result form (`day8_first_user_review.md`)

```markdown
# [Day 8] First virtual user onboarding usability report

## 1. Overview of virtual user personas
- **Settings:** Silver class in their 60s who feel extreme fatigue from smart device payments and subscriptions
- **Onboarding task:** Complete the form information on the sign up screen and receive notification of successful registration.

## 2. Log of error section experiencing friction
- **Password Complexity Friction:** I filled out a combination of 8 or more characters, numbers, and special characters, but was embarrassed when an error occurred. It turned out that the capital letters were missing, but they were missing from the screen guidance text.
- **Confusion over ID duplication check:** I thought that if I clicked the sign-up done button, it would automatically check for duplicates, but I didn't press the manual 'duplicate check' button, so all input forms were invalidated.

## 3. TO-BE screen guidance prescription
- Apply an input indicator below the registration form that immediately displays in green/red whether the real-time password rules are met.
- Implementation of background automatic duplicate check processing when email input focus goes out (`blur` event) after deleting the duplicate check button.
```

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-45 minutes
* **Practical usability:** ★★★★★

---

# Mission 02. Evaluate member service quality (Usability Metric Evaluation)

## 1. Mission Overview

Finally, we request an objective quality inspection from Codex for the entire operation sequence of the refined virtual member logic based on multidimensional quality indicators (ease of operation, error prevention, information visibility), and receive encouragement for its strengths and obtain a roadmap of recommended functions that will dramatically increase the service value if added.

---

## 2. Detailed tasks

1. **Final Code Audit Request**: Send completed subscription and storage guard scripts and direct a multi-dimensional usability quantitative evaluation.
2. **Analysis of pros and cons**: We analyze the rating indicators presented by Codex (each based on a scale of 5 points), strengths (perfect duplicate email guard), and critical weaknesses (such as security weaknesses that provide hints to hackers by writing too kindly whether the ID or password is incorrect when login fails).
3. **Implementation of recommended supplementary devices**: Check the module supplementary measures recommended by AI and apply them to the source code.
4. **Save Quality Evaluation**: Submit the `day8_usability_evaluation.md` file with the comprehensive score matrix.

---

## 3. Result form (`day8_usability_evaluation.md`)

```markdown
# [Day 8] Member service multidimensional usability quality assessment

## 1. Evaluation Index Matrix (Usability Scores)
- **Accessibility of registration operation:** 4.2 / 5.0 (form input is simple)
- **Error recovery and prevention:** 4.5 / 5.0 (excellent blur view redundancy check)
- **Security and consistency safety:** 3.0 / 5.0 (In case of login error, the detailed reason for failure is exposed, exposing the threat of account takeover)

## 2. Comprehensive auditing comments
- **Strengths:** The 3-second email sign-up flow is completed very smoothly without Kakao/Google by combining it with sessionStorage cache.
- **Painful improvement point (security advisory):** When login fails, instead of providing different error messages such as “ID does not exist” and “Password does not match,” brute force attacks should be blocked by processing them as a single “E-mail or password was entered incorrectly.”
```

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-40 minutes
* **Practical usability:** ★★★★★
