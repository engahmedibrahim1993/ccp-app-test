# CCP Exam Coach — End-to-End Human Use Stress Test — Final Report

## 1. Executive Verdict

**PASS WITH MINOR FIXES — corrected and regression-tested.**

Three real, confirmed defects were found in the learner journey / state-transition layer (all in the Blueprint/Mastery/Retention orchestration code added across the v5.6–v5.13 patch series, not in question content, scoring, or thresholds). All three were fixed with the smallest possible, surgical changes, verified individually, and the full existing regression/integrity suite plus every persona was re-run clean afterward.

## 2. User Journey Results (10 Personas)

| # | Persona | Result | Notes |
|---|---|---|---|
| 1 | Brand-new user | **PASS** | Empty-progress landing is unambiguous ("Start Chapter 1 Practice"), Study Plan correctly refuses to test unstudied material, no broken/empty cards, no NaN/undefined text anywhere. |
| 2 | Normal successful learner | **PASS** | Full chain Practice → Official Study Guide → Apply → Mastery → Challenge → 5-day wait → Retention → Retained verified end-to-end via real UI entry points; status, CTA, and chapter-card wording matched at every one of 8 checkpoints; no stage was reachable early, no completed stage ever un-completed. |
| 3 | Retention-wait / multi-chapter concurrency | **PASS** | Learner is explicitly told "Continue with Ch.X While Retention Waits" during the 5-day window (not blocked); multiple chapters can be mid-pipeline simultaneously without cross-contamination once the Fix-1 pool-isolation bug (below) was corrected. |
| 4 | Weak learner | **PASS** | A chapter at 33% accuracy never gets recommended into Apply/Mastery/Challenge/Blueprint Mock; Fix Weak Areas' adaptive pool puts 100% of the chapter's flagged weak questions in the top 10 of the queue; fixing them correctly clears weak status. |
| 5 | High-Confidence-Wrong misconception lifecycle | **PASS** | Full lifecycle verified live: Wrong+High flags immediately → same-question correct retry does **not** clear it (confirmed via code and live test) → a different-question Low-confidence correct also does **not** clear it → a different-question Medium/High-confidence correct **does** clear it, and Training Readiness recovers accordingly. On a chapter that has already reached provisional/retained/due, an unresolved misconception correctly overrides the chapter's own next-step to "Resolve Chapter X Misconception," identical to Today's recommendation. |
| 6 | Fragile Knowledge | **PASS** | Correct+Low is tracked separately from wrong/misconception, causes zero numeric Training Readiness penalty, and is cleared by one fresh different-question Medium/High-confidence correct answer. |
| 7 | Interrupted user | **PASS** | Chapter Practice, Timed Mock, and Blueprint Mock all persist and resume exactly (queue order, index, and results) across a real browser reload via the same generic session mechanism; Full Simulation's separate persistence was already re-verified in the prior AACE-alignment session. Discard correctly leaves no ghost session in storage. |
| 8 | Out-of-order user | **PASS after fix** | Challenge-before-Apply is blocked at both the UI (disabled button) and function level (explicit `allowOutOfOrder` guard) with a clear message. Retention-before-due is unreachable through any UI surface. Repeatedly restarting one-use tests fails closed with a clear, specific error once the pool is exhausted. **One real gap found and fixed**: starting an Apply/Challenge/Retention Test while a Chapter Practice/Mock/Full-Simulation session was already paused was silently allowed instead of being blocked (see P1-1 below) — now blocked with the same message already used for Mastery/Cold/Repair. |
| 9 | Heavy mock user | **PASS** | 3 consecutive Blueprint Mocks: mock history count correct (3), zero cross-mock duplicate questions across 357 attempts, all attempts correctly tagged `training` (never misfiled as Cold/independent evidence), readiness `mockAvg` correctly reflects all three. Cold-eligible count for the touched chapter correctly and transparently drops as static questions get exposed — this is the app's documented, intentional "permanent seen-ledger" behavior, not a bug. |
| 10 | Near-exam user | **PASS** | Final Week banner appears exactly at the ≤10-day threshold; Final Week's question pool correctly front-loads an unresolved misconception's exact question into position 3 of 560; Today still correctly prioritizes fixing the misconception over generic Final Week content — no competing recommendation. |

