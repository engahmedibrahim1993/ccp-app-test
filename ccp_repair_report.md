# CCP Exam Coach — Controlled P0/P1 Repair + Regression Validation Report

**Scope:** Fix ONLY the 4 confirmed P0/P1 issues from the completed Human Student Evaluation, verify via targeted browser regression, produce one traceable final build. No feature work, no redesign, no unrelated changes.

---

## 1. Scope Confirmation

This repair pass addressed exactly these 4 confirmed issues and nothing else:

| ID | Severity | Issue |
|---|---|---|
| P0-A | CRITICAL | Distractor/author-rationale text leaking into visible answer choices (e.g. "(mistakenly halving the correct result)", "(reversed)", "(30% instead of 70%)", "(infeasible)") |
| P0-B | HIGH | Performance Dashboard and Chapter Progress & Mastery show different accuracy numbers for the same chapter, with no explanation |
| P1-A | HIGH | Error Notebook kept counting a question as "currently missed" even after it was later answered correctly |
| P1-B | HIGH | Some "Substitute and calculate" feedback steps contained only narrative prose, no actual numeric substitution |

No other item from the prior evaluation (`ccp_eval_findings.md`, `ccp_eval_content_issues.md`) was touched. Explicitly **not** done, per instructions: UI redesign, question-bank rewrite, Formula Lab expansion, new study modes, Adaptive Practice/Weakness Report/Memo Practice redesign, mock architecture changes, new analytics, unrelated autosave, global WHY-WRONG behavior changes, cosmetic cleanup, typography/layout changes, difficulty rebalancing, unrelated answer-key changes, or any P2/P3 recommendation.

---

## 2. Git / Working Tree Safety

- Branch verified before any change: `claude/ccp-exam-prep-eval-48nukj` (matches the required branch exactly — no switch performed).
- `git status --short` before any edit: clean working tree, no pre-existing modified/staged/untracked files.
- No destructive git commands were used at any point (`git reset --hard`, `git clean -fd`, `git checkout -- .`, `git restore .` were never run).
- No blanket `git add .` was used; only the specific intended files are staged for commit (verified below in Section 11).
- No merge to `main`, no automatic PR, no history rewrite.

**Pre-final-commit verification:**
```
$ git status --short
 M CCP_Exam_Coach_FINAL.html
?? CCP_Exam_Coach_FINAL_FIXED.html
?? CCP_Exam_Coach_PRE_REPAIR.html
?? ccp_repair_report.md

$ git branch --show-current
claude/ccp-exam-prep-eval-48nukj

$ git diff --stat CCP_Exam_Coach_FINAL.html
 CCP_Exam_Coach_FINAL.html | 38 +++++++++++++++++++++++++++-----------
 1 file changed, 27 insertions(+), 11 deletions(-)
```
Only the 4 files listed above are touched — matching exactly what this repair pass was expected to produce (1 modified source file, 2 new build artifacts, 1 new report). No unrelated pre-existing file was reverted, staged, or altered.

**Backup/build safety:**
- `CCP_Exam_Coach_FINAL.html` confirmed present before any edit.
- `CCP_Exam_Coach_PRE_REPAIR.html` created as an untouched copy **before** any repair, and verified byte-identical to the pre-repair original via SHA-256 at backup time (`1a6f4292...` — see Section 11). It has not been modified since.
- All repairs were made only in `CCP_Exam_Coach_FINAL.html`.
- `CCP_Exam_Coach_FINAL_FIXED.html` was created only after all 4 fixes passed regression, as a plain copy of the fully-repaired `CCP_Exam_Coach_FINAL.html`, then independently browser-verified as its own exact file (Section 11). It has not been edited since that verification, so its SHA-256 remains valid.

---

## 3. P0-A — Distractor/Rationale Leakage Into Visible Answer Choices

