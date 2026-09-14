# CCP Exam Coach — AACE Source Validation Report

## Overall status: PARTIAL AACE SOURCE VALIDATION

This is **not** a full-bank AACE validation. Of the 830 runtime questions, **17 have been manually, line-by-line source-validated** against actual AACE text; the remaining **813 have not** and must not be described as "AACE-validated." See Section 15 for the exact status counts and Section 18 for open access gaps.

**Corrective notice (this revision):** an earlier version of this report contained two errors, both corrected below:
1. It claimed the current Handbook specifies a 4-domain exam structure. This was wrong — that 4-part breakdown (Cost Management/Communication Competency/Interfacing with Other Disciplines/Performance Analysis) is the Handbook's candidate-facing **score-report** breakdown (p. 40, "Exam Results"), not the exam construction Blueprint. The actual Blueprint (pp. 9–10 of the Handbook, on pages that render as an image and were missed by the original text-only extraction) is a **6-domain** table that matches the application's existing 6-domain taxonomy exactly. See Section 9.
2. It claimed a conflict between the app's "May 2026 Blueprint" citations and the Handbook's "Revised June 2026" cover date. This was wrong — the Blueprint table itself is titled "Certified Cost Professional (CCP) Examination Blueprint - May 2026," a legitimate date distinct from the Handbook document's own later revision date. The app's citations are correct as written; no change was needed or made.

## 1. Baseline

- Branch: `claude/ccp-exam-prep-eval-48nukj`
- Baseline build: `CCP_Exam_Coach_CONTENT_VALIDATED.html`, baseline commit `ffbe58a`
- Baseline SHA-256 (verified before any edit): `3ad256a0d16332e8aa6a1b304e571d4cfd18873a79c8bc993f66e1153d52bba6`
- Runtime question count at baseline and after this pass: **830** (unchanged, confirmed via live `window.QUESTIONS.length`)
- Backup created before any edit: `CCP_Exam_Coach_PRE_AACE_VALIDATION.html` (byte-identical to baseline, hash-verified)

## 2. Sources Used

All five primary sources were provided via a connected Google Drive folder (read-only reference; none copied into this repository). Where the connector's extraction tool truncated a large PDF, the raw file was downloaded as bytes and processed locally with `pdftotext` to obtain the complete text.

