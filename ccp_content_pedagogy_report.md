# CCP Exam Coach — Content & Pedagogy Quality Report

**Scope:** Content and feedback-quality audit/repair of the existing question bank on the verified P0/P1 baseline. No UI redesign, no new study modes, no architecture changes.

---

## 1. Baseline

- Branch: `claude/ccp-exam-prep-eval-48nukj`
- Baseline build: `CCP_Exam_Coach_FINAL_FIXED.html`, commit `abf5127`
- Baseline SHA-256 (verified at start of this pass): `bd4cc64c4a077053b2aa5d98cabaf53f80b2a54b233437c2a39966eb9c9edc0b`
- Runtime question count at baseline: **830** (confirmed via live `window.QUESTIONS.length`, unchanged from the prior repair pass)
- Backup created before any edit: `CCP_Exam_Coach_PRE_CONTENT_REPAIR.html` (byte-identical to baseline, hash-verified)

## 2. Audit Scope

- **Questions scanned:** all 830 (structural, wording, duplicate, distractor, and why-wrong audits ran against the full runtime bank, not a sample)
- **Calculation items scanned:** all 277 calculation-type questions (arithmetic re-verification)
- **Chapters covered:** all 34 chapters for automated/full-bank checks; a deep manual regression sample across the 11 explicitly required chapters (1, 9, 13, 14, 21, 27, 29, 30, 31, 32, 33), including concept and calculation items, right and wrong answers
- **Distribution confirmed:** 553 concept / 277 calculation; 121 Easy / 598 Medium / 111 Hard; 128 runtime-generated Blueprint-reserve questions (`BP522-`/`BP524-` prefixes) plus 702 static-authored
- **Automated checks run:** structural validity (unique IDs, option counts, valid correct-index, non-empty fields); wording-defect regexes; exact and near-duplicate detection (token-Jaccard similarity within chapter); arithmetic re-computation of every extractable formula/substitution pair in calculation feedback; distractor length-disparity and word-count-outlier scans; targeted terminology scans (contingency/allowance/reserve/escalation)
- **Manual review approach:** every automated flag was individually read with full question context before any edit; no flag was treated as a confirmed defect without manual confirmation (see Section 12 for the pre-repair tally)
- **Source-material limitation (must be stated plainly):** the actual AACE RP 10S-90, S&K6, TCM Framework 2nd Ed., and CCP Certification Study Guide 2nd Ed. source documents are **not present in this repository** (only their citations exist as metadata strings inside the question objects). Source validation in this pass therefore relied on (a) domain knowledge of standard AACE cost-engineering terminology and definitions, and (b) internal consistency between each question's stem, options, explanation, and cited source label — not on direct page-level lookup against the physical documents. Any specific page-citation was left unchanged unless an internal inconsistency made an error clear; no citation was "verified" against a page I could not actually read.

## 3. Question Wording

**Confirmed defects (fixed):**
- Article-agreement grammar error, "a airport terminal" → "an airport terminal" — occurred in 2 questions (18-5, 21-referenced... actually 18-5 and 31-10). W1.

**Reviewed and found NOT to be defects** (to document the audit was thorough, not just a keyword pass):
- 45 stems ending in a colon (e.g., "Total Cost Management (TCM) is best defined as:") were automatically flagged by a naive "missing terminal punctuation" check; all 45 were manually confirmed to be a legitimate, complete fill-in-the-blank stem style, not truncation. No change made.
- A broader scan for "a" + vowel-starting word (a possible article-agreement class of error) returned 9 candidates; 7 were confirmed correct English on inspection (e.g., "a university," "a used lathe," "a unilateral" — all consonant-sound words despite a vowel spelling); only the 2 "a airport terminal" instances above were genuine.

**Remaining issues:** none identified beyond the above within the scope reviewed. A full line-by-line prose audit of all 830 stems' phrasing (beyond the automated + sampled-manual passes described here) was not performed; see Section 16.