### Method
1. Extracted the **true runtime question bank** via live Playwright evaluation of `window.QUESTIONS.length` (not static source parsing), because two IIFEs (`v522InstallTaskReserve`, and a V524 analogue) append ~128 template-generated Blueprint-task questions to the static 702-entry array at page load. **Actual live bank size: 830 questions, confirmed both before and after the repair** — this is not a bug, it is the real total (702 static + 128 runtime-generated), and it is unchanged by this repair.
2. Ran a keyword scan across every option of every question (830 questions × 4 options = **3,320 options scanned**) for rationale-leak vocabulary (`reversed`, `instead of`, `infeasible`, `mistakenly`, `halving`, `swapped`, etc.) — **46 raw hits** before the fix.
3. Because a keyword list alone is not a complete audit, ran a second, broader structural scan for **every option containing any parenthetical text** — **179 instances** before the fix — and manually reviewed each one with full question-stem context.
4. Classified every flagged item as: **CONFIRMED LEAK** (the parenthetical reveals the specific mechanism by which a wrong option was derived from/relates to the correct one — e.g. "the two values reversed", "instead of 70%", "mistakenly halving") vs. **LEGITIMATE** (self-evident from the option's own stated numbers, a directly-stated input from the stem, a unit/acronym clarification, or plausible in-universe distractor content that does not reveal correctness).

### Result of the full-bank audit
- **Total questions in live bank:** 830 (confirmed via runtime evaluation, not hard-coded)
- **Total options scanned:** 3,320
- **Confirmed leaks found and fixed:** **9**
- **Suspicious-but-legitimate items reviewed and retained:** 209 total (170 parenthetical-content items + the 39 keyword hits not already counted among them), all manually inspected with full question context; every one was found to be either self-evident from the option's own numbers/stem, a unit/acronym clarification, parallel/symmetric descriptive text applied evenly across all options, or legitimate in-universe distractor bait that does **not** reveal which option is correct.
- **Ambiguous items requiring further manual/SME review after this pass: 0.** (All 209 candidates were resolved to "legitimate" on inspection; none were left in an undetermined state.)

### The 9 confirmed leaks (before → after)

| Question ID | Chapter | Option | Before | After |
|---|---|---|---|---|
| 4-31 | 4 | opt#2 | `CPI = 0.951, SPI = 0.935 (reversed)` | `CPI = 0.951, SPI = 0.935` |
| 8-17 | 8 | opt#0 | `Traditional = $42,000; ABC/M = $30,000 (reversed)` | `Traditional = $42,000; ABC/M = $30,000` |
| 10-16 | 10 | opt#1 | `$2,880,000 (30% of capacity instead of 70%)` | `$2,880,000` |
| 10-16 | 10 | opt#2 | `$3,360,000 (mistakenly halving the correct result)` | `$3,360,000` |
| 13-31 | 13 | opt#1 | `Total Float = 0 days, Free Float = 13 days (the two values reversed)` | `Total Float = 0 days, Free Float = 13 days` |
| 27-14 | 27 | opt#1 | `Receipts are represented by downward arrows, and disbursements by upward arrows (the reverse convention)` | `Receipts are represented by downward arrows, and disbursements by upward arrows` |
| 27-11 | 27 | opt#0 | `Intangibles, and quantifiable outcomes, respectively (the reverse pairing)` | `Intangibles, and quantifiable outcomes, respectively` |
| 29-23 | 29 | opt#2 | `Variance≈5.70, Std Dev≈32.46 (reversed)` | `Variance≈5.70, Std Dev≈32.46` |
| 30-8 | 30 | opt#3 | `X1=60, X2=0, max profit=$1,500 (infeasible)` | `X1=60, X2=0, max profit=$1,500` |

Each replacement was applied only after verifying the exact "before" string occurred **exactly once** in the file, using an exact non-regex string substitution — no JSON structure, index, or correct-answer pointer was touched.

### Post-fix verification
- Re-extracted the live runtime bank: still **830** questions (no structural change).
- Re-ran the keyword scan: **39** hits remain (46 − 7 that matched the literal word "reversed"; the other 2 fixes used "the reverse convention"/"the reverse pairing" and were not in the original keyword list) — every one of the 39 manually re-reviewed and confirmed legitimate (see Section 7, Test 1).
- Direct string search for all 9 original leaked substrings across the full runtime bank: **0 remaining matches**.
- Static `QUESTIONS` literal re-parsed as valid JSON, still 702 entries — no corruption.

---

## 4. P0-B — Conflicting Chapter Accuracy Numbers (Dashboard vs. Mastery)

### Root cause (traced, not assumed)
Two **independent, non-duplicated** functions feed the two screens:

- **Dashboard → "Chapters" list** calls `chapterStats()` (`CCP_Exam_Coach_FINAL.html:762`), which computes **all-attempts accuracy**: every recorded attempt on every question in the chapter counts, including repeat attempts on the same question. `pct = correct / total` over the raw attempt log.
- **Chapter Readiness & Evidence → "Training: X%"** calls `chapterStaticStats()` → `chapterTrainingGate()` (`:6819`, `:6804`), which computes **latest-attempt-per-unique-question accuracy**: attempts are deduplicated down to the single most recent attempt per question ID, then `pct = correct / unique`, additionally gated by minimum unique-question and topic-coverage requirements used elsewhere for the Practice → Apply → Mastery pipeline.

(Note: `chapterStaticStats`/`chapterMasteryStatus` are each declared twice in the file due to a later decorator-style reassignment; only the second/winning declaration is reachable at runtime. This duplication is pre-existing and was traced but not touched, since the winning definitions are correct and already used consistently.)

**Verdict: Case B — two different, individually legitimate metrics**, not a duplicated-formula bug. Forcing them to match would either break the verified Mastery-gate logic (used for the Practice → Apply → Mastery Test pipeline) or make the Dashboard's plain progress count worse. Per the task's explicit decision rule, the fix is **honest, implementation-accurate labeling**, not silent unification.

### Fix applied
- Dashboard "Chapters" card (`renderDashboard`, line ~3274): header changed from `Chapters` to **`Chapters — All Attempts`**, and the sub-line now reads: *"...This accuracy counts every attempt on every question, including repeats. It is a different metric from the 'Training gate' percentage shown on the Chapter Readiness & Evidence page, which counts only each question's latest attempt and requires minimum coverage."*
- Chapter Readiness & Evidence page (`renderEvidence`, line ~6172): the per-chapter label changed from `Training:` to **`Training gate (latest attempt/question):`**.

No calculation logic was changed anywhere — only the two labels/explanatory text. `chapterStats()`, `chapterTrainingGate()`, and everything the Mastery pipeline depends on are untouched.

### Verification (live, rendered)
After generating real attempt history in Chapter 3 (12 total attempts, 3 correct on their most-recent-attempt-per-question basis differing from the raw count):
- Dashboard rendered: **`Ch.3 — Materials` / `25% (3/12)`** under the **`Chapters — All Attempts`** header.
- Chapter Readiness & Evidence rendered: **`Training gate (latest attempt/question): 27% across 12 attempts`** for the same chapter.

The two numbers (25% vs. 27%) now visibly differ for the same chapter, and each is now attached to a precise, honest label explaining what it measures — directly resolving the "conflicting values with no explanation" complaint without touching either underlying calculation.

---

## 5. P1-A — Error Notebook Keeps Counting Corrected Questions as "Missed"

### Root cause (traced, reproduced before fixing)
`notebookEntries()` (`CCP_Exam_Coach_FINAL.html`, Error Notebook section) built its list by scanning **every historical attempt** and adding/incrementing an entry for a question ID any time **any** attempt on it was wrong — with no check for whether a **later** attempt on the same question was correct. The notebook's own sub-text already claimed "currently missed (most recent attempt was wrong)", but the underlying logic never actually checked recency.

By contrast, the codebase already has a **correct, established pattern** for this exact "is this question currently missed" question, used elsewhere for the home-screen "wrong" backlog count: `wrongOnlyIds()` (`:692`) sorts each question's attempts by timestamp and checks only whether the **last** one was wrong.

**Reproduced:** blind-answered a batch of chapter questions, confirmed a set of them landed in the notebook, then confirmed (before the fix) that these entries persisted even after this fix was validated to make them disappear post-correction (see Test 3, Section 7) — the state-derivation logic, not just a counter, was the defect.

### Fix applied
Rewrote `notebookEntries()` to use the same latest-attempt-per-question convention already verified correct in `wrongOnlyIds()`: group all attempts by question ID, sort by timestamp, and include a question **only if its most recent attempt was wrong**. The "Missed N×" count still reflects the total number of historically-wrong attempts (unchanged semantics for questions still currently missed) — only the inclusion test changed.

### Verification (live, rendered — see Section 7, Test 3)
Blind-guessed through Chapter 2 (8 questions), producing 7 genuine misses in the Notebook. Read the Notebook's own on-screen "Correct answer" text for each (no source-code answer key used), used the app's native "Retry these 7 questions" feature, and re-answered each one with the text the Notebook itself displayed. Re-opened the Notebook: **all 7 previously-missed questions were gone (0 remaining, 0 still present from before).**

---

## 6. P1-B — "Substitute and Calculate" Label on Prose-Only Feedback

### Root cause (traced)
`humanCalculationExplanation(q, explain)` (the function actually used by the live `renderFeedback`, which is reassigned later in the file to call it — confirmed via source trace, not assumption) builds the "Worked solution" box's step 2 always titled **"Substitute and calculate"**, using `q.calcSteps` if present, else falling back to `q.explain`. For most calculation questions this text genuinely does show substituted numbers (e.g. `CPI=EV/AC=0.820` — no, wait, that example is one of the *broken* ones; a good example is `Purchase price = $6,200+$500=$6,700; ...`). But for a subset of questions the stored text states the formula **symbolically** and jumps straight to the final numeric answer with **no substituted values shown at all** (e.g. `VAC=BAC-EAC=USD -6.00 million.` — the learner never sees BAC or EAC's actual numbers plugged in, even though the question stem gives them).