## 3. State-Transition Matrix

**Chapter-level states** (`chapterMasteryStatus(ch).key`):

| State | Allowed next actions | Blocked actions | Recommended action (CTA) | Condition to leave state |
|---|---|---|---|---|
| Not Started (`developing`, label "Not Started") | Chapter Practice | Everything else (not offered) | Continue Chapter Practice | `chapterTrainingGate` starts accumulating evidence |
| Learning / Practice Complete / Practice Almost Complete (`developing`) | Chapter Practice, Official Study Guide | Apply Test (not offered until both gates below pass) | Continue Practice → Complete Official Questions | Practice gate (≥8 unique Q, ≥80%, ≥4 topics) **and** Official Study Guide (≥80%) both pass |
| Applied (`transfer`) | Mastery Test (Cold if ≥8 cold-eligible, else Internal Mastery) | Challenge Test (disabled until Mastery passes; also function-level guarded) | Start Mastery Test | `strongFoundationPass` (Cold ≥80%, Independent ≥80%, or Internal Mastery ≥85% on the full required count, closed-book attested) |
| Developing / post-Mastery (`developing`) | Challenge Test | Retention Test (not offered before due) | Start Challenge Test | `l3ClosedTransferPass` (≥75%, closed-book attested) |
| Provisional Mastery (`provisional`) | Continue any other chapter (explicitly recommended: "Continue with Ch.X While Retention Waits") | Retention Test (not offered until due) | Continue with next chapter while waiting | 5 days elapsed since the Mastery+Challenge baseline |
| Retention Due (`due`) | Retention Test | — | Start Retention Test | Pass ≥80% closed-book |
| Retention Gap (`failed`) | Repair (misconception-weighted adaptive practice on the chapter) → then Retention Test retry | Retention retry (only until at least one repair practice attempt is logged — **fixed in this pass**, see P0-3) | Repair Chapter X → then Start Retention Test | Repair once, then pass a delayed retest ≥80% closed-book |
| Retained (`retained`) | Any (chapter is closed); can still re-enter `retestRequired` if a fresh HCW misconception occurs | — | Move to next chapter | Terminal, unless a new unresolved misconception reopens it |
| Retest Required (`retestRequired`, overlay on provisional/due/retained) | Fix the misconception via Fix Weak Areas (adaptive, misconception-boosted) | — | Resolve Chapter X Misconception | A **different** question, same skill, correct, confidence medium/high |

**Cross-cutting, skill/question-level states** (independent of chapter stage):

| State | Allowed next actions | Recommended action | Condition to leave state |
|---|---|---|---|
| Weak question (`weakQuestionIds`) | Any further practice | Fix Weak Areas | A correct answer restores accuracy |
| Unresolved misconception (`mreUnresolvedMisconceptions`) | Any activity, but Today/Study Plan/Final Week all refuse to recommend anything else first | Fix This Now (adaptive, misconception-boosted) | A **different** question, same skill, correct, confidence medium/high (same-question retries and low-confidence correct answers are explicitly excluded by design) |
| Fragile knowledge (`mreFragileSkills`) | Any activity (no forced action, informational only) | — | A different question, same skill, correct, confidence medium/high naturally becomes the new "latest" evidence |

No unreachable states were found. Every state above was actually driven into and out of via real UI entry points during this audit (including, after the fix, the previously-unreachable "Retention Gap → repaired → retry → Retained" transition).

## 4. Confirmed Problems

### P0 — BLOCKERS (all fixed and re-verified this pass)

