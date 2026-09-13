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
- Ch.1 Cost Elements — PARTIALLY TESTED (1 Chapter-Practice session, 10 Qs,
  mixed concept+calc, difficulty Easy/Medium/Hard all seen; Official
  Questions / Apply / Mastery / Challenge / Retention tiers NOT yet
  attempted)

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
10 (Chapter 1 only)

Known Strong Areas:
Direct vs Indirect Cost classification (100% this session per app's own
closeout message) — matches my independent sense that basic cost
classification is a strength.

Known Weak Concept Area:
Not yet established with confidence (only one chapter done). Candidate:
the Direct/Indirect × Fixed/Variable 2×2 matrix is subtle (Q5, Q9) —
answered correctly but this is a plausible confusion area worth
retesting later in Adaptive Practice / retention checks.

Known Weak Calculation Area:
Q7 (sum of 4 direct-cost line items) — I deliberately simulated a
plausible "misread one line item" error (answered $202,000 instead of
$222,000, consistent with misreading $35,000 as ~$15,000) at Medium
confidence. Real error type: Question Reading / Calculation Error blend.

High-Confidence Errors:
None yet (Chapter 1's one miss was at Medium confidence, by design).

Low-Confidence Correct Answers:
None yet — Chapter 1 answers were mostly Medium/High confidence. Plan to
deliberately include Low-confidence correct/incorrect answers in later
chapters (per task's required history matrix).

Bookmarks / Notes / Error Records Created:
None yet (Bookmark / Mark for review / Question issue controls seen on
every question screen but not yet exercised).

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
1. On the Chapter 1 Results screen, click "Complete Official Questions →"
   briefly to understand that mechanic (don't need to finish all of them),
   OR click "Home" to move to touring more chapters — prioritize breadth
   next: sample ~5 questions per chapter across a representative spread of
   the remaining 33 chapters (mixing concept/calc, all difficulties),
   deliberately varying confidence x correctness to build the full history
   matrix required by the task (need: Correct+Low, Wrong+Low, Wrong+High
   still missing).
2. After a handful of chapters, deliberately trigger and use the
   wrong-answer classification widget at least once (use MODE=answer alone,
   read feedback, click a classification button, THEN MODE=next).
3. Then cycle through: Random Practice, Calculation Drill, Fresh Challenge,
   Formula Lab, Wrong Answers Review, Dashboard, Study Plan, Adaptive
   Practice (once enough history exists), Timed Mock, Memo Practice.
4. Update all 5 checkpoint files after every ~5-10 questions or feature.

Remaining Phases:
Phase 1 (retro — mostly done implicitly, home screen already read), Phase 2
(33 more chapters), Phases 3-28 all still open. Pass 2 (technical
investigation) and final Arabic report come last.

Last Updated:
2026-09-13 (Session 2 — network blocker resolved via local app file; first
real chapter practice session completed)
