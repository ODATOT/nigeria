# Day 09. Designing a payment service (Payment Service)

The payment function is the final and most critical step in web/app services where business profits are generated and transactions are completed. However, many introductory development trainings focus only on mechanically succeeding in ‘launching the payment window’ and ‘calling the approval API’ by importing the linking source code of an external electronic payment agency (PG) such as Toss Payments or PortOne. In fact, in actual service operation, you miss out on problems in the realistic checkout journey, such as **"users who feel anxious during payment and leave"**** or **"users who are frustrated by seeing stupid English error codes when approval fails"**, which have a direct impact on sales.

The Day 9 course is not a coding day to copy and paste a payment API, but a day to audit payment experience and reliability with AI so that users can open their wallets and pay with peace of mind without any hesitation or anxiety at the last step. We optimize the movement path by removing unnecessary steps from product selection to final payment completion (Task 01), carefully collect failure situations that frequently occur in practice, such as exceeding the card limit or communication interruption, and prepare recovery plans (Task 02), and practice improving payment trust by supplementing security badges and detailed price notation (Task 03).

Learners will use Codex AI as a thorough black box testing partner and safe payment consultant to establish unexpected failure notices (Mission 01) and learn collaboration routines that analyze the sections that cause departures at each payment stage and derive priority improvement plans (Mission 02). This course provides practical guidelines to help non-planners, designers, and non-developers with limited technical knowledge fully empathize with and plan the key barriers to payment service design and ways to improve trust.

---

# Task 01. Payment Flow Planning

## 1. Story and practice background

A crowdfunding platform startup launched ambitiously, but is experiencing a huge crisis in which only 15% of customers who put products in their ‘shopping cart’ reach the final payment, while the remaining 85% drop out during payment. When we inspected the process from registration to payment, we found that there were over 9 steps in the process, including product details ➔ option selection ➔ filling out an order form ➔ agreeing to terms and conditions ➔ entering a delivery address ➔ selecting a payment method ➔ verifying mobile phone identity ➔ launching a PG company app ➔ completing payment. Meanwhile, loading was delayed or unnecessary pop-ups appeared on mobile screens, completely discouraging users' desire to purchase.

The moment a user decides to spend, there should be no sense of disconnection even for a second. In this exercise, we pass the payment flow details of the current virtual service to Codex AI and design the ultimate simplified payment journey model (Optimized Payment Flow) that boldly cuts out unnecessary intermediate pages and approval confirmation pop-ups to complete payment in ‘only 3 steps’.

---

## 2. Learning objectives

* The payment process, from product selection to order creation and final approval, can be diagrammed step by step.
* Unnecessary confirmation procedures or page movements within the payment journey can be identified and user friction minimized.
* You can obtain a smooth and fast UX payment flow design document by reflecting AI’s opinion on journey simplification.

---

## 3. Practice mission

The learner creates a file called `day9_current_checkout_flow.md` that describes the current payment flow in a messy manner and requests the Codex Client to design a single line.

> "Read the current multi-step payment flow (`day9_current_checkout_flow.md`) and find two barriers that may cause users to run away due to fatigue before clicking payment. Also, please derive an improved payment user flow (TO-BE Flow) that is reduced to 3 steps or less by merging unnecessary steps so that users who sign up for email can complete the purchase as quickly as possible."

---

## 4. Example of results

Codex audits your journey and delivers condensed scenarios and step definitions.

### 1) Improved payment step definition (Optimized TO-BE Flow)
* **Step 1: Automatically load payment information and delivery address (Single Page)**
  - By default, the shipping address saved when signing up is exposed, eliminating the trouble of entering a new address.
* **Step 2: Select one-click payment method and agree to integrated terms and conditions (Checkout Overlay)**
  - Selection of means to go to a separate page and full consent are integrated into one overlay window.
* **Step 3: PG Easy Payment Call and Completion Redirection (Confirmation)**
  - After approval, move to the completion dashboard immediately without waiting in the middle.

