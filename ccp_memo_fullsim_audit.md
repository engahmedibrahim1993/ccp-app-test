# CCP Exam Coach — Memo + Full Simulation Audit

**Subject:** `CCP_Exam_Coach_AACE_VALIDATED.html` (current locked build, SHA-256 `964831538d0b02c70265cf7221fa9d07c2fce17b6176b91c72b80cffd6c2b4e2`, **unmodified by this audit**).
**Method:** Live testing via headless browser (real clicks, real typing, real timers observed ticking) plus full source tracing of every relevant function through its complete reassignment chain to confirm the true live implementation before judging it. Cross-checked against the project's already-downloaded authoritative sources in the stated hierarchy: current CCP Candidate Handbook (full text extraction, Blueprint table pp. 9–10 previously visually confirmed in a prior audit), AACE RP 10S-90, S&K6, TCM Framework, CCP Certification Study Guide including Appendix A. **Source-access limitation, disclosed up front:** the Handbook's own linked "How to Write a CCP Memo" PDF (`web.aacei.org/.../how-to-write-a-ccp-memo.pdf`) could not be retrieved — outbound access to that domain is blocked in this environment. This is AACE's own specific memo-writing guidance and the single most relevant document for Part A; its absence is a genuine gap in this audit's completeness, not resolved by assumption. The Study Guide was searched directly and confirmed to contain **no memo-writing guidance at all** (zero matches for "memo," "written component," or "essay").

No application file was modified during this audit.

---

## Current Memo Practice — What Works

- **Genuinely varied scenarios.** The 5 fixed prompts (Estimate Increase Reconciliation, Schedule Slippage/SPI, Change Order Cost Impact, Contingency Drawdown, Vendor Delay Risk) span 5 different cost-engineering domains (estimating, EVM/schedule performance, change management, risk/contingency, procurement risk) — not superficial rewordings of one scenario. Live-tested two of the five end-to-end; both rendered distinct scenario text, and history correctly recorded both as separate entries.
- **Deliberately does not fabricate AI-graded feedback.** This is an explicit, documented design decision (source comment: memo readiness is "NEVER inferred from word count, checklist completion, memo length, timer completion, or any automated writing analysis"). Given the task's own concern about over-reliance on AI-style generic writing advice, the app's answer is to not attempt automated content grading at all, and to say so directly in the UI ("This is a writing/structure practice tool — it does not produce an official AACE score"). This is a defensible strength, not a shortcut.
- **Working mechanics, live-verified.** Timer counts down in real time (confirmed ticking during a live 2-second wait), word count updates live as text is typed, the 10-item structural self-review checklist (To/From/Date/Subject/problem statement/relevant facts/analysis of alternatives/cost-schedule-risk-quality considerations/clear recommendation/next actions) saves correctly, an optional external score and a human reviewer rating (Needs Work/Developing/Competent/Ready, with reviewer source) persist to Memo History, and `memoReadiness()` correctly reflects only the most recent *human-rated* attempt — zero console errors through the full config → write → self-review → save → history → reopen flow.
- **Full Simulation and standalone Memo Practice share one prompt pool** and a submitted simulation memo can be explicitly promoted into Memo History for the same human-rating workflow — a sensible, non-duplicated integration.

## Current Memo Practice — Material Gaps

