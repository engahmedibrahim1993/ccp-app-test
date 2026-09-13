# CCP Evaluation Checkpoint

Status:
IN PROGRESS

Current Phase:
Phase 2 — Every Chapter (Chapter 1 practice session complete; touring
remaining 33 chapters + major features next)

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
- 30 chapters remain untouched (Ch.2-8, 10-13, 15-28, 30-34)

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
46 total: 10 (Ch.1) + 10 (Ch.9) + 10 (Ch.14) + 10 (Ch.29) Chapter Practice,
plus 6 Wrong Answers Review retries (2 rounds of the same 3 missed
questions, from two different entry points, to test the Error Notebook bug)

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
Full history matrix now achieved (all 6 required combinations present +
verified against Weakness Report). Pivoting from "build history" to
"breadth + major features":
1. Sample 2-3 more calc-heavy/scenario-heavy chapters (suggest: Ch.13
   Scheduling, Ch.27 Financial & Cash Flow, Ch.31/32 Risk Management) at
   ~10Q each via MODE=setup CHAPTER="..." NUMQ=10.
2. Then pivot hard into untested major features, in this order (all still
   0% tested): Random Practice, Calculation Drill, Method Selection, Fresh
   Challenge (all levels), Formula Lab, Performance Dashboard / Readiness
   Center, Adaptive Practice (history now exists — use it), Study Plan,
   My Final Review, Topics to Relearn.
3. Then: Timed Mock, MCQ Blueprint Mock (if present), Memo Practice, Full
   CCP Simulation, Final Week Mode.
4. Near the end (not yet): mobile viewport pass, export/import/reset.
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
