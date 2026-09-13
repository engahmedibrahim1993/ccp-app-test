# CCP Evaluation — Findings Log

No learner-experience findings yet. No question, chapter, calculation,
feedback, or dashboard content has been observed, because the live
application could not be reached from this environment (see
`ccp_eval_checkpoint.md` for full detail).

## Session 2 — Real Evaluation Begins (local app file, network blocker resolved)

### STRONG POSITIVE FINDING — Weakness Report / confidence×correctness engine is mathematically sound

After 20 Chapter Practice questions (Ch.1 + Ch.9) with a deliberately constructed
history (1 Wrong+High/misconception, 1 Wrong+Medium, 1 Wrong+Low, rest
Correct at High/Medium) plus a 3-question Wrong Answers Review retry (all
corrected), the Weakness Report showed:
- 23 recorded attempts total (10+10+3) — correct.
- Confidence×correctness bucket counts (18 Correct+High, 2 Correct+Medium,
  0 Correct+Low, 1 Wrong+High, 1 Wrong+Medium, 1 Wrong+Low) — I hand-verified
  every one of these against my own answer log and they are **exactly
  correct**, including correctly bucketing the 3 corrected retries as new
  Correct+High attempts rather than overwriting the original wrong attempts.
- The one topic with a genuine high-confidence miss ("Allowances vs
  contingency") is still shown at "50% (1/2)" and flagged as the #1 priority
  weak area / "contains a flagged misconception" **even after I answered it
  correctly on retry** — this is not a bug, it's counting both the original
  miss and the corrected retry as two separate attempts (1 of 2 correct =
  50%), and correctly declines to instantly clear a flagged misconception
  from a single immediate correct retry. This matches sound learning-science
  practice (one correct retry ≠ retained mastery) and is a genuine strength
  to highlight in the final report, not a defect.
- Root-cause distribution (1 Concept Gap, 1 Formula Selection) also matched
  exactly what I self-classified on the two questions I actually classified
  (the third wrong answer, Ch1 Q7, was auto-advanced past without
  classification, and correctly does NOT appear in the root-cause
  distribution — it's absent from "2 classified mistakes," confirming
  unclassified mistakes are excluded rather than silently miscounted).
- Domain and difficulty breakdowns (Domain 1 86%, Domain 3 100%; Easy 80%,
  Medium 88%, Hard 100%) also reconcile correctly against the raw data.

This is meaningful, verified evidence (not a superficial glance) that the
underlying analytics engine driving weakness diagnosis is trustworthy at
this scale. Will need to re-verify at larger scale (more chapters, more
attempts) before generalizing, but this is a strong start.

### BUG — Distractor-option text leaks the answer-key rationale (CRITICAL)

- **Severity:** CRITICAL
- **Feature:** Chapter Practice question rendering (Ch.10 Process Product
  Manufacturing, and possibly wider — needs a broader sweep)
- **Reproduction steps:**
  1. Chapter Practice → Ch.10 — Process Product Manufacturing → Mixed,
     10 questions, All difficulty, Immediate feedback, Confidence On.
  2. Question 4 ("A plant's full-capacity annual sales income is
     $9,600,000... what is the sales income at 70% of capacity?") rendered
     its answer choices as:
     - A $6,720,000
     - **B $3,360,000 (mistakenly halving the correct result)**
     - C $9,600,000 (unchanged from full capacity)
     - **D $2,880,000 (30% of capacity instead of 70%)**
  3. The parenthetical text after options B and D is clearly author-facing
     answer-key/distractor-rationale metadata ("mistakenly halving the
     correct result", "30% of capacity instead of 70%") that leaked into
     the student-facing option label, visible BEFORE submitting an answer.
  4. Also seen on option C ("unchanged from full capacity") — less
     damaging since it just restates the scenario, but still metadata-
     shaped, not natural answer-choice phrasing.
- **Expected behavior:** Answer options should show only the value/choice
  a real exam would show (e.g., plain "$3,360,000"), with any "why this
  distractor is wrong" explanation reserved for the post-submission
  feedback screen only.
- **Observed behavior:** The distractor's designed failure mode is spelled
  out in parentheses directly on the option button, visible pre-answer.
  A test-wise student doesn't even need to know the material — the
  parenthetical literally tells you "this is the wrong 30%-instead-of-70%
  answer" and "this is the mistakenly-halved answer," making the correct
  answer (A, the one WITHOUT a give-away parenthetical) identifiable by
  elimination alone.
- **Student impact:** This directly undermines validity for any question
  that has this leak — the question stops testing knowledge and starts
  testing "which option has no confession attached." For self-practice
  this is merely unhelpful (inflates scores, teaches nothing); if similar
  leakage exists in Mock/Simulation modes it would be a much more serious
  exam-readiness/content-integrity problem.
- **Reproduced?** Yes, at least twice independently: Ch.10 Q4 (above) AND
  earlier, Ch.29 Q8 (Statistics — sample variance/std dev question) had
  option C rendered as "Variance≈5.70, Std Dev≈32.46 **(reversed)**" — the
  exact same pattern (a dev-facing note on how the distractor was
  constructed, i.e. "these two values are swapped," leaking into the
  student-facing label) — I noted it at the time in
  ccp_eval_calculations.md but did not yet escalate it as a bug; doing so
  now that a second, clearer instance confirms it's systemic rather than a
  one-off typo. Have not yet done a systematic sweep for how common this
  is across the ~830-question bank — likely tied to a specific
  content-generation/authoring batch (possibly the same one responsible
  for the "Substitute and calculate" template-repetition issue, Issue 2 in
  ccp_eval_content_issues.md) — flagging for Pass 2 / broader Phase 3-4
  sampling to check prevalence.
- **Additional evidence:** Ch.30 (Optimization) Q4/Q5 LP maximization
  question had an option rendered as "X1=60, X2=0, max profit=$1,500
  **(infeasible)**" — again a mechanism-revealing annotation (this option
  ignores the binding labor constraint) baked into the visible option text
  rather than reserved for post-submission feedback. Lower severity than
  the Ch.10/Ch.29 examples (a single word, and arguably closer to
  legitimate scenario framing than a full "why this is wrong" sentence),
  but consistent with the same authoring pattern.
- **Recommended fix:** Server/content-side strip of any parenthetical
  distractor-rationale text from option labels before rendering; add a
  content-QA check that flags option strings matching patterns like
  "(mistakenly ...)", "(instead of ...)", "(reversed)", "(unchanged from
  ...)" etc. (note: similar bracketed asides were also seen framing
  correct answers in other chapters, e.g. Ch.29 "(reversed)" pairing and
  Ch.9's "(the 9.0 bid is a clear outlier...)" — the latter is fine, it's
  scenario context, not a distractor-mechanism confession; the pattern to
  strip specifically is meta-commentary on WHY an option is right/wrong).