### 2) Diagnosis of exit barriers
- **Double request for mobile phone identity verification**: Even though you are a member who is already logged in, an additional identity verification pop-up is called during payment to provide a factor for escaping membership.
- **Inconvenience in entering address search**: Identified a major defect where the zip code window opens an in-pop browser that leaves the mobile phone and the form is lost when going back.

---

## 5. AI utilization points

* **Automated flow merging**: Derive a compact screen merging design idea that merges 'Enter shipping address', 'Use points', and 'Apply coupon' scattered across multiple pages into a single 'Order/Payment Summary Sheet'.
* **Abandonment risk quantitative investigation**: Provides evidence from a user psychology perspective on how the payment abandonment rate increases for each additional input field based on mobile devices.

---

## 6. Learning points

The key to payment design is **"Once someone opens their wallet, process it in the shortest possible way without giving them time to think about anything else."** Before thinking about technical details, learn intuitive planning and design methods to discover and eliminate customer friction factors.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Task 02. Review payment failure scenarios (Payment Exception Review)

## 1. Story and practice background

I excitedly bought something at a shopping mall and pressed the credit card payment button, but it loaded for a while and suddenly stopped with an English warning message saying 'Error 1042: System Transaction Declined by External Carrier' popping up on the screen. The customer center was flooded with urgent complaint calls from users asking “Has the money been taken out?”, “Has the payment not been made?”, “Will I be charged twice if I pay again?” When I checked, it was just that the user had exceeded the limit, but it was because the backend displayed the error code returned by the PG company raw on the screen without a filter.

Payment authorization errors are very common. The important thing is to provide clear exception feedback so that when users encounter an error, they can confidently understand what went wrong and how to avoid losing money twice. In this exercise, we use Codex AI as a failure coach to derive four major exception situations such as card limit exceeded, network time exceeded, insufficient balance, and duplicate payment request, and assemble a safe error response guide (Error Mitigation Guide) appropriate for them.

---

## 2. Learning objectives

* Can explain four or more representative exceptions and failure types that occur during the payment linkage process.
* Translate technical raw error codes into user-friendly language containing action instructions.
* You can configure a guidance scenario that resolves exceptions with a large asset threat, such as duplicate payments, without cognitive friction.

---

## 3. Practice mission

The learner mocks `day9_raw_payment_errors.json`, PG's raw failure log format, and instructs the Codex Client to build a conversion guide.

> "Based on the provided PG company's raw error log specification `day9_raw_payment_errors.json`, please create a friendly 'Korean guidance phrasebook for each error situation' that never causes anxiety to users and a 'double authorization prevention response guideline (Mitigation Playbook)' that blocks duplicate payment attempts."

---

## 4. Example of results

Codex analyzes error codes and returns smooth resolution messages and response rules.

### 1) User-safe error message change (Actionable Error Copy)
| raw error code | Cause of occurrence | User screen exposure phrase (TO-BE) |
|---|---|---|
| `ERR_CARD_LIMIT_EXCEEDED` | limit exceeded | "The payment limit for the selected card has been exceeded. Please use a different card or increase the limit and try again. (Payment has been cancelled.)" |
| `ERR_NETWORK_TIMEOUT` | communication delay | "There is a delay in communication with the payment gateway. Money has not been withdrawn from your bank account or card at this time, so please rest assured and try again." |
| `ERR_DUPLICATE_REQUEST` | Multiple hits/duplicate | "The same order is currently being processed. Please wait a moment to prevent duplicate payments. Approval can be confirmed immediately in the order history." |

### 2) Dual Authorization Prevention Guide
- **Duplicate transmission blocking (Debounce Lock)**: As soon as a payment request is clicked, the button is processed as ‘disabled’ and the standby spinner is activated.
- **Client order token issuance**: When creating an order, assign a UUID `orderToken` to prevent double processing of the same token.

---

## 5. AI utilization points

* **Anxiety-relieving copywriting**: Corrects the optimal sentence structure to alleviate financial anxiety, such as “Don’t worry, you won’t be double charged.”
* **Correction of excessive information**: When the cause of an error is a server defect, randomly showing the detailed cause can be a hacking target, so encapsulate it with appropriate common error information.

---

## 6. Learning points