- **Only 5 fixed scenarios, never rotated or expanded.** A student who practices repeatedly will exhaust the entire scenario set quickly and start rewriting memos for prompts they've already seen verbatim — including inside their one shot at Full Simulation, which draws from the identical pool (see Full Simulation gaps).
- **The self-review checklist is entirely self-marked and never verified against the actual memo text.** A student can check every box without the memo containing those elements. It can only ever teach "did I remember to include X," never "did I actually include X well, or at all."
- **No substantive feedback exists on analysis quality, correctness of the cost-engineering reasoning, or writing effectiveness — from the app itself, ever.** Without an external human reviewer (self, peer, or coach), "Memo Readiness" stays "Not Assessed" permanently. A candidate studying alone gets zero signal on the actual skills the task asked to verify: whether facts were separated from irrelevant ones, whether the conclusion is defensible, whether the recommendation is supported by project/cost-engineering reasoning.
- **No cross-attempt weakness tracking.** Memo History stores each attempt's checklist score and rating independently; nothing aggregates a recurring pattern (e.g., "you omit a clear recommendation in 4 of 5 memos").
- **No conciseness/length guidance.** A live word count is shown, but with no target, no warning, and no norm — "concise professional writing" is never explicitly trained.
- **Inconsistent audience specification.** Only 2 of 5 scenarios explicitly name a recipient ("to the project sponsor," "to project leadership"); the other 3 (Estimate Increase, Change Order, Vendor Delay) never state who the memo is addressed to, undermining the explicit "identifying audience and purpose" skill for 3 of the 5 scenarios.
- **No explicit training against the named memo traps.** Neither the scenarios nor the checklist names "answering the wrong question," "weak recommendation," "unsupported conclusion," "excessive background," "unclear audience focus," or "poor prioritization" as failure modes to self-check against — the checklist only verifies presence of structural elements, never absence of these specific traps.
- **`readinessScore()` (the app's own internal overall-readiness metric) has zero awareness of memo status.** It factors only MCQ-side evidence and unresolved misconceptions. A student with strong MCQ performance and a completely untested memo sees a high internal "Readiness" score with no indication that a fully 25%-weighted exam component (per the Handbook's scoring structure — see below) is an unaddressed blind spot.

## Current Full Simulation — What Works

- **Correct question count and domain quotas.** 119 MCQ questions drawn via the same Blueprint-domain-quota engine used by the standalone Blueprint Mock — 43/29/13/20/6/8 across the 6 official Blueprint content domains (live-confirmed: `Object.values(byDomain).reduce(...) === 119`), consistent with this quota structure's prior independent AACE validation against the visually-confirmed Blueprint table (Handbook pp. 9–10).
- **Single 5-hour master timer, honestly framed.** The Handbook states no CCP-specific exact exam duration (only a generic "up to 5 hours" across AACE certification exams broadly). The app's own confirm-dialog text is transparent about this: *"...using a 5-hour practice pacing timer. The supplied handbook confirms the 119+memo format but does not state an exact CCP-specific duration."* This is the right way to handle an unsourced number — approximate and disclose, not fabricate false precision.
- **Realistic MCQ mechanics.** A working question navigator (answered/unanswered/flagged/current), "Next unanswered," "Leave unanswered & next," and per-question elapsed-time tracking — all live-confirmed via real clicks. The MCQ section is genuinely revisitable from the Memo section ("← Return to MCQ review") while time remains.
- **Honest scoring — no fabrication.** MCQ score/accuracy/domain-count breakdown is shown; the memo section explicitly states *"Memo scoring requires human/instructor review — this app does not fabricate an official AACE writing score,"* and the results screen explicitly states *"there is no official combined pass/fail result generated by this app."* This avoids a serious credibility risk.

## Current Full Simulation — Material Gaps

