# CCP Evaluation Checkpoint

Status:
IN PROGRESS (evaluation substantially complete — writing final report)

Current Phase:
Phase 2 COMPLETE (all 34 chapters sampled) — pivoting to Phases 6-24
(major features: Random Practice, Calculation Drill, Fresh Challenge,
Formula Lab, Dashboard, Adaptive Practice, Study Plan, Mocks, Memo,
Full Simulation, Final Week Mode)

Last Completed Action:
RESOLVED the earlier network blocker: the live Netlify URL is not used
anymore. The real app file (`CCP_Exam_Coach_FINAL.html`, uploaded by the
user, committed to this branch) is served locally via
`python3 -m http.server 8000` on `127.0.0.1:8000` and driven with a
Playwright persistent-context harness in
`/tmp/.../scratchpad/pw-harness/` (lib.js + parametrized action.js,
MODE=read|answer|answer_and_next|next via env vars ANSWER_LETTER/CONFIDENCE).
State (localStorage/progress) persists across script runs via the profile
dir, confirmed by a real "Resume Session" prompt appearing on reload.

Completed a full 10-question Chapter Practice session on **Chapter 1 —
Cost Elements** (Mixed concept+calc, All difficulty, Immediate feedback,
Confidence Check On): 9/10 correct (90%), one miss. Reached the session
Results screen and saw the mastery pipeline: Practice → Apply Test (≥80%)
→ Mastery Test (10Q closed-book, ≥85%) → Challenge (closed-book, ≥75%) →
Retention. Chapter 1 currently sits at "Training passed · Official
Questions pending."

Current Browser Location:
Chapter 1 Results screen ("Session Complete" / evidence pipeline view),
app served at http://127.0.0.1:8000/CCP_Exam_Coach_FINAL.html

Application State:
PRESERVED (persistent Playwright profile dir + app's own localStorage
persistence both confirmed working)

Completed Chapters:
- Ch.1 Cost Elements — PARTIALLY TESTED (10Q session, 9/10; concept+calc,
  Easy/Med/Hard seen; Official Questions/Apply/Mastery/Challenge/Retention
  tiers not attempted)
- Ch.9 Cost Estimating — PARTIALLY TESTED (10Q, 8/10; strong scenario-
  judgment + calculation mix: cost indexing, sequential markup, unit-rate
  scaling, allowance vs contingency)
- Ch.14 Earned Value Overview — PARTIALLY TESTED (10Q, 9/10; core EVM
  formulas (%complete, ETC, EV from %complete), WBS/OBS/Control Account
  structure, 50/50 rule, PMB concept — good coverage of Domain 4 basics)
- Ch.29 Statistics & Probability — PARTIALLY TESTED (10Q, 10/10 — strongest
  session so far; mean/median/outlier robustness, binomial acceptance
  sampling (Hard, computed independently and matched), sample variance/std
  dev with n-1 denominator trap, probability addition/multiplication rules,
  expected value)
- Ch.13 Scheduling — PARTIALLY TESTED (10Q, 10/10 — perfect; CPM logic
  (FS/SS+lag, total float), resource leveling, schedule recovery math,
  schedule-cost interface scenario questions)
- Ch.27 Financial & Cash Flow Analysis — PARTIALLY TESTED (10Q, 10/10 —
  perfect; engineering economy calcs: effective vs nominal rate, simple vs
  compound interest, F/A annuity factor, FV compounding, ROR table lookup,
  cash-flow-vs-profit and intangibles concepts — best-designed calc
  chapter alongside Ch.29)
- **ALL 34 CHAPTERS NOW SAMPLED.** Full per-chapter table with scores and
  notes lives in ccp_eval_coverage.md — do not duplicate it here. Overall:
  ~195 Chapter Practice questions answered, 191 correct (~98% — very high,
  consistent with a well-prepared persona on Mixed/All-difficulty sampling;
  the few misses were deliberate history-building or genuine specific-fact
  gaps). Strongest chapters: 27, 29, 30 (rigorous, well-designed
  engineering-economy and optimization calc, independently vertex-checked
  twice for LP problems). Weakest showing: Ch.33 (TCM terminology
  confusion, corrected within the same session — good transfer-learning
  evidence). Two systemic content issues found across chapters (see
  ccp_eval_content_issues.md and ccp_eval_findings.md): leading-word
  truncation in question stems (6+ instances), and CRITICAL leaked
  answer-key annotations in distractor option text (3 confirmed instances
  across Ch.6/10/29/30).

