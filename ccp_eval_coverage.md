# CCP Evaluation — Feature Coverage Matrix

Legend: TESTED / PARTIALLY TESTED / NOT TESTED / BLOCKED
(Opening a page alone never counts as TESTED.)

| # | Feature | Status | Notes |
|---|---|---|---|
| 0 | Live app reachability (network smoke test) | BLOCKED | Egress policy in this environment returns 403 for `rococo-daifuku-1076a2.netlify.app` and every other non-allowlisted host tested. See checkpoint. |
| 1 | Home / first-time experience | NOT TESTED | Never reached |
| 2 | Chapter Practice (all chapters) | PARTIALLY TESTED | See per-chapter table below. |
| 3 | Random Practice | NOT TESTED | Never reached |
| 4 | Calculation Drill | NOT TESTED | Never reached |
| 5 | Generated Practice | NOT TESTED | Never reached |
| 6 | Fresh Challenge (all levels) | NOT TESTED | Never reached |
| 7 | Wrong Answers Review | TESTED | 2 full retry rounds (3 Qs each) from 2 entry points; confirmed reshuffled choices, correct-on-retry scoring, "Clean sweep" messaging |
| 8 | Error Notebook / Notes / Bookmarks | PARTIALLY TESTED | Error Notebook opened, HIGH severity bug found (stale "currently missed" count, see findings). Bookmark/Mark-for-review/Topics-to-Relearn/My-Final-Review not yet exercised |
| 9 | Weakness Report | TESTED | Full confidence×correctness matrix, root-cause distribution, domain/difficulty breakdown all hand-verified against my own answer log — exactly correct |
| 12 | Performance Dashboard | TESTED | 230 attempts, 97% accuracy; hand-verified totals (attempts/correct/incorrect/fragile) all matched exactly; Blueprint task coverage (76 tasks) is a standout feature; honest "Training Readiness 85" penalized for no mock + thin bank coverage despite 97% raw accuracy |
| — | Readiness Center (hub) | TESTED | Training Readiness (85) vs Unseen-Test Readiness (—, not yet activated) cleanly separated; genuinely sophisticated "cold/Lab-exposed" question tracking per chapter and per Blueprint domain with exact quotas for a strict 119Q cold mock — standout feature |
| — | Unseen Evidence & Exam Readiness | TESTED | Full sealed-static-pool accounting (341/830 Lab-exposed, 216 seen, 410 cold-eligible); per-chapter and per-domain cold-test availability; explicitly refuses to "pretend a recycled training mock is unseen evidence" — strong integrity signal |
| — | Chapter Progress & Mastery | TESTED | **Found HIGH-severity inconsistency**: shows "Training: 100%" for 4 chapters that the Performance Dashboard (same attempt counts) shows at 92%/87%/83%/83% — see ccp_eval_findings.md |
| 22 | Today's Study Plan | TESTED | 19-question mission = 3 due-review (my actual past misses) + 5 calc/hard application-tagged + rest reused-but-relevant chapter content; correctly prioritized my real weak items first |
| 10 | Adaptive Practice | NOT TESTED | Never reached |
| 11 | Formula Lab | NOT TESTED | Never reached |
| 12 | Performance Dashboard | NOT TESTED | Never reached |
| 13 | Study Plan | NOT TESTED | Never reached |
| 14 | Retention / Mastery indicators | NOT TESTED | Never reached |
| 15 | Readiness indicators | NOT TESTED | Never reached |
| 16 | Timed Mock | NOT TESTED | Never reached |
| 17 | MCQ Blueprint Mock | NOT TESTED | Never reached |
| 18 | Memo Practice | NOT TESTED | Never reached |
| 19 | Full CCP Simulation | NOT TESTED | Never reached |
| 20 | Final Week Mode | NOT TESTED | Never reached |
| 21 | Resume / persistence across reload | NOT TESTED | Never reached |
| 22 | Export / Import / Reset | NOT TESTED | Never reached |
| 23 | Mobile / narrow viewport | NOT TESTED | Never reached |
| 24 | Final visual sweep for missed features | NOT TESTED | Never reached |

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