### BUG — Error Notebook "currently missed" count never clears after correcting the mistake

- **Severity:** HIGH
- **Feature:** Error Notebook (Fix Mistakes → Error Notebook), and by
  extension "Wrong Answers Review" / "Retry these 3 questions"
- **Reproduction steps:**
  1. Answer 3 questions incorrectly across two Chapter Practice sessions
     (Ch.1 Q7, Ch.9 Q7, Ch.9 Q8 — done deliberately for this evaluation).
  2. Open Fix Mistakes → Wrong Answers Review. Answer all 3 correctly
     (confirmed via on-screen "3/3 · 100%" results, "Clean sweep — no
     missed questions this session").
  3. Open Fix Mistakes → Weakness Report: correctly reflects the retry as
     new evidence (topic accuracy recalculates to include the retry
     attempt — see the positive finding above).
  4. Open Fix Mistakes → Error Notebook: **still reads "3 question(s)
     currently missed (most recent attempt was wrong)"** and lists the
     exact same 3 questions as still-missed, with no acknowledgment of the
     corrected retry.
  5. Repeated the entire retry (via the Error Notebook's own "Retry these
     3 questions" button this time, not the Fix-Mistakes-hub entry point —
     confirmed both buttons route to the identical "WRONG ANSWERS REVIEW"
     screen) — answered all 3 correctly again (3/3, 100%).
  6. Re-opened Error Notebook immediately after: **still "3 question(s)
     currently missed (most recent attempt was wrong)"**, unchanged.
- **Expected behavior:** "most recent attempt was wrong" should become
  false for a question once its most recent attempt (via any retry path)
  is correct — the count should drop toward 0 as mistakes are fixed,
  consistent with the app's own description of the feature ("Auto-populated
  ... 3 question(s) currently missed (most recent attempt was wrong)").
- **Observed behavior:** The count and question list are frozen at the
  original miss and do not update no matter how many times the same
  question is subsequently answered correctly through the app's own retry
  flow.
- **Student impact:** A student doing exactly what the app recommends
  (fix your mistakes, then check your Error Notebook) sees no evidence
  their correction registered. In Final Week Mode this is actively harmful:
  either the student keeps re-reviewing material they've already fixed
  (wasted time under time pressure), or — worse — loses trust in the
  feature and stops using it, or believes they still have unresolved gaps
  they've actually already closed.
- **Reproduced?** Yes — twice, via two different entry points that share
  the same underlying screen, both immediately after a confirmed 100%
  correct retry session.
- **Note:** This sits alongside (but is distinct from) the earlier
  Weakness-Report finding, which DOES update correctly. So the bug appears
  specific to whatever "currently missed" flag drives the Error Notebook's
  count/filter — Pass 2 (code inspection) should target that specific
  piece of state once the blind pass is far enough along to justify it.

## Session 1 — Infrastructure Finding (not an app finding)

- **Type:** Environment/infrastructure blocker (explicitly NOT a
  "Playwright/Claude/browser infrastructure failure classified as an app
  bug" — this is the opposite: documented evidence that the app itself was
  never reached, so no app bug can yet be attributed).
- **Severity:** CRITICAL (blocks the entire evaluation)
- **Evidence:**
  - `curl -v https://rococo-daifuku-1076a2.netlify.app/` → proxy CONNECT
    tunnel returns `403 Forbidden`.
  - Raw socket CONNECT to the proxy (`127.0.0.1:38071`) returns body:
    `request blocked: no rule or allowlist entry allows host
    "rococo-daifuku-1076a2.netlify.app"`.
  - Playwright `page.goto()` on the same URL → `net::ERR_TUNNEL_CONNECTION_FAILED`.
  - Control requests to unrelated hosts (`www.google.com`, `netlify.app`,
    `app.netlify.com`) were blocked identically, while `github.com` returned
    a normal (non-403) HTTP response — proving the block is a session-wide
    default-deny egress allowlist that simply does not include this
    deployment's domain, not a bug in the target site or in the browser
    harness.
- **Root cause:** This remote execution environment's network policy
  (configured when the environment was created — see
  https://code.claude.com/docs/en/claude-code-on-the-web) does not permit
  outbound HTTPS to `netlify.app` subdomains.
- **Action taken:** None to bypass it (per hard rule: never disable TLS
  verification, never unset `HTTPS_PROXY`, never retry a 403/407 policy
  denial). Reported instead.
- **Required to proceed:** The environment must be recreated/reconfigured
  with a network policy that allows this host, after which this checkpoint
  system will resume automatically from "Next Exact Action" in
  `ccp_eval_checkpoint.md`.