### Method to identify affected items reliably
Rather than a manual/subjective pass, used a content-based rule applied to all 277 calculation-type questions in the live bank: **flag a worked-solution string only if it contains no digit anywhere before its final "=" sign** — i.e., the text states a formula and a final answer, but never shows a substituted number in between. This is a conservative, low-false-positive rule (it does not flag genuine substitutions, and errs toward leaving borderline cases unchanged rather than over-relabeling). It identified **13** such items, spanning multiple domains (EV/EAC in Chapter 14, financial analysis in Chapter 27, cost-estimating index adjustment in Chapter 9, statistics, decision analysis).

Per the task's explicit repair rule, numeric substitution was **not fabricated** for these 13 items (doing so per-item would require re-deriving each calculation from the stem by hand, which risks introducing new calculation errors — out of scope for a labeling fix). Instead, the step label is now generated **dynamically at render time** using the same digit-before-final-equals rule: when real substituted numbers are present, the step is still called **"Substitute and calculate"**; when they are not, it is honestly relabeled **"Solution reasoning"**. This is a general, content-driven rule (not a hard-coded list of 13 IDs), so it will continue to apply correctly if the question bank changes later.

### Verification (live, rendered — see Section 7, Test 4)
Confirmed via real practice sessions (Chapters 9, 14, 27) that the rendered label matches expectation in every sampled case:

