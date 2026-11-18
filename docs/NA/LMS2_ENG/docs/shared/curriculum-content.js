(function () {
  "use strict";

  function skill(title, card, concept, practice, artifact, check) {
    return { title: title, card: card, concept: concept, practice: practice, artifact: artifact, check: check };
  }

  function mission(title, card, issue, planner, developer, artifact) {
    return { title: title, card: card, issue: issue, planner: planner, developer: developer, artifact: artifact };
  }

  window.LMS_CURRICULUM = {
    1: {
      theme: "Requirements & Domain Discovery",
      skills: [
        skill("Turn service problems and Personas into Domain language", "Developers use AI's questions to model vague business language into Actor·Goal·Data themselves.", "You should be able to explain how Persona, Goal, behavior and data lead to Domain candidates.", "First mark the evidence sentences in the source, write the Persona table yourself, then ask AI only for missing questions and counter-examples to fix the table.", "persona-domain-notes.md", "Do not copy AI's sentences. Explain the evidence for each Domain candidate in your own words."),
        skill("Group Features into cohesive Domains", "Developers set cohesion and coupling rules, then adjust Feature boundaries using AI counter-examples.", "Learn to group features that share the same responsibility and reason to change.", "Group Features by hand first, then ask AI for cases where the boundaries break, and record what changed.", "feature-domain-map.md", "Explain why each feature belongs to a Domain using its reason to change and data ownership."),
        skill("Check the Domain Map and responsibility boundaries", "Developers draw data ownership and dependency direction, then use AI as an architecture reviewer.", "Understand Bounded Context, Upstream/Downstream and source-data ownership.", "Draft a Context Map yourself, ask AI to find circular dependencies, duplicate ownership and missing integration points, then fix it yourself.", "domain-context-map.md", "Every key piece of data has one source owner, and you recorded how circular dependencies were removed.")
      ],
      missions: [
        mission("Find decision reasons lost in an AI meeting summary", "Planners and developers compare the AI summary with the original and restore missing policies, open items and decision reasons.", "The AI Agent kept only the meeting's conclusions and wrote conditions, objections and open questions as if they were final.", "The planner marks quotes from the original and decision status, and splits AI guesses into facts, assumptions and questions.", "The developer marks how the missing conditions affect features, data and error handling.", "decision-evidence-log.md"),
        mission("Agree on vague done-conditions in AI requirements", "Planners and developers review AI-written requirements together and turn them into testable done-conditions.", "Words like \"fast\", \"safe\" and \"easy\" stay in the requirements, so people build them differently.", "The planner gives user value and acceptable ranges as numbers, states and examples.", "The developer asks about normal, failure and edge cases and writes testable Acceptance Criteria.", "requirement-acceptance-log.md"),
        mission("Fix over-generalized AI Personas", "Check together whether the AI's typical user goes beyond the real evidence.", "The AI Agent invented users' age, behavior and spending habits without evidence and distorted the Domain design.", "The planner separates traits backed by research from guesses and puts items that need checking in the backlog.", "The developer marks unsupported Persona traits so they don't end up in permissions, data fields or feature logic.", "persona-assumption-register.md"),
        mission("Resolve ownership conflicts in AI Domain suggestions", "Planners and developers find duplicate responsibilities and data-ownership conflicts in the AI's Domain Map and decide.", "The AI proposed that the Member, Payment and Settlement Domains each keep their own source copy of the same customer status.", "The planner makes clear who owns each business task and who changes policy.", "The developer proposes the Source of Truth, event delivery and recovery responsibility, and the team decides together.", "domain-ownership-decision.md")
      ]
    },
    2: {
      theme: "User Flow & Sequence Modeling",
      skills: [
        skill("Design key user Flows yourself", "Developers define Actor, start and done conditions first, then fill missing steps with AI's questions.", "Separate user actions from internal system processing, and split normal, alternative and failure Flows.", "Write the Video Upload·Playback·Advertising flows yourself, then ask AI only to check mixed responsibilities and missing transitions.", "04_USER_FLOW.md", "Every Flow has an Actor, preconditions, done conditions and a recovery point after failure."),
        skill("Draw Sequence Diagrams between Domains", "Developers decide call order and sync/async themselves, then check the diagram with AI.", "Understand the timing of messages, responses, timeouts, retries and compensation.", "Write a text sequence first, convert it to Mermaid, then ask AI to point out missing responses and wrong dependency directions.", "05_SEQUENCE.md", "You can explain every arrow in the diagram from a code or contract point of view."),
        skill("Build Frequency Capping rules", "Developers design the time window, identifiers and stored state, then test the rules with AI-generated tests.", "Learn how fixed/sliding windows, user identification, concurrency and cache expiry affect exposure limits.", "Write the rules and pseudocode yourself, then have AI generate edge-value and concurrent-request tests and fix the failures.", "frequency-cap-rule-and-tests.md", "The same input always gives the same result, and edge-time and concurrent tests pass.")
      ],
      missions: [
        mission("Find gaps in AI impact analysis", "Planners and developers trace screen, API, DB and operations impacts the AI missed.", "The AI Agent analyzing a request to add phone verification changed only the screen and missed failure recovery and personal-data retention policy.", "The planner states the reason for the change, target users, policy limits and what is out of scope.", "The developer links system dependencies and deployment/migration impact, and sends back missing questions.", "change-impact-agreement.md"),
        mission("Check evidence and priority in an AI issue report", "Re-sort AI-summarized project issues by source evidence and real risk.", "The AI Agent treated how often something was mentioned as how serious it is, and guessed owners and deadlines.", "The planner separates facts, decisions, guesses and open items, and sets the business impact.", "The developer reviews technical risk, prerequisites and reproducibility, and adjusts priority together.", "evidence-based-issue-report.md"),
        mission("Agree on what payment timeout and retry mean", "Agree where planning language and development states are understood differently in an AI-made PG sequence.", "It was unclear whether \"payment failed\" meant declined or delayed, so the AI always suggested re-approval.", "The planner defines the status users see and when retry is allowed.", "The developer explains Idempotency Keys, webhooks, pending states and compensation, and records the agreement.", "payment-timeout-decision.md"),
        mission("Translate sync errors into user scenarios", "Planners and developers connect the AI's technical sync design to the user experience.", "The AI Agent built BLE resend logic but did not handle duplicate data, offline messages or delayed medical alerts.", "The planner decides which delays, duplicates and failures users must know about, and how to tell them.", "The developer explains cache, resend, ordering and de-duplication limits and links them to acceptance criteria.", "sync-exception-scenario.md")
      ]
    },
    3: {
      theme: "Entity Discovery & ERD",
      skills: [
        skill("Find Entities and states from the Sequence", "Developers trace nouns, actions and state changes in messages, then review missing models with AI.", "Learn how to tell Entities, Value Objects, Events and simple attributes apart.", "Mark CRUD and state transitions for each Sequence yourself, then ask AI about lifecycle conflicts and missing identifiers.", "entity-state-catalog.md", "Explain each Entity's identifier, lifecycle and the reasons for its state transitions."),
        skill("Design relationships, normalization and data ownership", "Developers build a 3NF model from functional dependencies and business rules, then test it with AI counter-examples.", "Understand the balance between Cardinality, FK, Unique, normalization and query performance.", "Draw the first ERD yourself, reproduce the anomalies AI suggests with real sample data, and add constraints.", "06_ERD.md", "There are no insert/update/delete anomalies or duplicate ownership, and the reason for each constraint is recorded."),
        skill("Audit Domain–Flow–ERD consistency", "Developers build a trace table across deliverables and use AI as a cross-checking tool.", "Learn that every read and write in a Flow must map to a Domain responsibility and the ERD structure.", "Build a CRUD trace matrix yourself, have AI find orphan Entities, unused fields and reversed ownership, then judge them yourself.", "domain-flow-erd-audit.md", "Every mismatch has its evidence, impact, fix target and decision-maker recorded.")
      ],
      missions: [
        mission("Check the evidence behind AI-made Entities", "Planners and developers compare data concepts the AI added or merged on its own with the source.", "The AI Agent merged \"customer\", \"member\" and \"buyer\" into one and invented a membership-level attribute that does not exist.", "The planner confirms each business term's definition, context and whether terms are synonyms.", "The developer checks identifier and lifecycle differences and proposes whether to split or merge.", "entity-evidence-register.md"),
        mission("Prevent meaning loss when AI standardizes terms", "Together, restore the business meaning lost when the AI replaced similar words in bulk.", "\"Approved\", \"Confirmed\" and \"Completed\" were merged into one status, so the process was modeled wrongly.", "The planner explains the business responsibility and user meaning of each status.", "The developer shows the impact on Enums, transition rules and API/DB names, and the team agrees on standard terms.", "term-state-decision.md"),
        mission("Check business rules in AI normalization suggestions", "Planners and developers find and review hidden assumptions in the AI's schema proposal.", "The AI Agent replaced the price history at order time with a link to the current product price, so past transactions changed.", "The planner sets rules for keeping past facts needed for audits, settlement and customer questions.", "The developer explains the difference between Snapshot and reference models and the impact on integrity and performance.", "data-history-decision.md"),
        mission("Check AI impact analysis for schema changes", "Check the AI's change list against both the planning flow and the real code dependencies.", "Renaming a column was marked as a simple task, but API contracts, reports and batch jobs break with it.", "The planner checks changed user terms and reporting metrics.", "The developer links Migration, backward compatibility, rollback and data checks, and gets joint approval.", "schema-change-checklist.md")
      ]
    },
    4: {
      theme: "API Contract & Interface",
      skills: [
        skill("Design Endpoints by Domain Boundary", "Developers define Resources and responsibility boundaries, then refine the design with AI alternatives.", "Learn how REST Resources, URIs, Methods and Idempotency relate to Domain boundaries.", "Draft Endpoints yourself, ask AI to find RPC smells, leaking responsibilities and inconsistencies, then fix them.", "api-resource-map.md", "Explain your choice of URI and Method through business state changes and idempotency."),
        skill("Write Request·Response·Error Contracts", "Developers write the Schema and error format themselves, then test the contract with AI-generated examples.", "Learn required/optional fields, Validation, Status Codes and a shared Error Contract.", "Draft an OpenAPI spec, have AI generate normal, edge and error Payloads, check them with a Validator, and improve the spec.", "07_API_SPEC.yaml", "Every example passes schema validation, and each error is linked to a client action."),
        skill("Review API Contract consistency", "Developers build a Sequence·ERD·OpenAPI trace table and use AI to look for Breaking Changes.", "Understand contract compatibility, Versioning, Consumer impact and negative tests.", "Classify the change Diff yourself, have AI create failure scenarios from the consumer's view, and confirm with tests.", "api-contract-review.md", "The reason for each Breaking/Non-breaking decision and the affected Consumers are recorded.")
      ],
      missions: [
        mission("Find missing requirements in AI API specs", "Planners and developers check that the AI-generated API supports every real user flow.", "The AI Agent wrote only success responses and left out cancel, duplicate requests and permission errors.", "The planner defines the expected state after each user action succeeds or fails.", "The developer maps them to Endpoints, status codes and error codes and fills in the missing contract.", "api-requirement-trace.md"),
        mission("Match AI error messages with recovery actions", "Planners and developers agree on how error codes, user messages and retry actions connect.", "The AI handled every failure as 400 and \"Please try again\", so users cannot recover.", "The planner defines the explanation and next step users need.", "The developer designs distinct error codes and whether retry is allowed, without exposing security details.", "error-recovery-contract.md"),
        mission("Turn external API assumptions into contracts", "Separate the AI's guesses about open-banking behavior into the official contract and questions to verify.", "The AI Agent wrote token lifetimes and retry policies that are not in the docs as if they were facts.", "The planner separates confirmed policies from items to check with the provider and creates a decision queue.", "The developer isolates unconfirmed assumptions with Mocks and Contract Tests and proposes how to handle failures.", "external-api-assumption-log.md"),
        mission("Jointly approve the user impact of API changes", "Re-assess, from planning and development views, a change the AI rated as low risk.", "Removing a response field was called internal refactoring, but app screens and operations reports still use it.", "The planner checks user-facing features and the impact on the launch schedule.", "The developer lists Consumers, the Deprecation period, a compatibility layer and a rollback plan.", "api-change-approval.md")
      ]
    },
    5: {
      theme: "Persona-Based UI/UX",
      skills: [
        skill("Design Information Architecture for each Persona", "Developers turn user goals into screens, Routes and permissions, then check them with AI card sorting.", "Learn IA, Navigation, Screen Flow and how access differs by role.", "Build a Sitemap and Route table yourself, have AI do navigation tasks as each Persona, and fix blocked paths.", "08_UI_SPEC.md", "Key goals are reached by the shortest path, and there are rules for screens a user cannot access."),
        skill("Build Components and UI States", "Developers write Component responsibilities and the state model, then use AI to review missing states.", "Learn Loading, Empty, Error, Disabled and Success states and accessibility attributes.", "Build a component State Matrix first, render each state with AI-generated Stories/Tests, and improve it yourself.", "component-state-matrix.md", "You can reproduce every async state and keyboard/screen-reader behavior."),
        skill("Run a beginner-user UX Walkthrough", "Developers use the real screens and observe, while AI helps with questions and heuristic checks.", "Turn cognitive load, feedback, error prevention and recoverability into code-level improvements.", "Write a think-aloud log yourself, reproduce the problems AI grouped, and fix the highest-priority ones in code.", "ux-walkthrough-and-fix.md", "Each fix keeps its evidence, steps to reproduce, code change and before/after check together.")
      ],
      missions: [
        mission("Check for bias in AI Personas", "Planners and developers check whether the AI's user assumptions go against real data and accessibility principles.", "The AI Agent assumed older users should use fewer features and hid key functions.", "The planner gives research evidence and inclusion criteria and turns guesses into items to test.", "The developer suggests readability, feedback and assistive-technology support instead of limiting features.", "inclusive-persona-review.md"),
        mission("Fix baseless scores in AI UX reviews", "Replace the AI's usability score with real observation and measured metrics.", "The AI Agent gave \"9/10 usability\" just from a screenshot, with no completion-rate or error data.", "The planner defines success criteria, target Personas and observation questions.", "The developer prepares tracking events and a reproducible test setup, and the team decides together.", "ux-evidence-scorecard.md"),
        mission("Trace requirements in an AI UI draft", "Review together whether the AI's screens kept the original policies, permissions and exceptions.", "The pretty prototype left out guest-user limits and failure-recovery screens.", "The planner links each screen to its requirement IDs and user messages.", "The developer marks state, permission and API dependencies and adds missing screens to the build scope.", "ui-requirement-trace.md"),
        mission("Negotiate whether AI improvements can be built", "Planners and developers break down the AI's excessive interaction ideas into value, cost and risk.", "The AI Agent suggested live recommendations and animations on every screen, raising schedule and accessibility risks.", "The planner confirms the core user value and Must/Should/Could priorities.", "The developer shows build complexity, performance and accessibility impact, and the team agrees on a minimum test version.", "ux-scope-decision.md")
      ]
    },
    6: {
      theme: "Front-End & API Integration",
      skills: [
        skill("Build screen–API Binding yourself", "Developers read the Contract and connect types, calls and rendering themselves, using AI as a pair reviewer.", "Learn how DTO conversion, async calls, cancellation and error propagation connect to screen state.", "Build one Flow yourself, ask AI about Contract violations and Race Conditions, then confirm with tests and fix.", "frontend-api-binding.patch", "The same state transitions happen with the Mock and the real API, with no Contract violations."),
        skill("Build state management and failure UX", "Developers design a state machine first, then strengthen recovery flows with AI-generated failure scenarios.", "Learn Loading·Empty·Validation·Timeout·Error·Success states and their transition rules.", "Draw a State Diagram yourself, inject network delay, double clicks and cancellation, and fix the UI.", "ui-state-recovery-demo.md", "After a failure, users can choose their next step without losing data."),
        skill("Learn Front-End Debugging & Refactoring", "Developers debug in the order hypothesis → reproduce → observe → fix, while AI offers other hypotheses.", "Learn Console, Network and Performance tools, state isolation, function splitting and accessibility fixes.", "Reproduce the bug first, write your own cause hypothesis, check AI suggestions against evidence, then make a minimal fix and refactor.", "debug-refactor-log.md", "The cause evidence, failed hypotheses, minimal fix and regression test are recorded.")
      ],
      missions: [
        mission("Find where AI code drifts from the requirements", "Planners and developers check together that working code still follows the original user policy.", "The AI Agent finished the screen but simplified the cancellation fee and permission rules on its own.", "The planner checks the expected result for each scenario and the policies that must not change.", "The developer links code paths and tests to requirements and fixes the drift.", "generated-code-trace.md"),
        mission("Check hasty conclusions in AI debugging", "Don't apply the AI's suggested cause without evidence. Decide together.", "The AI said a CORS error was a server outage, so unnecessary workaround code was about to be added.", "The planner records the user symptoms, when it happens and how far it reaches.", "The developer tests the hypothesis with logs, Network and a reproduction test, and separates the cause from a temporary fix.", "incident-hypothesis-log.md"),
        mission("Agree on AI code review priorities", "Split dozens of AI review comments into user risk and technical risk to set the real fix order.", "The AI Agent listed style issues and a data-loss bug at the same severity.", "The planner gives user/business impact and what blocks the launch.", "The developer rates reproducibility, fix risk and regression scope to build a shared priority.", "review-priority-board.md"),
        mission("Confirm AI refactoring keeps features working", "Planners and developers check that user actions and exception policies still work after code cleanup.", "While removing duplicate code, the AI refactoring deleted the retry count and error message.", "The planner provides a regression checklist of key actions and messages.", "The developer proves features are kept with Characterization Tests and a Diff explanation.", "refactor-acceptance-report.md")
      ]
    },
    7: {
      theme: "Back-End Business Logic",
      skills: [
        skill("Turn Business Rules into executable specs", "Developers express policies as conditions, states and invariants, and harden the rules with AI counter-examples.", "Learn the difference between Rule, Validation, Policy and Invariant.", "Turn Campaign·Budget·Target rules into a Decision Table, then move AI-generated counter-examples into tests.", "09_BUSINESS_RULE.md", "Each rule has its input, decision, failure reason and test cases."),
        skill("Build Domain Services and Repositories", "Developers build with separated responsibilities and use AI as a structure reviewer.", "Learn the roles of Controller, Application/Domain Service and Repository, and dependency inversion.", "Build one Use Case yourself, ask AI to point out layer leaks and hard-to-test parts, then refactor.", "domain-service-repository.patch", "Business rules are unit-tested without Framework or DB details."),
        skill("Check Transaction·Validation·Exception handling", "Developers design transaction boundaries and failure strategy, then check them with AI-generated Failure Injection.", "Learn concurrency, atomicity, retries, exception mapping and data integrity.", "Inject budget exhaustion, duplicate requests and DB failures yourself, then turn AI's extra cases into tests.", "transaction-exception-tests.md", "There are no partial successes or data mismatches, and exceptions lead to clear caller actions.")
      ],
      missions: [
        mission("Find policy distortion in AI Business Rules", "Planners and developers review what changed when natural-language policies became code rules.", "The AI Agent mixed up \"up to the budget\" and \"below the budget\" and chose UTC as the time zone on its own.", "The planner makes edge values, reference time, priorities and exception approval clear.", "The developer shows the different readings with a Decision Table and tests, and applies the final rules.", "business-rule-agreement.md"),
        mission("Check the user impact of AI error handling", "Design together how technical exceptions lead to screens, notifications and operations responses.", "The AI Agent retries every exception, causing duplicate orders and late notices.", "The planner decides how long users wait, when they can cancel and which channel to notify on.", "The developer links Retryable/Non-retryable types with Idempotency and compensation.", "exception-experience-map.md"),
        mission("Agree on transaction boundaries the AI missed", "Planners and developers redefine what success means for one request in business terms.", "The order was saved but the payment event failed to send, and the AI treated it as complete.", "The planner decides which state users see as \"order complete\".", "The developer proposes Outbox, compensation, reprocessing and monitoring, and the team agrees.", "transaction-boundary-decision.md"),
        mission("Decide who is responsible for AI Agent results", "Decide who reviews, approves and rolls back Rules and data the AI changed automatically.", "The Agent changed a discount rule just because tests passed, with no business approval or audit record.", "The planner names the policy-change approver and when it takes effect.", "The developer designs the change Diff, tests, deploy/rollback ownership and Audit Log.", "agent-change-governance.md")
      ]
    },
    8: {
      theme: "Identity, Authentication & Authorization",
      skills: [
        skill("Design a Role·Permission Matrix", "Developers build the permission table with least privilege, then test it with AI attack questions.", "Learn how Role, Resource, Action, Ownership and Tenant boundaries relate.", "Write screen, API and data permission tables, have AI create privilege-escalation and IDOR scenarios, and fill the gaps.", "10_SECURITY.md", "Allow/deny rules and ownership conditions are enforced on the server."),
        skill("Build the Authentication Flow", "Developers build password, session and token lifecycles, then review the threat model with AI.", "Understand Signup, Login, Hash, JWT/Session, expiry, refresh and logout.", "Write the flow and code yourself, ask AI about theft, reuse and concurrent-session attacks, and confirm defenses with tests.", "authentication-flow-and-tests.md", "Token lifetime and revocation, password protection and failure responses are defined and tested."),
        skill("Run Authorization Negative Tests", "Developers test forbidden actions themselves while AI helps widen the attack surface.", "Learn that permission checks must happen at every server entry point, not in the UI.", "Write tests for other users' IDs, forged Roles, Admin APIs and cross-Tenant access, add AI's suggestions, and patch.", "authorization-negative-tests.md", "Every forbidden scenario follows a consistent 403/404 policy and leaves an Audit Log.")
      ],
      missions: [
        mission("Stop AI member policies from over-collecting personal data", "Planners and developers review whether the sign-up fields AI suggested are needed and why they are stored.", "The AI Agent made date of birth, address and job required, saying they help personalization.", "The planner checks purpose, whether each field is required, consent, retention period and deletion policy.", "The developer shows the data flow, encryption, access rights and cost of building deletion.", "personal-data-review.md"),
        mission("Balance AI login UX and security", "Review together whether AI's convenience ideas create account-enumeration or brute-force risks.", "The AI Agent separated \"email does not exist\" from \"wrong password\", giving attackers hints.", "The planner designs user messages and the customer-support path.", "The developer proposes a single error message, Rate Limit, Lockout and monitoring, and the team agrees.", "auth-ux-security-decision.md"),
        mission("Find missing ownership in AI permission tables", "Add user and Tenant ownership rules to an AI permission table that only looked at Roles.", "It was built so anyone with the Creator Role could edit other users' content.", "The planner defines rules for collaboration, delegation and admin intervention.", "The developer links Ownership Checks, Tenant Boundary and audit-log tests.", "permission-ownership-contract.md"),
        mission("Judge false positives and misses in AI security reviews", "Don't accept the AI security report as-is. Decide together based on threat, evidence and impact.", "The AI Agent marked a style issue as Critical and a real token-reuse problem as Low.", "The planner assesses user, regulatory and business impact.", "The developer checks a reproduction PoC, attack conditions and fix/regression risk, and sets the final severity.", "security-finding-triage.md")
      ]
    },
    9: {
      theme: "Advertising, Billing & Analytics",
      skills: [
        skill("Build ad candidate search and selection Rules", "Developers build filter, priority and tie-break rules themselves and check them with AI tests.", "Learn the evaluation order of Active, Budget, Target Match and Frequency Cap, and why it must be deterministic.", "Write a Rule Pipeline, then use AI to generate edge data and conflicting conditions and build Property Tests.", "ad-selection-rule-tests.md", "The same input gives the same result, and you can trace why something was excluded."),
        skill("Connect Billing·Analytics Domain Events", "Developers design the Event Schema and idempotent consumers, then use AI to add failure scenarios.", "Learn At-least-once delivery, Idempotency, Ordering, Outbox and Reconciliation.", "Build the event flow from AdRequested to Charge, inject duplicates, wrong order and loss, and confirm recovery.", "billing-event-pipeline.md", "There is no double charging, and missing events can be detected and reprocessed."),
        skill("Test Viewer–Ad–Billing end to end", "Developers define observation points and expected states, then use AI to explore integration failures.", "Learn to trace from a UI action to ad display, playback, cost deduction and metrics.", "Run E2E scenarios with a Correlation ID, inject the failures AI suggests, and find the cause in the logs.", "viewer-ad-billing-e2e.md", "Each step's input, output, state and logs link into one Trace.")
      ],
      missions: [
        mission("Find hidden states in AI payment flows", "Planners and developers restore payment states the AI reduced to just success or failure.", "Slow responses and webhook-waiting states show as failures, so users try to pay again.", "The planner sets messages and actions for waiting, checking, complete and cancelled states.", "The developer links PG status, lookup/retry and idempotency.", "payment-state-experience.md"),
        mission("Check trust problems in AI payment UX", "Review the AI's payment screen together against real price, refund and security information.", "Prices before/after discount and subscription terms are missing, so users misunderstand the final amount.", "The planner confirms required notices, cancel/refund policy and when consent is given.", "The developer checks server-side amounts, tamper protection and links to receipts and logs.", "checkout-trust-checklist.md"),
        mission("Find double-charge risks in AI event design", "Planners and developers review the business risk of the automatic reprocessing the Agent suggested.", "Replaying every failed event could apply a Charge twice.", "The planner sets when a charge is final, customer compensation and operations approval rules.", "The developer designs Idempotency Keys, a Ledger, Reconciliation and alerts.", "billing-retry-decision.md"),
        mission("Prevent metric distortion in AI Analytics", "Correct an AI report that explained correlation as cause, using data definitions and experiment evidence.", "More clicks were called higher revenue, but duplicate events and refunds were not counted.", "The planner clarifies metric definitions, the decision goal and the baseline.", "The developer checks event quality, de-duplication and Attribution limits and shows the confidence range.", "analytics-evidence-report.md")
      ]
    },
    10: {
      theme: "Full Integration, QA & Release",
      skills: [
        skill("Run full-service E2E Scenarios and QA", "Developers design risk-based E2E scenarios themselves and use AI to add missing paths.", "Learn Happy Path, Failure Injection, Regression, the Test Pyramid and observability.", "Write tests from Signup to Payment·Billing·Analytics, really inject the failures AI suggests, and verify recovery.", "11_TEST_SCENARIO.md", "Core flows and failure recovery can be reproduced with automated and manual evidence."),
        skill("Complete Release Readiness and document Context", "Developers check that code, design and operations docs match, and use AI as a document Diff reviewer.", "Learn readiness for Build, Config, Migration, Rollback, Runbook and Observability.", "Go through the release checklist yourself, have AI find mismatches between code and docs, check the evidence and fix.", "12_RELEASE.md", "A new developer can deploy, monitor and roll back using only the docs."),
        skill("Present design Decisions, AI use and a Demo", "Developers explain tech choices and testing in their own words and practice tough questions with AI.", "Learn Decision Records, Trade-offs, Evidence and Demo Narrative.", "Summarize 3 key decisions and a failure/fix case yourself, answer AI mock questions with evidence, and improve your talk.", "technical-demo-deck.md", "The talk focuses on the developer's judgment, testing and learning — not on what AI produced.")
      ],
      missions: [
        mission("Find factual errors in AI launch documents", "Planners and developers compare AI-written intros, FAQs and manuals with the real features.", "The launch docs included features not yet built and a refund process that is not supported.", "The planner checks what can be made public, what is promised and the customer-support process.", "The developer checks the docs against the Feature Flags and real behavior of the deployed version.", "launch-content-verification.md"),
        mission("Check exaggeration and evidence in an AI final talk", "Check the AI-polished talk against measured results and real decision records.", "Performance and productivity numbers were made up without measuring, and AI's work was presented as the team's.", "The planner checks the evidence for user value and business results.", "The developer shows tests, metrics, Diffs and where people made decisions, and corrects the wording.", "final-presentation-evidence.md"),
        mission("Break the \"all tests passed\" illusion in AI integrated QA", "Planners and developers check whether the Agent's \"all tests passed\" report really meets launch standards.", "Only Mock tests passed; the real payment Sandbox, migration and failure recovery were never run.", "The planner confirms launch-blocking scenarios and user acceptance criteria.", "The developer shares evidence per environment, items not run, remaining risks and owners.", "release-quality-gate.md"),
        mission("Agree on rollback and monitoring for an AI deployment plan", "Add human approval, recovery and monitoring steps to the Agent's deployment plan.", "The AI Agent proposed only automatic deployment, with no failure metrics and no rollback owner.", "The planner sets how much downtime is acceptable and when to notify users.", "The developer links Canary, Health Check, Alerts, a Rollback Trigger and owners.", "deployment-governance-plan.md")
      ]
    }
  };
})();

