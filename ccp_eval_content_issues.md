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