| ID | Domain | Worked text (as stored) | Rendered label |
|---|---|---|---|
| 14-6 | EV/EAC | `VAC=BAC-EAC=USD -6.00 million.` | **Solution reasoning** (fixed) |
| 14-12 | EV/EAC | `CPI=EV/AC=0.820.` | **Solution reasoning** (fixed) |
| 27-8 | Financial | `Simple interest=P x r x t = USD 40,000.` | **Solution reasoning** (fixed) |
| 9-9 | Estimating/index adjustment | `Index adjustment = historical cost x current index / historical index = SAR 6.00 million.` | **Solution reasoning** (fixed) |
| 27-1 | Financial | `Simple interest: $5,000 + ($500 x 2) = $6,000. Compound interest: ...` | **Substitute and calculate** (unchanged control) |
| 9-11 | Estimating/markup | `Direct=USD 189,000; after overhead=USD 207,900; after profit=USD 228,690.` | **Substitute and calculate** (unchanged control) |
| BP524-1_Z-1 | EV/EAC (runtime-generated) | `CPI = 4/5 = 0.80; EAC = 10/0.80 = 12.5M` | **Substitute and calculate** (unchanged control) |

All 7/7 sampled items rendered the expected label, including one runtime-generated (Blueprint reserve) calculation question, confirming the fix applies uniformly regardless of question origin.

---

## 7. Regression Suite (all via real rendered-UI Playwright automation, fresh isolated browser profiles — no reuse of the original evaluation's profile)

All tests below used the app's own rendered DOM/text for verification. Where correct/incorrect answers needed to be known (P1-A retry), the correct text was read from the app's own on-screen feedback/notebook display — never from source-code inspection — consistent with the "no answer-key cheating" constraint. Source inspection was used only to locate affected items and confirm root causes beforehand, as explicitly permitted.

