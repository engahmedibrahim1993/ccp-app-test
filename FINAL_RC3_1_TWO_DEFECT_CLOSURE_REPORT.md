# CCP Exam Coach Study Studio v1.2.0 RC3.1 — Two-Defect Closure Report

**Scope:** This is a narrow, two-defect closure patch on top of RC3. Two post-RC3 defects were
subsequently discovered by independent review: missing diagnostic coverage for nine RC3-added
Challenge items, and a state-dependent global-census false positive caused by `FRESHCHALLENGE`
(and related) runtime session state. Neither defect was closed in RC3, and this report does not
claim otherwise. RC3 was not modified, RC1 and RC2 were not modified, no native question content
was modified, and no RC4 was created.

---

## 1. Baseline Reproduction of Both Defects

Before any edit: `git status` clean, branch `claude/ccp-exam-prep-eval-48nukj`, local HEAD
matched origin. `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.html` SHA-256 recomputed and confirmed:
`804e9fbab84129d3550a7d0382c4d9cb927cf69e00965d79a46416adb1b8b39e`. Native `QUESTIONS` literal
(precise bracket-matched `[...]` array text) recomputed and confirmed:
`bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c`, 702 items.

**Defect 1 reproduction (on RC3.html, before any change).** `v52aChapterCoverage()` was run for
chapters 1, 3, 15, 19, 20, 32. `V52A_DISTRACTOR_DIAGNOSTICS[id]` was queried for all nine item
IDs and returned `null` for every one:

| Chapter | TOTAL_CANONICAL | UNMAPPED_ACTIVE (before) |
|---|---|---|
| 1 | 37 | 1 |
| 3 | 33 | 1 |
| 15 | 53 | 1 |
| 19 | 52 | 2 |
| 20 | 47 | 2 |
| 32 | 46 | 2 |

Total `UNMAPPED_ACTIVE` across the six chapters: 9 — matching exactly the nine RC3-added items,
confirming `v52aChapterCoverage()` does include `V520_CHALLENGE_EXTRAS` in its canonical
population (verified directly in the function body, line ~14345 of RC3.html) and that these are
genuinely active, undiagnosed learner-facing items, not exempt utility records.

**Defect 2 reproduction (on RC3.html, before any change).**

- A. Clean page: `integrityResults()` → 131/131 passing. `v518GlobalCensus()` → `unexpected: []`.
- B. A real Transfer/Fresh Challenge session was started via the actual app function
  (`autoGenerateAndStartFresh('9', 2, 10, {...})`, not a synthetic mock), populating
  `FRESHCHALLENGE.items` with 10 real, question-shaped items (confirmed:
  `FRESHCHALLENGE.items.length === 10`, each item carrying `options` and a text field).
- C. Re-running `v518GlobalCensus()` and `integrityResults()` after that session:
  `census.unexpected` now contained `[{"bank":"SESSION","count":1},{"bank":"FRESHCHALLENGE","count":10}]`,
  and `integrityResults()` dropped to **130/131**, the single failing check being
  `"Global content census - no unexpected undiscovered bank"`.