/* PBL 수행 설명과 실제 산출물 예시 */
(function () {
  "use strict";
  var days = window.LMS_CURRICULUM;
  if (!days) return;

  var skillExamples = {
    1: [
      ["# Persona–Domain Evidence Table", "", "| Persona | Source evidence | Goal | Actions | Data needed | Domain candidate |", "|---|---|---|---|---|---|", "| Creator | \"Creators upload videos\" | Publish videos | Upload·edit·delete | videoId, status | Video |", "| Advertiser | \"Sets the campaign budget\" | Run ads | Set target·budget | campaignId, budget | Campaign |", "", "> Hypothesis: Creator payout cycle is not in the source, so check with stakeholders"].join("\n"),
      ["# Feature–Domain Placement Table", "", "| Feature | Responsibility | Reason to change | Owner Domain | Rejected alternative |", "|---|---|---|---|---|", "| Scheduled video publishing | Manage publish time and status | Video policy change | Video | Creator: only handles the user role |", "| Payment approval | Approve/cancel amount | PG policy change | Billing | Order: does not own payment source |"].join("\n"),
      ["flowchart LR", "  Creator -->|UploadVideo| Video", "  Video -->|VideoPublished| Playback", "  Campaign -->|AdSelected| AdServing", "  AdServing -->|ChargeRequested| Billing", "  Billing -->|ChargeCompleted| Analytics", "", "%% Owner: Video=Video Domain, Invoice=Billing Domain", "%% Not allowed: Analytics must not directly modify the Billing source DB"].join("\n")
    ],
    2: [
      ["# Playback User Flow", "", "- Actor: Viewer", "- Start condition: logged in, has a playable videoId", "- Normal flow:", "  1. Viewer presses the play button.", "  2. Client checks playback permission.", "  3. Playback issues a playback URL.", "- Done condition: first frame plays and playback_started is recorded", "- Exceptions: no permission → purchase screen, network drop → retry from same position"].join("\n"),
      ["sequenceDiagram", "  actor Viewer", "  participant Client", "  participant Playback", "  participant DB", "  Viewer->>Client: Click play", "  Client->>Playback: GET /videos/{id}/playback", "  Playback->>DB: Check permission·status", "  alt Playable", "    Playback-->>Client: 200 playbackUrl", "  else No permission", "    Playback-->>Client: 403 PLAYBACK_NOT_ALLOWED", "  end"].join("\n"),
      ["describe('Frequency Cap: 3 times per 24 hours', () => {", "  it('blocks the fourth concurrent request', async () => {", "    const results = await Promise.all(", "      Array.from({ length: 4 }, () => expose('user-1', 'campaign-7'))", "    );", "    expect(results.filter(r => r.allowed)).toHaveLength(3);", "    expect(results[3].reason).toBe('FREQUENCY_CAP_EXCEEDED');", "  });", "});"].join("\n")
    ],
    3: [
      ["# Entity Candidate Classification", "", "| Candidate | Type | Identifier | Lifecycle evidence | State |", "|---|---|---|---|---|", "| Video | Entity | videoId | Edited/deleted after upload | DRAFT/PUBLISHED |", "| Money | Value Object | None | Amount + currency compared together | - |", "| VideoPublished | Event | eventId | Fact at moment of publishing | OCCURRED |"].join("\n"),
      ["CREATE TABLE orders (", "  order_id BIGINT PRIMARY KEY,", "  user_id BIGINT NOT NULL,", "  ordered_at TIMESTAMP NOT NULL", ");", "", "CREATE TABLE order_items (", "  order_item_id BIGINT PRIMARY KEY,", "  order_id BIGINT NOT NULL REFERENCES orders(order_id),", "  product_id BIGINT NOT NULL,", "  unit_price DECIMAL(12,2) NOT NULL, -- price Snapshot at order time", "  quantity INT NOT NULL CHECK (quantity > 0)", ");"].join("\n"),
      ["# Domain–Flow–ERD Audit", "", "| Flow step | CRUD | Entity | Owner | Result | Action |", "|---|---|---|---|---|---|", "| Record ad impression | C | Impression | Analytics | Match | - |", "| Deduct cost | U | CampaignBudget | Campaign | Mismatch | Remove direct Billing UPDATE, use Event |"].join("\n")
    ],
    4: [
      ["| Domain | Method | URI | Permission | Idempotency |", "|---|---|---|---|---|", "| Video | POST | /videos | Creator | Idempotency-Key |", "| Playback | POST | /videos/{id}/playback-sessions | Viewer | sessionId per request |", "| Campaign | PATCH | /campaigns/{id}/budget | Advertiser Owner | If-Match |"].join("\n"),
      ["paths:", "  /videos/{videoId}:", "    get:", "      responses:", "        '200':", "          content:", "            application/json:", "              schema:", "                $ref: '#/components/schemas/Video'", "        '404':", "          $ref: '#/components/responses/VideoNotFound'"].join("\n"),
      ["# API Change Assessment", "", "| Change | Result | Affected Consumer | Migration | Test |", "|---|---|---|---|---|", "| `price: number` → `price: string` | Breaking | Web Checkout, settlement batch | Keep v1, then move to v2 | String/number Consumer Test |", "| Add optional `currency` | Non-breaking | None | Default KRW | Unknown currency Test |"].join("\n")
    ],
    5: [
      ["/", "├── /browse                 # Viewer", "│   └── /videos/:id", "├── /creator               # Creator only", "│   ├── /videos/new", "│   └── /videos/:id/edit", "└── /advertiser            # Advertiser only", "    └── /campaigns", "", "No permission: go to a login/permission screen that keeps the original goal"].join("\n"),
      ["| Component | Loading | Empty | Error | Disabled | Success |", "|---|---|---|---|---|---|", "| VideoList | 6 Skeletons | Suggested searches | Retry + error ID | Filters locked | Card list |", "| Checkout | Spinner + amount locked | Cart guide | Keep input + retry | Prevent double payment | Receipt |"].join("\n"),
      ["# UX Walkthrough Finding", "", "- Finding: filters reset when coming back from search results", "- Reproduce: Genre=Education → video detail → back", "- Observed: user types the same filter again", "- Severity: High (task time +42 sec)", "- Fix: save filter in the URL query", "- Verified: Genre=Education kept after going back, task time 42s→8s"].join("\n")
    ],
    6: [
      ["async function loadVideos(signal) {", "  render({ status: 'loading' });", "  try {", "    const response = await fetch('/api/videos', { signal });", "    if (!response.ok) throw new ApiError(response.status);", "    const videos = (await response.json()).items.map(toVideoCardVM);", "    render({ status: videos.length ? 'success' : 'empty', videos });", "  } catch (error) {", "    if (error.name !== 'AbortError') render({ status: 'error', error });", "  }", "}"].join("\n"),
      ["const transitions = {", "  idle:       { SUBMIT: 'submitting' },", "  submitting: { ACCEPTED: 'pending', INVALID: 'validationError', FAIL: 'error' },", "  pending:    { CONFIRMED: 'success', TIMEOUT: 'error' },", "  error:      { RETRY: 'submitting', CANCEL: 'idle' }", "};", "", "// Keep formData and idempotencyKey even in the Error state."].join("\n"),
      ["# Debug Log: Infinite Requests", "", "- Reproduce: after opening Dashboard, Network requests repeat 6 times per second", "- First hypothesis: server Retry setting error", "- Evidence: a new object is created on every render in the React effect dependency", "- Root cause: `filters` object reference changes", "- Minimal fix: use primitive dependencies", "- Regression test: 1 API call for the same filter, 1 more when the filter changes"].join("\n")
    ],
    7: [
      ["| Rule ID | Input | Condition | Result | Failure reason |", "|---|---|---|---|---|", "| CAM-01 | status | Not ACTIVE | Exclude | CAMPAIGN_INACTIVE |", "| CAM-02 | remainingBudget | Less than cost | Exclude | BUDGET_EXHAUSTED |", "| CAM-03 | target | Does not match Viewer | Exclude | TARGET_MISMATCH |"].join("\n"),
      ["class CreateCampaignService {", "  constructor(repository, policy) {", "    this.repository = repository;", "    this.policy = policy;", "  }", "  async execute(command) {", "    const campaign = Campaign.create(command, this.policy);", "    await this.repository.save(campaign);", "    return campaign.id;", "  }", "}", "// Domain objects do not import HTTP or DB implementations."].join("\n"),
      ["it('deducts budget only once even with concurrent requests', async () => {", "  await seedCampaign({ budget: 100, impressionCost: 100 });", "  const results = await Promise.allSettled([charge('event-1'), charge('event-2')]);", "  expect(await currentBudget()).toBe(0);", "  expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);", "  expect(await chargeCount()).toBe(1);", "});"].join("\n")
    ],
    8: [
      ["| Role | Resource | Action | Ownership | Result |", "|---|---|---|---|---|", "| Creator | Video | UPDATE | video.creatorId == user.id | ALLOW |", "| Creator | Video | UPDATE | Owned by someone else | DENY 404 |", "| Advertiser | Campaign | READ | Same tenantId | ALLOW |", "| Advertiser | Campaign | READ | Different tenantId | DENY 404 |"].join("\n"),
      ["sequenceDiagram", "  Client->>Auth: POST /login", "  Auth->>UserDB: Verify password hash", "  Auth-->>Client: access token + rotating refresh token", "  Client->>Auth: POST /token/refresh", "  Auth->>TokenStore: Revoke previous refresh token", "  Auth-->>Client: New access/refresh token", "  Note over Auth,TokenStore: If a refresh token is reused, revoke the whole token family"].join("\n"),
      ["it('hides campaign edit requests from another tenant', async () => {", "  const token = tokenFor({ role: 'ADVERTISER', tenantId: 'tenant-a' });", "  const response = await patchCampaign('tenant-b-campaign', token, { budget: 0 });", "  expect(response.status).toBe(404);", "  expect(await auditLog()).toContainEqual(expect.objectContaining({ reason: 'TENANT_MISMATCH' }));", "});"].join("\n")
    ],
    9: [
      ["function selectCampaign(campaigns, context) {", "  return campaigns", "    .filter(c => c.status === 'ACTIVE')", "    .filter(c => c.remainingBudget >= c.impressionCost)", "    .filter(c => matchesTarget(c.target, context.viewer))", "    .filter(c => exposureCount(c.id, context.viewer.id, 24) < 3)", "    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0] ?? null;", "}"].join("\n"),
      ["{", "  \"eventId\": \"evt-0192\",", "  \"eventType\": \"AdImpressionRecorded\",", "  \"occurredAt\": \"2026-09-28T01:02:03Z\",", "  \"correlationId\": \"playback-771\",", "  \"campaignId\": \"cam-7\",", "  \"viewerId\": \"viewer-21\",", "  \"chargeAmount\": { \"value\": 15, \"currency\": \"KRW\" }", "}"].join("\n"),
      ["| Trace | Step | Expected state | Actual evidence | Result |", "|---|---|---|---|---|", "| playback-771 | AdSelected | cam-7 selected | log line 182 | PASS |", "| playback-771 | Charge | 15 KRW deducted once | ledger row 991 | PASS |", "| playback-771 | Analytics | impression +1 | event evt-0192 | PASS |"].join("\n")
    ],
    10: [
      ["| Scenario | Given | When | Then | Evidence |", "|---|---|---|---|---|", "| E2E-01 New purchase | New Viewer, in stock | Sign up→buy→play | 1 receipt, playback starts | screenshot + traceId |", "| FAIL-03 PG Timeout | Approval result delayed | Submit payment | Pending notice, no double approval | PG log + ledger |"].join("\n"),
      ["# Release Readiness", "", "- [x] Production build reproduced (`npm ci && npm run build`)", "- [x] DB migration dry-run and row count check", "- [x] Secrets are not in the repo and are injected in the deploy environment", "- [x] `/health` reports DB and Queue dependencies separately", "- [x] Rollback to v1.9.2 finished in Staging within 7 minutes", "- Evidence: `release-evidence/2026-09-28/`"].join("\n"),
      ["# Decision 2: Use Outbox for Payment Events", "", "- Problem: if the Event fails to send after the order is saved, the charge is missed", "- Options reviewed: DB Transaction only / Distributed Transaction / Outbox", "- Choice: Outbox", "- Trade-off: higher Poller running cost, but no lost Events", "- AI use: generated the list of options and failure scenarios", "- Developer check: 0 missing in 20 Failure Injection runs", "- Demo: Broker failure after DB commit → show the reprocessing screen"].join("\n")
    ]
  };

  function explain(type, item) {
    if (type === "skill") {
      return [
        "Analysis step: In the first task, mark which inputs, policies and current behavior in the materials relate to the problem. Write down where the evidence is and your own hypothesis before opening AI.",
        "Design & build step: In the second task, write the table, diagram, code or tests yourself. Ask AI for missing edge values and counter-examples, not a finished answer.",
        "Verification step: In the third task, compare the results with the done criteria. Keep failed tests, before/after Diffs and the AI suggestions you kept or rejected as evidence."
      ];
    }
    return [
      "Issue check step: In the first task, compare the AI result with the source line by line, and separate facts, AI assumptions and missing questions. Note where the evidence for each problem is.",
      "Role collaboration step: In the second task, the planner writes users, policy and scope, the developer writes system limits, failure cases and test methods, and then you ask about each other's gaps.",
      "Joint decision step: In the third task, don't let AI decide — the team confirms the option. Record the reason, owner, done criteria and review date in your output."
    ];
  }

  function missionExample(item) {
    return [
      "# " + item.title + " — Joint decision log example",
      "",
      "## Problems found",
      "- " + item.pbl.brief,
      "- Evidence: compared the related items in `" + item.pbl.inputs[0] + "` with the AI result",
      "",
      "| Type | Example entry | Owner | Evidence |",
      "|---|---|---|---|",
      "| Confirmed fact | Only conditions stated in the source count as facts | Planner | Source quote · policy ID |",
      "| AI assumption | Suggestions without evidence are removed from the decision and turned into questions | Joint | AI output Diff |",
      "| Planning decision | " + item.planner + " | Planner | User scenarios · policy table |",
      "| Development check | " + item.developer + " | Developer | Test · Log · PoC |",
      "| Joint decision | Apply the fix, using the first done criterion as the Release Gate | Joint | " + item.pbl.done[0] + " |",
      "",
      "## Action Items",
      "- [ ] Planner: confirm policy, messages and scope",
      "- [ ] Developer: submit reproduction Test and fix Diff",
      "- [ ] Joint: after passing Acceptance Criteria, change Decision status to `APPROVED`"
    ].join("\n");
  }

  window.attachPblExamples = function () {
    for (var day = 1; day <= 10; day += 1) {
      days[day].skills.forEach(function (item, index) {
        item.pbl.explanation = explain("skill", item);
        item.pbl.example = skillExamples[day][index];
        item.pbl.exampleType = [2, 3].indexOf(day) >= 0 && index === 1 ? "mermaid" : "text";
      });
      days[day].missions.forEach(function (item) {
        item.pbl.explanation = explain("mission", item);
        item.pbl.example = missionExample(item);
        item.pbl.exampleType = "markdown";
      });
    }
  };
})();