## 4. Correct-Answer Validity

- **Confirmed key defects:** none found. Across the full-bank structural audit (correct-index range/type validity) and the 11-chapter manual regression sample (concept + calculation, multiple right/wrong attempts each), every keyed correct answer checked out as the single defensible answer given the stem's stated data and standard AACE definitions.
- **Ambiguous questions (two answers reasonably defensible):** none confirmed. No case was found where the correct answer depended on an unstated assumption or where the question could not be answered from the data given.
- **SME-review-required items:** none at the "wrong keyed answer" level. See Section 14 for lower-severity items still worth expert eyes.

## 5. Distractor Quality

**Confirmed and repaired:**
- Two options were literal, unit-less placeholder values ("USD 1") in multi-million-dollar EVM calculations (14-6 VAC, 14-16 Cost Variance) — clearly not a plausible distractor by any real misconception, more likely a template artifact. Replaced with genuinely plausible, computable misconception-based distractors (D1): 14-6's replaced with "USD 66.00 million" (adding BAC+EAC instead of subtracting); 14-16's replaced with "USD 82,000" (a decimal/magnitude-scaling slip), which also created a cleaner 3-way distractor set (sign error / magnitude error / no-variance assumption).

**Reviewed and found NOT to be defects:**
- A statistical scan flagged **97 of 830 questions (~11.7%)** where the correct option's text is more than 2.2× longer than the average of the other three options — the classic "test-wiseness" pattern the audit was asked to check for. A structured manual sample of 19 of these, spanning the full range of severity (ratios from 2.2× up to 6.9×) and multiple chapters/domains (EVM, risk, quality, optimization, scheduling, contracting), found **zero instances** where the length came from padding, hedging, or an answer-revealing giveaway — in every sampled case the correct answer is longer because it states a complete, technically precise definition or a multi-part synthesis (e.g., "EMV vs. Monte Carlo," "subjective vs. objective progress measurement"), while the false options are legitimately short because they are simple, single-clause misstatements. No bulk rewrite was performed on this pattern: rewriting ~100 individually-correct questions' wrong options purely to equalize length would itself violate the "don't rewrite unless there's a defensible reason" and "don't make distractors deceptive through wording" constraints of this pass. This is reported as a **confirmed, quantified, but not per-question-defective pattern** — a candidate for a dedicated future distractor-elaboration initiative, not a fix applied here.
- A separate scan for extreme word-count outliers (a single-word option among 8+-word siblings) found 4 cases, all legitimate (short contract-type names, short dollar figures, a deliberate one-word "Contingency" distractor testing cost-category confusion).

**Remaining patterns:** the 97-item length-correlation pattern above remains unaddressed by design (see rationale); it is not a per-question defect but is worth tracking if a future pass wants to invest in elaborating distractor text bank-wide.

## 6. Calculation Audit

- **Method:** every one of the 277 calculation-type questions' worked-solution text was parsed for `A op B = C`-style arithmetic and independently recomputed; separately, every formula was manually re-derived from the question's own stated inputs for the full 11-chapter regression sample (EV/EAC, scheduling/CPM, financial/cash-flow, statistics/probability, optimization/LP, risk/EMV, estimating/markup/indexing, SI conversion).
- **Automated pass result:** 204 arithmetic expressions extracted, 44 initial mismatches flagged. **All 44 were manually verified to be false positives** in the extraction regex itself (it does not understand percentages, exponents, or multi-term chained sums with several "=" signs, and mis-paired unrelated numbers across a sentence) — not one represented an actual computational error. Every one of the 44 was hand-recomputed from the stated formula and confirmed correct.
- **Genuine defects found and fixed (C1):**
  - **14-16 (Cost Variance):** the question's separate `formula` field (shown in the UI as "1. Governing formula / method") stated an internally inconsistent value, "CV=EV-AC=USD 818,182. Negative is unfavorable," which does not match either the question's own EV=9.00M/AC=8.18M inputs or its own correct answer/explanation (USD 820,000, positive/favorable). Corrected the `formula` field to "CV=EV-AC=USD 820,000. Positive is favorable," matching the actual inputs and the already-correct `explain` text.
  - **9-28 (Parametric CER):** the worked calculation correctly computes $1,216,572, but the stated "rounded" figure in both the answer option and the explanation text said "≈ $1,217,200," which is not a defensible rounding of $1,216,572 (nearest hundred would be $1,216,600; nearest thousand, $1,217,000). Corrected to "$1,216,600" in the option text and the explanation/calcSteps. The correct-answer ranking itself was never in doubt (the other three options are 10×+ different), so this was a precision fix, not a key change.