When money is on the line, the most dangerous thing is to "silence users or scare them with jargon." We work with an AI assistant to assemble reliable, friendly error messages and a secure client lock device to improve product completeness.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 25-35 minutes
* **Practical usability:** ★★★★★

---

# Task 03. Improving the payment experience (Payment Experience Review)

## 1. Story and practice background

It is a platform that is very successful in making payments and has full error prevention measures, but strangely, users hesitated for a long time at the final payment method selection screen and then left. When analyzing the screen, there was only a black 'subscription amount of 50,000 won' and a clunky 'pay' button on a white background, and there was complete absence of information on whether the company had a safe payment security license, whether the total payment amount including VAT was correct, and what the refund and cancellation regulations were. From the user's perspective, it felt as if they had accessed a phishing site and had their card number stolen.

Subtle psychological factors on the checkout screen have a decisive impact on actual purchase conversion rates. In this exercise, Codex AI will be used as a member of the financial usability evaluation committee to evaluate the final payment approval screen plan 'day9_payment_ui.html' and assemble a payment trust supplement report (Payment Experience Report) that will more than double the purchase rate, including placement of trust badges, separation of final benefit price details, and linking of refund policy anchor links.

---

## 2. Learning objectives

* You can name three elements (security badge, refund information, etc.) that provide trust so that users can make payments without worry.
* Information (total payment amount, detailed discount, commission) included in the payment summary screen can be placed without omission.
* By applying AI’s UI improvement feedback, you can obtain a user-centered payment UX design that increases payment rates.

---

## 3. Practice mission

Learners submit `day9_payment_ui.html`, the UI layout specification for the final payment confirmation page being planned, and request UX evaluation from Codex Client.

> "Please review the usability and reliability of the provided `day9_payment_ui.html` payment UI layout. Find places where users may feel anxious due to information opacity, and derive a final CSS/HTML structure supplemented with 1) separate display of detailed price discount receipt type, 2) placement of 24-hour secure payment security phrase, and 3) simple cancellation/refund link prescription."

---

## 4. Example of results

Codex evaluates the layout and returns TO-BE UI code with increased confidence.

### 1) Improved secure payment receipt layout (Payment UX UI)
```html
<!-- AS-IS: Subscription amount 50,000 won / End of make payment -->
<!-- TO-BE: Separate detailed receipts and enhance security -->
<div class="checkout-receipt-box" style="background: #18181b; padding: 16px; border-radius: 10px;">
  <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#a1a1aa;">
    <span>Basic service amount</span>
    <span>₩50,000</span>
  </div>
  <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#f43f5e; margin-top:4px;">
    <span>Special discount for first month launch</span>
    <span>-₩10,000</span>
  </div>
  <div style="display:flex; justify-content:space-between; font-size:0.95rem; font-weight:800; color:#fff; border-top:1px solid #27272a; margin-top:8px; padding-top:8px;">
    <span>Final actual payment amount (including VAT)</span>
    <span>₩40,000</span>
  </div>
  
  <p style="font-size:0.7rem; color:#71717a; margin-top:12px; text-align:center;">
    🔒 This payment is safely protected by 256-bit encrypted communication, and <a href="#refund" style="color:var(--secondary-color);">full refund within 7 days</a> is possible.
  </p>
</div>
```

---

## 5. AI utilization points

* **Receipt Price Segmentation**: Coaching text segmentation that removes cost opacity at the moment of payment and lists detailed deduction details to help users be confident they are making a reasonable purchase.
* **Anxiety-avoiding copy assembly**: Provides small but powerful purchase anxiety trigger requirements such as cancellation within 7 days, peace of mind security lock, and placement of certified PG partner logo.

---

## 6. Learning points

Trust blooms not from grandiose interconnection technology, but from **“visible, transparent guidance and a friendly safety badge.”** Using AI's UX audit review, we will practice thoroughly filling out the safety and completeness of our services.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Mission 01. Handling Payment Failures

## 1. Mission Overview