**An additional related false-positive was found during this same reproduction pass**, not
mentioned in the original defect report but discovered by directly exercising the actual
regression suite: `SESSION` itself was already flagged as `unexpected` merely from calling
`integrityResults()` once on a clean page (a residual side effect of one of its own internal
self-tests leaving `SESSION`'s state non-empty), independent of any real Transfer session. This
confirmed the underlying bug is a genuine *classification* defect — the census cannot tell
mutable runtime session state from an authored content bank — not a defect narrowly specific to
`FRESHCHALLENGE`, exactly as anticipated by the mission's instruction to check for other
analogous containers.

---

## 2. Fix 1 — Diagnostic Coverage for the Nine RC3-Added Items

### 2.1 Item IDs

`cx1_1`, `cx3_2`, `cx15_1`, `cx19_1`, `cx19_2`, `cx20_2`, `cx20_3`, `cx32_1`, `cx32_2`.

### 2.2 Diagnostic Row Counts Per Item

Every item received exactly 3 diagnostic rows — one per wrong option (each item has 4 options,
1 correct, 3 wrong) — for **27 rows total**. No correct-option row was added for any item
(independently verified: `rows.filter(r => r.is_correct === 'yes').length === 0` for all nine
items). Each row's `option_text` was verified to match exactly one of the item's actual wrong
options (no orphaned or mismatched rows), and no `option_identity` is duplicated within an item.

### 2.3 Diagnostic Status / Error Class / Misconception / Skill / Evidence-Family Summary

| Item | Chapter | Topic | Error classes used | Diagnostic statuses used | Misconception codes | Skill ID(s) |
|---|---|---|---|---|---|---|
| cx1_1 | 1 | Direct vs Indirect Cost Classification | CONCEPT_GAP ×3 (1 with secondary QUESTION_READING_INTERPRETATION) | SPECIFIC_DIAGNOSIS_VERIFIED ×3 | `DIRECT_INDIRECT_COST_MISCLASSIFICATION` (reused, existing) | `DIRECT_INDIRECT_COST_CLASSIFICATION` (reused) |
| cx3_2 | 3 | Safety Stock and Lead-Time Variability | CONCEPT_GAP ×2, QUESTION_READING_INTERPRETATION ×1 | SPECIFIC_DIAGNOSIS_VERIFIED ×3 | `SAFETY_STOCK_UNIFORM_APPLICATION_ASSUMED`, `SAFETY_STOCK_VARIABILITY_EVIDENCE_CONTRADICTED`, `SAFETY_STOCK_CROSS_ITEM_LEVER_SUBSTITUTION` (new) | `SAFETY_STOCK_PURPOSE` (reused) |
| cx15_1 | 15 | Combined Schedule/Cost Index Interpretation | CONCEPT_GAP ×3 | SPECIFIC_DIAGNOSIS_VERIFIED ×3 | `SPI_DIRECTION`, `CPI_DIRECTION` (reused, existing), `SPI_CPI_JOINT_INTERPRETATION_DENIED` (new) | `EVM_INTERPRETATION` (reused), `CPI_SPI_INTERPRETATION` (reused) |
| cx19_1 | 19 | Labor Efficiency Variance Isolation | CONCEPT_GAP ×2, CALCULATION_ERROR ×1 | SPECIFIC_DIAGNOSIS_VERIFIED ×2, SPECIFIC_CALCULATION_PATH_VERIFIED ×1 | `QUANTITY_VS_RATE_VARIANCE_CAUSE` (reused, existing), `LABOR_VARIANCE_NETTING_TO_ZERO_ASSUMED`, `LABOR_VARIANCE_DECOMPOSITION_DENIED` (new) | `QUANTITY_RATE_VARIANCE` (reused) |
| cx19_2 | 19 | Labor-Specific EAC Assumption Selection | CONCEPT_GAP ×3 (1 with secondary QUESTION_READING_INTERPRETATION) | SPECIFIC_DIAGNOSIS_VERIFIED ×3 | `EAC_ASSUMPTION_MISMATCH` (reused, existing), `EAC_ASSUMPTION_UNSTATED_SCHEDULE_FACTOR_FABRICATED`, `EAC_ACTUAL_COST_TO_DATE_DISREGARDED` (new) | `EAC_FORECASTING` (reused) |
| cx20_2 | 20 | Conflict Resolution Style Selection | CONCEPT_GAP ×3 | SPECIFIC_DIAGNOSIS_VERIFIED ×3 | `CONFLICT_TECHNIQUE_AVOIDANCE_UNDER_TIME_PRESSURE`, `CONFLICT_TECHNIQUE_ACCOMMODATION_WRONG_BASIS`, `CONFLICT_TECHNIQUE_FORCING_WITHOUT_TECHNICAL_REVIEW` (new) | `CONFLICT_RESOLUTION_TECHNIQUES` (reused) |
| cx20_3 | 20 | Situational Leadership and Delegation Readiness | CONCEPT_GAP ×3 (1 with secondary QUESTION_READING_INTERPRETATION) | SPECIFIC_DIAGNOSIS_VERIFIED ×3 | `SITUATIONAL_LEADERSHIP_READINESS_IGNORED`, `SITUATIONAL_LEADERSHIP_LOW_READINESS_GIVEN_FULL_AUTONOMY`, `SITUATIONAL_LEADERSHIP_DELEGATION_CATEGORICALLY_DENIED` (new) | `SITUATIONAL_LEADERSHIP_DELEGATION_READINESS` (**new skill_id** — see §2.5) |
| cx32_1 | 32 | Risk Response Strategy Selection | CONCEPT_GAP ×2, QUESTION_READING_INTERPRETATION ×1 | SPECIFIC_DIAGNOSIS_VERIFIED ×3 | `RISK_RESPONSE_STRATEGY_CATEGORY_CONFUSION` (reused, existing, all 3 rows) | `RISK_RESPONSE_STRATEGIES` (reused) |
| cx32_2 | 32 | Risk Register Update Discipline | CONCEPT_GAP ×3 | SPECIFIC_DIAGNOSIS_VERIFIED ×3 | `RISK_REGISTER_UPDATE_DEFERRED_TO_SCHEDULE`, `RISK_REGISTER_CLOSED_TO_NEW_RISKS_ASSUMED`, `RISK_REGISTER_ATTENTION_MISDIRECTED_TO_EXPIRED_RISK` (new) | `RISK_REGISTER_DEVELOPMENT` (reused) |

Only `error_class` values from the allowed set (`CONCEPT_GAP`, `FORMULA_METHOD_SELECTION`,
`CALCULATION_ERROR`, `QUESTION_READING_INTERPRETATION`) were used — independently verified
programmatically against all 27 rows, zero violations. `SPECIFIC_CALCULATION_PATH_VERIFIED` was
used for exactly one row (cx19_1's "exactly on budget" distractor), where a specific, reproducible
calculation disproves the option (`calculation_path_if_applicable`: "Actual cost = 1,200 hrs x
$42/hr = $50,400. Budgeted cost for the work performed = 1,000 hrs x $40/hr = $40,000. Total
variance = $50,400 − $40,000 = $10,400 unfavorable (not zero)."); every other row honestly uses
`SPECIFIC_DIAGNOSIS_VERIFIED`, since no other wrong option supports a reproducible numeric
calculation path — no specificity was inflated to manufacture a green result.

### 2.4 Affected-Chapter UNMAPPED_ACTIVE Before/After

| Chapter | UNMAPPED_ACTIVE before | UNMAPPED_ACTIVE after | DIAGNOSTICALLY_MAPPED_ACTIVE after | coveragePct after |
|---|---|---|---|---|
| 1 | 1 | **0** | 36 | 96% |
| 3 | 1 | **0** | 33 | 91% |
| 15 | 1 | **0** | 53 | 89% |
| 19 | 2 | **0** | 51 | 93% |
| 20 | 2 | **0** | 47 | 99% |
| 32 | 2 | **0** | 46 | 99% |

All six chapters: `UNMAPPED_ACTIVE = 0`, confirmed live via `v52aChapterCoverage()` on RC3.1.

### 2.5 Taxonomy Changes / Reuse

Before authoring, the existing `V52A_DISTRACTOR_DIAGNOSTICS` dataset (1,596 items, 920 distinct
`misconception_code` values at baseline) was searched by topic keyword for each of the nine items.
Six of nine items reused an existing, independently-precedented `skill_id` (and, where the
specific wrong-option mechanism matched exactly, an existing `misconception_code`) rather than
inventing a new one:

- `DIRECT_INDIRECT_COST_CLASSIFICATION` / `DIRECT_INDIRECT_COST_MISCLASSIFICATION` — already used
  42 times, including directly on native Chapter 1 items (1-1, 1-2, 1-10).
- `SAFETY_STOCK_PURPOSE` — already used on native Chapter 3 items (3-5).
- `EVM_INTERPRETATION` / `CPI_SPI_INTERPRETATION`, and the existing codes `SPI_DIRECTION` /
  `CPI_DIRECTION` — already used across Chapter 14/19 EVM items and Blueprint-task items.
- `QUANTITY_RATE_VARIANCE` / `QUANTITY_VS_RATE_VARIANCE_CAUSE` — already used on native item 19-8.
- `EAC_FORECASTING` / `EAC_ASSUMPTION_MISMATCH` — already used 17 times across Chapter 14/19 items.
- `CONFLICT_RESOLUTION_TECHNIQUES` — already used on Chapter 20 study-guide item sg20_10.
- `RISK_RESPONSE_STRATEGIES` / `RISK_RESPONSE_STRATEGY_CATEGORY_CONFUSION` — already used 10
  times, including on a Chapter 32 item (ts32_3).
- `RISK_REGISTER_DEVELOPMENT` — already used on a Blueprint task item (BP524-6_B-1).

Nine new, specifically-scoped `misconception_code` values were added only where no existing code
captured the exact wrong-option mechanism (listed in the table in §2.3); none of them duplicate an
existing code's meaning — each was checked against the full existing set for the reused `skill_id`
before being added. **One new `skill_id` was added**: `SITUATIONAL_LEADERSHIP_DELEGATION_READINESS`
(for cx20_3). A keyword search of the full existing dataset (1,596 items) for
"situational leadership," "readiness," and "delegat*" found no existing entry covering
Hersey-Blanchard-style readiness-based delegation — Chapter 20's existing taxonomy is extensive
(Likert, McGregor Theory X/Y, Maslow, Herzberg, Argyris, Blake-Mouton, Schein, and others) but did
not yet include this specific, standard leadership model, so a new skill_id was the correct,
non-duplicating choice rather than force-fitting an unrelated existing one.

**Non-blocking limitation, reported transparently (not fabricated):** for cx20_3's
`source_support`, no existing dataset row could be reused for precedent (unlike the other eight
items), so the citation is given at chapter level — `"S&K6 Ch.20 (Leadership & Management) —
situational/contingency leadership and delegation-readiness principles"` — without an
independently-verified specific page number, since this session has no direct access to the S&K6
PDF to page-verify. The underlying concept (situational leadership matching delegation to
demonstrated task-specific readiness) is standard, internally consistent project-management theory
with no evidence of conflict with any source material, and the item itself was already authored
and passed the full RC3 content-quality gate pipeline in the prior session — this is a citation-
precision gap, not a "source support insufficient or conflicting" condition requiring a mission
stop, and is flagged in the release-readiness report as a non-blocking limitation for a future
content-authoring pass to close with a verified page number.

### 2.6 Evidence Families

Each item's diagnostic rows use `evidence_family` equal to the item's own ID (e.g., `"cx1_1"`),
the standard pattern for a non-duplicated item (matching precedent, e.g. native item `14-1`'s own
diagnostic rows use `evidence_family: "14-1"`). None of the nine items were found to be a
representation-level duplicate of each other or of existing content: each addresses a distinct
scenario, chapter, and skill; no change to `CCP_v1.2_Evidence_Equivalence.csv` or
`EVIDENCE_EQUIVALENCE_GROUPS` was required or made.

### 2.7 Diagnostic/Taxonomy Integrity Verification

A dedicated verification pass checked all 27 new rows against every requirement in the mission:
required-field completeness, no correct-option rows, `error_class` from the allowed set only,
no duplicate `option_identity` within an item, exactly one row per actual wrong option (no
orphaned/mismatched rows), and no blank `calculation_path_if_applicable` on the one
`SPECIFIC_CALCULATION_PATH_VERIFIED` row. **Zero issues found.**

---

## 3. Fix 2 — FRESHCHALLENGE (and Related) False Content-Bank Census Finding

### 3.1 Root Cause

`v518GlobalCensus()`'s "unexpected bank" scan (`v518BankCount`) classifies any `window`-level
value as a content bank if it is an array (or an object with an array-valued property) whose first
few entries "look like a learner item" (`v518LooksLikeLearnerItem`: has a text field plus an
`options`/`correct`-like field). This heuristic cannot distinguish an **authored, static content
bank** (e.g. `QUESTIONS`, `EXAM_STUDY_GUIDE_BANK`) from **mutable, session-scoped runtime state**
that happens to hold real question objects while a quiz/challenge/simulation is in progress
(`SESSION.queue`, `FRESHCHALLENGE.items`, `FULLSIM.mcqQueue`, etc.) — both shapes pass the same
"looks like a learner item" test. The scan previously excluded only `CENSUS_MANIFEST`-listed banks
and a short `KNOWN_DERIVED_NONCONTENT` list of index/candidate-pool structures; no equivalent
exclusion existed for runtime session-state containers, so any of them populated with real
content at census time was misclassified as an unexpected, undiscovered authored bank.

### 3.2 Exact Census Code Change

A new frozen list, `KNOWN_RUNTIME_SESSION_STATE`, was added immediately after the existing
`KNOWN_DERIVED_NONCONTENT` (same file section, same pattern, same enforcement point), and the
scan's skip condition was extended to also check it:

```js
const KNOWN_RUNTIME_SESSION_STATE = Object.freeze([
  'SESSION', 'SESSION_CHECKPOINT', 'FRESHCHALLENGE', 'FULLSIM', 'GENSESSION',
  'DRILLSESSION', 'TIMEDCALC', 'METHODDRILL', 'MEMOSESSION',
  'PENDING_ACTIVE_SESSION', 'PENDING_ACTIVE_FULLSIM', 'PENDING_MEMO_DRAFT'
]);
window.KNOWN_RUNTIME_SESSION_STATE = KNOWN_RUNTIME_SESSION_STATE;
```

```js
for(const name of Object.getOwnPropertyNames(window)){
  if(seenBanks.has(name) || KNOWN_DERIVED_NONCONTENT.includes(name) || KNOWN_RUNTIME_SESSION_STATE.includes(name)) continue;
  ...
}
```

No change was made to `v518LooksLikeLearnerItem` or `v518BankCount` themselves (the detection
logic is untouched), no check was removed or weakened to always pass, and `FRESHCHALLENGE` (or
any other session container) was never cleared before running integrity — the fix is a
**classification** correction, exactly as the mission required.

**Twelve entries, not one.** The mission named `FRESHCHALLENGE` specifically; the actual fix
covers the whole class, discovered by direct empirical testing (§1, and the stateful matrix in
§3.4), not by inference alone: `SESSION` (surfaces merely from running `integrityResults()` once,
independent of any real Transfer session — a residual self-test side effect), `SESSION_CHECKPOINT`
(a clone of the in-progress queue kept for mid-session rollback, discovered live during the
"ordinary Practice" state), `FULLSIM`, `GENSESSION`, `DRILLSESSION`, `TIMEDCALC`, `METHODDRILL`,
`MEMOSESSION` (each confirmed to be declared as an empty/non-learner-shaped session object,
repopulated in place when that mode starts), and the three `PENDING_ACTIVE_*`/`PENDING_MEMO_DRAFT`
resume-payload holders (confirmed live to hold a real 5-item queue after a page reload with a
saved session, and still correctly excluded).

### 3.3 Negative Control

A synthetic, genuinely new authored-bank-shaped global was injected directly on `window`
(`SYNTHETIC_TEST_BANK_XYZ`, an array of two learner-shaped objects) and `v518GlobalCensus()` was
re-run: it **was still correctly flagged** as unexpected (`{"bank":"SYNTHETIC_TEST_BANK_XYZ","count":2}`),
proving the fix did not neuter the census's real job of catching a genuinely new, undiscovered
authored bank. This negative control was run once against RC3.html's pre-fix code (to confirm the
detection mechanism itself works) and again after the fix (to confirm the fix didn't break it) —
both times correctly detected.

### 3.4 Stateful Census Test Matrix

Twelve states were exercised on the fixed build via real app functions (not mocks), each checked
with a fresh `integrityResults()` + `v518GlobalCensus()` call:

| # | State | Trigger | Result |
|---|---|---|---|
| 1 | Clean page | — | `unexpected: []`, 131/131 |
| 2 | Ordinary Practice | `startSession()` (chapter mode) | `unexpected: []`, 131/131 |
| 3 | Apply Test | `autoGenerateAndStartFresh(ch,2,...)` | `unexpected: []`, 131/131 |
| 4 | Challenge Test | `autoGenerateAndStartFresh(ch,3,...)` | `unexpected: []`, 131/131 |
| 5 | Blueprint Transfer Check (119Q) | `startOfflineFreshBlueprint()` | `unexpected: []`, 131/131 |
| 6 | Chapter Transfer / Fresh Challenge (repeat) | `autoGenerateAndStartFresh(ch,2,...)` | `unexpected: []`, 131/131 |
| 7 | Active Full Simulation | `goFullSimulation()` | `unexpected: []`, 131/131 |
| 8 | Generated/Random practice | `startGeneratedPractice()` | `unexpected: []`, 131/131 |
| 9 | Calc Drill | `startCalcDrill('mixed_all',10)` | `unexpected: []`, 131/131 |
| 10 | Method Selection Drill | `startMethodDrill()` | `unexpected: []`, 131/131 |
| 11 | Timed Calculation Set | `startTimedCalcSet()` | `unexpected: []`, 131/131 |
| 12 | Resumed persisted session (real reload) | save session, `resetProgress()` skipped for this state, cold `page.reload()` | `unexpected: []`, 131/131 (`PENDING_ACTIVE_SESSION` independently confirmed non-null with a real 5-item queue at check time, not trivially skipped) |
| 13 | Negative control | inject `SYNTHETIC_TEST_BANK_XYZ` | **correctly flagged as unexpected** |

Zero runtime-session false positives across the entire matrix; the negative control still fires.
This exceeds the mission's required 8-state minimum (states 8–11 were added after discovering
`SESSION_CHECKPOINT` mid-matrix, to directly exercise every remaining session-state global at
least once).

---

## 4. Reverification of Unrelated RC3 Fixes (Unchanged)

Because only diagnostic data (Fix 1) and the census classification list (Fix 2) were touched —
no question stem, option, correct answer, or reserve-selection logic was modified — the following
were reverified, not re-derived:

- **Fixed-8 Cold reserve:** 20 qualifying chapters × 8 = **160** total protected reserve, unchanged.
  Chapters 1/3/15/19/20/32 (the RC3-repaired chapters): reserve = 8, `pairPlanOk = true`,
  `challengeFloorMet = true` for all six — identical to RC3's verified state.
- **Blueprint Practice Mock:** exactly **119** items, domain allocation **43/28/13/20/6/9**
  (Domain 1–6), 0 reserve-protection violations, 0 shortfall — unchanged.
- **Protected-source firewall, HCW/repeated/fragile independence logic:** covered by the same
  131-check regression suite, all still green.
- **Native `QUESTIONS` literal:** unchanged, 702 items,
  `bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c`.

---

## 5. Startup / Memo / Export Smoke Results

- **Startup:** Home render count = 1, 0 legacy-UI observations, boot completed in 741ms (no
  regression from the diagnostic-dataset growth — the added ~6.6MB of `V52A_DISTRACTOR_DIAGNOSTICS`
  JSON is not read on the Home-render hot path).
- **Memo async suite:** 3/3 passing (`integrityResultsAsync()`).
- **Real file-based export/import:** full round-trip re-verified — 119 Transfer sources exposed
  pre-export, real Export click → real downloaded file → real Reset (confirmed) → real file-input
  Import → reload; all Transfer-pack source exposure, HCW-unresolved status, and the in-progress
  memo draft text survived the round-trip exactly, with zero Cold-reserve leakage.

---

## 6. Final SHA-256 Hashes

| File | SHA-256 |
|---|---|
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.1.html` | `ddfdf68f93ddcb6ccc4ab759d81af77ef252568f56604c6bdf62a85a370448b0` |
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.html` (unchanged) | `804e9fbab84129d3550a7d0382c4d9cb927cf69e00965d79a46416adb1b8b39e` |
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC2.html` (unchanged) | `72f4026698aded4e19d9ae0baf59620b9a334ee89ce4353cf55fd34c1f83a429` |
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC1.html` (unchanged) | `3d00706c54983ac39ab897d98a85771fc6f5ad5bf85c1c37901b7d5960dd6e3a` |
| Native `QUESTIONS` literal (unchanged, RC3 and RC3.1 identical) | `bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c` |

`diff` between the corrected `DEV.html` and `RC3.1.html` shows exactly the three intended
self-identifying label lines changed (`<title>`, `document.title`, the build-identity note text)
— nothing else — mirroring exactly how RC1→RC2→RC3 was each created.

---

## 7. Git / Push Status

- `git status`: clean after commit.
- Local HEAD after commit matches `origin/claude/ccp-exam-prep-eval-48nukj` after push.
- Commit message: "RC3.1: two-defect closure — diagnostic coverage for 9 RC3 items + FRESHCHALLENGE census false-positive fix" (see git log for full message).

---

## 8. Blockers / Non-Blocking Limitations

**Blockers:** none.

**Non-blocking limitations:**
- cx20_3's `source_support` citation is at chapter level (S&K6 Ch.20), not an independently
  verified specific page number — see §2.5. Recommended follow-up: a future content-authoring
  pass with direct source access should confirm and add the exact page reference.
- Firefox/WebKit remain **NOT TESTED** (unchanged from RC3 — this environment has only a Chromium
  binary installed).
- The root cause of `SESSION`'s residual single-item state after running `integrityResults()`
  once (a leftover from one of its own internal self-tests not fully restoring `SESSION` to empty)
  was identified but not chased down and fixed at the source — the census classification fix
  correctly and safely neutralizes its symptom (a false "unexpected bank" finding), and hunting
  down the specific self-test's cleanup discipline is a separate, small hygiene item outside this
  mission's two named defects, not a data-integrity or learner-facing risk.