- **Units, rounding, and interpretation:** spot-checked across the 11-chapter sample; no other discrepancies found.

## 7. Worked Solutions

- **Problems found:** the "2. Substitute and calculate" step (already relabeled to "Solution reasoning" where no numeric substitution exists, per the prior P0/P1 repair) was confirmed still functioning correctly and was not altered further in this pass, other than the 14-16 formula-field fix above (which is upstream of that step, in the "Governing formula/method" line).
- **Improvements:** none needed to the worked-solution *structure* itself — the GIVEN → FORMULA → SUBSTITUTION → RESULT → INTERPRETATION shape already in place (from the P0/P1 pass) is sound and was preserved. This pass's calculation-side improvements were about **feedback content quality** (Section 8) rather than structure.
- **Representative example (already correct, shown for reference):**
  ```
  1. Governing formula / method: EAC = BAC / CPI
  2. Substitute and calculate: CPI=0.900; EAC=BAC/CPI=USD 13.33 million.
  3. Result: USD 13.33 million
  4. Check: The result must be consistent with the units, sign, and direction required by the stem.
  ```

## 8. Why-Wrong Feedback

This was the highest-value finding of the pass.

- **Generic explanations found:** across the full bank, **349 questions** had a `whyWrong` field using one of several generic templates (e.g., "The incorrect options typically reflect a wrong formula, mis-substitution, or arithmetic slip — verify each step against the formula shown above," or "X; Y; Z each misses a key qualifier or reverses the correct logic") that list the wrong option labels but never explain the *specific* error each one represents. Critically, these 349 were **not** caught by the app's own pre-existing quality mechanism (`humanWeakWhyWrong()` → `humanTargetedWhyWrong()`, built during the prior P0/P1 pass), which already catches 3 other generic templates (202 questions) and upgrades them to a "Your choice / Correct choice / governing rationale" comparison.
- **Root-cause fix (S1/E2, architectural, minimal, high-leverage):** rather than hand-rewriting 349 individual strings (infeasible to do reliably and defensibly at that scale in one pass, and riskier than necessary), the existing `humanWeakWhyWrong()` classifier was **extended** with the newly-identified generic-template fragments. This is the same mechanism the prior repair pass already established and verified — extending its detection list, not building a new one. As a direct result, all 349 additional questions (plus the original 202) now automatically receive the "Your choice was X; the correct choice is Y; here is the governing rationale, applied to your specific selection" comparison instead of the generic boilerplate — **563 of 830 questions (68%)** now get this upgraded treatment, live-verified via Playwright with zero page errors.
- **Distractor-specific explanations hand-written (E2, flagship examples):** for 7 high-value questions where the specific misconception behind each wrong option is objectively derivable from the question's own numbers, genuine per-option diagnoses were written (replacing the generic "off by a specific error" language):
  - **9-8** (allowance vs. contingency vs. management reserve vs. escalation) — this is the exact scenario the audit brief itself used as a worked example; the new text explains precisely why each of the three wrong terms doesn't fit a known-but-not-yet-priced scope item.
  - **14-6** (VAC), **14-13** (EAC=BAC/CPI), **14-16** (CV), **14-22** (ETC) — each wrong numeric option is now traced to a specific, real mechanism (e.g., "comes from multiplying BAC × CPI instead of dividing," "comes from averaging EAC and AC instead of subtracting," "off by a factor of 10 — a decimal-point slip") wherever a mechanism could be honestly derived from the two given figures; where a distractor's origin could **not** be honestly derived (e.g., 14-6's "-6.42" and 14-22's "$2.00 million"), the text says plainly that the value "is not consistent with the figures given under the standard formula" rather than inventing a false mental-process claim, per the audit brief's own guidance.
  - **23-6** (liquidated damages) and **32-10** (risk response follow-up) — generic "each confuses this concept with a related but different one" boilerplate replaced with a specific reason each wrong option fails (civil vs. criminal remedy confusion; residual-risk vs. full-allowance confusion).
