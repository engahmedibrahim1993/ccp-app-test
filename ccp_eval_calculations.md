# CCP Evaluation — Calculation Audit Log

No calculation questions have been observed yet. The live application could
not be reached from this environment (network egress policy blocks the
target host — see `ccp_eval_checkpoint.md` and `ccp_eval_findings.md` for
full evidence). This file will be populated once Phase 4 (Calculation
Quality) work actually begins.

## Chapter 1 — Cost Elements (session 1, all straightforward — logged for completeness)

| Q | Question | Formula | My calc | My answer | App answer | Agree? | Note |
|---|---|---|---|---|---|---|---|
| 3 | Total $250k, direct $190k → indirect? | Indirect = Total − Direct | 250,000−190,000=60,000 | B $60,000 | B $60,000 | Yes | Clean |
| 4 | Sum 5 indirect elements | Σ elements | 8,500+15,000+22,000+18,000+9,500=73,000 | B $73,000 | B $73,000 | Yes | Clean |
| 7 | Sum 4 direct elements | Σ elements | Correct sum = 222,000; I deliberately simulated misreading equipment as ~$15k → 202,000 | D $202,000 (wrong, deliberate) | C $222,000 | No (by design) | See ccp_eval_content_issues.md Issue 1 — app's "why wrong" text is generic, doesn't diagnose the misread |
| 8 | Total = direct 222k + indirect 73k | Total = Direct+Indirect | 222,000+73,000=295,000 | B $295,000 | B $295,000 | Yes | Clean |

No formula, unit, sign, or rounding problems found in Chapter 1's calculation
items — all are simple additions/subtractions with unambiguous correct
answers and matching worked solutions. Nothing here yet stresses formula
*selection* (multiple candidate formulas) — expect that in Ch.9 Cost
Estimating, Ch.14 EV, Ch.27 Financial/Cash Flow, Ch.29 Statistics.

## Chapter 9 — Cost Estimating (session 1)

| Q | Question | Formula | My calc | My answer | App answer | Agree? | Note |
|---|---|---|---|---|---|---|---|
| 3 | Index: SAR 4.00M @ idx200 → idx300 | New = Old×(New idx/Old idx) | 4.00M×1.5=6.00M | B $6.00M | B $6.00M | Yes | Worked solution didn't show real substitution (Issue 2) |
| 8 | BOQ 1,800u, $75+$18+$12/u, +10%+10% sequential | Direct×1.10×1.10 | 1,800×105=189,000; ×1.1=207,900; ×1.1=228,690 | (deliberately picked flat-20% trap C, low conf) | B $228,690 | No (by design) | Good distractor design (flat-% trap vs correct sequential compounding vs "forgot markup" trap); worked solution again didn't show real substitution |
| 10 | Warehouse 2,400 SM=$540k → 3,100 SM | $/SM × new SM | 540,000/2,400=225; ×3,100=697,500 | C $697,500 | C $697,500 | Yes | This one DID show real substitution — inconsistent with Q3/Q8 |

Formula-selection quality in Ch.9 calc questions is good (cost indexing,
sequential vs. flat markup, unit-rate/area scaling, allowance-vs-contingency
classification) — genuinely tests recognizing which method applies, not just
arithmetic. Main issue found so far is the worked-solution substitution
inconsistency noted above, not the underlying math or formula choice itself.

Planned record format per entry, once testing resumes:

- Question ID (if visible)
- Chapter / topic
- What is being asked
- Formula I selected (independent, before submitting)
- My inputs / units / calculation / final answer
- App's marked answer + shown formula/substitution/arithmetic
- Agreement / disagreement
- Explanation quality
- Issue classification (if any) + severity
