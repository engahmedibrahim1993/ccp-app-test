# CCP Evaluation — Feature Coverage Matrix

Legend: TESTED / PARTIALLY TESTED / NOT TESTED / BLOCKED
(Opening a page alone never counts as TESTED.)

| # | Feature | Status | Notes |
|---|---|---|---|
| 0 | Live app reachability (network smoke test) | BLOCKED (superseded) | Original Netlify URL blocked by session egress policy; superseded by serving the local `CCP_Exam_Coach_FINAL.html` file, from which the entire evaluation below proceeded. |
| 1 | Home / first-time experience | TESTED | Read fully at session start (mode cards, blueprint weights, evidence-pipeline explainer) and revisited dozens of times as attempts/wrong/weak counters updated live. See Phase 1 notes in final report. |
| 2 | Chapter Practice (all chapters) | PARTIALLY TESTED | All 34 chapters sampled (195 Qs). See per-chapter table below. |
| 3 | Random Practice | NOT TESTED | No feature named "Random Practice" was found distinct from Chapter Practice's "All chapters (full mixed bank)" option — that option was implicitly exercised via the Blueprint/Timed mocks (which pull from the full mixed bank) but not deliberately tested as its own dedicated mode. |
| — | Method Selection Drill | PARTIALLY TESTED | Excellent 2-stage design (recognize method → miss diagnostic w/ source citation → solve). 1 full round verified (Ch.23 Bonding Capacity); does not persist across reload, and re-randomizes each "Start drill," which made further systematic rounds impractical within this session. |
| 4 | Calculation Drill (= task's "Generated Practice") | TESTED | 8 dynamic items across 7 chapters, all 8 independently re-derived and verified exactly correct. Honestly labeled "DYNAMIC — FRESH NUMBERS" vs. the fixed Master Bank. |
| — | Fresh Challenge (= app's "Cold Chapter Certification") | TESTED | 5/5 (100%) on truly never-before-seen Ch.29 items (permanently sealed once shown, reset disabled). Correctly labeled result as below the numeric-index threshold rather than overclaiming. |
| 7 | Wrong Answers Review | TESTED | 2 full retry rounds (3 Qs each) from 2 entry points; reshuffled choices, correct scoring, "Clean sweep" messaging confirmed. |
| 8 | Error Notebook / Notes / Bookmarks | PARTIALLY TESTED | Error Notebook opened — **HIGH severity bug**: stale "currently missed" count never clears after correction (see findings). Mark-for-review exercised during mocks. Standalone Bookmark button and Topics-to-Relearn list not exercised. |
| 9 | Weakness Report | TESTED | Full confidence×correctness matrix, root-cause distribution, domain/difficulty breakdown all hand-verified — exactly correct. |
| 10 | Adaptive Practice | TESTED | 15/15 (100%) — well-targeted Hard CPM/EVM problems, both EAC methods, and correctly re-served my one flagged fragile-correct item. Classified Highly Relevant. |
| 12 | Performance Dashboard | TESTED | 230 attempts, 97% accuracy at first check — every headline total hand-verified exactly. Blueprint Task Coverage (76 tasks) is a standout. Later deliberately perturbed via an early-exited 119Q mock (see below) to test edge-case behavior — Dashboard responded correctly (Training Readiness dropped 85→60). |
| — | Readiness Center (hub) | TESTED | Training Readiness vs. Unseen-Test Readiness cleanly separated; sophisticated cold/Lab-exposed tracking per chapter and Blueprint domain — standout feature. |
| — | Unseen Evidence & Exam Readiness | TESTED | Full sealed-static-pool accounting; explicitly refuses to "pretend a recycled training mock is unseen evidence" — strong integrity signal. |
| — | Chapter Progress & Mastery | TESTED | **Found a second HIGH-severity inconsistency**: shows "Training: 100%" for 4 chapters where the Performance Dashboard (same attempt counts) shows 92/87/83/83% — see findings. |
| 14 | Retention / Mastery indicators (Practice→Apply→Mastery→Challenge→Retention pipeline) | PARTIALLY TESTED | Pipeline structure and terminology confirmed on every chapter's progress card (Ch.1, 9, 10, 13, 14, 27, 29 all reached "Practice Almost Complete"); Apply/Mastery Test/Challenge/Retention tiers themselves never attempted (each requires completing "Official Questions" first, a large additional workflow not exercised). Multi-day retention cannot be verified in one session by design (per task instructions) — PARTIALLY TESTED is the ceiling here regardless of remaining time. |
| 15 | Formula Lab | TESTED | 27 formula cards (13 chapters) with variables, "what it tells you," an explicit **common trap**, and a worked example — standout feature, includes an honest note about a known textbook erratum. Gap: only 13/34 chapters covered; EV formulas mistagged under "CH.19" instead of Ch.14. |
| 16 | Timed Mock | TESTED | Full 20Q mock: live timer, question map, skip/flag/revisit/answer-change all verified, native `confirm()` submission gate. Result 19/20 (95%). |
| 17 | MCQ Blueprint Mock (Blueprint Practice Mock, 119Q) | PARTIALLY TESTED | 7/119 sampled (full 119Q ≈3hr not practical). Confirmed domain-weighted distribution and honest disclosure dialog. **Notable finding**: wall-clock-based timer survived a ~2.5hr real session gap correctly. Later ended early (deliberately, to test that workflow) with 112 auto-scored-wrong — correctly reflected in Dashboard/diagnostics, though this was a known, deliberate perturbation of "clean" stats, not a natural result. |
| 18 | Memo Practice | TESTED | One full realistic memo completed end-to-end (scenario→30-min timer→word count→structured writing→10-item self-review checklist, accurately scored 9/10→saved to history). Reviewer-rating control has a strong anti-self-inflation design. |
| 19 | Full CCP Simulation | NOT TESTED (setup only) | Confirmed honest setup dialog ("does not state an exact CCP-specific duration"). Full 5hr combined MCQ+memo session not attempted — not practical within remaining session time; an honest gap. |
| 20 | Final Week Mode | TESTED | 20/20 (100%). Draws broadly from calc-heavy/Hard content across chapters; reasonable given my near-perfect history but the "weak-domain-specific" targeting claim would need a learner with more real mistakes to fully verify. |
| 21 | Resume / persistence across reload | TESTED | Chapter Practice, Timed Mock, Blueprint Mock, Adaptive Practice, Study Plan, and Final Week Mode all correctly restore full state (question index, answers, flags, timer) after a full page reload — verified dozens of times, including across a ~2.5hr real-world gap. Memo Practice (pre-save) and Calculation Drill/Method Selection do NOT persist — see findings (inconsistent persistence). |
| 22 | Export / Import / Reset | NOT TESTED | Seen listed on the Performance Dashboard ("Export progress (JSON)", "Import progress (JSON)", "Reset all progress") but not exercised — correctly deferred per the task's own instruction to test reset behavior only at the very end, and this evaluation's remaining time went to higher-priority features instead. |
| 23 | Mobile / narrow viewport | TESTED | 390×844: Home, Chapter setup, and a live question+confidence screen all render cleanly. One minor cosmetic overlap found ("Mark for review" pill over 2-line question text). Overall a genuine strength. |
| 24 | Final visual sweep for missed features | PARTIALLY TESTED | "More tools"/"Advanced tools" accordions and the "Exam & Readiness" hub were both fully enumerated (all button labels captured) — no additional undiscovered top-level feature found beyond what's listed in this table. Did not re-sweep after the very last few actions of the session. |
| — | Blueprint Transfer Check (119Q, one-use) | NOT TESTED | Seen listed in the Exam & Readiness hub; explicitly a one-use permanent-consumption feature, deliberately not spent given it cannot be redone and the evaluation's time budget was prioritized elsewhere. |
| — | Pacing & Session History | NOT TESTED | Seen listed under Readiness Center; not opened. |

## Per-Chapter Coverage (Chapter Practice)

| Ch | Title | Qs bank | Status | Sampled | Score | Notes |
|---|---|---|---|---|---|---|
| 1 | Cost Elements | 24 | PARTIALLY TESTED | 10 | 9/10 | Direct/indirect, fixed/variable, code of accounts |
| 2 | Pricing & Costing | 20 | PARTIALLY TESTED | 5 | 5/5 | Markup vs margin, cost-price sequencing |
| 3 | Materials | 22 | PARTIALLY TESTED | 5 | 5/5 | EOQ, reorder point, mill cert, material classification |
| 4 | Labor | 34 | PARTIALLY TESTED | 5 | 5/5 | Loaded rate, weighted avg rate, OT fatigue fact |
| 5 | Engineering Role & Project Success | 13 | PARTIALLY TESTED | 5 | 5/5 | IP/patents, reengineering, front-loaded cost influence |
| 6 | Machinery, Equipment & Tools | 24 | PARTIALLY TESTED | 5 | 4/5 | Valuation terminology miss; dealer-pricing calc; **near-duplicate Q found (Issue 5)**; **leaked-annotation bug precursor (std dev "(reversed)")** |
| 7 | Economic Costs | 27 | PARTIALLY TESTED | 5 | 5/5 | Sunk cost, SL/DDB depreciation, incremental ROR, EUAC |
| 8 | Activity Based Cost Management | 17 | PARTIALLY TESTED | 5 | 5/5 | ABC allocation vs traditional, activity rate |
| 9 | Cost Estimating | 45 | PARTIALLY TESTED | 10 | 8/10 | Strong scenario+calc mix; allowance/contingency miss |
| 10 | Process Product Manufacturing | 29 | PARTIALLY TESTED | 10 | 10/10 | **Critical leaked-distractor-annotation bug found (Q4)**; break-even, MACRS, scaling exponent |
| 11 | Discrete Part Manufacturing | 29 | PARTIALLY TESTED | 5 | 5/5 | Concurrent engineering, tax/markup, prime cost, CAPP variant approach |
| 12 | Project Planning | 22 | PARTIALLY TESTED | 5 | 5/5 | Construction-driven scheduling, budget freeze, historical/physical data, WBS/OBS coding, contingency planning |
| 13 | Scheduling | 49 | PARTIALLY TESTED | 10 | 10/10 | CPM logic, float, leveling, recovery math |
| 14 | Earned Value Overview | 70 | PARTIALLY TESTED | 10 | 9/10 | Core EVM formulas, WBS/OBS, 50/50 rule miss |
| 15 | Performance & Productivity Management | 24 | PARTIALLY TESTED | 5 | 5/5 | Success Index, CWH, equivalent-units %complete (weighted, verified) |
| 16 | Project Management Fundamentals | 14 | PARTIALLY TESTED | 5 | 5/5 | PM history, Bean Counter Syndrome, F.T.-T.T. technique (fragile correct, low conf) |
| 17 | Project Organization Structure | 12 | PARTIALLY TESTED | 5 | 5/5 | CII study, lump-sum vs reimbursable staffing/contract fit |
| 18 | Project Communications | 36 | PARTIALLY TESTED | 5 | 5/5 | Audience tailoring, S-curves, cross-discipline reconciliation |
| 19 | Project Labor Cost Control | 32 | PARTIALLY TESTED | 5 | 5/5 | EV/CV/CPI from linear-foot unit rates (verified), labor $ derivation |
| 20 | Leadership & Management of Project People | 20 | PARTIALLY TESTED | 5 | 5/5 | Likert, McGregor X/Y, Maslow, Blake & Mouton grid |
| 21 | Quality Management | 9 | PARTIALLY TESTED | 5 | 5/5 | COQ multi-step calc (verified, 5%→8% profit), sporadic/chronic problems |
| 22 | Value Engineering | 11 | PARTIALLY TESTED | 5 | 5/5 | VE ROI ranges, FAST diagram, 4 value types (exchange value) |
| 23 | Contracting for Capital Projects | 30 | PARTIALLY TESTED | 5 | 5/5 | Contract formation/mistake doctrine, unit-price + quantity-variation clause |
| 24 | Strategic Asset Management | 13 | PARTIALLY TESTED | 5 | 5/5 | ROI/ROA, asset life cycle, influence curve, cost-reduction impact at scale |
| 25 | Change Management Practical Guide | 13 | PARTIALLY TESTED | 5 | 5/5 | Change-control sequencing, baseline discipline |
| 26 | Overview of Construction Claims & Disputes | 12 | PARTIALLY TESTED | 5 | 5/5 | Acceleration, Measured Mile, mediator authority, DSC claim support |
| 27 | Financial & Cash Flow Analysis | 30 | PARTIALLY TESTED | 10 | 10/10 | Strong engineering-economy coverage |
| 28 | Practical Corporate Investment Decision-Making Guide | 22 | PARTIALLY TESTED | 5 | 5/5 | NPV (verified), ROCE, Capex/unit, cash-flow 3-way split |
| 29 | Statistics & Probability | 38 | PARTIALLY TESTED | 10 | 10/10 | Strongest calc chapter; leaked-annotation precursor "(reversed)" |
| 30 | Optimization | 14 | PARTIALLY TESTED | 5 | 5/5 | **LP graphical solution fully vertex-verified twice (min-cost and max-profit)** — both non-trivial, both confirmed correct |
| 31 | Risk Management Fundamentals | 22 | PARTIALLY TESTED | 5 | 5/5 | Contingency calc, decision-tree EMV (4 paths verified), expected cost |
| 32 | Risk Management Practical Guide | 22 | PARTIALLY TESTED | 5 | 5/5 | 3-point EV, QRA interpretation, EMV, TCM/TQM relationship |
| 33 | Total Cost Management Overview | 11 | PARTIALLY TESTED | 5 | 4/5 | **Genuine miss**: confused project-lifecycle terms (Ideation/Planning/Execution/Closure) with asset-lifecycle terms (Ideation/Creation/Operation/Modification/Termination) — good real learning-transfer moment across Q1→Q3 |
| 34 | The International System of Units (SI) | 20 | PARTIALLY TESTED | 5 | 5/5 | Unit conversions (all independently verified), SI history, mass vs weight |

**All 34 chapters now have representative coverage.** Total bank size
across all 34 chapters: 830 questions (confirmed via "All chapters" filter
pool count). 195 total Chapter Practice questions answered across all 34
chapters + 6 Wrong-Answers-Review retries. No chapter is FULLY TESTED yet
(Official Questions / Apply / Mastery / Challenge / Retention tiers remain
essentially untouched beyond Ch.1's initial look) — "PARTIALLY TESTED" is
accurate for every row above.

## Infrastructure / harness status (for resumption, not app coverage)

| Item | Status |
|---|---|
| Playwright (`playwright` npm package) available globally | CONFIRMED WORKING |
| Chromium browser binary present (`/opt/pw-browsers/chromium`) | CONFIRMED PRESENT |
| Persistent-context harness (state survives across script runs) | BUILT, in `scratchpad/pw-harness/` (run.js + action.js pattern, profile dir for cookies/localStorage) |
| Network path to target host | BLOCKED by session egress policy (see checkpoint) |