**P0-1 — Failing a Retention Test permanently stranded the chapter.**
- **Observed:** After a delayed Retention retest scored below 80%, `chapterMasteryStatus` correctly returned `'failed'` ("Retention Gap"), and `chapterExitNextAction` correctly offered "Repair Chapter X." But "Repair" only ever launched ordinary adaptive practice (`recordAttempt`-based, no new Delayed Retest evidence). Since `chapterMasteryStatus`'s `'failed'` branch is driven purely by whether the *latest* delayed-retest evidence record scored <80%, and no new such record was ever created, the chapter could never leave `'failed'` — the app would recommend "Repair Chapter X" forever, with no path back to "Start Retention Test." Live-reproduced: a repaired chapter stayed stuck at `key:'repair'` indefinitely.
- **Expected:** After repairing, the learner should be offered a genuine retry of the Retention Test, exactly as the existing "Repair Chapter" hint text already promises ("repeat the delayed retention check").
- **Root cause:** `chapterExitNextAction`'s `f.mastery.key==='failed'` branch (the one live copy, inside the function reassigned at the line beginning `chapterExitNextAction=function(ch){` that starts with `if(!f.gate.pass)...`) unconditionally returned `key:'repair'` with no check for whether a repair attempt had since occurred.
- **Function(s) involved:** `chapterExitNextAction` (the `'failed'` branch); relies on existing `latestOfflineTransferRetest`, `PROGRESS.attempts`.
- **Fix:** When status is `'failed'`, check whether any non-cold attempt on the chapter has occurred *after* the failed retest's timestamp; if so, return `key:'retention'` (the exact same, already-validated retry mechanism used for `'due'`) instead of `key:'repair'` again. No threshold, no content, no other gate touched.
- **Verified:** Live fail → repair → retry → **Retained** confirmed end-to-end after the fix; 78/78 regression, 58/58 integrity, 50/50 Blueprint Mock stress, Full Simulation all still pass.

**P0-2 — Internal Mastery Test could silently strand 12% of chapters at "Challenge Test still required" forever.**
- **Observed:** Following the app's own recommended path (Practice → Official Study Guide → Apply → Mastery [Cold if available, else Internal Mastery] → Challenge) across all 34 chapters, 4 of them (Ch.3, Ch.6, Ch.7, Ch.20 — all chapters where Cold Certification wasn't available, forcing the Internal Mastery fallback) ended up permanently unable to start Challenge, with the pre-flight check alerting "Fewer than five unexposed Challenge cases remain" every time, and `chapterExitNextAction` perpetually recommending "Start Challenge Test" — an action guaranteed to keep failing.
- **Expected:** Mastery, Apply, Challenge, and Retention should each protect their own one-use evidence pool without silently eating into a sibling stage's reserve.
- **Root cause:** `v57PriorSourceKeys(ch)` (feeding `v510PairPlan`/`v510StageAvailability`/`v510BuildStagePack`, the actual availability/pack-building path for Apply/Challenge/Retention) aggregated consumed source keys across *every* stage recorded in `PROGRESS.v57PackHistory`, including `'mastery'`. Since Internal Mastery falls back to the same native/curated/supplement/dynamic question sources as Apply/Challenge/Retention whenever a chapter has no curated 10-question Human Mastery Bank pack, completing Mastery could silently consume the exact source concepts Challenge needed, dropping its reserve below the built-in 5-case safety floor — with no expiry and no recovery short of a full Reset.
- **Function(s) involved:** `v510PriorSourceKeys(ch)`.
- **Fix:** `v510PriorSourceKeys` now excludes `'mastery'`-stage history when computing what Apply/Challenge/Retention have already consumed. Mastery's own pack-building is untouched (it still calls the original, unfiltered history directly), so its own one-use protection — including against repeating items from a prior Mastery attempt — is fully intact.
- **Verified:** All 34 chapters (including the 4 previously-stranded ones) now reach `provisional` following the exact same recommended-path test; a controlled two-attempt Mastery test on the same chapter produced zero item overlap between attempts (one-use protection intact); full regression suite clean.