/* PBL 실행 과제: 각 카드가 설명이 아니라 실제 수행 가능한 프로젝트가 되도록 보강한다. */
(function () {
  "use strict";
  var days = window.LMS_CURRICULUM;
  if (!days) return;

  function task(brief, inputs, work, done) {
    return { brief: brief, inputs: inputs, work: work, done: done };
  }

  function apply(day, project, skillTasks, missionTasks) {
    days[day].project = project;
    days[day].skills.forEach(function (item, index) { item.pbl = skillTasks[index]; });
    days[day].missions.forEach(function (item, index) { item.pbl = missionTasks[index]; });
  }

  apply(1, "Define the requirements and Domains of the Streamly OTT service.", [
    task("Turn vague requests in the meeting notes into a buildable Persona·Goal·Data table.", ["streamly-kickoff-notes.md", "persona-evidence-sheet.md"], ["Quote 2 pieces of source evidence for each of Viewer, Creator, Advertiser and Admin.", "Write 2 Goals, 3 actions and 3 created/read data items for each Persona.", "Ask AI only for missing questions, then delete items without evidence or mark them as \"hypothesis\"."], ["All 4 Personas are written", "Every item has source evidence or a hypothesis mark", "At least 5 Domain candidates found"]),
    task("Group 18 Features into Domains that share responsibility and reason to change, by yourself.", ["day1-feature-list.csv", "persona-domain-notes.md"], ["For each Feature, write the business owner and the policies it usually changes with.", "Group Features into 5–8 Domains, and choose one Owner for items placed twice.", "Review 3 boundary counter-examples from AI, then change at least 2 groupings or write why you kept them."], ["All 18 Features are placed", "Each Domain has a one-sentence responsibility", "Reasons for 3 boundary decisions are recorded"]),
    task("Complete a Context Map showing data ownership and dependency direction between Domains.", ["feature-domain-map.md", "day1-data-catalog.csv"], ["Set the source Owner for User Profile, Video, Playback, Campaign and Invoice.", "Draw sync calls and Event delivery between Domains with different arrows.", "Fix at least 2 circular dependencies or duplicate ownerships found in the AI review."], ["The 5 key data types each have one Owner", "Every arrow shows the data it carries", "No circular dependencies, or a reason for each exception"])
  ], [
    task("Find missing or distorted decisions in the AI meeting summary and restore them with source evidence.", ["kickoff-transcript.md", "ai-meeting-summary.md"], ["Compare the two documents and find 3 omissions, 2 distortions and 2 open items mistaken as decided.", "The planner writes decision status and source quotes; the developer writes build impact.", "Jointly sort the 7 items into fix, hold or follow-up question."], ["At least 7 problems found", "Every item has a source quote and impact", "There are joint decision-makers and follow-up owners"]),
    task("Turn 6 vague AI-made requirements into testable done conditions.", ["ai-requirements-draft.md", "service-policy.md"], ["Mark unmeasurable words like \"fast\", \"safe\" and \"easy\".", "The planner writes acceptable ranges and examples; the developer writes normal, failure and edge conditions.", "Write 2 Given–When–Then Acceptance Criteria for each requirement."], ["6 requirements revised", "At least 12 Acceptance Criteria", "Undecided policy items are split out as questions"]),
    task("Find unsupported user assumptions in the AI Persona and remove them from the product scope.", ["ai-persona-report.md", "user-interview-quotes.md"], ["Find at least 5 unsupported assumptions about age, skill level or spending habits.", "The planner sorts them into fact, hypothesis or needs research; the developer marks the impact on data fields and permission logic.", "Create 2 usable Persona cards and a validation backlog."], ["At least 5 assumptions sorted", "Code and data impacts are linked", "Untested assumptions are not used as feature conditions"]),
    task("Run a meeting to resolve duplicate data-ownership conflicts in the AI Domain Map.", ["ai-domain-map.mmd", "ownership-conflict-log.md"], ["Find 3 data items owned twice by the Member, Payment and Settlement Domains.", "The planner names who changes policy; the developer proposes the Source of Truth and Event delivery.", "Confirm each item's Owner, Consumer and recovery owner in a decision table."], ["All 3 conflicts decided", "Each data item has one Owner", "Delivery failure and recovery owner are recorded"])
  ]);

  apply(2, "Design Streamly's upload, playback and ad flows and system Sequences.", [
    task("Complete 3 user Flows: Video Upload, Playback and Advertising.", ["03_DOMAIN_MAP.md", "day2-flow-template.md"], ["Write each Flow's Actor, start condition and done condition first.", "Separate user actions from system processing and write at least 6 normal steps.", "Add 2 alternative Flows each, including permission failure and network drop."], ["3 Flows completed", "Each Flow has 6 normal steps and at least 2 exceptions", "Every step has a responsible party"]),
    task("Convert the three User Flows into Mermaid Sequence Diagrams yourself.", ["04_USER_FLOW.md", "sequence-starter.mmd"], ["Define Lifelines for Client, API, Domain Service, DB and external systems.", "Show sync/async calls, responses, Timeout and Retry.", "Render the Mermaid, then fix missing messages and reversed dependencies after AI review."], ["3 renderable Diagrams", "At least 2 exception flows in each Diagram", "Every message has a request/response or Event"]),
    task("Build a rule limiting ad exposure to 3 times in 24 hours, with tests.", ["ad-impression-sample.json", "frequency-cap-starter.js"], ["Write rule pseudocode using User ID, Campaign ID and exposure time.", "Create 8 tests: 23:59 boundary, anonymous user, concurrent requests and cache expiry.", "Run sample data through your own function and fix failing tests."], ["At least 8 automated tests pass", "The fourth concurrent request is blocked", "The exclusion reason is returned in the result"])
  ], [
    task("Find what the AI change-impact analysis missed and make a deployable fix plan.", ["phone-auth-change-request.md", "ai-impact-report.md", "system-map.md"], ["Find 2 gaps each in screens, API, DB, personal data and operations.", "The planner writes the change goal and out-of-scope items; the developer writes Migration and Rollback impact.", "Make a joint plan sorted into must-fix, needs checking and excluded from this release."], ["At least 10 gaps across areas", "Each item has evidence and an owner", "Deploy and rollback steps are included"]),
    task("Correct the wrong priorities and guessed owners in the AI issue report.", ["meeting-log.md", "issue-history.csv", "ai-weekly-report.md"], ["Mark 6 owners, deadlines or severities that have no source evidence.", "The planner rates business impact; the developer rates reproducibility and prerequisites.", "Define P0–P3 criteria and agree on the order for the top 5 issues."], ["At least 6 errors corrected", "Priority criteria are documented", "The top 5 have an Owner and done condition"]),
    task("Safely fix an AI Sequence that treats payment Timeout as failure.", ["ai-payment-sequence.mmd", "pg-status-table.md"], ["Separate declined, delayed response and waiting-for-webhook into different states.", "The planner defines text and buttons per state; the developer defines Idempotency and the lookup API.", "Create re-check, complete and cancel Sequences and Acceptance Criteria for unconfirmed payments."], ["At least 5 payment states defined", "No path that always re-approves", "User actions are clear for each state"]),
    task("Complete user scenarios and technical recovery flows for BLE sync failures.", ["wearable-sync-log.json", "ai-sync-design.md"], ["Find duplicate, out-of-order, offline and delayed-alert cases in the reproduction data.", "The planner sets messages and acceptable delay; the developer sets cache, resend and de-duplication.", "Write a table of user message, system handling and done condition for each of the 4 failures."], ["All 4 failure types handled", "There is a de-duplication rule", "There is an Escalation for delayed medical alerts"])
  ]);

  apply(3, "Normalize Streamly's core data and connect it in an ERD.", [
    task("Find Entities, Value Objects and Events in the Sequence messages.", ["05_SEQUENCE.md", "entity-candidate-sheet.csv"], ["Mark nouns and state changes in messages and collect at least 15 candidates.", "Sort candidates into Entity, Value Object, Event or simple attribute, with reasons.", "Define identifiers and state transitions for 6 core Entities."], ["At least 15 candidates sorted", "At least 6 core Entities", "Every state is linked to Sequence evidence"]),
    task("Design a 3NF ERD for order, payment and coupon data yourself.", ["commerce-flat-table.csv", "normalization-workbook.md"], ["Mark repeating groups and partial/transitive functional dependencies.", "Record the 1NF→2NF→3NF steps in a table and define PK, FK and Unique.", "Insert 20 sample rows and check that insert, update and delete anomalies are gone."], ["3NF tables and the reasons for each step", "Cardinality and constraints are shown", "Tests for the three anomalies pass"]),
    task("Build a Domain–Flow–ERD trace matrix and fix mismatches.", ["03_DOMAIN_MAP.md", "04_USER_FLOW.md", "06_ERD.md"], ["Link each Flow step to its CRUD Entity and owner Domain in a table.", "Find at least 5 orphan Entities, missing fields or direct writes to another Domain.", "Submit the before/after ERD or Flow Diff and your reasoning."], ["Every Flow step maps to an Entity", "At least 5 mismatches judged", "Direct-write violations removed"])
  ], [
    task("Judge Entities the AI created or merged on its own, using source evidence.", ["ai-erd.mmd", "requirements.md", "term-dictionary.csv"], ["Find 5 unsupported Entities/attributes and 3 wrongly merged terms.", "The planner records business meaning; the developer records identifiers and lifecycles.", "Decide keep, delete, split or ask, and update the ERD."], ["At least 8 problems judged", "Every decision has evidence from both sides", "The updated ERD renders"]),
    task("Fix an AI glossary that merged Approved, Confirmed and Completed into one.", ["ai-term-dictionary.csv", "order-state-cases.md"], ["The planner writes the business responsibility and screen differences for each state.", "The developer proposes Enums, allowed transitions and API/DB names.", "Confirm a state-transition table and a standard Korean/English/code-name glossary."], ["The 3 states have separate meanings", "Forbidden transitions are defined", "Screen, API and DB terms are mapped"]),
    task("Fix an AI normalization plan that changes past order prices.", ["ai-order-schema.sql", "price-change-scenario.md"], ["Insert orders before and after a price change to reproduce the problem.", "The planner gives the retention policy; the developer compares Snapshot and reference approaches.", "Jointly approve the chosen model, Migration and check queries."], ["The problem is reproduced in SQL", "At least 2 alternatives compared", "Past order amount retention test passes"]),
    task("Jointly trace how a column change affects APIs, screens and batch jobs.", ["schema-change.diff", "dependency-inventory.csv", "ai-impact-note.md"], ["Find at least 5 Consumers the AI missed by searching code and docs.", "The planner checks metric and screen terms; the developer checks Migration and the compatibility layer.", "Create a step-by-step change, test and rollback checklist."], ["At least 5 Consumers added", "There is a backward-compatibility period", "Rollback and data-check queries exist"])
  ]);

  apply(4, "Design and verify Domain-based API Contracts for Streamly.", [
    task("Design Video, Playback, Campaign and Ad Serving Endpoints.", ["03_DOMAIN_MAP.md", "endpoint-template.csv"], ["Write the Resources and possible state changes for each Domain.", "Set URI, HTTP Method, permission and idempotency for 12 Endpoints.", "Find RPC-style designs and leaks into other Domains, and improve at least 3 Endpoints."], ["At least 12 Endpoints", "Every item shows permission and idempotency", "Domain Owner matches the URI"]),
    task("Complete the OpenAPI Request, Response and Error Contracts.", ["api-spec-starter.yaml", "validation-rules.md"], ["Write the Schema and required/optional fields for 6 core Endpoints.", "Create examples for success, Validation, permission, conflict and server errors.", "Check with an OpenAPI Validator and make error examples follow the shared Error Schema."], ["0 Validator errors", "At least 3 error types per Endpoint", "Error codes are linked to user actions"]),
    task("Judge Breaking Changes and Consumer impact in an API change Diff.", ["api-v1.yaml", "api-v2-draft.yaml", "consumer-list.csv"], ["Classify field removal, type change, made-required and added Enum values.", "Write the failure risk and Migration method for each Consumer.", "Create 8 negative tests and a Deprecation plan, and verify them."], ["Every change judged as Breaking or not", "Consumer Owners and actions are listed", "At least 8 negative tests"])
  ], [
    task("Add the cancel, duplicate and permission flows the AI API spec missed.", ["ai-api-spec.yaml", "user-flow-cases.md"], ["Find 8 missing Endpoints, errors or states based on the user Flows.", "The planner writes the expected state after failure; the developer writes the contract change.", "Jointly complete a Requirement–Endpoint–Test trace table."], ["At least 8 gaps", "Every Flow is linked to an API", "Every contract has a verification Test"]),
    task("Change an AI error spec that returns 400 for every failure so users can recover.", ["ai-error-catalog.csv", "support-cases.md"], ["Classify errors as Validation, Auth, Conflict, Rate Limit or Server.", "The planner sets messages and next steps; the developer sets Status, Code and whether Retry is allowed.", "Create a shared Contract and UI handling table for 10 errors."], ["At least 10 errors defined", "No security information is exposed", "Users have a recovery action"]),
    task("Separate AI guesses about external API behavior into testable assumptions.", ["ai-openbanking-spec.md", "provider-doc-excerpt.md"], ["Mark 6 assumptions about tokens, Timeout or Retry with no official documentation.", "The planner writes questions for the provider; the developer creates Mock defaults and isolation.", "Agree on what can be built before confirmation and what is Blocked."], ["At least 6 assumptions separated", "Each check has an Owner and deadline", "The Mock states its unconfirmed assumptions"]),
    task("Re-assess, as a launch plan, a response-field removal the AI called safe.", ["breaking-change.diff", "api-usage-report.csv"], ["Find affected app screens, operations reports and partners.", "The planner proposes launch impact; the developer proposes a compatibility layer and Deprecation period.", "Write a staged deploy, monitoring and rollback approval."], ["All Consumers identified", "There is a Deprecation period and notice", "Rollback Triggers are defined with numbers"])
  ]);

  apply(5, "Design Streamly's screen structure and UI states for each Persona.", [
    task("Design the IA and Screen Flow for Viewer, Creator and Advertiser.", ["persona-goals.md", "screen-inventory.csv"], ["Link each Persona's top 3 tasks to the screens they need.", "Create a Sitemap and core Flows, and mark access paths without permission.", "Find 5 blocked points in AI mock-user navigation and fix the Routes."], ["Top Task paths for all 3 Personas", "Every screen has a Route and permission", "At least 5 navigation problems fixed"]),
    task("Complete the Component State Matrix for Video Card, Player and Checkout.", ["component-list.md", "state-matrix-template.csv"], ["Define Loading, Empty, Error, Disabled and Success for each Component.", "Write keyboard Focus, ARIA Labels and error-alert behavior.", "Render the 15 states yourself with Stories or a static Demo."], ["3 Components × 5 states", "Includes accessibility behavior", "Screen evidence for all 15 states"]),
    task("Fix real UX problems with a beginner-user Walkthrough.", ["prototype/index.html", "walkthrough-log.md"], ["Do sign up → search → play while thinking aloud, and log clicks and confusion.", "Sort 6 reproducible problems by severity and evidence.", "Fix the top 3 in code or screen specs and compare times before and after."], ["At least 6 problems", "Top 3 fixed", "Before/after evidence and user impact"])
  ], [
    task("Remove stereotypes from the AI Persona and write inclusive UX requirements.", ["ai-senior-persona.md", "interview-evidence.md"], ["Find and mark 5 unsupported limits or biases.", "The planner describes real difficulties; the developer suggests accessibility alternatives.", "Write 8 requirements for readability, feedback and interaction support without removing features."], ["At least 5 biases removed", "At least 8 requirements", "Each requirement has a way to test it"]),
    task("Replace the AI's \"9/10 usability\" rating with a real measurement plan.", ["ai-ux-score.md", "prototype/index.html"], ["Mark 6 unsupported scores and claims.", "Design 3 tasks to measure completion rate, error rate, time taken and drop-off points.", "Collect mock test data from 3 people and recalculate the score and improvement priorities."], ["3 measurement tasks", "Observation data from 3 people", "The new score shows how it was calculated"]),
    task("Restore the policy, permission and failure screens missing from the AI UI draft.", ["ai-prototype.html", "requirements-trace.csv"], ["Find missing guest, no-permission, payment-failure and Empty states.", "The planner writes messages; the developer writes UI States and API dependencies.", "Add 5 missing screens as Wireframes or HTML and update the trace table."], ["At least 5 gaps", "Requirement IDs are linked to screens", "Each screen has a next action"]),
    task("Negotiate the AI's excessive interactions down to MVP scope.", ["ai-ui-ideas.md", "release-capacity.md"], ["Rate 12 suggestions by user value, build cost, performance and accessibility.", "The planner uses MoSCoW; the developer estimates complexity and risk.", "Agree on 3 items for this Sprint, 2 experiments, and excluded items with reasons."], ["All 12 rated", "Sprint scope fits Capacity", "Exclusion reasons and review conditions are recorded"])
  ]);

  apply(6, "Connect the Streamly frontend to the API and build failure UX.", [
    task("Connect the video list screen to the real API Contract.", ["video-list-starter.js", "api-spec.yaml", "mock-server.json"], ["Write the Fetch function and DTO→View Model conversion yourself.", "Connect Loading, Success, Empty, 401 and 500 states to the screen.", "Reproduce slow responses and request cancellation, and fix the Race Condition."], ["5 UI states work", "No access to fields outside the Contract", "Duplicate and cancelled request tests pass"]),
    task("Build the Checkout state machine and failure-recovery UX.", ["checkout-starter.html", "failure-cases.json"], ["Draw the Idle→Submitting→Pending→Success/Error transitions.", "Inject Timeout, double clicks, Validation and server errors.", "Build input saving, retry and contact paths, and pass 8 state tests."], ["State table matches the code", "Input is kept on failure", "At least 8 state tests"]),
    task("Fix 3 frontend bugs using reproducible steps.", ["buggy-dashboard/", "bug-report-template.md"], ["Reproduce infinite requests, global state pollution and missing keyboard access.", "Write your own cause hypothesis and evidence before asking AI.", "Apply a minimal fix and refactor, and keep regression tests and before/after logs."], ["All 3 bugs reproduced and fixed", "Cause evidence and failed hypotheses recorded", "At least 6 regression tests"])
  ], [
    task("Find the policies the AI-generated screen code broke and agree on the fix scope.", ["ai-generated-checkout/", "checkout-policy.md"], ["Find 6 drifts in cancellation fee, permissions, price calculation and privacy policy.", "The planner links expected results; the developer links code paths and tests.", "Jointly write a P0/P1 fix list and Acceptance Criteria."], ["At least 6 policy drifts", "Every item has a code location", "P0/P1 done conditions are testable"]),
    task("Verify the CORS cause the AI asserted, using evidence.", ["browser-network-log.har", "server-config.txt", "ai-debug-answer.md"], ["The planner writes down the user symptoms and when they occur.", "The developer tests 3 hypotheses with Network and server logs.", "Complete an Incident Log separating root cause, temporary fix, permanent fix and user notice."], ["3 hypotheses tested", "There is evidence of the root cause", "Temporary and permanent fixes are separate"]),
    task("Turn 20 AI code-review comments into a real fix priority list.", ["ai-review-comments.csv", "release-scope.md"], ["Sort them into style, bug, security or data loss, and check if they reproduce.", "The planner scores user impact; the developer scores fix risk and regression scope.", "Agree on 5 immediate fixes and the reasons for items on hold."], ["All 20 judged", "The 5 immediate fixes have Owners", "Items on hold have review conditions"]),
    task("Jointly verify features are kept before and after AI refactoring.", ["before.js", "ai-refactored.js", "behavior-checklist.md"], ["Find policy, error-handling and retry logic deleted in the Diff.", "The planner writes 8 user actions; the developer writes Characterization Tests.", "Fix failing tests and submit a safe Refactor Diff."], ["8 behavior checks", "Characterization Tests pass", "Deleted policies are restored or agreed"])
  ]);

  apply(7, "Build Streamly's ad Campaign Business Logic and Backend.", [
    task("Turn 10 Campaign, Budget and Target Business Rules into an executable table.", ["campaign-policy.md", "decision-table-template.csv"], ["Write the input, condition, result and failure reason for each Rule.", "Set edge values and conflict priority, and create 10 counter-examples.", "Move the Decision Table into code tests and make them all pass."], ["10 Rules completed", "At least 10 counter-example tests", "Conflict priority is deterministic"]),
    task("Build the Campaign creation Use Case with separated layers.", ["backend-starter/", "09_BUSINESS_RULE.md"], ["Split the responsibilities of Controller, Application Service, Domain Service and Repository.", "Write unit tests first with an In-memory Repository.", "Fix 3 layer leaks found in the AI structure review."], ["Domain Rules are tested without a DB", "At least 3 layer leaks judged", "At least 8 success/failure tests"]),
    task("Verify the budget-deduction Transaction and exception handling.", ["billing-service-starter/", "failure-injection-cases.md"], ["Inject 20 concurrent requests, Budget exhaustion and DB failure.", "Check partial success and double deduction in the logs and DB state.", "Fix the Transaction boundary, Idempotency and exception mapping until tests pass."], ["Concurrency tests pass", "No duplicate or negative Budget", "Each caller has its own exception codes"])
  ], [
    task("Jointly fix the budget boundary and time standard the AI misread.", ["ai-business-rules.md", "campaign-policy.md"], ["Find 6 errors in \"up to/below\", KST/UTC and Rule priority.", "The planner writes policy examples; the developer writes edge tests.", "Jointly approve the revised Rule table and test results."], ["At least 6 interpretation errors", "At least 10 edge tests", "There is an approver and effective date"]),
    task("Fix the user and data risks of AI error handling that always retries.", ["ai-retry-policy.md", "order-incident-log.md"], ["Mark the risks of duplicate orders, long waits and user confusion.", "The planner sets wait/cancel rules; the developer sets Retryable types and idempotency.", "Create an exception–message–recovery action–operations response table."], ["At least 8 exceptions classified", "No infinite or unconditional Retry", "User and operations actions are linked"]),
    task("Agree on the completion status when the Event fails to send after an order is saved.", ["partial-success-timeline.md", "architecture-options.md"], ["The planner proposes when to show \"order complete\"; the developer proposes Outbox and compensation options.", "Compare 3 options on consistency, complexity and running cost.", "Write state transition, reprocessing and monitoring Acceptance Criteria for the chosen option."], ["3 options compared", "Partial success state is stated", "There are reprocessing and operations Owners"]),
    task("Design an approval and audit process for when an AI Agent auto-edits Rules.", ["agent-change.diff", "policy-approval-matrix.md"], ["Check whether the changed discount Rule and tests got policy approval.", "The planner defines the policy approver; the developer defines Diff, deploy and rollback ownership.", "Design an Agent change request and a Human Approval Gate."], ["3 policy changes judged", "Deployment before approval is blocked", "There is an Audit Log and Rollback Owner"])
  ]);

  apply(8, "Build Streamly's authentication, authorization and multi-Role security.", [
    task("Complete a screen/API/data Permission Matrix for 4 Roles.", ["role-resource-list.csv", "permission-matrix-template.csv"], ["Write Resource × Action permissions for Viewer, Creator, Advertiser and Admin.", "Define Ownership and Tenant conditions in separate columns.", "Turn 12 IDOR and forged-Role counter-examples into tests and fix the permission table."], ["Permission table: 4 Roles × core Resources", "Includes Ownership conditions", "At least 12 forbidden-access tests"]),
    task("Build the Signup, Login, Refresh and Logout authentication flows.", ["auth-starter/", "token-policy.md"], ["Draw the password Hash and Session/JWT lifecycle as a Sequence.", "Write the issue, expiry, refresh and revoke code yourself.", "Run token theft, reuse and concurrent refresh tests and strengthen defenses."], ["4 auth Flows work", "No plain-text passwords stored", "At least 8 attack tests"]),
    task("Write Negative Tests for authorization bypass and patch server checks.", ["api-test-starter.js", "permission-matrix.csv"], ["Try editing others' data, Admin APIs, forged Roles and cross-Tenant access.", "Fix server permission checks on the Endpoints that failed.", "Verify the 403/404 policy and Security Audit Log."], ["At least 12 Negative Tests", "No permission checks that rely only on the UI", "Forbidden access leaves an Audit Log"])
  ], [
    task("Remove the excess personal data in AI-suggested sign-up fields.", ["ai-signup-fields.csv", "privacy-purpose-sheet.md"], ["For each field, write its purpose, whether required, retention period and deletion rule.", "The planner reviews user value; the developer reviews encryption, access and deletion cost.", "Mark each as required, optional or removed, and update the sign-up Contract."], ["Every field judged", "At least 3 fields reviewed for removal or made optional", "There is a retention/deletion policy"]),
    task("Fix the account-enumeration risk in detailed login-failure messages.", ["ai-login-copy.md", "attack-simulation.log"], ["Reproduce a response that reveals whether an email exists.", "The planner sets a single message and support path; the developer sets Rate Limit and Lockout.", "Test a message and API spec that satisfy both user UX and security."], ["Account enumeration is impossible", "Real users have a recovery path", "Rate Limit test passes"]),
    task("Add the missing Ownership and Tenant conditions to the AI permission table.", ["ai-permission-matrix.csv", "multi-tenant-cases.md"], ["Try 8 accesses to other users' or other Tenants' data within the same Role.", "The planner defines collaboration/delegation rules; the developer defines server Conditions.", "Update the permission table and Integration Tests."], ["8 cross-access attempts blocked", "Delegation exceptions are linked to policy reasons", "Tenant ID forgery test passes"]),
    task("Re-judge false positives, misses and severity in the AI security report.", ["ai-security-report.md", "application-logs/", "threat-model.md"], ["Sort 12 Findings into reproducible, false positive or needs more investigation.", "The planner assesses user and regulatory impact; the developer assesses the PoC and fix risk.", "Agree on the final Severity and a P0/P1 fix plan."], ["All 12 Findings judged", "Critical/High have reproduction evidence", "There are fix Owners and regression Tests"])
  ]);

  apply(9, "Integrate Streamly's ad selection, billing and Analytics Events.", [
    task("Build the ad candidate Filter and a deterministic selection Rule.", ["campaigns.json", "viewer-context.json", "ad-selector-starter.js"], ["Build the Active, Budget, Target and Frequency conditions in order.", "Include tie-breaking and exclusion reasons in the result.", "Pass 12 Property Tests for edge cases, conflicts and empty candidates."], ["All 4 Rules work", "Same input, same result", "At least 12 Tests pass"]),
    task("Build the Event Pipeline from ad display to billing.", ["event-schema.json", "pipeline-starter/"], ["Write Event Schemas for AdRequested→Served→Impression→Click→Charge.", "Build the Outbox and an Idempotent Consumer.", "Inject duplicate, out-of-order and lost Events, and check reprocessing and Reconciliation."], ["5 Event Schemas", "No duplicate Charges", "Lost events can be detected and reprocessed"]),
    task("Complete the Viewer–Ad–Billing–Analytics E2E Trace.", ["integrated-sandbox/", "trace-checklist.md"], ["Run everything from choosing a video to cost deduction and metrics.", "Collect logs, Events and DB state for each step with a Correlation ID.", "Inject no-ad, Budget-exhausted and Analytics-delay failures and find the causes."], ["Evidence for 1 normal E2E run", "3 failure types recovered", "All steps are linked in one Trace"])
  ], [
    task("Connect payment states the AI reduced to success/failure with the user experience.", ["ai-payment-flow.md", "pg-event-log.json"], ["Find Pending, Unknown, Confirmed and Cancelled states in the logs.", "The planner defines messages and buttons per state; the developer defines lookup and reprocessing.", "Jointly write state transitions and UI Acceptance Criteria."], ["At least 5 states", "Nothing pushes users to pay twice", "There is a recovery path for Unknown"]),
    task("Fix missing price, refund and security notices on the AI payment screen.", ["ai-checkout.html", "pricing-policy.md", "refund-policy.md"], ["Find 6 places where users could misread the final amount or required notices are missing.", "The planner sets wording and consent timing; the developer sets server calculation and tamper protection.", "Submit the fixed screen and the receipt data Contract."], ["At least 6 gaps fixed", "The server amount is the Source of Truth", "Refund and subscription terms are shown"]),
    task("Block the double-charge risk from AI auto-reprocessing.", ["duplicate-charge-events.json", "ai-retry-worker.js"], ["Reproduce how the same payment gets applied twice.", "The planner sets when a charge is final and compensation rules; the developer designs Idempotency and the Ledger.", "Run 100 duplicate Events and verify a single Charge and an alert."], ["0 double charges", "Ledger reconciliation matches", "There are compensation and operations Owners"]),
    task("Correct wrong cause-and-effect claims in the AI Analytics report.", ["ai-analytics-report.md", "raw-events.csv", "refunds.csv"], ["Recalculate CTR, Conversion and Revenue with duplicate Events and refunds removed.", "The planner writes the decision goal; the developer writes data-quality limits.", "Write a report that separates confirmed facts, possible hypotheses and further experiments."], ["Metric formulas and Sources are listed", "Duplicates and refunds corrected", "Causal claims have an experiment plan"])
  ]);

  apply(10, "Run integrated QA on Streamly, then launch and present it safely.", [
    task("Run E2E QA for Signup→Upload→Playback→Ad→Payment.", ["release-candidate/", "e2e-test-template.md"], ["Design 3 core user Journeys and 6 failure injections.", "Run them in the Sandbox and collect Screenshot, Log and DB evidence.", "Fix the defects you find and pass the Regression Suite again."], ["3 Journeys pass", "6 failure injections recovered", "Before/after evidence for each defect"]),
    task("Complete a Release Readiness document you could really deploy with.", ["project-repository/", "release-checklist.md"], ["Run the Build, Config, Migration, Secret, Monitoring and Rollback items yourself.", "Find and fix 5 mismatches between the README and the real commands.", "Have a new teammate do a Staging deploy, Health Check and Rollback using only the docs."], ["100% checklist evidence", "At least 5 doc mismatches fixed", "Independent reproduction results recorded"]),
    task("Complete a 10-minute Demo showing technical Decisions and how you verified AI.", ["decision-logs/", "test-evidence/", "demo-deck-template.md"], ["Summarize 3 key Decisions as problem, options, choice and Trade-off.", "Include 2 cases where you checked and fixed AI suggestions, and 1 failure case.", "Practice the live Demo and 10 tough questions, and present within the time."], ["Talk within 10 minutes", "3 Decisions with evidence", "Explains the developer's judgment, not AI's output"])
  ], [
    task("Remove unbuilt features and wrong policies from AI launch documents.", ["ai-launch-package/", "release-feature-list.csv", "support-policy.md"], ["Compare the intro, FAQ and manual with the Release Candidate and find 10 errors.", "The planner checks public promises; the developer checks Feature Flags and real behavior.", "Fix the errors and approve a document–feature trace table."], ["At least 10 errors corrected", "No promises of unbuilt features", "Each document has a reviewer"]),
    task("Correct the AI's exaggerated numbers and achievements in the final talk using evidence.", ["ai-final-deck.md", "metrics.csv", "git-summary.md"], ["Mark 8 unmeasured numbers, credit given to AI, or exaggerations.", "The planner links user value; the developer links Test, Diff and metric evidence.", "Finish a final Deck that separates facts, interpretation and future goals."], ["At least 8 exaggerations judged", "Every number has a Source", "Human judgment and AI help are separated"]),
    task("Verify the AI's \"all tests passed\" report against a real Release Gate.", ["ai-qa-report.md", "ci-results/", "release-gates.md"], ["Find items that only ran on Mocks, and Sandbox, Migration and recovery tests that never ran.", "The planner writes launch-blocking criteria; the developer writes evidence per environment and remaining risks.", "Confirm a Go, Conditional Go or No-Go decision and follow-up Owners."], ["All items not run are disclosed", "Each Gate has evidence links", "There is a launch decision and approver"]),
    task("Add Canary, Monitoring and Rollback ownership to the AI deployment plan.", ["ai-deploy-plan.md", "slo-dashboard.json", "incident-contacts.csv"], ["Design 5% Canary→25%→100% stages and observation times.", "The planner sets stop and notice rules; the developer sets Error Rate, Latency and payment-error Triggers.", "Inject a mock failure and run the auto-stop, manual approval and Rollback Runbook."], ["At least 3 number-based Triggers", "Mock Rollback succeeds", "Notice and technical response Owners are clear"])
  ]);

  /* Day 1 통합 실습실에 중복 삽입되어 있던 기존 과제를 추가 Mission으로 이전 */
  days[1].missions.push(
    {
      title: "Extra Mission. Pet Home-Care Requirements Spec",
      card: "Turn the pet home-care assignment into a planner–developer Mission and verify approval, payment and no-show policies.",
      issue: "When turning meeting notes into requirements, the AI left out or guessed admin approval of pet sitters, the 1-hour payment deadline after matching, and no-show compensation and replacement rules.",
      planner: "The planner confirms the owner, pet-sitter and admin roles, approval conditions, cancel/no-show compensation policy and open questions.",
      developer: "The developer checks state transitions per role, payment expiry, and compensation/replacement exceptions as buildable Acceptance Criteria.",
      artifact: "pet-care-requirements-decision.md",
      pbl: task("Compare the pet home-care meeting notes with the AI requirements draft and fill policy gaps.", ["pet-care-meeting-notes.md", "ai-pet-care-requirements.md"], ["Compare the two documents and find 8 gaps or guesses in roles, approval, payment deadline, cancellation and no-show policy.", "The planner writes policies and open questions; the developer writes state transitions, exceptions and test conditions.", "Complete a joint requirements doc with PCR requirement IDs, normal/exception Flows, owners and approval status."], ["At least 8 problems judged", "Includes 1-hour payment expiry and no-show compensation Flows", "Every PCR requirement has test criteria"])
    },
    {
      title: "Extra Mission. Unmanned Study Café IoT Control Spec",
      card: "Turn the study café assignment into a team Mission and verify booking times, door-lock/power/HVAC control and Fail-safes.",
      issue: "The AI wrote only the normal booking flow and left out PIN active time, end-of-session notice, and physical safety steps when the network drops or the door lock fails.",
      planner: "The planner defines user notices before/after booking, when staff step in, emergency opening and compensation policy.",
      developer: "The developer checks time standards, Device state, backup-network switching, command failure/retry and manual Override as a system Flow.",
      artifact: "study-cafe-iot-decision.md",
      pbl: task("Complete an integrated study café spec with a booking Timeline and IoT failure handling.", ["study-cafe-meeting-notes.md", "ai-iot-control-flow.md"], ["Write a minute-by-minute Timeline of door lock, lights and HVAC from 10 minutes before booking until after it ends.", "The planner writes notice and emergency-call rules; the developer writes how to handle network loss, PIN failure and sensor mismatch.", "Jointly confirm user actions, Device commands, staff response and done conditions for the normal Flow and 4 failures."], ["Minute-by-minute control Timeline complete", "Includes 4 failure types and double Fail-safe", "Every Hardware command has a success/failure check"])
    },
    {
      title: "Extra Mission. Short-Video & Live Commerce Domain Design",
      card: "Turn the short-video and live commerce Domain assignment into an extra Mission and jointly verify the AI's boundary and ownership suggestions.",
      issue: "The AI gave Video, Live, Commerce, Order and Settlement overlapping responsibilities and did not set clear Owners for order, refund and settlement data after a broadcast ends.",
      planner: "The planner defines business ownership and who changes policy for broadcasts, product display, orders, refunds and settlement.",
      developer: "The developer designs Bounded Contexts, Aggregates, data Owners, Events and failure recovery, and removes circular dependencies.",
      artifact: "shortform-commerce-domain-decision.md",
      pbl: task("Jointly complete the Persona, Feature and Domain Map for short-form VOD and live commerce.", ["shortform-commerce-brief.md", "ai-commerce-domain-map.mmd"], ["Write Goals and Features for Viewer, Creator, Seller and Operator, and find 6 overlapping responsibilities in the AI Map.", "The planner names order, refund and settlement policy Owners; the developer sets Aggregates, Events and the Source of Truth.", "Fix the Context Map and the broadcast-end, payment-failure and refund Sequences, and submit a joint Decision Log."], ["At least 6 overlaps judged", "Each key data item has one Owner", "Includes 3 exception Sequences and recovery owners"])
    },
    {
      title: "Extra Mission. B2B Mobility Fleet Monitoring Domain Design",
      card: "Turn the company-vehicle monitoring assignment into an extra Mission and decide ownership and boundaries for vehicle, driver, trip and maintenance data.",
      issue: "The AI proposed that every Domain share vehicle location and driver personal data, so permissions, retention and responsibility for collection failures are unclear.",
      planner: "The planner defines fleet manager, driver and dispatcher roles, the purpose of location data, and view/retention/deletion policy.",
      developer: "The developer designs Owners and Events for the Vehicle, Trip, Telemetry and Maintenance Contexts, permission/Tenant boundaries and Offline recovery.",
      artifact: "mobility-domain-ownership-decision.md",
      pbl: task("Confirm data ownership and Domain boundaries for the fleet platform, including privacy policy.", ["mobility-service-brief.md", "ai-mobility-domain-map.mmd", "location-policy.md"], ["Find at least 8 collection purposes and duplicate Owners in the AI Map across vehicle, driver, location, trip and maintenance data.", "The planner writes view, retention and deletion policy; the developer writes Tenant, permissions, Events and Offline sync.", "Jointly approve the Domain Map, Ownership Matrix, exception Flows for stopped, delayed or corrupted location data, and owners."], ["Ownership decided for at least 8 data types", "Includes personal-data retention/deletion rules", "Includes 3 exception Flows: Offline, delay, corruption"])
    }
  );
  if (window.attachPblExamples) window.attachPblExamples();

  /*
   * Persona 기반 예시 상황
   * 각 PBL 과제의 기술 주제와 AI 협업 이슈를 그대로 사용해 학생이
   * '누구의 입장에서, 언제, 왜 이 일을 해야 하는지' 이해하도록 구성한다.
   */
  var scenarioProfiles = {
    1: { developer: "Kim Do-yun (junior service developer, 1st year)", planner: "Park Seo-yeon (service planner, 3rd year)", stakeholder: "Content operations team and new-business lead", moment: "Two days after the kickoff meeting, just before the first Domain design review" },
    2: { developer: "Lee Jun-ho (backend developer, 2nd year)", planner: "Park Seo-yeon (service planner, 3rd year)", stakeholder: "Video playback and ad operations staff", moment: "The day before Sprint Planning, when user Flows and system Sequences must be confirmed" },
    3: { developer: "Choi Eun-ji (data modeler, 2nd year)", planner: "Park Seo-yeon (service planner, 3rd year)", stakeholder: "Order and settlement operations team", moment: "90 minutes before the DB schema meeting, with terms and Entities understood differently" },
    4: { developer: "Lee Jun-ho (API developer, 2nd year)", planner: "Park Seo-yeon (service planner, 3rd year)", stakeholder: "Web/App development teams and an external API provider", moment: "An API Contract approval meeting before frontend integration starts" },
    5: { developer: "Jung Ha-rin (frontend developer, 1st year)", planner: "Yoon Ji-a (UX planner, 4th year)", stakeholder: "Viewer, Creator and Advertiser user groups", moment: "The day before usability testing, checking screen states in the prototype" },
    6: { developer: "Jung Ha-rin (frontend developer, 1st year)", planner: "Park Seo-yeon (service planner, 3rd year)", stakeholder: "API development team and customer support staff", moment: "Real API connection errors keep repeating during integration testing and the cause must be narrowed down" },
    7: { developer: "Lee Jun-ho (backend developer, 2nd year)", planner: "Park Seo-yeon (service planner, 3rd year)", stakeholder: "Campaign and Billing operations team", moment: "A concurrency and error-handling review before deploying Business Rules" },
    8: { developer: "Oh Se-jin (security developer, 3rd year)", planner: "Park Seo-yeon (service planner, 3rd year)", stakeholder: "Member operations team and privacy officer", moment: "A security check of member features found a permission bypass and privacy issues" },
    9: { developer: "Han Min-su (platform developer, 3rd year)", planner: "Park Seo-yeon (service planner, 3rd year)", stakeholder: "Advertiser, settlement and Analytics staff", moment: "Ad impressions and billing numbers don't match, so the release candidate is paused for tracing" },
    10: { developer: "Kim Do-yun (release developer, 2nd year)", planner: "Park Seo-yeon (product owner, 4th year)", stakeholder: "QA, operations, customer support and executives", moment: "Checking the Release Candidate the day before the final Demo and launch approval meeting" }
  };

  function attachPersonaScenario(day, type, item) {
    var profile = scenarioProfiles[day];
    var isSkill = type === "skill";
    var projectContext = item.title.indexOf("Extra Mission") === 0
      ? "Separate industry case PBL workshop"
      : "Day " + day + " " + days[day].theme + " project";
    var persona = isSkill
      ? profile.developer
      : profile.planner + " × " + profile.developer;
    var situation = isSkill
      ? "You take the role of " + profile.developer + ". The moment: " + profile.moment + ". " + projectContext + ": you are responsible for the following work. " + item.pbl.brief + " The only materials you have are " + item.pbl.inputs.join(", ") + ". In the team review, you must explain your design reasons and test results in your own words."
      : "Your team takes the roles of " + profile.planner + " and " + profile.developer + ". The moment: " + profile.moment + ". " + projectContext + ". While reviewing the AI Agent's results for this project, the team found this problem: " + item.issue;
    var dialogue = isSkill
      ? "\"If I submit a finished version made by AI, I can't explain why it's right. Let me make my own draft first and only ask AI for missing edge values and counter-examples.\""
      : "\"Let's confirm user policy and scope with planning evidence, check system limits and failure conditions with test evidence, and then decide together.\"";
    var assignment = isSkill
      ? item.pbl.work.join(" → ") + " Your final output is " + item.artifact + ". When done, you should be able to explain the following: " + item.check
      : item.pbl.work.join(" → ") + " Record both roles' judgments and approval reasons together. The joint output file is " + item.artifact + ".";

    item.pbl.scenario = {
      title: profile.moment,
      persona: persona,
      stakeholder: profile.stakeholder,
      situation: situation,
      dialogue: dialogue,
      assignment: assignment
    };
  }

  for (var scenarioDay = 1; scenarioDay <= 10; scenarioDay += 1) {
    days[scenarioDay].skills.forEach(function (item) { attachPersonaScenario(scenarioDay, "skill", item); });
    days[scenarioDay].missions.forEach(function (item) { attachPersonaScenario(scenarioDay, "mission", item); });
  }
})();
