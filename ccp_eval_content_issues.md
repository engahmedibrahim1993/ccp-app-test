# CCP Evaluation — Content Issue Log

No content issues have been observed yet. The live application could not be
reached from this environment during this session — see
`ccp_eval_checkpoint.md` and `ccp_eval_findings.md` for full evidence of the
network-policy blocker. This file will be populated once real questions have
actually been attempted through the rendered UI.

## Issue 1 — Generic (non-diagnostic) "why wrong" explanation

- Chapter: 1 — Cost Elements
- Topic: Direct Cost Aggregation
- Question: "A project's direct cost elements are: labor $42,000, material
  $118,000, equipment $35,000, and subcontract $27,000. What is the total
  direct cost?" A $180,000 / B $264,000 / C $222,000 / D $202,000
- My answer: D ($202,000), Medium confidence — simulated a plausible
  misread of one line item (e.g. treating equipment as ~$15,000 instead of
  $35,000: 42+118+15+27=202).
- App's marked answer: C ($222,000) — correct per straightforward addition.
- Why potentially weak: the "WHY YOUR ANSWER WAS WRONG" block is generic
  boilerplate identical in shape to what would appear for ANY wrong choice:
  "The incorrect options typically reflect a wrong formula, mis-substitution,
  or arithmetic slip — verify each step against the formula shown above."
  It does not attempt to reverse-engineer which specific slip produced
  $202,000, nor point out which number was likely misread. A student who
  made a real arithmetic error gets no specific correction — only "redo the
  math." Compare to the "WORKED SOLUTION" block, which is well structured
  (formula → substitution → result → check) but the "check" line itself is
  also generic ("must be consistent with units, sign, direction") rather
  than a concrete sanity check for this problem (e.g. "this is a sum, so
  the result must exceed every individual line item").
- Classification: LEARNING / PEDAGOGY GAP
- Severity: MEDIUM (feedback quality, not correctness — the marked answer
  is correct)
- Confidence in this finding: HIGH (directly observed, reproducible pattern
  language, not a one-off)

## Issue 2 — "Substitute and calculate" step sometimes doesn't substitute (inconsistent across content batches)

- Chapters observed: 9 (Cost Estimating)
- Examples:
  - Cost indexing Q (SAR 4.00M, index 200→300): WORKED SOLUTION steps 1–3
    are all the *identical* sentence "Index adjustment = historical cost x
    current index / historical index = SAR 6.00 million" — step 2
    ("Substitute and calculate") never actually substitutes 4.00, 300, 200.
  - Sequential-markup BOQ Q (1,800 units, $105/unit, +10%+10%): same pattern
    — all 3 steps repeat "Direct=USD 189,000; after overhead=USD 207,900;
    after profit=USD 228,690" verbatim, no visible multiplication shown.
  - By contrast, the Physical Dimensions (area) method Q in the same
    chapter DOES show real substitution: "$540,000/2,400 = $225/SM;
    $225×3,100 = $697,500" across the same 3-step template.
- Pattern: questions tagged `Source: CCP practice pool (verified)` or
  `S&K6 Ch.X, p.YY` (older/first content batch, e.g. Ch.1 questions) tend to
  show real substitution; some (not all) `Blueprint: 1.X` / newer
  `Current CCP Candidate Handbook (May 2026 Blueprint)`-sourced items reuse
  the same narrative string across all 3 worked-solution steps instead of
  real arithmetic. Not universal — needs more sampling across chapters to
  confirm the exact split, but it is reproducible on at least 2 of 10
  questions in Ch.9 alone.
- Why potentially weak: a "Substitute and calculate" step that doesn't show
  the substitution defeats the stated purpose of teaching HOW to solve
  similar problems — a genuinely confused student gets no worked arithmetic
  to check their own work against, only the final formula and final number.
- Classification: LEARNING / PEDAGOGY GAP (worked-solution quality)
- Severity: MEDIUM-HIGH (recurring, undermines the app's own stated
  "WORKED SOLUTION" pedagogy pattern for calculation questions specifically)
- Confidence: HIGH (directly observed and reproducible, contrasted against
  a working counter-example in the same session)

## Note — generic step 4 "Check" is boilerplate on every worked solution seen so far

Every WORKED SOLUTION block's step 4 has read verbatim: "The result must be
consistent with the units, sign, and direction required by the stem." This
never varies per-question (not even to state the actual expected sign/
direction/magnitude for that specific problem), across all ~7 calculation
questions seen in Ch.1 and Ch.9. Low standalone severity, but combines with
Issue 2 above to weaken the "worked solution" pedagogy pattern generally.

## Note — "most appropriate response" scenario-question template is repetitive (Ch.9)

5 of 10 Ch.9 questions used the identical stem shape "A [scenario]. Which
response is most appropriate?" with one comprehensive/correct answer and
three answers that are each individually incomplete, lazy-shortcut, or
scope-omitting. Once the pattern is recognized ("pick the most thorough,
multi-part answer"), a test-wise but under-prepared candidate could score
well without deep domain knowledge — worth checking whether this template
dominates other Blueprint-tagged chapters too, as it could be gamed.
Classification: AMBIGUOUS QUESTION / weak-distractor-design pattern (not
wrong, but discriminates less than a well-designed single-best-answer MCQ
should). Severity: LOW-MEDIUM. Confidence: MEDIUM (only 10 samples so far).

## Issue 3 — "Same 10 values" phrasing assumes fixed question order that shuffled delivery breaks

- Chapter: 29 — Statistics & Probability
- Question: "Using the same 10 values: 12,15,15,18,20,22,25,25,25,30, what
  is the median?" (and a follow-up "Using the dataset 12,15,... (n=10,
  mean=20.7), what are the sample variance and standard deviation?")
- Why potentially weak: "the same" implies a directly preceding question
  established this dataset (likely true in the original authored sequence),
  but Chapter Practice draws a shuffled/filtered subset, so a student could
  see this question without ever having seen "the first" one. Data is
  restated in full in the stem, so it remains answerable, but the phrasing
  is confusing/momentarily disorienting ("wait, what same values?") and a
  less confident student might waste time looking for a missing prior
  question.
- Classification: AMBIGUOUS QUESTION (minor authoring/sequencing issue)
- Severity: LOW
- Confidence: HIGH (directly observed, low ambiguity about the cause)

## Issue 4 — Ch.6 "purchase price" redefined mid-problem without signaling it

- Chapter: 6 — Machinery, Equipment & Tools
- Question: dealer buys a lathe for $6,200 + $500 deinstall/rigging/delivery,
  applies cost-of-money (10%/yr, 3mo) + "overhead at 20% of purchase price"
  + "profit at 20% of purchase price."
- App's marked answer (verified correct, I derived it independently before
  seeing the rationale): $9,547.50, computed by treating "purchase price" as
  $6,700 (i.e., $6,200 auction price **plus** the $500 deinstall/rigging/
  delivery cost) for the cost-of-money, overhead, AND profit calculations.
- Why potentially weak: the stem introduces "$6,200" specifically as what
  was paid "at auction" and separately introduces "$500 for deinstallation,
  rigging, and delivery" as a distinct cost — a plain reading defines
  "purchase price" as $6,200 only. The worked solution then silently states
  "Purchase price = $6,200+$500 = $6,700" and applies all percentages to
  that combined figure. A careful reader who takes "purchase price" at its
  first, narrower meaning would compute a different (unlisted) subtotal.
  Fortunately none of the 4 answer options match that literal alternate
  reading either, so a student re-checking arithmetic against the options
  would still likely arrive at D — but the terminology inconsistency itself
  is a real authoring flaw that could cost time/confidence under exam
  pressure.
- Classification: CALCULATION / FORMULA ISSUE (terminology ambiguity, not
  a wrong final answer)
- Severity: LOW-MEDIUM
- Confidence: HIGH (verified by independently computing multiple
  interpretations and comparing to the stated rationale)

## Issue 5 — Ch.6 near-duplicate question appeared twice in one 5-question sample

- The exact same dealer/lathe pricing scenario (same numbers: $6,200
  auction price, $500 deinstall/rigging/delivery, 10%/3mo cost of money,
  20%/20% overhead/profit) appeared as both Question 2 ("What is the
  minimum desired selling price (subtotal of all these components)?") and
  Question 3 ("What is the resulting market valuation?") of the same
  5-question Chapter 6 session — different question wording, identical
  numbers, identical correct answer ($9,547.50), answer options in the
  same order.
- Why potentially weak: in a 24-question chapter pool, drawing the same
  underlying scenario twice in a 5-question sample suggests either the pool
  is smaller/more repetitive than the "24 eligible questions" count implies
  (i.e., two "different" bank entries are really the same content restated),
  or the shuffling logic has no duplicate-scenario protection within a
  session. Either way it reduces perceived question variety and wastes a
  learning opportunity that could have covered new ground instead.
- Classification: LEARNING / PEDAGOGY GAP (content variety) — could also be
  QUESTION-BANK CONTENT ISSUE if the two are literally cloned entries
- Severity: MEDIUM (if this pattern recurs across other chapters, it should
  be escalated — flagged here as a first observation, watch for repeats)
- Confidence: HIGH (directly observed, identical numbers/answer)

## Issue 6 — Recurring leading-word truncation in question stems (3+ occurrences)

- Chapters: 2, 17 (x2 so far)
- Examples:
  - Ch.2 Q1: "the cost classification used in the costing-pricing
    process, which of these belongs under Indirect Costs..." (missing
    opening word, likely "In")
  - Ch.17 Q1: "the most comprehensive Construction Industry Institute
    (CII) study to date, what was identified..." (missing "In")
  - Ch.17 Q2: "If cost control should not function as an independent audit
    arm reporting to senior management, what mechanism does describe as
    more than adequate..." (missing subject after "does", e.g. "does
    [S&K6/the text] describe")
- Why potentially weak: minor readability/professionalism issue — doesn't
  block answering (context is still inferable) but looks unpolished and
  could momentarily confuse a non-native-English speaker, of whom the CCP
  candidate pool likely has many (AACE is an international body).
- Classification: MINOR POLISH (text rendering/authoring)
- Severity: LOW (cosmetic, does not affect answerability)
- Confidence: HIGH (directly observed 3 times across 2 chapters so far —
  worth flagging as a systemic small-scale content-QA gap rather than
  isolated typos, likely from an automated content pipeline dropping a
  leading token)

Planned record format per entry, once testing resumes:

- Question ID (if visible)
- Chapter
- Topic
- Visible question text
- Relevant options
- App's marked answer
- My independent reasoning
- Why potentially incorrect / ambiguous / weak
- Confidence in this finding (Low/Medium/High)
