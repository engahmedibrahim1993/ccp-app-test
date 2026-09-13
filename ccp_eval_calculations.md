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

## Chapter 14 — Earned Value Overview (session 1)

| Q | Question | Formula | My calc | My answer | App answer | Agree? |
|---|---|---|---|---|---|---|
| 1 | %complete: BAC=20M, EV=8M | EV/BAC | 8/20=40% | B | B | Yes |
| 4 | ETC: EAC=22M, AC=6M | ETC=EAC-AC | 22-6=16M | A | A | Yes |
| 8 | 50/50 rule, started not finished, budget 80k | 50%×budget | 40,000 (deliberately picked "depends on %complete" instead) | Wrong by design | C $40,000 | No (by design — concept confusion) |
| 10 | EV: budget 500k, 40% complete | Budget×%complete | 500,000×0.40=200,000 | D | D | Yes |

All EVM formulas were applied correctly by me and matched the app. No
formula, sign, or unit issues found in Ch.14's calc items themselves. Two
worked solutions (Q1 %complete, Q4 ETC, Q8 50/50, Q10 EV) again show the
"repeat the same sentence 3x instead of substituting" pattern for Q8, while
Q10 does substitute properly ($500,000×0.40=$200,000) — same inconsistency
pattern as Ch.9.

## Chapter 29 — Statistics & Probability (session 1) — strongest calc chapter so far

| Q | Question | Formula | My calc | Answer | Agreement |
|---|---|---|---|---|---|
| 1 | Mean/median of 7 bids w/ outlier | mean=Σ/n; median=middle value | mean=31.5/7=4.5; median=3.8 | B | Yes |
| 2 | Binomial P(x≤1), n=20,p=0.05 (Hard) | (q)^n + n·p·q^(n-1) | 0.358+0.377=0.736 | A | Yes — independently derived via ln/e approximation, matched exactly |
| 4 | P(A or B), mutually exclusive, 0.30/0.25 | P(A)+P(B) | 0.55 | C | Yes (flagged Low confidence deliberately) |
| 6 | P(A and B), independent, 0.60/0.50 | P(A)×P(B) | 0.30 | A | Yes |
| 7 | Median of 10 values (even n) | avg of 5th/6th ranked | (20+22)/2=21 | B | Yes |
| 8 | Sample variance/std dev, n=10 (Hard) | s²=Σ(x-x̄)²/(n-1) | Σsq dev=292.1; /9=32.46; √=5.70 | B | Yes — independently computed full deviation table, matched exactly; good distractor (A uses /n=29.21, the population-variance trap) |
| 10 | Expected value, 0.7×$0 + 0.3×$50k | E(X)=ΣxP(x) | 15,000 | B | Yes |

Chapter 29's calculation questions are the best-designed of the 4 chapters
sampled so far: real formula-selection stakes (population vs sample
variance denominator, mutually-exclusive-addition vs independent-
multiplication, binomial vs simple proportion), not just "plug into one
obvious formula." Two independently-verified Hard questions (binomial
acceptance sampling, sample variance) both checked out exactly. No
calculation or formula errors found in this chapter.

## Content note — Ch.29 Q7 phrasing issue

Q7 opens with "Using the same 10 values: 12,15,15,18,20,22,25,25,25,30..."
— the phrase "the same" implies a preceding linked question established
this dataset, but in Chapter Practice mode (shuffled, no guaranteed
adjacency) there was no such preceding question in my session. The data is
thankfully restated in full within the question stem itself, so it's
answerable standalone and NOT a functional problem — but the wording
assumes a fixed authored sequence that random/shuffled delivery breaks.
Classification: AMBIGUOUS QUESTION / minor authoring inconsistency.
Severity: LOW. Confirms in ccp_eval_content_issues.md.

## Chapter 13 — Scheduling (session 1) — all correct, no issues

CPM basics (FS+lag, SS+lag, Total Float=LS-ES=0→critical), a schedule
recovery subtraction (79-4-2=73), and several "most appropriate response"
scenario items. All matched my independent reasoning exactly. No formula,
unit, or worked-solution problems found in this chapter's calc items.

## Chapter 27 — Financial & Cash Flow Analysis (session 1) — all correct, strong engineering-economy coverage

| Q | Question | Formula | My calc | Answer | Agreement |
|---|---|---|---|---|---|
| 2 | EAR, 10% nominal, semi-annual | (1+r/k)^k-1 | (1.05)²-1=10.25% | D | Yes |
| 3 | Simple interest, $500k @8%, 12mo | P×r×t | 500,000×0.08=40,000 | B | Yes |
| 4 | ROR via P/A factor match | Table lookup | 10,000/2,374=4.212→6% | C | Yes (question essentially gives the answer — see content note) |
| 5 | Compound vs simple interest diff, $5k@10%,2yr | Compound-Simple | 6,050-6,000=50 | B | Yes |
| 8 | EAR, 12% nominal, monthly | (1+r/k)^k-1 | (1.01)^12-1=12.68% | A | Yes — independently derived via logs, matched |
| 9 | FV annuity, $2,000/yr×8yr@7% | A×[(1+i)^n-1]/i | 2,000×10.2598=20,520 | C | Yes — derived factor from formula, not memorized table |
| 10 | FV single sum, $600k@9%,3yr | P(1+i)^n | 600,000×1.295029=777,017 | C | Yes |

All 7 calculation questions in Ch.27 checked out with no formula, sign, or
arithmetic issues. This chapter has the best mix of genuine engineering-
economy formula selection (simple vs compound, nominal vs effective,
single-sum vs annuity, rate-via-table-lookup) seen so far — recommend
highlighting Ch.27 and Ch.29 as the strongest-designed calculation
chapters in the final report.

## Content note — Ch.27 Q4 gives away its own answer

"Given (P/A,6%,5)=4.212 and $10,000/$2,374≈4.212, what is the ROR?" — the
question stem states the exact factor-to-rate mapping needed, so the
"calculation" is really just reading the 6% back out of the same sentence
that supplied it. Tagged Difficulty: Medium and "calculation," but requires
no independent work once read carefully. Classification: MINOR POLISH /
difficulty-label mismatch. Severity: LOW.

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