- **Limitations:** the remaining ~554 questions that now receive the auto-upgraded comparison format get a real "your choice vs. correct choice + rationale" — a substantial improvement over raw generic text — but this is not the same as a hand-crafted, per-distractor misconception diagnosis for every one of them. Hand-writing genuine per-option diagnoses for all 554 was not attempted in this pass; the 7 hand-written examples above demonstrate the technique and target the areas with the clearest, most defensible per-option mechanisms (EVM formula confusions, cost-term conflations).

## 9. AACE Terminology / Source Validation

- **Terminology corrections made:**
  - **9-8:** the whyWrong text (Section 8) now correctly and explicitly distinguishes Allowance (known scope, not yet priced) from Contingency (uncertainty within defined scope), Management Reserve (held outside the baseline for unknown-unknowns), and Escalation (time/market-driven price change on already-estimated cost) — matching standard AACE usage.
  - **6-18:** the question asked for the "resulting **market valuation**" of a cost-plus-markup buildup (purchase price + cost of money + overhead + profit). "Market valuation" implies a market-comparables/appraisal approach, which is a different valuation method from a dealer's cost-buildup formula; conflating the two is a real terminology imprecision. Reworded to "minimum desired selling price," matching the terminology already used correctly in the near-duplicate question 6-12, and updated the `topic`/`source` metadata accordingly (S1).
- **Terminology reviewed and found consistent (no change needed):** targeted scans for "reserve" used ambiguously (outside "management reserve"/"contingency reserve") found only 2 instances, both legitimate (a financial sinking-fund "reserve" in an economics question, unrelated to project-controls terminology; a properly-qualified "contingency reserve" phrase).
- **Source conflicts encountered:** none requiring a hierarchy decision — no case was found in this pass where two cited sources gave contradictory guidance on the same tested concept.
- **Hierarchy decisions:** not applicable this pass, per the above.
- **Limitation:** as noted in Section 2, the actual AACE documents are not available in this repository, so this section reflects domain-knowledge-based terminology review and internal-consistency checking, not page-level document verification.

## 10. Duplicate / Pattern Audit

- **Exact duplicate stems:** **0** found across the full 830-question bank (token-normalized comparison).
- **Near-duplicates flagged:** **25 candidate pairs** (same-chapter, ≥60% token-Jaccard similarity). Every pair was read in full with options and correct answers.
  - **Confirmed genuine redundant duplicates (cosmetic variants of the identical scenario/numbers/answer) — repaired (R1):**
    - 10-12 / 10-24 (royalty-expense calculation) — 10-24 revised to a different sales figure and rate ($32,000,000 @ 5% vs. the original $18,000,000 @ 3%), with newly-derived, distinct distractors and a distractor-specific whyWrong.
    - 11-11 / 11-21 (pre-tax markup for target after-tax profit) — 11-21 revised to a 35% tax rate (vs. 40%), recomputed end-to-end.
    - 7-17 / 7-21 (additive inflation + risk-premium interest rate) — 7-21 revised to 3.0%/4.5% (vs. 2.5%/3.5%), recomputed end-to-end.
    - 6-12 / 6-18 (equipment cost-buildup) — 6-18 revised to different input values (purchase price, holding period, profit %) **and** its terminology corrected (Section 9), recomputed end-to-end.
  - **Reviewed and confirmed legitimate (different applications, different numbers, or genuinely different sub-question), retained unchanged — 21 pairs**, including: 11-19/11-20 (same scenario, two different formulas asked — markup amount vs. selling price), 29-20/29-21 (same dataset, median vs. mode), 11-7/11-8 (Shutdown Point vs. Cost Point — different cost bases), 28-3/28-20 (same PI formula, materially different dollar figures and results), 34-17/34-18 (different SI unit-conversion pairs), and 14 further pairs following the same "same skill family, genuinely different application" pattern.