| # | Title | Edition/Revision | Drive filename(s) | Validation role | Readability |
|---|---|---|---|---|---|
| 1 | CCP Candidate Handbook | Document revised **June 2026**; the embedded Blueprint table (pp. 9–10) is separately titled and dated **"...Blueprint - May 2026"** — both dates are genuine and not in conflict (Section 9) | `05 New CCP Candidate Handbook.pdf` | Current exam scope, domains, format | **Full** (65 pp). Note: pp. 9–10 (the Blueprint table) render as an image with no text layer — text-only extraction silently skips them; confirmed instead by visually rendering those two pages |
| 2 | AACE RP 10S-90 — Cost Engineering Terminology | Rev. **August 23, 2022** | `03 Cost Engineering Termonology.pdf` | Governing terminology/definitions, formula definitions | **Full** (136 pp, complete local extraction; connector's own extraction was truncated at ~53% and was not relied on) |
| 3 | Skills & Knowledge of Cost Engineering, 6th Ed. | 6th Ed., 2015 | `01 Skills-and-Knowledge 6 Edition.pdf` (single-file, exceeds connector's 10MB cap) + `SK6_Part_2_Ch09-15.pdf`, `SK6_Part_3_Ch16-26.pdf`, `SK6_Part_4_Ch27-34.pdf` (split copies, each under 10MB) | Primary technical/formula source | **Chapters 9–34: confirmed complete** (verified natural start/end boundaries for each part). **Chapters 1–8: still not confirmed complete** — obtained only via the connector's own truncated extraction of the single-file copy (~302,000 characters, ending partway through Chapter 8); the `SK6_Part_1_Ch01-08.pdf` split copy has failed to download in **10 attempts across two passes** (session errors specific to this 8.1MB file) and remains unobtained. See Section 18 for the recommended next step (further splitting). |
| 4 | Total Cost Management Framework, 2nd Ed. | 2nd Ed., 2015 | `04 Total Cost Management Framework.pdf` | TCM lifecycle/process integration | **Full** (334 pp, complete local extraction) |
| 5 | CCP Certification Study Guide, 2nd Ed. | 2nd Ed., 2016 | `02 CCP_CertStudyGuide2.pdf` | Official companion practice, Appendix A | **Full** (265 pp, complete local extraction, including Appendix A) |

**Secondary sources:** none of the CCP Preparation Course files were provided in the Drive folder for this pass; none were used (consistent with their "secondary support only" status — their absence does not block validation, which relies on the five primary sources above).

## 3. Authority Rules

Hierarchy applied exactly as specified: (1) Current Candidate Handbook governs exam scope/domains; (2) RP 10S-90 governs terminology and supersedes other AACE publications' wording where they conflict; (3) S&K6 is the primary technical source; (4) TCM Framework governs lifecycle/process relationships; (5) CCP Study Guide + Appendix A validate official companion practice; (6) CCP Preparation Course, secondary only (not used this pass, none provided). No case was encountered in this pass where S&K6's wording actually conflicted with 10S-90's — in every term checked, S&K6's language was fully consistent with (or a plain-language paraphrase of) the 10S-90 definition, so the supersession rule was never actually needed to override anything.

## 4. Validation Coverage

Being precise about the three tiers, per instructions:

- **Structurally scanned (830/830):** every question checked for unique ID, valid 4-option array, valid correct-index, non-empty text — 100% of the bank, automated.
- **Automatically checked for known regression patterns (830/830):** P0-A leak substrings, generic why-wrong classifier coverage — 100% of the bank, automated (re-run of checks established in prior passes, not new source-based analysis).
- **Manually source-validated against actual AACE text in this pass (17 questions, line-by-line):** 9-8, 10-12, 10-24, 11-11, 11-21, 7-17, 7-21, 6-12, 6-18, 23-6, 32-10, 14-6, 14-13, 14-16, 14-22, 9-28, plus one original (unmodified) Chapter 33 TCM/TQM-relationship question checked for verbatim source alignment. This set was chosen deliberately: all 14 questions modified in the prior Content/Pedagogy pass (mandatory revalidation) plus their un-modified "sibling" questions where a near-duplicate existed (10-12, 11-11, 7-17, 6-12), plus one additional spot-check.
- **Terminology items checked directly against 10S-90's authoritative text:** CONTINGENCY, ALLOWANCE, MANAGEMENT RESERVE, ESCALATION, DAMAGES/LIQUIDATED, RESIDUAL RISK, RISK RESPONSE, RISK TREATMENT, BAC, EV, AC, CPI, SPI, EAC, ETC, VAC, COST VARIANCE — 16 terms, all with formulas/definitions pulled and compared verbatim.
- **Formula families checked against S&K6/10S-90 source text:** equipment minimum-desired-selling-price buildup (Ch.6), additive interest-rate method (Ch.7), royalty expense estimation (Ch.10), pre-tax profit grossing-up (Ch.11), parametric CER (Ch.9), core EVM formulas (VAC/EAC/CV/ETC via 10S-90) — 6 formula families.
- **Blueprint mapping:** validated at the domain/weight/quota level against the actual Blueprint table (Handbook pp. 9–10, visually confirmed) — all confirmed correct (see Section 9). 3 of the 128 generated questions' granular task codes (1.A, 1.P, 4.H) were spot-checked against the same table and matched exactly; the remaining task codes were not individually re-checked one-by-one.
- **Study Guide / Appendix A:** reviewed for edition/structure and general style-and-topic alignment (not a question-by-question cross-check of all 830 against the Study Guide's own problems).
- **Not manually source-checked in this pass:** the remaining 813 questions were structurally scanned and covered by the existing automated regression checks, but were not individually read against AACE source text line-by-line in this pass. This is stated plainly rather than implied otherwise.

## 5. RP 10S-90 Terminology Audit

| Term | App usage checked | 10S-90 definition (paraphrased) | Classification |
|---|---|---|---|
| CONTINGENCY | 9-8 whyWrong | Amount for uncertain items/conditions *within* defined scope; excludes management reserve, escalation, major scope changes | **A — matches current 10S-90** |
| ALLOWANCE | 9-8 correct answer | Resources for *known but undefined* requirements for an activity/work item | **A — matches current 10S-90** |
| MANAGEMENT RESERVE | 9-8 whyWrong | Amount for discretionary management purposes *outside* defined scope / held outside the performance baseline | **A — matches, after a small wording tightening** (see Section 11) |
| ESCALATION | 9-8 whyWrong | Provision for uncertain technical/economic/market cost changes over time; inflation is a component | **A — matches current 10S-90** |
| DAMAGES, LIQUIDATED | 23-6 | Contractually stated amount for failure to complete by designated time(s) | **A — matches current 10S-90** |
| RESIDUAL RISK | 32-10 whyWrong | Portion of risk remaining after responses are implemented in full or in part | **A — matches current 10S-90** |
| BAC, EV, AC, CPI, SPI, VAC, ETC | 14-6, 14-13, 14-16, 14-22 | All formulas (VAC=BAC−EAC; ETC=EAC−AC; CV=EV−AC; EAC=BAC/CPI per 10S-90's own worked description) confirmed exact | **A — matches current 10S-90** |
| TOTAL COST MANAGEMENT / TQM relationship | Ch.33 question (unmodified) | S&K6 Ch.33 wording found verbatim-identical to the app's explanation text | **A — matches (via S&K6, consistent with 10S-90 scope)** |

**Conflicts found:** none — in every term checked, the app's usage was already consistent with 10S-90's current definition (Category A). No Category D (materially conflicting) terminology was found among the 16 terms actually checked. This does not mean the remaining, unchecked terms in the 830-question bank are guaranteed conflict-free — only that none was found in the terms actually audited.

**Corrections made:** one wording tightening (9-8's whyWrong replaced informal "unknown-unknown" risk jargon, which does not appear in 10S-90, with language drawn directly from the Management Reserve definition) — T1.

## 6. S&K6 Technical Validation

| Chapter | Formula/concept | Source finding |
|---|---|---|
| Ch.6 — Machinery, Equipment & Tools | Minimum desired selling price = purchase price + cost of money + overhead + profit | **Exact match** to S&K6 Table 6.2 (a metal-lathe worked example using the identical structure: tax-exempt dealer purchase, deinstallation/rigging/delivery, cost-of-money pro-rated for holding period, overhead 20% of purchase price, profit "15% to 20%"). This directly confirms the prior Content/Pedagogy pass's correction of question 6-18 (which had incorrectly called this sum a "market valuation") — the term "minimum desired selling price" is the exact phrase S&K6 itself uses. **AACE-VALIDATED.** |
| Ch.7 — Economic Costs | Interest rate = expected inflation + risk premium (additive method) | **Exact match** to S&K6's own worked example ("if long-term inflation rates are projected to be three percent and the risk...at four percent, the derived interest rate would be summed at seven percent"). **AACE-VALIDATED** for both 7-17 and 7-21. |
| Ch.9 — Cost Estimating | Royalty expense estimation | **Exact match**: S&K6 states royalty expense "may be estimated at one to five percent of the product sales price" — the app's 10-12/10-24 wording is drawn almost verbatim from this passage. **AACE-VALIDATED.** |
| Ch.9 — Cost Estimating | Parametric CER (cooling towers) | **Defect found and corrected.** The real S&K6 formula is `Cost = $86,600 + $84,500(Cooling Range in °F)^0.65 − $68,600(Approach) + $76,700(Flow Rate in 1000 GPM)^0.7` (Table 9.2), and S&K6 explicitly calls out the non-linear (exponentiated) nature of the Cooling Range and Flow Rate terms as a key teaching point. The app's question omitted both exponents entirely, presenting them as plain "factors." The specific numeric values given (10.08, 14.36) were confirmed to be traceable directly to S&K6's own Table 9.3, which pre-computes the exponentiated terms — so the arithmetic and correct answer were never wrong, but the formula as displayed to the learner did not accurately represent the CER. **CORRECTED — AACE SOURCE (F1).** See Section 11. |
| Ch.11 — Discrete Part Manufacturing | Pre-tax profit "grossing-up" for a target after-tax profit | **Exact match**: S&K6 states "with a tax rate of 40 percent, one must charge $1.67 for every $1.00 of after tax profit desired" — identical to the app's 11-11 example. **AACE-VALIDATED** for both 11-11 and 11-21. |
| Ch.33 — Total Cost Management Overview | TCM/TQM relationship | **Verbatim match**: "TCM is patterned after Total Quality Management (TQM), developed by W. Edwards Deming...TCM and TQM are integrative philosophies of management for continuously improving the quality of products and..." — word-for-word identical to the app's explanation text. **AACE-VALIDATED.** |

No S&K6 chapters 1–5, 8 (beyond what the truncated extraction covered), 12–20, or 22–26, 28 formula content beyond the items above were individually source-checked in this pass (structural/automated checks only for those chapters' questions).

## 7. TCM Validation

The Total Cost Management Framework (2nd Ed., full text) defines TCM as "the sum of the practices and processes that an enterprise uses to manage the total life cycle cost investment in its portfolio of strategic assets," consistent with the app's general framing of TCM across Ch.33 questions. The word "TQM" does not appear anywhere in the TCM Framework itself — the TCM/TQM comparison the app tests is sourced from S&K6 Ch.33, not the TCM Framework, and that S&K6 wording was confirmed verbatim (Section 6). No cross-chapter TCM process-map (Sections 1–10) content was checked against specific app questions beyond this in the time available for this pass; no conflicts were found in what was checked.

## 8. Study Guide / Appendix A Validation

- Confirmed: "CCP Certification Study Guide, Second Edition...Companion Workbook to Skills & Knowledge of Cost Engineering, 6th Edition," Dr. Makarand Hastak, editor, 2016 — matches the expected edition exactly.
- Appendix A ("Sample Exam Questions," pp. 232+) reviewed: its format is **compound, multi-part scenario items** (e.g., one EVM dataset with planned/actual hours and percent-complete feeding seven sub-questions: earned hours, CV, SV, CPI, SPI, EAC, and an overall favorable/unfavorable status synthesis). This confirms the app's practice of testing multiple related EVM metrics (CV, SPI, EAC, etc.) from a shared kind of scenario is stylistically aligned with official AACE practice, even though the app presents them as separate single-answer questions rather than Appendix A's compound format. This is a legitimate stylistic difference only — not a defect, and rewriting the bank into compound-question format was correctly out of scope for this pass (would be "rewriting valid questions merely for style").
- No Study Guide or Appendix A questions were copied into the application bank in this pass (validation only, no ingestion, per instructions).
- No discrepancies were found between app content and Study Guide/Appendix A material in the specific comparisons made above.

## 9. Current Blueprint Validation (corrected)

**This section supersedes the "4-domain" finding in the original version of this report, which was wrong.** The error: pages 9–10 of the Handbook (the actual Blueprint table) render as an image with no extractable text layer, so the original text-only `pdftotext` pass silently skipped straight from page 8 to page 11 with no warning. The 4-part breakdown found on page 40 ("Exam Results — Exam Breakdown and Scoring": Cost Management 55Q / Communication Competency memo / Interfacing with Other Disciplines 24Q / Performance Analysis 40Q) is a **separate, candidate-facing score-report grouping**, not the exam-construction Blueprint. This was corrected by visually rendering pages 9–10 as images and reading the table directly.

**The actual Blueprint (Handbook pp. 9–10), visually confirmed:**

Title on the table itself: **"Certified Cost Professional (CCP) Examination Blueprint - May 2026"** — a date belonging to the Blueprint table, distinct from the Handbook document's own later "Revised June 2026" cover/footer date. Both dates are legitimately real; they are not in conflict, and the Blueprint's own May 2026 date is what any citation to "the Blueprint" should use.

| Domain (as titled on the table) | Weight | Task count |
|---|---|---|
| Domain 1: Managing Project Costs | 36% | 27 tasks (1.A–1.AA) |
| Domain 2: Interface with Other Disciplines | 24% | 18 tasks (2.A–2.R) |
| Domain 3: Create Reports and Documentation | 11% | 8 tasks (3.A–3.H) |
| Domain 4: Conduct Performance Measurement/Analysis | 17% | 13 tasks (4.A–4.M) |
| Domain 5: Support/Inform the Scheduling Process | 5% | 4 tasks (5.A–5.D) |
| Domain 6: Inform the Risk Management Process | 7% | 6 tasks (6.A–6.F) |

Total: 36+24+11+17+5+7 = **100%**, 76 tasks total.

**Application comparison — domain names/weights:**

| App domain label | Actual Blueprint title | Weight match |
|---|---|---|
| "Domain 1: Managing Project Costs" | "Domain 1: Managing Project Costs" | **Exact name match.** 36% |
| "Domain 2: Interface with Other Disciplines" | "Domain 2: Interface with Other Disciplines" | **Exact name match.** 24% |
| "Domain 3: Reports and Documentation" | "Domain 3: Create Reports and Documentation" | Minor abbreviation (missing "Create") — compatible, not material. 11% |
| "Domain 4: Performance Measurement" | "Domain 4: Conduct Performance Measurement/Analysis" | Minor abbreviation — compatible, not material. 17% |
| "Domain 5: Support/Inform Scheduling" | "Domain 5: Support/Inform the Scheduling Process" | Minor abbreviation — compatible, not material. 5% |
| "Domain 6: Inform the Risk Management Process" | "Domain 6: Inform the Risk Management Process" | **Exact name match.** 7% |

**Blueprint Mock quota check:** the app's `BLUEPRINT_DOMAINS` array hard-codes quotas 43/29/13/20/6/8 (of 119), sourced from a code comment citing "36%,24%,11%,17%,5%,7%." Recomputing directly from the confirmed table: 119×0.36=42.84→43, ×0.24=28.56→29, ×0.11=13.09→13, ×0.17=20.23→20, ×0.05=5.95→6, ×0.07=8.33→8 — **matches the app's quotas exactly** (largest-remainder rounding, as the code comment itself states).

**Task-code spot check** (sample of codes used by the app's 128 generated Blueprint-reserve questions, checked against the visually-confirmed table):
- App cites **"1.A"** → table: "1.A Research historical database" — **exact match**
- App cites **"1.P"** → table: "1.P Adhere to cost system governance requirements" — **exact match**
- App cites **"4.H"** → table: "4.H Evaluate alignment between EV and physical progress" — **exact match**

**Corrected findings:**
1. **Domain structure and weights: CURRENTLY CORRECT.** The app's 6-domain taxonomy and 36/24/11/17/5/7% weighting are directly, visually confirmed against the actual Blueprint table (pp. 9–10). The minor name abbreviations (Domain 3–5) are compatible simplifications, not material conflicts. **No correction required, and none applied.**
2. **Blueprint Mock quotas (43/29/13/20/6/8 of 119): CURRENTLY CORRECT.** Independently recomputed from the confirmed percentages and found to match exactly.
3. **"May 2026" Blueprint-date citations (128 questions): CURRENTLY CORRECT.** This is the Blueprint table's own genuine title date, not an error. **No change was made or should be made** to these citations merely because the surrounding Handbook document carries a later "Revised June 2026" cover date — that would have been an incorrect edit made for a wrong reason, and was correctly not applied.
4. **Task codes (e.g., "1.A," "4.H"): AACE-VALIDATED** for the 3 sampled above (direct visual match against the Blueprint table). The remaining task codes among the 128 generated questions were not individually re-checked one-by-one in this corrective pass; the 3-code sample found zero discrepancies.

No working mock logic was altered — the original assessment that "no correction is currently needed" turns out to be correct, but for the right reason now (source-confirmed match) rather than the previous, incorrect reason (a fabricated mismatch that was never real).

## 10. Formula / Method Validation

| Formula family | AACE source | Status | Changes |
|---|---|---|---|
| Minimum desired selling price (equipment) | S&K6 Ch.6, Table 6.2 | AACE-VALIDATED | None needed this pass (already corrected in prior pass; now source-confirmed) |
| Additive interest rate (inflation + risk premium) | S&K6 Ch.7 | AACE-VALIDATED | None |
| Royalty expense (1–5% of sales) | S&K6 Ch.10 | AACE-VALIDATED | None |
| Pre-tax profit grossing-up | S&K6 Ch.11 | AACE-VALIDATED | None |
| Parametric CER (cooling tower) | S&K6 Ch.9, Table 9.2–9.3 | **CORRECTED — AACE SOURCE** | Added the governing exponents (^0.65, ^0.7) to the formula and question text; numeric values/answer unchanged (already correctly derived from source Table 9.3) |
| VAC = BAC − EAC | RP 10S-90 | AACE-VALIDATED | None |
| ETC = EAC − AC | RP 10S-90 | AACE-VALIDATED | None |
| CV = EV − AC | RP 10S-90 | AACE-VALIDATED | None |
| EAC = BAC / CPI | RP 10S-90 (explicit: "original cost estimate/CPI = projected cost at completion") | AACE-VALIDATED | None — also confirms this is a source-endorsed method, not merely internally consistent |

## 11. Question Corrections

| Question ID | Chapter | Type | Issue | Source | Action |
|---|---|---|---|---|---|
| 9-28 | 9 | F1, S1 | Formula text omitted the governing exponents (^0.65 on Cooling Range, ^0.7 on Flow Rate) required by the real S&K6 CER, presenting them as plain linear "factors" | S&K6 Ch.9, Tables 9.2–9.3 | Corrected `q`, `explain`, `formula` fields to show the accurate exponent notation; upgraded `source` citation to name Table 9.2–9.3 specifically. Correct answer, options, and arithmetic unchanged (already valid) |
| 9-8 | 9 | T1 | whyWrong used informal "unknown-unknown" risk jargon not found in 10S-90's Management Reserve definition | RP 10S-90, MANAGEMENT RESERVE | Replaced with wording drawn directly from the 10S-90 definition ("discretionary management purposes outside the defined project scope...held outside the performance measurement baseline") |

No keyed (`correct`) answer was changed for any question in this pass. No question ID, chapter mapping, or difficulty rating was changed.

## 12. Source Metadata Corrections

- **9-28**: `source` field upgraded from the generic "Ch.9, Parametric Estimating (Cost Estimating Relationship)" to "S&K6 Ch.9, Table 9.2–9.3 (Cooling Tower Parametric CER)" — this specific table reference was directly confirmed against the source text, not invented.
- No other page/table references were added or changed in this pass. Per instructions, no new page number was fabricated for any other question; where an exact page could not be verified, existing chapter-level citations were left as-is rather than sharpened speculatively.

## 13. Source Conflicts

**No genuine source conflicts were found in this pass.** The original version of this report claimed two Blueprint-related conflicts (a domain-count mismatch and a citation-date mismatch); both were investigated further per corrective review, traced to a text-extraction gap (Section 9), and retracted — the app's 6-domain structure, weights, and "May 2026" Blueprint citations are all confirmed correct against the actual, visually-inspected Blueprint table. There is no conflict to resolve for either item.

No terminology conflicts requiring the 10S-90-supersedes-S&K6 rule were found in the terms actually checked (Section 5) — S&K6's wording, everywhere checked, was already consistent with 10S-90.

## 14. Previous SME Items

| # | Item | Resolution |
|---|---|---|
| 1 | 14-6 (VAC), distractor "USD -6.42 million" not traceable to a standard formula | **STILL SME REVIEW REQUIRED** — 10S-90 defines only the correct VAC formula (BAC−EAC); no source documents a specific incorrect-derivation pattern that would explain this value |
| 2 | 14-22 (ETC), distractor "USD 2.00 million" not traceable to a standard formula | **STILL SME REVIEW REQUIRED** — same reasoning for ETC |
| 3 | 97-question distractor-length statistical pattern | **RESOLVED — not a source-answerable question.** AACE sources govern content correctness, not distractor-length style; the prior pass's manual sampling (finding every case individually defensible) stands. No further action indicated by any of the 5 sources. |
| 4 | Source-citation page-number precision (bank-wide) | **PARTIALLY RESOLVED.** Several previously-generic citations were directly verified and one was sharpened with a confirmed table reference (9-28). A full page-by-page audit of all 830 citations remains outside this pass's feasible scope — **STILL SME REVIEW REQUIRED** as a general bank-wide item, though the specific instances checked in this pass all held up. |

## 15. Validation Status Summary

**Overall: PARTIAL AACE SOURCE VALIDATION.** These counts are exact, not blanket claims — 813 of 830 questions have not undergone authoritative source validation and must not be described as "AACE-validated."

Question-level counts (from the 17 manually, line-by-line source-validated in this pass, Section 4):
- **AACE-VALIDATED:** 16 (9-8's core allowance/contingency/reserve/escalation distinction, 10-12, 10-24, 11-11, 11-21, 7-17, 7-21, 6-12, 6-18, 23-6, 32-10, 14-6, 14-13, 14-16, 14-22, plus the Ch.33 TCM/TQM question; 9-28 counted separately below since it moved to "corrected")
- **AACE-VALIDATED WITH TERMINOLOGY UPDATE:** 1 (9-8)
- **CORRECTED — AACE SOURCE:** 1 (9-28)
- **SOURCE-METADATA CORRECTED:** 1 (9-28 — same question, distinct citation fix)
- **SME REVIEW REQUIRED:** 3 open items — 2 specific distractor values (14-6, 14-22) + 1 general bank-wide citation-precision item
- **NOT SOURCE-VALIDATED (questions):** 813 — structurally scanned and covered by automated regression checks only, not individually checked against AACE source text in this pass

Non-question-level findings (corrected in this pass):
- **Blueprint domain structure, weights, and quota logic (bank-wide, affecting all 830 questions' `domain` metadata and the Blueprint Mock): AACE-VALIDATED** — confirmed by direct visual inspection of Handbook pp. 9–10 (Section 9). This reverses the original report's incorrect "correction required" finding.
- **Blueprint task codes:** AACE-VALIDATED for the 3 codes sampled (1.A, 1.P, 4.H); **NOT SOURCE-VALIDATED** for the remaining task codes among the 128 generated questions (not individually re-checked one-by-one).
- **S&K6 Chapters 1–8 content beyond the specific items checked (Ch.6, Ch.7 formulas):** still **NOT SOURCE-VALIDATED** — full access to this range remains incomplete (Section 18).

## 16. Regression Tests

| Test | Result | Evidence |
|---|---|---|
| Structural validation (830 questions, unique IDs, valid options/correct-index, non-empty fields) | **PASS** | 0 issues found, before and after edits |
| Runtime question count unchanged | **PASS** | 830 before, 830 after |
| JS syntax validity | **PASS** | `node --check` on extracted script: no errors |
| P0-A preservation (no leaked distractor rationale) | **PASS** | Live scan of all 830×4 options for the 9 known leak substrings: 0 matches |
| P0-B preservation (Dashboard/Mastery labels) | **PASS** | Live render confirms "Chapters — All Attempts" and "Training gate (latest attempt/question)" both present |
| P1-A preservation (Error Notebook latest-attempt logic) | **PASS** | `notebookEntries()` source confirmed unchanged |
| P1-B preservation (no false "Substitute and calculate") | **PASS** | `humanCalculationExplanation()` source confirmed unchanged |
| Content/Pedagogy pass preservation (why-wrong classifier) | **PASS** | `humanWeakWhyWrong()` still contains the widened `GENERIC_FRAGMENTS` list; live-verified upgraded feedback rendering |
| 16-chapter learner-facing regression sample (Ch.1, 7, 9, 12, 13, 14, 21, 23, 25, 27, 29, 30, 31, 32, 33, 34) | **PASS** | Real Playwright click-through of each chapter with a live right/wrong attempt; 0 raw-generic-feedback occurrences; 0 JS page errors |
| Core system regression (Chapter Practice, Error Notebook, Weakness Report, Review Center, Dashboard, Mastery, Formula Lab, Method Selection, Study Plan, Cold Readiness, Practice Center, persistence across reload) | **PASS** | 11/11 views render non-empty with 0 JS errors; study history (5 attempts) persisted identically across a full page reload |
| Final-build smoke test on the exact `CCP_Exam_Coach_AACE_VALIDATED.html` file | **PASS** | 830 questions, unique IDs, no leak, all fix markers present, 0 page errors |

## 17. Previous Fix Preservation

- **P0-A: PASS** — no learner-visible distractor-rationale leakage found anywhere in the 830-question live bank.
- **P0-B: PASS** — Dashboard and Chapter Readiness & Evidence metric labels remain distinct, honest, and correctly rendered.
- **P1-A: PASS** — corrected questions are not falsely counted as currently missed (underlying logic unchanged, confirmed present).
- **P1-B: PASS** — no narrative-only reasoning is falsely labeled "Substitute and calculate" (underlying logic unchanged, confirmed present).
- **Content/Pedagogy pass: PASS** — the why-wrong generic-template classifier remains functional (and this pass did not weaken it); wording fixes (18-5, 31-10) remain intact; duplicate repairs (10-24, 11-21, 7-21, 6-18) remain intact and are now additionally source-confirmed; the 830-question structural integrity is intact.

## 18. Remaining Known Limitations

Factual only:
- **`SK6_Part_1_Ch01-08.pdf` (8.1 MB) still could not be downloaded** in this corrective pass either — 10 total attempts across both passes (6 originally + 4 in this corrective review), all returning a connector session error specific to this file. Chapters 1–8 coverage remains limited to an earlier, connector-truncated extraction of the full single-file S&K6 copy (reaching partway into Chapter 8) — the same partial coverage as before, **not resolved**. Chapters 9–34 remain independently confirmed complete via the three smaller split files that did download successfully. **Per explicit instruction, this pass does not claim full S&K6 Chapters 1–34 access, and the overall status is reported as PARTIAL rather than a completed full-bank pass.** Recommendation: split `Ch01-08` into two smaller files (e.g., Ch.1–4 and Ch.5–8) so each is well under the connector's working size range, and retry.
- Of the 830 questions in the runtime bank, 17 were manually, line-by-line source-validated in this pass; the remaining 813 were structurally scanned and covered by existing automated regression checks, but were not individually re-checked against AACE source text.
- The Blueprint domain structure, weights, and quota logic were previously misreported as requiring correction; this was an extraction error (Section 9), now corrected — the app's implementation is confirmed accurate against the actual, visually-inspected Blueprint table. No outstanding Blueprint action item remains from this pass.
- The 128 runtime-generated Blueprint-reserve questions' granular task codes were spot-checked (3 of them) and matched exactly; the remaining task codes were not individually re-verified one-by-one against the Blueprint table in this pass.
- Two SME-flagged distractor values (14-6's "-6.42," 14-22's "$2.00 million") remain without a source-traceable derivation; no available source documents common incorrect-calculation patterns, only correct formulas.
- A full page-by-page citation audit of all 830 questions' source metadata was not performed; only citations directly tied to the 17 manually-checked questions (plus the Blueprint task-code sample) were verified or corrected.