**P0-3 — (Same underlying defect as P0-1; listed once above, not double-counted.)**

### P1 — IMPORTANT (fixed this pass)

**P1-1 — Concurrent-scored-session guard silently bypassed for Apply/Challenge/Retention.**
- **Observed:** The app blocks starting Mastery, Cold Certification, or Repair while another session/Full Simulation is paused (clear alert: "You already have a paused exam/session..."). But a later patch (`V510_BASE_RUN_EXIT`) that improved Apply/Challenge/Retention's evidence-pool sizing intercepts those three keys *before* the code path that contains this guard is ever reached — so starting an Apply, Challenge, or Retention Test while another session was paused was silently allowed with no warning.
- **Consequence assessed:** Because `FRESHCHALLENGE` (the Apply/Challenge/Retention/Mastery state) and `SESSION`/`ACTIVE_SESSION_KEY` (ordinary practice/mocks) are fully independent storage, this did **not** corrupt or lose the original paused session — verified live: the original session resumed with identical queue, index, and results afterward. Classified P1 (inconsistent, silently-bypassed protection) rather than P0 (no data loss).
- **Function(s) involved:** `runChapterExitAction` (the override beginning `ch=String(ch);key=String(key);const a=v510StageAvailability(ch);`).
- **Fix:** Added the same guard/message already used elsewhere, at the top of this override, covering the three keys it handles directly.
- **Verified:** Live reproduction now shows the alert and correctly refuses to start, leaving the paused session's view untouched.

### P2 — MINOR (reported, not changed)

**P2-1 — "Needs Another Look" label is shared by two different underlying causes.**
`studentChapterState()` maps both `'failed'` (Retention Gap) and `'retestRequired'` (unresolved misconception) to the same displayed label, "Needs Another Look," on the Progress chapter list. The specific, correct guidance is still given correctly by the chapter's own "Next:" button and by Today in both cases — this is a label-only ambiguity, not a functional one. Not changed, since it's cosmetic and outside the "smallest safe fix" scope for a behavioral audit.

**P2-2 — Early-stage chapter's own "Next:" button doesn't route through misconception-prioritized practice.**
When an unresolved HCW misconception occurs on a chapter that hasn't yet reached provisional/retained/due, Today (and Study Plan, and the Progress readiness drivers) correctly make "Resolve Chapter X Misconception" the top, most prominent recommendation. But the *same chapter's own* Chapter Progress card — rendered directly beneath that banner on the Home screen, and reachable again via drilldown — still shows "Next: Continue Chapter X Practice," which routes to plain (non-adaptive) practice that doesn't specifically prioritize the flagged skill. A learner who acts on the chapter card instead of the top banner gets a materially slower, non-targeted repair path, though the same screen's "Why am I not mastered yet?" note does still mention the misconception. Once a chapter reaches provisional/retained/due, this is fully consistent (the `retestRequired` overlay makes both surfaces agree). **Not changed** — extending the `retestRequired` treatment to early-stage chapters is a legitimate design option but a judgment call about desired behavior (e.g., should ordinary Chapter Practice ever be blocked/redirected mid-gate?) rather than an unambiguous correctness bug, so it is reported here rather than silently altered.

## 5. Changes Made

| # | File | Function | Before → After | Reason |
|---|---|---|---|---|
| 1 | `CCP_Exam_Coach_FINAL_MEMO_VALIDATED.html` | `v510PriorSourceKeys(ch)` | `return v57PriorSourceKeys(String(ch));` (included `'mastery'`-stage history) → filters out `h.stage==='mastery'` when aggregating consumed source keys | Stop Mastery's evidence consumption from silently starving Apply/Challenge/Retention's shared reserve (P0-2) |
| 2 | same | `runChapterExitAction` (v5.10 override) | No paused-session check before handling `'transfer'`/`'l3'`/`'retention'` → added the same guard/alert already used for `'sealedstrong'`/`'cold'`/`'repair'` | Restore consistent, non-silent blocking of concurrent scored assessments (P1-1) |
| 3 | same | `chapterExitNextAction` (`f.mastery.key==='failed'` branch) | Always returned `key:'repair'` → returns `key:'retention'` (genuine retry) once at least one post-failure practice attempt is logged, otherwise still `key:'repair'` first | Close the "Retention Gap" dead end so a failed chapter can reach Retained again (P0-1) |