- **Repetitive templates:** the 128 runtime-generated Blueprint-reserve questions (`BP522-`/`BP524-` prefixes) follow a consistent "Which response is most appropriate?" scenario template by design (this is the app's intentional Blueprint-task-coverage mechanism, not a defect) — reviewed and left untouched, consistent with the explicit instruction not to modify the mock/blueprint architecture.

## 11. Question Changes

| Question ID | Chapter | Class | Issue | Action | Source used |
|---|---|---|---|---|---|
| 18-5, 31-10 | 18, 31 | W1 | "a airport terminal" (article agreement) | "a" → "an" | — (grammar) |
| 9-8 | 9 | E2 | Generic why-wrong for allowance/contingency/mgmt-reserve/escalation | Distractor-specific rewrite | AACE terminology (domain knowledge) |
| 23-6 | 23 | E2 | Generic why-wrong for liquidated damages options | Distractor-specific rewrite | Contract-terms domain knowledge |
| 32-10 | 32 | E2 | Generic why-wrong for risk-monitoring options | Distractor-specific rewrite | Risk-management domain knowledge |
| 14-6 | 14 | D1, E2 | "USD 1" placeholder distractor; generic why-wrong | Replaced distractor; distractor-specific why-wrong | S&K6/RP 10S-90 VAC formula |
| 14-13 | 14 | E2 | Generic why-wrong for EAC=BAC/CPI options | Distractor-specific rewrite | S&K6 Ch.19 Eq.19.7 |
| 14-16 | 14 | C1, D1, E2 | Wrong `formula` field value ($818,182); "USD 1" placeholder distractor; generic why-wrong | Fixed formula field; replaced distractor; distractor-specific rewrite | S&K6 Ch.19 Eq.19.3 |
| 14-22 | 14 | E2 | Generic why-wrong for ETC options | Distractor-specific rewrite | AACE RP 10S-90 ETC |
| 10-24 | 10 | R1 | Redundant near-duplicate of 10-12 | Revised to a different scenario, recomputed | Royalty-expense estimation method (unchanged) |
| 11-21 | 11 | R1 | Redundant near-duplicate of 11-11 | Revised to a different tax rate, recomputed | Pre-tax profit grossing-up method (unchanged) |
| 7-21 | 7 | R1 | Redundant near-duplicate of 7-17 | Revised to different rates, recomputed | Additive inflation/risk method (unchanged) |
| 6-18 | 6 | R1, S1 | Redundant near-duplicate of 6-12; "market valuation" terminology imprecision | Revised inputs, recomputed; retitled to "minimum desired selling price" | Equipment cost-buildup method (unchanged) |
| 9-28 | 9 | C1 | Rounded figure ($1,217,200) inconsistent with precise calculation ($1,216,572) | Corrected to $1,216,600 in option + explanation | Parametric CER (unchanged) |
| *(architectural, applies bank-wide)* | all | E2 | 349 questions with generic why-wrong text bypassing the app's existing auto-upgrade | Extended `humanWeakWhyWrong()` classifier (one function, ~15 new fragment strings) | — (rendering logic, not question data) |

**Total individual questions with data changed: 13** (18-5, 31-10, 9-8, 23-6, 32-10, 14-6, 14-13, 14-16, 14-22, 10-24, 11-21, 7-21, 6-18, 9-28 — 14 IDs; 18-5/31-10 share one wording fix). **Plus 1 rendering-logic change** benefiting 349 additional questions without touching their stored data.

No question ID, chapter mapping, blueprint mapping, or difficulty rating was changed. No correct-answer index was changed for any question (all `correct` values are identical to the pre-repair baseline).

## 12. Regression Tests

| Test | Result | Evidence |
|---|---|---|
| Structural validation (unique IDs, valid options/correct-index, non-empty fields) | **PASS** | 830/830 questions, 0 issues, before and after all edits |
| Runtime question count unchanged | **PASS** | 830 before, 830 after |
| P0-A preservation (no distractor-rationale leakage) | **PASS** | Live scan of all 830×4 options for the 9 original leak substrings: 0 matches |
| P0-B preservation (Dashboard/Mastery labels) | **PASS** | Live render confirms "Chapters — All Attempts" and "Training gate (latest attempt/question)" labels intact |
| P1-A preservation (corrected questions leave Error Notebook) | **PASS** | `notebookEntries()` source confirmed unchanged, contains the latest-attempt fix |
| P1-B preservation (no false "Substitute and calculate" label) | **PASS** | `humanCalculationExplanation()` source confirmed unchanged, contains "Solution reasoning" dynamic logic |
| Chapter regression sample — 11 required chapters (1, 9, 13, 14, 21, 27, 29, 30, 31, 32, 33), concept + calculation, right + wrong answers | **PASS** | Real Playwright click-through of each chapter; feedback read and confirmed genuinely explanatory (no raw generic "Why it fails" text observed in the final verified run — see note below) |
| Calculation regression — estimating/markup, scheduling/CPM, EVM/EAC, economics/cash-flow, statistics/probability, optimization, risk/EMV, SI conversion | **PASS** | Independently re-derived and confirmed all sampled results (see Section 6); one genuine defect (14-16 formula field) and one precision defect (9-28 rounding) found and fixed |
| Core system regression: Chapter Practice, Wrong Answers Review, Error Notebook, Weakness Report, Adaptive Practice, Dashboard, Chapter Progress & Mastery, Formula Lab, Method Selection, Study Plan, Timed Mock entry, Cold/Fresh evidence, persistence across reload | **PASS** | 14/14 checks — every view rendered non-empty with 0 JS errors; Adaptive Practice built a real 5-question queue; Timed Mock config screen rendered correctly; prior study history (5 attempts) persisted identically across a full page reload |

**Test-harness note (not a product defect):** during this pass's regression testing, an early run of the chapter-sample script intermittently showed raw generic why-wrong text for a few chapter-13/14/21/29 questions. Root-cause investigation traced this to the shared test harness's `APP_URL` constant pointing at the **prior** build (`CCP_Exam_Coach_FINAL.html`, from before this pass's edits) rather than the file actually being edited (`CCP_Exam_Coach_FINAL_FIXED.html`) — a bug in the reusable test script, not in the product. This was found, fixed in the harness, and the full 11-chapter regression was re-run cleanly against the correct file with 0 raw-generic-text occurrences (see the PASS row above). No product code was changed as a result of this investigation.

## 13. Previous P0/P1 Fix Preservation

- **P0-A: PASS** — 0 leaked distractor-rationale substrings remain anywhere in the 830-question live bank.
- **P0-B: PASS** — Dashboard "Chapters — All Attempts" and Chapter Readiness & Evidence "Training gate (latest attempt/question)" labels both render correctly and remain distinct.
- **P1-A: PASS** — `notebookEntries()` still uses the latest-attempt-per-question rule; unchanged by this pass.
- **P1-B: PASS** — `humanCalculationExplanation()` still dynamically labels "Solution reasoning" vs. "Substitute and calculate" based on real numeric substitution; unchanged by this pass except for the unrelated, correctly-scoped 14-16 formula-field fix (Section 6).

## 14. SME Review Required

No question was found where the **keyed correct answer itself** is wrong, ambiguous, or unresolvable from the given data (Section 4). The following lower-severity items are flagged for optional expert attention rather than fixed here, because a confident, source-backed correction was not achievable within this pass:

1. **14-6 (VAC), distractor "USD -6.42 million":** does not correspond to any standard VAC-related computation from the two given figures (BAC, EAC). Left in place with honest "not consistent with the figures given" language rather than inventing a false derivation; an SME could either confirm the intended distractor logic or approve replacing it.
2. **14-22 (ETC), distractor "USD 2.00 million":** similarly does not trace to a standard ETC computation from the two given figures. Same treatment.
3. **The 97-question distractor-length pattern (Section 5):** confirmed real and quantified, but not individually defective on manual sampling. Recommended as a candidate for a dedicated, larger-scope distractor-elaboration initiative rather than something to fix reactively.
4. **Source-citation page numbers:** left unverified against the actual AACE documents (not available in this repository) except where an internal inconsistency made a correction clear (none were found requiring this in this pass). A full citation audit would require the physical/PDF source texts.

## 15. Intentionally Not Changed

Per the explicit scope boundary, the following were **not** touched in this pass, regardless of any findings:
- UI design, layout, typography, navigation, or colors.
- Adaptive Practice, Weakness Report, readiness-scoring, confidence-tracking, or Cold/Fresh evidence **logic** (their question-data inputs were audited; their algorithms were not modified).
- Mastery/retention architecture, Timed Mock structure, Blueprint Mock timer behavior, Memo Practice scoring/readiness logic.
- Formula Lab (no expansion).
- Any new study mode, autosave feature, "practice similar question" feature, or other roadmap item not required to repair a confirmed content defect.
- The pre-existing decorator/reassignment pattern for several render functions (documented, not refactored) — touched only via the single, targeted `humanWeakWhyWrong()` extension described in Section 8, which follows the same pattern already established by the prior P0/P1 pass rather than introducing a new one.
- The 554 questions now covered only by the generic-to-comparison auto-upgrade (Section 8) were not individually hand-rewritten with bespoke per-distractor diagnoses; only 7 flagship examples received that treatment.
- The 21 near-duplicate pairs confirmed legitimate (Section 10) were left unchanged.
- The 89 remaining distractor-length-pattern questions beyond the 19 manually sampled were not individually re-reviewed one by one (the sample was judged sufficient to characterize the pattern; see Section 5).
- Any P2/P3 item from the original human-student evaluation not tied to a P0/P1 fix or a confirmed content defect in this pass.

## 16. Remaining Known Limitations

Factual, not editorializing:
- The actual AACE RP 10S-90, S&K6, TCM Framework 2nd Ed., and CCP Study Guide 2nd Ed. source documents are not present in this repository; all source-alignment judgments in this report rely on domain knowledge and internal consistency, not direct document lookup.
- A full manual, line-by-line prose review of all 830 question stems/options/explanations (beyond the automated wording scans plus the 11-chapter deep sample) was not performed; undiscovered minor wording issues may remain outside the reviewed set.
- The 97-question distractor-length statistical pattern (Section 5) remains present in the bank; it was found to be individually defensible on sampling but was not eliminated.
- 554 of 830 questions now receive an improved but generic "your choice vs. correct choice + governing rationale" comparison rather than a hand-crafted, distractor-specific misconception diagnosis; only 7 received the latter in this pass.
- Two specific distractor values (Section 14, items 1–2) could not be traced to a defensible derivation and are described honestly as "not consistent with the given figures" rather than replaced or explained with an invented mechanism.
- No new content-quality automated tooling was added to the shipped application itself — all audits in this pass were run externally (Node/Playwright scripts) against the live runtime bank, not built into the product.
