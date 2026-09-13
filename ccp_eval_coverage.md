# CCP Evaluation — Feature Coverage Matrix

Legend: TESTED / PARTIALLY TESTED / NOT TESTED / BLOCKED
(Opening a page alone never counts as TESTED.)

| # | Feature | Status | Notes |
|---|---|---|---|
| 0 | Live app reachability (network smoke test) | BLOCKED | Egress policy in this environment returns 403 for `rococo-daifuku-1076a2.netlify.app` and every other non-allowlisted host tested. See checkpoint. |
| 1 | Home / first-time experience | NOT TESTED | Never reached |
| 2 | Chapter Practice (all chapters) | NOT TESTED | Never reached |
| 3 | Random Practice | NOT TESTED | Never reached |
| 4 | Calculation Drill | NOT TESTED | Never reached |
| 5 | Generated Practice | NOT TESTED | Never reached |
| 6 | Fresh Challenge (all levels) | NOT TESTED | Never reached |
| 7 | Wrong Answers Review | NOT TESTED | Never reached |
| 8 | Error Notebook / Notes / Bookmarks | NOT TESTED | Never reached |
| 9 | Weakness Report | NOT TESTED | Never reached |
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

## Infrastructure / harness status (for resumption, not app coverage)

| Item | Status |
|---|---|
| Playwright (`playwright` npm package) available globally | CONFIRMED WORKING |
| Chromium browser binary present (`/opt/pw-browsers/chromium`) | CONFIRMED PRESENT |
| Persistent-context harness (state survives across script runs) | BUILT, in `scratchpad/pw-harness/` (run.js + action.js pattern, profile dir for cookies/localStorage) |
| Network path to target host | BLOCKED by session egress policy (see checkpoint) |