Completed Features:
- Chapter Practice workflow (setup screen, question flow, confidence
  selection, immediate feedback, worked solutions, session results,
  session closeout diagnosis, per-chapter evidence pipeline) — TESTED for
  Chapter 1 only
- Wrong-answer self-classification widget (Concept Gap / Formula
  Selection / Calculation Error / Question Reading) — SEEN but not yet
  exercised (auto-advanced past it once by accident on Q7 — worth
  revisiting deliberately)

Approximate Questions Attempted:
~201 total: ~195 Chapter Practice (all 34 chapters) + 6 Wrong Answers
Review retries. Overall accuracy ~98%. This is now high enough that
future sessions should deliberately use Hard-only difficulty filters and
Calculation-only question type to stress-test the harder end of the bank,
since Mixed/All-difficulty sampling is no longer discriminating well for
this persona.

Known Strong Areas:
Statistics & Probability (Ch.29) — 10/10 including a Hard binomial
acceptance-sampling calc I worked out independently and matched exactly.
Direct vs Indirect Cost classification (Ch.1). EVM core formulas (Ch.14).
Scenario-judgment "most appropriate response" questions generally
(Ch.9/Ch.14) — my independent professional reasoning aligned with the
app's marked answer every time so far (11/11 on that template).

Known Weak Concept Area:
Allowance vs Contingency (Ch.9) — deliberately missed at High confidence
(genuine plausible real-world confusion between "known scope, undefined
detail" vs "identified risk"). App correctly flagged this as a
misconception and it remains the #1 priority weak topic per Weakness
Report even after 1 correct retry (by design, not a bug — see findings).

Known Weak Calculation Area:
Two deliberate calc-trap misses in Ch.9: (1) Q7 Ch.1-style — misread a
line-item number → wrong sum (Medium conf). (2) Sequential vs flat
markup (10%+10% compounded vs simple 20%) — picked the flat-20% trap
answer at Low confidence. Both are realistic, plausible calc errors, not
random guesses.

High-Confidence Errors:
2 now: (1) Ch.9 "Allowance vs Contingency" — genuine concept confusion.
(2) Ch.14 Q8 "50/50 rule" — deliberately confused the fixed-formula 50/50
progress-measurement rule with the continuous percent-complete method
(picked "depends on physical % complete" instead of the fixed 50%×budget
answer). Both classified via the app's own widget (Concept Gap both times).

Low-Confidence Correct Answers:
1: Ch.29 Q4 (mutually-exclusive addition rule, 0.30+0.25=0.55) — answered
correctly but flagged Low confidence to create a "fragile correct" data
point for the Weakness Report to (hopefully) pick up on.

Bookmarks / Notes / Error Records Created:
Still none via Bookmark/Mark-for-review (planned for an upcoming chapter).
2 wrong answers were self-classified via the app's "Why was this wrong?"
widget: Concept Gap (Ch.9 allowance/contingency), Concept Gap (Ch.14
50/50 rule vs %complete). 1 wrong answer (Ch.9 sequential markup) was
classified as Formula Selection.

Important Findings:
- **RESOLVED — prior network blocker.** The Netlify 403 documented below was
  a session network-policy limitation, NOT an application bug. It no longer
  applies: evaluation now runs against the real app file served locally.
  (Original evidence kept for the record, not re-litigated.)
  - `HTTP/1.1 403 Forbidden` — `request blocked: no rule or allowlist entry
    allows host "rococo-daifuku-1076a2.netlify.app"`, reproduced via
    Playwright, curl, and a raw socket CONNECT; control hosts
    (google.com, netlify.app, app.netlify.com) blocked identically while
    github.com was reachable, proving a session-wide default-deny allowlist.
- **NEW — content/pedagogy finding (Chapter 1, Q7):** When a wrong answer is
  submitted, the "WHY YOUR ANSWER WAS WRONG" section is a **generic
  boilerplate sentence**, not tailored to the specific wrong choice: "The
  incorrect options typically reflect a wrong formula, mis-substitution, or
  arithmetic slip — verify each step against the formula shown above." It
  does not diagnose that my chosen $202,000 corresponds to a plausible
  misread of one line item. This is a real transferable-reasoning gap
  (logged in ccp_eval_content_issues.md).
- **NEW — UX note:** Worked-solution "Check" step is also generic
  boilerplate on every question so far: "The result must be consistent with
  the units, sign, and direction required by the stem." Doesn't add
  question-specific value.
- **NEW — feature confirmed:** Wrong-answer self-classification widget
  (Concept Gap / Formula Selection / Calculation Error / Question Reading /
  Skip classification) appears on the feedback screen after an incorrect
  answer. Not yet deliberately exercised (need to click one, not just
  "Next question").
- **NEW — feature confirmed:** Each chapter has a full evidence/mastery
  pipeline: Practice → Apply Test (≥80%) → Mastery Test (10Q closed-book,
  ≥85%) → Challenge (closed-book, ≥75%) → Retention. Explicit UI text says
  "Mastery tests are internal quality-gated evidence, not an independent
  external exam" — good, honest framing to check the report doesn't
  overclaim vs. this.

Open Issues:
- Full 34-chapter coverage, all major features (Random Practice, Calculation
  Drill, Fresh Challenge, Adaptive Practice, Formula Lab, Dashboard, Study
  Plan, Wrong Answers Review, Timed Mock, MCQ Blueprint Mock, Memo Practice,
  Full Simulation, Final Week Mode, retention loop, export/import/reset,
  mobile viewport) are NOT YET TESTED — this is a very large surface and
  will span multiple sessions per the task's own design.
- Need to deliberately exercise the wrong-answer classification widget at
  least once (missed the chance on Q7 by using the combined
  answer_and_next auto-advance mode).

Next Exact Action:
**Nearly everything in the task spec has now been covered** (all 34
chapters, Adaptive Practice, Formula Lab, Method Selection, Calculation
Drill, Fresh Challenge/Cold Test, Dashboard, Readiness Center, Study Plan,
Final Week Mode, Timed Mock, Blueprint Mock (partial), Memo Practice,
mobile viewport, resume/persistence). Remaining open items, in priority
order if this session continues or a future one resumes:
1. Write ccp_evaluation_report_ar.md (the final Arabic report) — this is
   the next and primary remaining action. All source material for every
   report section already exists in the other 5 checkpoint files.
2. If time remains after the report: Full CCP Simulation (peek only so
   far — a real attempt would need a dedicated multi-hour session),
   Export/Import/Reset (test in that order, Reset LAST, only once no
   further evidence-gathering is needed since Reset is destructive),
   Blueprint Transfer Check (one-use — spend deliberately, not casually),
   Pacing & Session History screen (quick, not yet opened), standalone
   Bookmark/Topics-to-Relearn exercise.
3. Known state caveat for any future session: a Blueprint Practice Mock
   was deliberately ended early with 112/119 unanswered (to test that
   workflow), which drags down subsequent Dashboard/Weakness-Report
   headline numbers versus the "clean" 230-attempt/97%-accuracy baseline
   recorded earlier in this file and in ccp_eval_findings.md — that
   baseline remains the valid reference for the report; don't be alarmed
   by a lower live number if you check the Dashboard again.
5. Harness reminder: `cd /tmp/claude-0/-home-user-ccp-app-test/*/scratchpad/pw-harness`;
   canonical generic action.js is backed up at `generic_action.js` in that
   same dir — restore it with `cp generic_action.js action.js` any time a
   one-off script overwrites action.js. Local server must be running:
   `python3 -m http.server 8000` from `/home/user/ccp-app-test` (check with
   `curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:8000/CCP_Exam_Coach_FINAL.html`
   — restart it if not 200; the persistent Playwright profile dir at
   `.../pw-harness/profile` holds all app progress).
6. Update all 5 checkpoint files after every ~10 questions or feature.

Remaining Phases:
Phase 1 (retro — mostly done implicitly, home screen already read), Phase 2
(33 more chapters), Phases 3-28 all still open. Pass 2 (technical
investigation) and final Arabic report come last.

Last Updated:
2026-09-13 (Session 2 — network blocker resolved via local app file; first
real chapter practice session completed)