- **MUST FIX, confirmed live: pausing and resuming a Full Simulation within the same browser session corrupts state and crashes the render.** Reproduced by real clicks: start a simulation → click "Pause & Home" (the only pause control; the Full Simulation screens have no header back-crumb) → Today correctly shows "Resume your Full CCP Simulation... Resume Simulation →" → clicking it throws `TypeError: Cannot read properties of undefined (reading 'map')` in the console, and the DOM is left showing the stale Today screen (the failed render never replaces it), so a non-technical user sees "Resume Simulation" silently do nothing, with no error message and no way to tell why. There is also no "discard this simulation" control anywhere in the reachable UI (the underlying `discardInterruptedFullSimulation()` function exists but has no button wired to it), so a student stuck in this state has no in-app escape.
  **Root cause (traced through the full reassignment chain):** `pauseFullSimulation()` sets `PENDING_ACTIVE_FULLSIM = fullSimPayload()`. `fullSimPayload` was later overridden (`fullSimPayload=function(){return v58CompactFullSimPayload();}`) to return a *compacted* representation for storage efficiency, but `pauseFullSimulation` was never updated to expand it back (`v58ExpandFullPayload`) before assigning it, so `PENDING_ACTIVE_FULLSIM.fullsim.mcqQueue` ends up holding compacted question stubs (`{id, o}`, no `.options`), not full question objects. The parallel `goBack()` navigation path *does* correctly call `v58ExpandFullPayload` after compacting — the same inconsistency exists between two code paths that should behave identically.
  **This is not Full-Simulation-specific — it is systemic.** The identical bug was reproduced live for an ordinary **Blueprint Mock** session: answering a question, then clicking the general "Home" nav (`goHome()`, not the back-crumb) mid-session, then "Resume Session →" from Today, throws the exact same error. `goHome()`'s regular-session branch has the identical unexpanded-payload defect. Given a Full Simulation is meant to run up to 5 hours and is very likely to be paused and resumed within one sitting, and "Home" is one of the most commonly clicked controls in the app, this is a high-likelihood, high-severity defect directly undermining the core promise of a pausable, realistic exam rehearsal.