### Test 1 — P0-A leakage via rendered UI + full-bank static audit — **PASS**
- Ran full chapter sessions (all-available, mixed type/difficulty) across all 7 affected chapters (4, 8, 10, 13, 27, 29, 30): **0 leak-pattern matches** anywhere across any rendered question in any of these sessions.
- 6 of 8 target questions were encountered directly in a live session and rendered with clean text (confirmed via `bodyText` capture matching the exact expected clean option string).
- 2 targets (13-31, 27-14) were found to be excluded from live practice-session pools by a **pre-existing, unrelated** quality-vetting gate (`nativeQuestionIsVetted`/`staticQuestionIsQualityApproved`) — confirmed identical (`vetted:false`/`approved:false` on both) in the PRE_REPAIR and FINAL files, i.e. **not caused by this repair**. Rendered-UI evidence for these two was instead obtained by invoking the exact same options-rendering template line used by the live `renderQuiz()` directly against these two question objects in the loaded page — same rendering code path, same result: both render clean, with no leaked text. This pre-existing exclusion is logged under Section 10 (Remaining Known Limitations) since it is unrelated to the 4 confirmed issues and was not touched.
- Static full-bank re-audit: 830 questions / 3,320 options, 0 of the 9 confirmed-leak substrings remain anywhere; 39 residual keyword hits and 170 parenthetical-content items all manually re-confirmed legitimate.

### Test 2 — P0-B dashboard/mastery comparison — **PASS**
Generated real attempt history in Chapter 3 (two sessions, 12 total attempts). Dashboard rendered `Chapters — All Attempts` header with sub-text and `Ch.3 — Materials: 25% (3/12)`. Chapter Readiness & Evidence rendered `Training gate (latest attempt/question): 27% across 12 attempts` for the same chapter. Both distinct labels present and visibly differentiate the two legitimately-different numbers.

### Test 3 — P1-A Error Notebook (2+ questions) — **PASS**
Confirmed Notebook starts empty on a fresh profile. Blind-answered 8 questions in Chapter 2; 7 landed in the Notebook. Used the Notebook's own "Retry these 7 questions" feature and its own displayed correct-answer text to answer all 7 correctly. Re-checked the Notebook: **0 of the 7 remained** — full pass, well above the required minimum of 2.

### Test 4 — P1-B calculation feedback across domains — **PASS**
7/7 sampled items (EV/EAC ×2 broken + control, financial ×1 broken + control, estimating/markup ×1 broken + control, one runtime-generated calculation) rendered exactly the expected label (see Section 6 table).

### Test 5 — Core analytics validation (small, independently verified sample) — **PASS**
On a freshly reset profile, ran 6 questions in Chapter 1 with an independent tally kept by the test script from the app's own rendered "Correct"/"Incorrect" verdict text (not the source answer key): **1 correct, 5 incorrect**. Compared against the app's own `overallStats()` on the Dashboard: **total 6/6 match, correct 1/1 match, incorrect 5/5 match, accuracy 17%/17% match** — full independent agreement, confirming the P0-B labeling change did not disturb the underlying analytics pipeline.