No question content, wording, options, correct answers, explanations, calculation solutions, Blueprint percentages/task mapping, mastery thresholds, retention thresholds, or psychometric quality gates were touched. Total diff: 39 insertions, 3 deletions, confined to the three functions above.

## 6. Regression Results

- **Established 78-test regression suite:** 78/78 PASS (Engine 36/36, Core 12/12, Targeted UX 13/13, Live Pipeline 17/17) — run twice, before and after all fixes.
- **Built-in `integrityResults()` self-test suite:** 58/58 PASS, zero failures — run before and after.
- **Question bank:** 830/830 questions, 830 unique IDs, unchanged before/after.
- **Blueprint Mock stress test:** 50/50 runs, exact 43/29/13/20/6/8 domain split every run, zero duplicate question IDs — run before and after.
- **Full CCP Simulation:** 119 MCQs + 1 memo, official scoring card and 6-domain Blueprint correctly shown as distinct, zero errors.
- **Full successful-chapter journey (Persona 2):** re-run after all fixes, identical Retained outcome and consistent Today/Chapter-Progress text at every one of 8 checkpoints.
- **34-chapter recommended-path stress test:** 0/34 chapters stuck after the fix (was 4/34 before).
- **Fail → repair → retry → Retained cycle:** now completes successfully (previously stuck indefinitely at "Repair Chapter").
- **Concurrent-session guard:** now correctly blocks and alerts; original paused session verified to resume with identical queue/index/results afterward.
- **Console/runtime errors across every test in this audit: 0.**

No existing regression test was deleted, relaxed, weakened, or bypassed to obtain these results.

## 7. Unnecessary / Redundant Features

`No unnecessary feature removal recommended.` Every screen audited (Today, Study, Fix Weak Areas, Exam Practice, Progress, More, Study Plan, Chapter Practice, Official Questions, Apply, Mastery, Challenge, Retention, Weakness Report, Readiness Center, Blueprint Mock, Timed Mock, Unseen Chapter Test, Full Simulation, Memo Practice, Final Review, Backup/Data management) serves a distinct, non-overlapping purpose; where two screens look similar (Blueprint Mock vs. Blueprint Transfer Check; My Final Review vs. Post-Exam Diagnostic vs. Mock History), the app already clearly differentiates them in its own copy and this was verified not to cause confusion in the tested journeys.

## 8. Missing Essential Capability

None identified. Every stage a learner needs — from first chapter practice through Official Study Guide, Apply, Mastery, Challenge, Retention, weak-area repair, misconception resolution, mock exams, memo practice, full simulation, and final review — is reachable and (after this pass's fixes) completable end-to-end without needing a capability the app doesn't have.

## 9. Final Human-Use Question

**If I give this application to a learner with no explanation, can they successfully use it from their first study session through final exam preparation without needing me to explain the system?**

**YES**, based on actual tested behavior (not design intent), now that the three fixes are in place. Before this pass, the honest answer would have been **NO** for two concrete, reproducible reasons: a chapter could get permanently stuck if the learner ever failed a single Retention Test (a routine, expected occurrence at an 80% bar), and roughly 1 in 8 chapters could get permanently stuck at Challenge Test purely from following the app's own recommended Mastery path — both silent, unrecoverable-without-losing-all-progress dead ends that no amount of learner effort could resolve. With those closed, every tested persona and edge case completed its journey using only the guidance already on screen: Today always states one obvious next action, Study Plan/Final Week/Readiness Center never contradict it, gates block cleanly with clear explanations rather than failing silently, and interrupted sessions resume exactly where they left off.