- **No confidence-rating capture in Full Simulation's MCQ section.** Unlike ordinary practice sessions (`confidenceEnabled:true`), `FULLSIM` has no confidence field anywhere. A genuine high-confidence wrong answer inside a Full Simulation will never register as an "unresolved misconception" the way the identical mistake would in ordinary practice — Full Simulation mistakes don't feed the app's own remediation engine.
- **No pacing/fatigue diagnostic on the Full Simulation results screen**, even though the app already built an excellent one for the smaller Blueprint/Timed Mock (`mockPacingCardHtml`: overall/calculation/concept avg seconds per question, a fatigue check comparing first-N vs. last-N accuracy, and a "slowest questions" list with correctness). `renderFullSimResult` only shows a basic score/accuracy/avg-time/unanswered stat grid — the app's own best diagnostic tool isn't wired into its flagship mode.
- **Domain breakdown is computed but never shown.** `finishFullSimulation()` computes `mcqDomainScores` (per-domain correct/total) and stores it in history, but `renderFullSimResult()` never renders it — the data exists and is thrown away from the student's point of view.
- **No representation anywhere in the app of the real exam's actual pass/fail mechanism.** Per the Handbook's "Exam Breakdown and Scoring" section: the CCP exam scores **4 domains** — Cost Management (55 MC questions), Communication Competency (the memo), Interfacing with Other Disciplines (24 MC questions), Performance Analysis (40 MC questions) — and **averages them equally, regardless of question count**, to reach a 70% overall threshold to pass (explicitly confirmed by the Handbook's own worked examples of passing on 3-of-4 topics or failing despite 3-of-4 passes). This means the memo alone is a full 25% of the final decision, and the 24-question Interfacing domain counts exactly as much as the 55-question Cost Management domain. The app's `q.domain` field and every mock/simulation result screen use a *different*, 6-bucket Blueprint **content** classification (Managing Project Costs / Interface with Other Disciplines / Reports and Documentation / Performance Measurement / Support Scheduling / Risk Management) — correctly validated for question/task distribution in a prior audit, but not the same axis as the 4-bucket scoring classification, and never labeled as such. A systematic search of the live code for "70%," "averaged," "Communication Competency," or the domain question counts (55/24/40) returned zero matches anywhere outside the raw question data. **A student could reasonably believe their overall MCQ percentage is "their score," and never learn that a weak smaller domain or a rushed/skipped memo can cause an overall fail despite strong performance elsewhere** — a materially important exam-day fact this tool never teaches.
- **Memo prompt reuse.** The Full Simulation memo is drawn from the identical 5-prompt pool as standalone Memo Practice. A student who has practiced (and effectively memorized a response to) all 5 prompts in standalone practice may encounter, in their one full-length rehearsal, a scenario they've already solved — undermining "tests transfer, not recognition" for this one component.

## Official AACE Alignment Findings

| Item | Finding |
|---|---|
| 119 MCQ + 1 memo (120 total items) | **Matches.** Both Handbook phrasings ("119...questions plus 1 memo" in the scoring section; "120...questions, including one written memo question" in the FAQ) are consistent, not conflicting. |
| Blueprint content-domain quotas (43/29/13/20/6/8) | **Matches**, per prior independent visual confirmation against the Blueprint table (Handbook pp. 9–10); reconfirmed live in this pass. |
| Exam duration | Handbook gives **no CCP-specific exact figure** (only a generic "up to 5 hours" across AACE exams). App's 5-hour timer is a disclosed approximation, not a sourced number — appropriately honest, not a defect. |
| Real scoring structure (4 domains, equal-weighted average, 70% overall, memo = 25%) | **Not represented anywhere in the app.** This is a genuine, material gap between the tool and the real exam's grading mechanism (see Full Simulation gaps). |
| Official memo-writing guidance | Study Guide contains **none**. The Handbook's own linked "How to Write a CCP Memo" PDF **could not be retrieved** in this environment (network egress blocked) — an audit-completeness limitation, disclosed rather than papered over. |

## Exam-Day Realism Findings

| Checklist item | Finding |
|---|---|
| Long-session concentration / time allocation | Well-diagnosed for Blueprint/Timed Mock (pacing card); **not diagnosed at all for Full Simulation**, the mode that most needs it. |
| Skipping and returning | Supported and live-verified in both modes (navigator, flags, "leave unanswered," "next unanswered"). |
| Calculation-heavy sections | Supported via Calculation Drill, Timed Calculation Set (25 min/10Q, explicit pace target), and Method Selection Drill. |
| Mixed unsignposted method selection | **Directly supported** — Method Selection Drill explicitly separates "recognize the governing formula/method" from "solve correctly," which is exactly this skill. |
| Mixed-domain switching | Supported structurally — Full Simulation and Blueprint Mock draw across all 6 content domains in one continuous queue. |
| Decision-making under pressure | Supported via the master timer + navigator combination; not separately diagnosed. |
| Pause/reload behavior | **Broken** for the realistic in-session pause→resume path (MUST FIX above); works correctly only across a full browser close-and-reopen (page load re-fetches via the correctly-expanding path). |
| Confidence tracking | Present in ordinary practice; **absent in Full Simulation.** |
| End-of-exam review | Present (MCQ review before submitting the memo; results screen). |
| Weak-domain diagnosis | Present at chapter/topic level everywhere; present at Blueprint-domain level only for Blueprint/Timed Mock, not Full Simulation. |

**Does "Full CCP Simulation" justify its label?** Structurally, mostly yes — the right question count, an honestly-disclosed timer, genuine combined MCQ+memo delivery, and a real navigator. But it is undermined by (a) the pause defect, (b) missing the pacing/domain diagnostics its own smaller sibling mode already has, and (c) never teaching the real domain-averaged scoring model. **It rehearses the mechanics of sitting the exam without teaching how the exam actually decides pass/fail** — a candidate can leave a "successful" Full Simulation run with a false sense of security if their memo was rushed or their smaller domain was weak.

## Memo + Exam-Day Integration (Part C)

The path chapter learning → weakness remediation → retention → mixed practice → timed mock → memo practice → full simulation → final-week readiness exists and is navigable, but memo practice sits **outside** the mastery/retention/readiness loop entirely: `readinessScore()`, Today's recommendations, and the retention engine never reference memo status. A student can reach "Ready" on every chapter's MCQ mastery and "Retained" across all retention checks, see a high internal Readiness score, do a Final Week review, and never once be told their memo is untested — the single largest gap in an otherwise coherent pipeline.

## Student-Profile Findings (Part D)

| Profile | App's diagnosis | Verdict |
|---|---|---|
| Strong MCQ, weak memo writer | MCQ-side mastery/Progress correctly shows strong, differentiated states; `readinessScore()` never factors memo status; "Memo Readiness" silently stays "Not Assessed" with no proactive flag. | **Not identified.** The app does not direct this student to their actual problem. |
| Strong technical, slow calculator | Method Selection Drill separates method-selection accuracy from solve accuracy; Blueprint/Timed Mock's pacing card separates calc vs. concept avg-time and lists slowest-but-correct questions. | **Identified — for Blueprint/Timed Mock.** Not surfaced in Full Simulation (no pacing card there). |
| Weak time management | Same pacing card explicitly flags first-vs-last-question accuracy drop (fatigue). | **Identified — for Blueprint/Timed Mock only.** Absent from Full Simulation, where it matters most. |
| Mixed Blueprint weaknesses | Chapter/topic weakness detection is strong (independently verified in prior sessions). Blueprint-domain-level breakdown exists in Blueprint/Timed Mock's diagnostic; absent from Full Simulation's results screen. | **Served at chapter/topic level; served at domain level only outside Full Simulation.** |
| One week before exam | Today's exam-proximity urgency logic and Exam Practice's Final Week card were independently verified working in a prior session (out of this audit's Memo/Full-Sim scope; not re-tested here). | **Already confirmed working**, unaffected by this audit. |

---

## MUST FIX

1. **Pause/resume corruption crash** (Full Simulation "Pause & Home," and the same defect in ordinary sessions via "Home" mid-quiz). Root cause: `pauseFullSimulation()`/`goHome()` assign an unexpanded compact payload to `PENDING_ACTIVE_FULLSIM`/`PENDING_ACTIVE_SESSION` where `goBack()`'s equivalent path correctly expands it first. **Change type: workflow/logic bug fix (no new feature).**
2. **No representation of the real 4-domain, equally-averaged, memo-inclusive scoring model.** Candidates get no warning that a small domain or an untested/weak memo can fail them despite a strong raw MCQ percentage. **Change type: wording/content change plus a small scoring-adjacent display addition (reusing data the app already computes — not a new grading engine).**

## SHOULD IMPROVE

3. Wire the existing `mockPacingCardHtml` diagnostic into Full Simulation's results screen. **Workflow change (reuse existing function).**
4. Display the domain breakdown (`mcqDomainScores`) Full Simulation already computes. **Workflow change (surface existing data).**
5. Capture confidence ratings in Full Simulation's MCQ section so its mistakes feed the misconception engine like ordinary practice. **Workflow/logic change.**
6. Give `readinessScore()` awareness of memo status (e.g., cap or flag overall readiness when memo readiness is "Not Assessed"/"Needs Work" while MCQ readiness is otherwise high). **Scoring change (extend an existing formula).**
7. Name an explicit recipient/audience in the 3 of 5 memo scenarios that currently omit one. **Wording/content change.**
8. Add a modest number of additional memo scenarios (even 3–5) to reduce repeat-prompt memorization risk — especially since Full Simulation draws from the same pool. **Content change (extends the existing `MEMO_PROMPTS` array; no new mechanism).**
9. Add trap-specific self-review prompts (e.g., "Does your recommendation directly answer what was asked?", "Is your conclusion supported by a fact cited above?") alongside the existing structural checklist — still self-marked, still no automated grading. **Wording/content change.**
10. Track recurring memo weaknesses across saved attempts (e.g., which checklist items are most often left unchecked) and surface the pattern in Memo History. **Workflow/logic change (aggregates existing stored data; no new feature).**

## ACCEPTABLE Limitations

- No automated AI-based memo content grading. This is a deliberate, well-reasoned design choice: a confidently-wrong AI score on the exam's least-verifiable, highest-stakes component would be worse than no score. Human review (self/peer/coach) is the honest substitute, matching how AACE itself grades memos (volunteer human graders on a monthly cycle) — not a gap to fix with more automation.
- No exact official CCP-specific exam duration asserted; the 5-hour approximation is disclosed as such, matching the best-available source language.
- Memo writing-quality assessment left entirely to human review, for the same reason as above.

## Features That Should NOT Be Added

- An AI-generated memo score, grade, or "this reads like a passing memo" verdict.
- A fabricated combined MCQ+memo pass/fail prediction, even using the newly-surfaced domain-averaging model — the app does not have (and cannot obtain) AACE's actual memo grading rubric, so honestly combining the two remains impossible; the correct move is disclosure of the mechanism, not a fabricated combined score.
- New exam formats or additional simulation modes. The existing set (Blueprint Mock / Timed Mock / Full Simulation / Calculation Drill / Method Selection Drill / Timed Calculation Set) already covers every exam-day skill category the task asked about — the gap is in finishing and wiring what exists, not adding more of it.
- A procedural/generated memo-scenario engine. A small, deliberately curated, human-quality-checked set of scenarios is more defensible than an automatically generated one of unknown quality; per the task's own conservatism instruction, extend the existing curated list (SHOULD IMPROVE #8) rather than building a generator.

## Recommendations Ranked by Expected Impact on CCP Pass Probability

| Rank | Recommendation | Change type | Why this rank |
|---|---|---|---|
| 1 | Fix the pause/resume crash (MUST FIX #1) | Workflow/logic bug fix | Highest impact: can silently destroy hours of realistic exam rehearsal and leaves the student with no way to recover, eroding trust in the tool's core value proposition. |
| 2 | Surface the real domain-averaging/memo-weighting scoring model (MUST FIX #2) | Wording/content change + minor display logic | Directly addresses the single most dangerous false-confidence scenario found: strong MCQ, weak/skipped memo → real exam fail despite the app showing "strong" readiness. |
| 3 | Add memo-status awareness to `readinessScore()` (SHOULD IMPROVE #6) | Scoring change | Directly targets the "strong MCQ, weak memo writer" profile this audit found the app currently fails to identify. |
| 4 | Wire pacing + domain diagnostics into Full Simulation results (SHOULD IMPROVE #3/#4) | Workflow change | Makes the flagship exam-rehearsal mode as diagnostically useful as its own smaller sibling mode already is. |
| 5 | Capture confidence in Full Simulation's MCQs (SHOULD IMPROVE #5) | Workflow/logic change | Lets a full simulation's mistakes feed the same remediation loop ordinary practice already benefits from. |
| 6 | Fix inconsistent memo audience specification + add a few more scenarios (SHOULD IMPROVE #7/#8) | Wording/content change | Improves memo realism and reduces memorization risk without new mechanisms. |
| 7 | Add trap-specific self-review prompts + recurring-weakness tracking (SHOULD IMPROVE #9/#10) | Wording/content + workflow change | Directly responsive to the task's named "memo traps" and "retained weaknesses" questions; lower ceiling than the items above since it remains self-assessed. |

---

## Bottom Line

**Does the current app prepare a candidate adequately for the memo component and a realistic full CCP exam experience, or are there material gaps?**

**There are material gaps, on both halves of the question.** For the memo component, the app trains structure and provides an honest (non-AI-fabricated) practice space, but cannot itself assess whether a candidate's analysis or recommendation is actually defensible — that depends entirely on an external reviewer the app cannot guarantee exists, and the app doesn't even flag this as a readiness risk on its own dashboards. For the full exam experience, "Full CCP Simulation" is structurally close to the real format (right count, honest timer, real mechanics) but is currently undermined by a confirmed, high-severity pause/resume defect, lacks the diagnostic depth its own smaller sibling mode already has, and never teaches the real domain-averaged, memo-inclusive scoring mechanism that actually determines pass/fail.

**Do not call the app exam-ready as-is for these two components.** A candidate who performs well inside the app's own dashboards today could still be underprepared for actual exam-day scoring realities, specifically around memo weighting and domain averaging — precisely the failure mode this audit was asked to check for.