### Test 6 — Core learning-flow smoke test — **PASS**
Navigated Home, Dashboard, Error Notebook, Formula Lab, Study Plan, Readiness Center, Chapter Readiness & Evidence, Cold/Unseen Readiness, Review Center, and Practice Center. **Zero JavaScript console/page errors** across all 10 views; every view rendered non-empty content. (Two of the ten had a cosmetic mismatch against the test script's own hard-coded expected-header string, due to CSS uppercase transforms and a "Cold → Unseen" terminology decorator applied after render — confirmed by direct inspection to be pre-existing, unrelated app behavior, not a defect introduced by this repair.)

**No regression test required a workaround, scope compromise, or exception.**

---

## 8. Core Analytics Validation

Covered by Regression Test 5 above: a small (6-question), freshly-isolated, independently-tallied sample matched the app's own `overallStats()` output exactly on every field (total, correct, incorrect, accuracy%). This is a targeted confirmation that core scoring/analytics remain correct after the P0-B labeling change and the P1-A/P1-B logic changes — it is intentionally **not** a repeat of the full 230-question Pass-1 evaluation.

---

## 9. Intentionally NOT Changed (explicit P2/P3 / out-of-scope list)

The following were identified in the prior evaluation but are explicitly **not** addressed here, per the strict scope boundary of this repair pass:
- Any P2/P3 recommendation from `ccp_eval_findings.md` / `ccp_eval_content_issues.md` / `ccp_evaluation_report_ar.md`.
- UI redesign, typography, color, or layout changes of any kind.
- Question-bank rewriting beyond the 9 confirmed P0-A leak strings.
- Formula Lab expansion, new study modes, Adaptive Practice redesign, Weakness Report redesign, Memo Practice redesign, mock architecture changes, new analytics features, or autosave changes unrelated to the 4 confirmed issues.
- Generic WHY-YOUR-ANSWER-WAS-WRONG behavior (global) — untouched.
- Global difficulty rebalancing or any correct-answer index change (no correct-answer index was changed anywhere in this repair).
- The pre-existing duplicate function declarations for `chapterStaticStats`/`chapterMasteryStatus`/`renderDashboard`/`renderEvidence`/`renderFeedback` (decorator-style reassignment pattern) — traced and understood, left exactly as-is since the winning/live definitions are functionally correct and already relied upon elsewhere.

---

## 10. Remaining Known Limitations (discovered, not fixed — out of scope)

1. **Pre-existing session-pool exclusion, unrelated to this repair:** Questions `13-31` and `27-14` (two of the 9 P0-A leak fixes) are excluded from live "All available" chapter practice pools by a pre-existing content-vetting gate (`nativeQuestionIsVetted`). This exclusion is **identical before and after this repair** (confirmed on both `CCP_Exam_Coach_PRE_REPAIR.html` and the fixed file: `vetted:false`, `approved:false` in both), so it is not a regression introduced here, but it does mean these two corrected questions may not currently surface in ordinary practice sessions at all. This is a distinct, unrelated content-QA gate and was left untouched, per instructions to record but not fix unrelated issues found during this pass.
2. The function-name-collision / decorator-reassignment pattern (multiple `function foo(){}`/`foo=function(){}` redeclarations of the same identifier later in the file — seen in `chapterStaticStats`, `chapterMasteryStatus`, `renderDashboard`, `renderEvidence`, `renderFeedback`, `renderSummary`, `renderFreshChallengeResult`, and likely others) is a pre-existing structural pattern in the codebase. It did not cause any incorrect behavior beyond the P0-B labeling gap already fixed, but it makes the file harder to audit safely and is worth a future non-urgent cleanup (out of scope here).
3. The 13 questions identified as lacking real numeric substitution (P1-B) now correctly say "Solution reasoning" instead of falsely claiming a calculation step; a genuine future improvement — out of scope for this pass — would be to add real substituted-number worked steps to these 13 items specifically.

---

## 11. Final Build Traceability

- **Final build filename:** `CCP_Exam_Coach_FINAL_FIXED.html`
- **SHA-256 (final build, locked after browser verification):** `bd4cc64c4a077053b2aa5d98cabaf53f80b2a54b233437c2a39966eb9c9edc0b`
- **SHA-256 (`CCP_Exam_Coach_FINAL.html`, identical to final build):** `bd4cc64c4a077053b2aa5d98cabaf53f80b2a54b233437c2a39966eb9c9edc0b`
- **SHA-256 (`CCP_Exam_Coach_PRE_REPAIR.html`, untouched pre-repair baseline):** `1a6f429257f4f8c50a2736b9316ae23e13f5dad90afe5d76fedb35b690250180`
- **Repair report filename:** `ccp_repair_report.md` (this file)
- **Files changed in this commit:** `CCP_Exam_Coach_FINAL.html` (modified), `CCP_Exam_Coach_PRE_REPAIR.html` (new), `CCP_Exam_Coach_FINAL_FIXED.html` (new), `ccp_repair_report.md` (new)
- **`git diff --stat` for the modified source file:**
  ```
  CCP_Exam_Coach_FINAL.html | 38 +++++++++++++++++++++++++++-----------
  1 file changed, 27 insertions(+), 11 deletions(-)
  ```
- **Final commit hash:** recorded after commit (see chat response).
- **Did any regression test require a workaround?** No. All 6 regression tests passed using the app's real rendered UI and native features (Retry-from-Notebook, live sessions), with no scope exceptions.

---

*This report documents a scoped repair of 4 confirmed defects only. It is not a new evaluation and does not claim to fix, assess, or improve anything beyond P0-A, P0-B, P1-A, and P1-B.*