Exceptions that occur in practice, such as the actual mobile network environment, non-installation of the simple pay app, or exceeding the limit, are checked through Codex simulation, and a behavioral payment cancellation and retry error guideline specification (`day9_failure_scenarios.md`) is created to prevent misunderstandings that money has evaporated from the user's perspective.

---

## 2. Detailed tasks

1. **Error mapping scenario request**: Throw 3 scenarios of PG window closing during payment, bank check time, and limit exceeded to Codex Client to evaluate the anxiety score.
2. **Establish an anxiety-relieving message**: To prevent users from abandoning their payment and resulting in a complaint call, create text copy that includes behavioral solutions such as “No amount has been authorized. We are currently in your bank check hours (23:55 - 00:05). Please choose another payment method or try later.”
3. **Construction of a response procedure table**: Create a unified phrasebook by linking the following steps: cause of failure ➔ user reaction ➔ guidance message ➔ post-cancellation and repayment induction.
4. **Save output**: Save the completed error prevention statement as `day9_failure_scenarios.md` file.

---

## 3. Result form (`day9_failure_scenarios.md`)

```markdown
# [Day 9] Overcoming payment failure exceptions and safe feedback guide

## 1. Three Major Payment Failure Response Matrix
| Number | Disability situation | user analogy anxiety factor | Recommended Actionable Message |
|---|---|---|---|
| 1 | User force closes window during payment | 'Has a duplicate payment been processed in my account?' | "Payment was terminated without being processed. Withdrawal and approval did not occur, so please rest assured and try again." |
| 2 | Reject transactions during bank inspection hours | 'Did the money go out and the purchase approval go through?' | "Approval is not possible due to the current OO Bank maintenance time zone (23:55~00:05). Payment has not been processed. Please try again with another card/method or after inspection." |

## 2. Double request defense development rules
- When the payment transmission flag `isPending` is true, the click event source blocks.
- A unique UUID valid for 30 minutes is issued per order and compared with a unique identification key (Idempotency Key) when calling the payment API.
```

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-45 minutes
* **Practical usability:** ★★★★★

---

# Mission 02. Check directly until purchase is completed (Checkout Journey Audit)

## 1. Mission Overview

The final refined virtual payment summary screen and API linkage flow are turned on, and the entire customer journey map, which leads to product selection ➔ shopping cart ➔ order creation ➔ PG payment window call ➔ approval processing ➔ completion page, is simulated and executed to analyze the points where churn is most likely to occur and create a priority improvement report (`day9_checkout_journey.md`).

---

## 2. Detailed tasks

1. **Obtain journey stage map**: Submit a code listing all payment stages to Codex and ask Codex to identify two friction peak points where the risk of users withdrawing their psychological decision to purchase is highest.
2. **Identification of reasons causing churn**: For example, “When choosing a payment method, there is no beautiful credit card icon logo, so I feel anxious about the smallness of the company.” This is a small but psychologically fatal predicament.
3. **Improvement Priority Assignment**: Measures are taken to assign 'security badge placement' and 'increasing receipt text font size' that can be repaired immediately as priority A, and mid- to long-term PG contract changes as priority B.
4. **Storage of output**: Save the organized auditing report as `day9_checkout_journey.md` file.

---

## 3. Result form (`day9_checkout_journey.md`)

```markdown
# [Day 9] Customer Payment Journey Usability Diagnostic Report

## 1. Payment Journey Friction Peaks
* **Peak 1: Order information creation page (Friction: High)**
  - Reason: There is structural despair in which all previously entered shipping address data is lost when you leave the current page to search for a coupon.
* **Peak 2: Final payment approval overlay (friction: Medium)**
  - Reason: Description of refund procedure and deadline is missing, causing reason to cancel payment right before clicking payment.

## 2. Improvement priority (TO-BE Remediation)
- **Priority 1 (applied immediately):** Add bold text to the bottom of the payment pop-up window: “One-click cancellation/refund possible immediately on My Page after payment is completed.”
- **Priority 2 (Development Patch):** When executing the coupon inquiry modal, temporarily synchronize the existing shipping address field status to the local session to block form initialization.
```

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Medium)
* **Estimated lab time:** 30-40 minutes
* **Practical usability:** ★★★★★
