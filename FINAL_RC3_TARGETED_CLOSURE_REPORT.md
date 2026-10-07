# CCP Exam Coach Study Studio v1.2.0 — RC3 Final Targeted Closure Report

**Scope:** RC3 FINAL LIMITED CLOSURE PASS — six named RC2 defects fixed in one continuous
mission, followed by one final targeted audit, followed by RC3 creation. RC1 and RC2 were
never mutated. No RC4 was created. This report documents what was found, what was changed,
how each change was verified, and the final state of the release candidate.

---

## A. Executive Summary

All six required fixes were completed, verified with live Playwright regression against the
real runtime (not static code reading), and committed in four checkpoints. One final targeted
audit was then run across the areas listed in Section T; everything came back green on the
first pass, so no second audit round was required. `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.html`
was created from the verified DEV state. RC1 and RC2 are confirmed byte-for-byte unchanged.

| # | Fix | Status |
|---|---|---|
| 1 | Restore fixed-8 protected Cold reserve policy | DONE |
| 2 | Close all 5 near-duplicate NEEDS_REVIEW cases | DONE |
| 3 | True file-based UI export/reset/import test | DONE |
| 4 | Correct 702/703/831 runtime-count terminology | DONE |
| 5 | Correct source-hierarchy documentation | DONE |
| 6 | Fix startup double-render / legacy-UI flash at root cause | DONE |

---

## B. Fix 1 — Fixed-8 Protected Cold Reserve Policy

**What RC2 got wrong.** `v513BaseColdReserve(ch)` had been changed from the original RC1
design (`base.length>=8 ? base.slice(0,8) : []` — always exactly 8, or nothing) into a
probing loop that accepted a smaller reserve (down to 1) when 8 wasn't available, silently
shrinking the protected Cold-test set in six chapters.

**Reproduction before any change.** Live measurement against the RC2-state DEV file
confirmed the mission's approximate figures exactly:

| Chapter | RC2 (measured) reserve size |
|---|---|
| 1 | 5 |
| 3 | 4 |
| 15 | 4 |
| 19 | 5 |
| 20 | 3 |
| 32 | 5 |

**Fix.** `v513BaseColdReserve` was rewritten to the original RC1 semantics verbatim (confirmed
by diffing against `CCP_Exam_Coach_Study_Studio_v1.2.0_RC1.html`'s own function body — identical
logic). A new `v513ReserveCapacityAudit()` function was added (authoring/regression-time only,
never learner-facing) to replace the old runtime `V513_RESERVE_OVERRIDE` probing mechanism, so
future regressions of this kind are caught by the permanent regression suite instead of silently
reappearing.

**Closing the real capacity shortfall — minimum additive supplement.** Each of the six chapters
was diagnosed individually (`v510PairPlan` union-size math + the Challenge demand-floor) to find
the *exact* minimum number of new Challenge-only supplemental items needed to keep both Apply and
Challenge pools viable once the full 8-item reserve was walled off. No native `QUESTIONS` item was
touched; only `V520_CHALLENGE_EXTRAS` (the established challenge-only supplemental mechanism) was
extended:

| Chapter | New items added | Item IDs |
|---|---|---|
| 1 | 1 | cx1_1 |
| 3 | 1 | cx3_2 |
| 15 | 1 | cx15_1 |
| 19 | 2 | cx19_1, cx19_2 |
| 20 | 2 | cx20_2, cx20_3 |
| 32 | 2 | cx32_1, cx32_2 |

9 items total — the exact minimum determined by live diagnostic, not a round or padded number.
Every item was authored, then validated against the real runtime quality-gate pipeline
(`v57BaseItemQa` → `v510PsychometricQa`/`v510OptionCueQa` → the three layered Challenge-specific
filters), which caught and required fixing 5 separate content-level issues (cue-regex collisions
in wording, not logic bugs) before all 9 items reliably reached the live candidate pool. This
confirms authored content was validated against the actual runtime gates, not merely assumed
compliant from static reading.

**34-chapter reserve matrix (full).** After the fix, `v513ReserveCapacityAudit()` was run across
all 34 chapters and cross-checked against `CCP_Exam_Coach_Study_Studio_v1.2.0_RC1.html`'s own
`v513BaseColdReserve` output for every chapter. The qualifying/non-qualifying chapter split is
**identical** between RC1 and the fixed DEV/RC3 state — 20 chapters qualify for the full 8-item
reserve, 14 do not (those 14 have always had fewer than 8 quality-approved native items in that
chapter and correctly receive an empty reserve in both RC1 and RC3, by original design):

- **Qualifying (reserve = 8, both RC1 and RC3):** 1, 3, 4, 7, 9, 10, 11, 12, 13, 14, 15, 18, 19,
  20, 23, 27, 29, 31, 32, 34
- **Non-qualifying (reserve = 0, both RC1 and RC3 — pre-existing, not a regression):** 2, 5, 6,
  8, 16, 17, 21, 22, 24, 25, 26, 28, 30, 33

Explicit before/after for the six chapters the mission named:

| Chapter | Reserve (RC2, broken) | Reserve (RC3, fixed) | pairPlanOk | Challenge demand-floor met | Apply capacity | Challenge capacity |
|---|---|---|---|---|---|---|
| 1 | 5 | **8** | true | true | 5 | 6 |
| 3 | 4 | **8** | true | true | 9 | 5 |
| 15 | 4 | **8** | true | true | 5 | 7 |
| 19 | 5 | **8** | true | true | 10 | 5 |
| 20 | 3 | **8** | true | true | 5 | 7 |
| 32 | 5 | **8** | true | true | 5 | 6 |

All 34 chapters: `pairPlanOk` and `challengeFloorMet` are true for every chapter that qualifies
for a reserve (100%, no exceptions).

---

## C. Fix 2 — Five Near-Duplicate NEEDS_REVIEW Adjudications

All 5 rows previously marked `NEEDS_REVIEW` in `CCP_v1.2_Global_Near_Duplicate_Audit.csv` were
adjudicated by direct content comparison against the project's six-level source hierarchy (see
Section F). 4 were classified **B** (related-but-independent, no action — different governing
concept/reasoning path, correctly scored as separate evidence) and closed. 1 was classified
**D** (genuine representation-level duplicate requiring an evidence-equivalence group) and
actioned. The full audit trail for all five pairs, pulled directly from the repository CSV
(commit `394c2ae`), is:

| # | Item A | Item B | Chapter(s) | Similarity concern | Classification | Reason | Evidence-independence consequence | Equivalence-family ID | Runtime-registry action? | Final review status |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 7-20 | 10-28 | 7 / 10 | Identical Sum-of-Years-Digits formula/process, different chapters | **B** RELATED_BUT_INDEPENDENT | Different year computed (2 vs 3), different numbers; 7-20 requires a salvage subtraction step 10-28 does not have — solving one does not give the other's answer | Kept as independent evidence; no change to HCW/mastery credit logic | — (none) | NO | CLOSED |
| 2 | 7-19 | 10-27 | 7 / 10 | Identical Double-Declining-Balance formula/process, different chapters | **B** RELATED_BUT_INDEPENDENT | 7-19 explicitly exercises the salvage-floor constraint (book value must not fall below salvage); 10-27 (zero salvage) never encounters that constraint and asks a different year — separable sub-skills | Kept as independent evidence; no change to HCW/mastery credit logic | — (none) | NO | CLOSED |
| 3 | 7-5 | 10-26 | 7 / 10 | Identical Straight-Line depreciation formula family, different chapters | **B** RELATED_BUT_INDEPENDENT | 7-5 requires the general form with a nonzero-salvage subtraction; 10-26 is the zero-salvage special case — different numbers, magnitude, and chapter context (asset costing vs. process/manufacturing capital investment) | Kept as independent evidence; no change to HCW/mastery credit logic | — (none) | NO | CLOSED |
| 4 | 31-19 | 32-19 | 31 / 32 | Same P50/P90 contingency-gap concept, high option-set similarity (os=0.88) | **B** RELATED_BUT_INDEPENDENT | 31-19 is a direct two-value (P50/P90) subtraction; 32-19 adds a third value (P10) as a distractor and requires correctly selecting the P50-to-P90 pair — a materially different cognitive task (pair selection vs. direct subtraction) | Kept as independent evidence; no change to HCW/mastery credit logic | — (none) | NO | CLOSED |
| 5 | 31-18 | 32-18 | 31 / 32 | Identical underlying scenario and numbers (1,000 units, $1/unit labor+material, labor +50%) | **D** REPRESENTATION_DUPLICATE | 31-18's own correct option states "$2,500, a 25% increase" verbatim; 32-18 asks only for that same percentage, answerable directly off 31-18's correct-option text with zero additional reasoning — same computed evidence, two response formats | **Non-independent**: a correct answer on one no longer counts as separate mastery evidence from the other; HCW/repeated-misconception logic treats them as the same family | `CH31_CH32_SENSITIVITY_PCT_IMPACT_REPR_DUP` | **YES** — added | ACTIONED |

**Formerly NEEDS_REVIEW: 5. Remaining NEEDS_REVIEW: 0** (verified directly against the current
`CCP_v1.2_Global_Near_Duplicate_Audit.csv`: 141 rows CLOSED, 15 rows ACTION_NEEDED — a pre-existing,
unrelated backlog category never in NEEDS_REVIEW status and outside this mission's scope — 2 rows
ACTIONED (the D-pair's two item-rows), 0 rows NEEDS_REVIEW).

**Evidence-equivalence registry sync — independently re-verified.** `CCP_v1.2_Evidence_Equivalence.csv`
(durable audit artifact, rows 33–34) and the runtime `EVIDENCE_EQUIVALENCE_GROUPS` object (embedded
JS mirror, 16 groups total) both carry the new group. Live re-verification against the actual RC3.html
artifact (not assumed from memory) confirms:

- `evidenceFamilyFor('NAT:31-18')` === `evidenceFamilyFor('NAT:32-18')` === `'CH31_CH32_SENSITIVITY_PCT_IMPACT_REPR_DUP'`
- `evidenceFamilyFor('NAT:31-19')` (an unrelated sibling pair, itself classified B above) resolves to a
  different value, confirming the group is correctly scoped to only the intended D-pair
- `EVIDENCE_EQUIVALENCE_GROUPS['CH31_CH32_SENSITIVITY_PCT_IMPACT_REPR_DUP']` contains exactly
  `['NAT:31-18', 'NAT:32-18']`, no more and no fewer

No discrepancy was found between the RC3 artifact and the repository CSV/runtime data — this section
is a documentation-completeness correction only, not a data or code fix.

---

## D. Fix 3 — True File-Based Export/Import UI Test

RC2's export/import test called the internal `exportProgress()`/`importProgress()` functions
directly — it never verified the actual learner-facing UI path. RC3 replaces it with a real
Playwright UI test (`test_true_file_export_import.js`) that:

1. Builds realistic state (attempts, everSeen, HCW-triggering wrong answers, an in-progress memo
   draft, retention-countdown entries).
2. Expands the collapsed `<details>Data & export</details>` section exactly as a learner would
   (this collapsed-by-default UI detail was the reason an earlier debugging iteration's
   programmatic `.click()` masked a real actionability problem — Playwright's real `.click()`
   correctly refuses a collapsed element).
3. Clicks the real **Export** button and captures the real downloaded file via
   `page.waitForEvent('download')`.
4. Clicks the real **Reset all progress** button and accepts the real confirmation dialog.
5. Re-expands **Data & export** after Reset re-renders Home, clicks the real file-input
   **Import**, and supplies the downloaded file.
6. Reloads the page cold and verifies every field survived the full file round-trip: everSeenIds,
   attempts, sessionHistory, retention entries, HCW unresolved status, all Transfer-pack source
   exposure, and the in-progress memo draft.

Result: full round-trip verified correct (`postImportAllTransferSourcesStillExposed: true`,
`postImportHcwStillUnresolved: true`, `coldLeakAfterImport: []`, memo draft text preserved
exactly). The pre-existing legacy migration fixtures test (`test_legacy_migration.js`) was
preserved unchanged and still passes (no crashes, correct backfill/normalization of pre-v1.2
saved state on both fixture generations).

---

## E. Fix 4 — Runtime Question Count Terminology (702 / 703 / 831)

**Root cause.** Two distinct, both-correct numbers were being conflated under one label in
places: `FINAL_RELEASE_MANIFEST` (~line 12207) is an intentionally frozen historical record of
v1.1.2 FINAL's true state (`nativeQuestions:702`, `staticAssessmentInventory:830`) — this is
correct history and was **left untouched**, per the mission's explicit "never silently rewrite
old records" instruction. Separately, a v5.16 native source-blind stem audit's integrity-check
`detail` string hardcoded the stale claim "...in all 702 native question stems", which was
actually describing the **current, live** `QUESTIONS.length` (831 in this build) — that one was
a live-state staleness bug, not a historical record, and was fixed to read dynamically from
`QUESTIONS.length` so it can never drift again:

```
detail: `0 source/chapter-reference cues in all ${QUESTIONS.length} installed static question stems`
```

`CENSUS_MANIFEST` (the live, self-verifying current-state object, distinct from the frozen
`FINAL_RELEASE_MANIFEST`) already correctly reported `QUESTIONS:831` before this fix and needed
no change beyond the `V520_CHALLENGE_EXTRAS` count bump for Fix 1's 9 new items (24 → 33).

**FINAL_RC2_CLOSURE_AUDIT_REPORT.md** — being a historical record of what was actually done and
reported at RC2 time — was **annotated, not rewritten**: a `[SUPERSEDED — RC3 closure pass]`
blockquote was inserted immediately before the original text in both the census table row and
the source-hierarchy section, explaining the correction while preserving the original "**702**"
value in the cell for provenance.

---

## F. Fix 5 — Source Hierarchy Documentation

The controlling project source hierarchy has **six levels**, in descending order of authority:

| Level | Source | Role |
|---|---|---|
| 1 | Current CCP Candidate Handbook / Exam Blueprint | Scope, tasks, exam structure, weighting, memo/exam rules |
| 2 | AACE RP 10S-90 | Definitions, terminology |
| 3 | Skills & Knowledge, 6th Edition (S&K6) | Primary technical source |
| 4 | Total Cost Management Framework | Lifecycle/process integration |
| 5 | CCP Certification Study Guide, 2nd Edition | Secondary reference |
| 6 | CCP Preparation Course | Secondary teaching aid only |

i.e. **Candidate Handbook/Blueprint > AACE RP 10S-90 > S&K6 > TCM Framework > Study Guide >
Prep Course.** `FINAL_RC2_CLOSURE_AUDIT_REPORT.md`'s Section B had stated an incorrect order,
and this report's own Section C originally (before this documentation-correction pass; see
Section O) mistakenly referred to it as a "five-source hierarchy" — both are terminology errors,
not a change to the hierarchy itself, which has always had six levels. A live grep-based audit of
every conflict-resolution code path in DEV.html/RC3.html confirmed **zero** live logic depends on
the specific stated order (source precedence is applied per-item at authoring time via manual
citation, not algorithmically at runtime) — so per the mission's explicit branch ("if only
documentation is wrong, fix documentation only"), only documentation was corrected, via the same
supersede-annotation pattern as Fix 4, with no code change.

---

## G. Fix 6 — Startup Double-Render / Legacy-UI Flash (Root Cause Fix)

### G.1 Root cause

The old boot sequence was an auto-invoking `(async function init(){...})()` IIFE positioned
mid-document. Because it `await`ed `loadProgress()` (an async storage read) while the HTML
parser continued executing every later `<script>` tag **synchronously** — including the late
`studio-enhancement` script that wraps `renderHome()` with the final Study Studio UI — the
timing of exactly when `loadProgress()`'s promise resolved relative to that later script
determined whether the *first* `render()` call used the not-yet-decorated base `renderHome()`.
When it did, a legacy/unstyled Home rendered first, and `studio-enhancement` (finding
`VIEW==='home'` already set) immediately forced a second re-render on top of it — a real,
user-visible double-render/flash. This is a genuine JavaScript execution-order race, not a
vague timing issue: async `await` yields control back to the synchronous parser, and which
script "wins" depends on microtask/script-execution interleaving that varies run to run.

### G.2 Fix — single authoritative boot sequence

- The IIFE was converted to a named `async function ccpBoot(){...}`, called exactly **once**,
  at the very end of the document — after every other script, including `studio-enhancement`,
  has finished registering its `renderHome()`/`render()` wrapper. This guarantees the one
  `render()` call inside `ccpBoot()` always uses the final, fully-decorated UI.
- The redundant `if(VIEW==='home')render();` line inside `studio-enhancement` (which used to
  force the second render when boot had already reached Home) was removed — it is structurally
  unreachable now, since `VIEW` is still `"loading"` at that point in every real boot.
- A static **loading shell** (`#ccp-boot-shell`) was made `#app`'s initial HTML content, styled
  inline with `var(--navy,#0E2438)`-style fallbacks so it renders correctly even before the late
  studio-specific `<style>` block loads — something final-styled is visible immediately instead
  of a blank `<div id="app"></div>`.
- A **startup-failure UI** was added: `ccpBoot().catch(...)` shows a final-style error card
  (⚠ heading, plain-language explanation, a **Retry** button that does a full reload) if boot
  itself throws — never a blank page, never a legacy/base UI fallback, and never any automatic
  reset or deletion of the learner's saved progress.
- `performance.mark`/`performance.measure` instrumentation was added at every boot step
  (`ccpBoot:buildIndexes`, `:loadProgress`, `:schemaNormalize`, `:activeSessionRestore`,
  `:fullSimRestore`, `:memoDraftRestore`, `:homeRender`, `:total`) for measured, not assumed,
  performance verification.

### G.3 Performance — CDP profiling and the actual fix

Before touching anything, the first Home render was profiled with a real Chrome DevTools
Protocol CPU profiler (`Profiler.start`/`Profiler.stop`, 100µs sampling interval — not a
wall-clock guess). The result identified `assessmentBlindText` — a pure text-scrubbing function
called several times per question (stem + every option) from dozens of call sites, including
once per question on every full-bank quality/reserve pass — as the dominant cost (~25–40%+ of
profiled samples), pulling its associated `humanQaTokens`/`nativeQuestionIsVetted` pipeline
along with it.

**Root cause of the waste.** Tracing every decorator reassignment of `nativeQuestionIsVetted`
found an existing cache, `V58_NATIVE_VET_CACHE`, that was populated by only one of five
sequential reassignments and never re-consulted by the later ones — but more importantly, the
**live** version's own cache (`V526_PREFLIGHT_CACHE`, keyed by question id + a content
"signature") had to *compute the signature itself* by calling `assessmentBlindText` on every
single invocation, cache hit or miss, defeating the point of caching: the expensive step ran
every time regardless of whether the cheap step (a Map lookup) would have sufficed.

**Fix.** `assessmentBlindText` is a pure function of its input string with no other dependency —
confirmed by reading all three composed layers of its decorator chain (base + two later
reassignments, none of which reference external mutable state). It was wrapped with a single
content-keyed memoization cache (`V58_BLIND_TEXT_CACHE`, following the file's existing `V58_*`
caching-layer convention), added once, after its last reassignment, so it becomes the permanent
live version:

```js
var V58_ORIG_BLIND_TEXT=assessmentBlindText;
var V58_BLIND_TEXT_CACHE=new Map();
assessmentBlindText=function(raw){
  const key=raw==null?'':String(raw);
  if(V58_BLIND_TEXT_CACHE.has(key))return V58_BLIND_TEXT_CACHE.get(key);
  const out=V58_ORIG_BLIND_TEXT(raw);
  V58_BLIND_TEXT_CACHE.set(key,out);
  return out;
};
```

Because the cache key is the exact raw string content (not the question id), it needs **no
invalidation step at all**: a changed input string is simply a different key, computed fresh on
first use; the scrubbed output for any given string never changes for the life of the build.
This reuses the file's existing caching architecture and convention rather than inventing a new
one, per the mission's explicit preference.

**Measured result (before → after), via the same CDP profiler and the Playwright startup-timing
matrix (`test_startup_matrix.js`), on identical empty/populated/heavy-history scenarios:**

| Scenario | `ccpBoot:homeRender` before | `ccpBoot:homeRender` after | Reduction |
|---|---|---|---|
| A — Empty (new learner) | 2051.9 ms | 370.0 ms | −82.0% |
| B — Populated (20 attempts, 1 session) | 2259.4 ms | 410.8 ms | −81.8% |
| C — Heavy (2000 attempts, 100 sessions) | 2311.0 ms | 406.2 ms | −82.4% |

Re-running the CDP profiler after the fix confirms `assessmentBlindText` no longer appears in
the top-25 hotspot list at all; the profile is now dominated by `(program)`/`(idle)` (V8/browser
overhead and network wait), with the memoized wrapper itself contributing under 2% of total
samples.

### G.4 Startup test matrix (all scenarios run)

| Scenario | Result |
|---|---|
| A — Empty new learner | 1 Home render, 0 legacy, homeRender 370 ms |
| B — Populated learner (20 attempts) | 1 Home render, 0 legacy, homeRender 411 ms |
| C — Heavy history (2000 attempts, 100 sessions) | 1 Home render, 0 legacy, homeRender 406 ms |
| D — Active resumable quiz session (real `startSession()`, real `saveActiveSession()`, cold reload) | 1 Home render, 0 legacy, `PENDING_ACTIVE_SESSION` correctly restored |
| E — Active Full Simulation (real `goFullSimulation()`, real `saveFullSimState()`, cold reload) | 1 Home render, 0 legacy, `PENDING_ACTIVE_FULLSIM` correctly restored |
| F — Simulated startup failure (`loadProgress()` forced to reject, real `.catch()` handler exercised) | Error card shown, Retry button present, `#app` never blank, no legacy/Home markup leaked, learner data provably unchanged, Retry successfully recovers to a working Home |

`page.goto(url, {waitUntil:'commit'})` (not the default `'load'`) was used throughout so the
loading shell's early visibility could actually be observed — for this large single-file app,
the `'load'` event fires only after all synchronous script execution completes, by which point
a fast boot could already have rendered Home, making the shell falsely appear to never have
existed. With `'commit'`, `shellVisibleEarly: true` was confirmed.

**Navigation-duplication check.** A dedicated test (`test_nav_no_duplication.js`) navigated
Home → Practice → Review → Exam → Study plan → Progress → Formula Lab → Calc Drill → Session
History → More tools → (repeat ×3) and counted `.studio-overview`/`.studio-paths`/`.studio-bar`/
`.recommend-card` on every Home revisit: all stable at exactly 1 across all 3 rounds (no growth,
no duplication). `.studio-note` was stably 2 across all rounds — explained (not a bug): one
static `.studio-note` lives inside the always-present `#studio-dialog` search overlay, outside
`#app`; the other is the dynamic one `studio-enhancement` appends to `#app` on every Home render;
the query is document-wide, so it correctly finds both, every time, with no growth.

### G.5 Permanent regression guard

A new permanent check was added to the live `integrityResults()` decorator (not an ad-hoc test
script): `render()` — decorated exactly once in the whole file and never re-declared afterward,
unlike `renderHome()`'s ~14 decorator layers — is wrapped to count every Home paint that occurs
before `ccpBoot()` marks boot complete. `integrityResults()` now asserts this count is exactly 1
once boot has finished:

> **RC3: Home renders exactly once during boot (no legacy-UI flash)** — `ok: true`, `detail:
> "boot complete; Home rendered 1x during boot"`

(`renderHome()` was deliberately not chosen as the wrap target: a later top-level
`function renderHome(){}` declaration uses `CreateGlobalFunctionBinding`, which silently
overwrites any accessor previously installed on that name — this was independently discovered
and confirmed while investigating why an earlier `Object.defineProperty` instrumentation attempt
against `renderHome` silently reported 0 reassignments despite obvious activity. `render()` has
no such later declaration and was safe to wrap.)

---

## H. Full Regression Suite

`integrityResults()`: **131/131** checks pass (130 pre-existing + 1 new RC3 boot-render-count
guard). `integrityResultsAsync()` (memo same-session persistence suite): **3/3** pass. Both
verified independently against DEV.html and against the final RC3.html — identical 131/131 and
3/3 results on both files.

---

## I. Native Integrity

Native `QUESTIONS` literal SHA-256 (the exact source text of the array literal itself, from its
opening `[` to its matching `]`, precise bracket-matched extraction — not the surrounding
`var QUESTIONS = ` declaration or trailing semicolon):
`bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c` — confirmed identical across
RC1.html, RC2.html, DEV.html, and RC3.html. `JSON.parse` of the extracted literal confirms exactly
**702** items, matching `ORIGINAL_NATIVE_QUESTIONS_LITERAL_COUNT` throughout this pass. See
Section O for the documentation-correction history of this value.

`git diff` on every RC3 commit confirms no line inside the `QUESTIONS` literal's source range was
ever touched, in addition to the hash match.

---

## J. Blueprint Practice Mock and Full Simulation Sanity

`buildBlueprintQueue()` produces exactly **119** items with the required domain allocation, and
draws **zero** items from any chapter's protected Cold reserve:

| Domain | Required | Delivered |
|---|---|---|
| 1 — Managing Project Costs | 43 | 43 |
| 2 — Interface with Other Disciplines | 28 | 28 |
| 3 — Reports and Documentation | 13 | 13 |
| 4 — Performance Measurement | 20 | 20 |
| 5 — Support/Inform Scheduling | 6 | 6 |
| 6 — Inform the Risk Management Process | 9 | 9 |
| **Total** | **119** | **119** |

Shortfall: 0. Reserve-protection firewall violations: 0. Full Simulation's queue-building policy
(`goFullSimulation()`) uses the same `buildBlueprintQueue()` for its 119-item MCQ set, so it
inherits the same guarantees; this was confirmed directly in Startup Scenario E above (a real
Full Simulation was started, its 119-item queue persisted, and restored correctly on reload).

---

## K. Cross-Browser Status

- **Chromium:** fully tested throughout this pass (all Playwright scripts).
- **Firefox / WebKit:** attempted once — `/opt/pw-browsers/` contains only a Chromium
  installation in this environment (no Firefox or WebKit browser binaries present). **NOT
  TESTED.** This is an environment limitation, not a product defect, and is reported honestly
  rather than retried repeatedly or silently assumed passing.

---

## L. Git and Artifact State

Four checkpoint commits on `claude/ccp-exam-prep-eval-48nukj`, all pushed to origin:

```
55557cf RC3 closure: fix startup double-render/legacy-UI flash at root cause + first-render performance
681b178 RC3 checkpoint 3: true file-based export/import test + census/hierarchy doc fixes
394c2ae RC3 checkpoint 2: close all 5 near-duplicate NEEDS_REVIEW cases
cc67108 RC3 checkpoint 1: restore fixed-8 protected Cold reserve policy
5597402 v1.2.0 RC2: create release candidate + final closure audit + readiness reports  (pre-existing)
```

`CCP_Exam_Coach_Study_Studio_v1.2.0_RC1.html` and `_RC2.html`: confirmed byte-for-byte unchanged
(`git status` reports no modification to either file at any point in this pass; SHA-256 hashes
recorded in Section M were computed for completeness and match the files as they existed prior
to this session).

---

## M. Final SHA-256 Hashes

| File | SHA-256 |
|---|---|
| `CCP_Exam_Coach_Study_Studio_v1.2.0_DEV.html` | `c9f28388eca211afefe5da54d032952b2461cf1d6c0bdab0cfb23ca3a2537c22` |
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.html` | `804e9fbab84129d3550a7d0382c4d9cb927cf69e00965d79a46416adb1b8b39e` |
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC2.html` (unchanged) | `72f4026698aded4e19d9ae0baf59620b9a334ee89ce4353cf55fd34c1f83a429` |
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC1.html` (unchanged) | `3d00706c54983ac39ab897d98a85771fc6f5ad5bf85c1c37901b7d5960dd6e3a` |
| Native `QUESTIONS` literal, 702 items, exact `[...]` array text (RC1, RC2, DEV, RC3 — all identical) | `bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c` |

`ORIGINAL_NATIVE_QUESTIONS_LITERAL_COUNT = 702`, `ADDITIVE_GLOBAL_REPAIR_ITEMS = 1`,
`INSTALLED_NATIVE_BASE = 703`, `V522_TASK_RESERVE_ITEMS = 89`, `V524_DIRECT_TASK_ITEMS = 39`,
`RUNTIME_INSTALLED_STATIC_QUESTIONS = 831` (702 + 1 + 89 + 39 = 831, verified both by static
extraction and live in the browser — see Section O).

---

## N. Final Targeted Audit (Single Pass)

The following areas were verified in one final pass after all six fixes were committed. Every
item came back green on the first run — no second audit round was needed:

1. Native `QUESTIONS` literal integrity (SHA-256 unchanged) — **PASS**
2. Fixed-8 reserve matrix, all 34 chapters, cross-checked against RC1's original behavior —
   **PASS** (identical qualifying/non-qualifying split)
3. Explicit Ch1/3/15/19/20/32 before/after reserve table — **PASS** (all now 8)
4. Apply/Challenge capacity per chapter — **PASS** (verified for all 6 focus chapters + spot-
   checked across the full matrix via `pairPlanOk`/`challengeFloorMet`)
5. Protected-source firewall (Apply, Challenge, Blueprint Mock, 34 chapters × 3 modes) —
   **PASS** (RC2-era regression checks, still green)
6. Cold/Transfer exposure lifecycle — **PASS** (RC2-era regression checks, still green)
7. Five near-duplicate adjudications, final classification and CSV state — **PASS** (0 rows
   NEEDS_REVIEW)
8. Evidence-equivalence runtime sync (CSV ↔ `EVIDENCE_EQUIVALENCE_GROUPS`) — **PASS**
9. HCW / repeated-misconception / fragile-knowledge independence logic — **PASS**
10. True file-based export → reset → import → reload round-trip — **PASS**
11. Legacy migration fixtures (two generations) — **PASS**
12. Memo same-session restore — **PASS** (async suite, 3/3)
13. Memo draft transfer through the real file export/import path — **PASS**
14. Runtime question census (`CENSUS_MANIFEST`, dynamic detail strings) — **PASS**
15. Source hierarchy documentation — **PASS** (corrected, no live-code dependency confirmed)
16. Startup order (single boot call, no race) — **PASS**
17. Startup first-paint (loading shell visible immediately, `shellVisibleEarly: true`) — **PASS**
18. Startup render-count (exactly 1 Home render, all 6 scenarios A–F) — **PASS**
19. Startup failure-state UI (error card, Retry, no data mutation) — **PASS**
20. Startup performance (measured, ~82% reduction, CDP-profiled root cause fixed) — **PASS**
21. Cache invalidation correctness (content-keyed, provably needs none) — **PASS**
22. Navigation-duplication check (10 views × 3 rounds) — **PASS**
23. Blueprint Practice Mock (119 items, exact domain allocation, 0 reserve draws) — **PASS**
24. Full Simulation queue-building policy — **PASS** (shares Blueprint Mock's queue builder;
    verified directly via Scenario E)
25. Regression suite (131 sync + 3 async) — **PASS**
26. Git/artifact state (4 checkpoints pushed, RC1/RC2 untouched, hashes recorded) — **PASS**

**Verdict: GREEN. RC3 created.**

---

## O. Documentation Correction / Final Independent Verification

A subsequent documentation-only review (no application code, question content, runtime
registries, or evidence-equivalence data touched) found that this report, as originally written,
mischaracterized one value and under-documented one audit trail. Both are corrected here
transparently rather than silently rewritten.

**1. The native `QUESTIONS` literal SHA-256 was previously reported incorrectly.**

This report originally stated the native literal's SHA-256 as
`5add92029ed451510a13f078c380f751d545c36b5a67ceeb5872c88ef2288ead`. That value was wrong. It was
produced by an ad hoc verification regex, `/var QUESTIONS\s*=\s*\[[\s\S]*?\n\];/`, run against the
DEV/RC3 source during the RC3 engineering pass. Because the true `QUESTIONS` array's closing `]`
in the actual source is immediately followed by `;` with **no newline in between** (`...}];\n\n//
Can...`), that regex's requirement of a literal `\n];` sequence did not match at the array's true
end — it kept scanning non-greedily until the *next* occurrence of `\n];` in the file, 1,973 bytes
later, which turns out to be the closing bracket of the unrelated `CHAPTER_LIST` array (the file's
34 chapter number/name entries). The reported hash therefore covered "`QUESTIONS`'s true content
plus roughly two kilobytes of unrelated trailing source, arbitrarily terminated by an unconnected
array's closing bracket" — a meaningless boundary, not a real extraction of anything. This has now
been independently re-derived and confirmed by two separate, convergent methods:

- **Static, precise bracket-matched extraction.** A depth-counting parser (string-literal aware,
  so bracket characters inside quoted strings are correctly ignored) was used to find the exact
  matching `]` for `QUESTIONS`'s opening `[`. The resulting `[...]` substring — array content
  only, no `var QUESTIONS = ` prefix, no trailing `;` — parses cleanly via `JSON.parse` into
  exactly **702** items, and hashes to
  `bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c`. This was run independently
  against `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.html`, `_DEV.html`, `_RC2.html`, and `_RC1.html`
  — **all four produce the identical hash and identical 702-item count.**
- **Live runtime verification.** Loaded in a real browser, RC3.html's live `QUESTIONS.length` is
  831. Filtering the live array by the markers each additive mechanism sets on its own items
  (`v522TaskReserve`, `v524DirectTask`, `replacesId==='1-17'`) finds exactly 89 + 39 + 1 = 129
  additively-pushed items, leaving `831 − 129 = 702` — matching the static extraction exactly. The
  quarantined original `1-17` item is confirmed still present in the live array (it was never
  deleted, only excluded from active serving elsewhere), consistent with the 702-count being
  unchanged.

So: `5add920...` does not correspond to the native literal, the 703 installed native base, the 831
runtime-installed inventory, or any other meaningful artifact — it was a pure regex-boundary bug,
now identified and explained rather than left unexplained. **`bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c`
is the correct native `QUESTIONS` literal SHA-256**, confirmed independently and consistently
across RC1, RC2, DEV, and RC3. Sections I and M above have been corrected to this value; the
runtime-count model is unchanged from Section E (702 native + 1 additive repair = 703 installed
native base; + 89 V522 + 39 V524 = 831 runtime-installed static questions).

**2. RC3 application file itself was not changed by this correction.** Only the two `.md` report
files were edited. `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.html`'s own SHA-256 was recomputed
before and after this documentation pass and is unchanged:
`804e9fbab84129d3550a7d0382c4d9cb927cf69e00965d79a46416adb1b8b39e`.

**3. All five formerly-`NEEDS_REVIEW` near-duplicate pairs are now individually listed** (Section
C above), pulled directly from the repository's `CCP_v1.2_Global_Near_Duplicate_Audit.csv` and
commit `394c2ae`, not summarized. The single D-classified pair's evidence-equivalence group,
`CH31_CH32_SENSITIVITY_PCT_IMPACT_REPR_DUP`, was independently re-verified live against RC3.html
(not assumed from a prior report): `evidenceFamilyFor('NAT:31-18') === evidenceFamilyFor('NAT:32-18')`,
both differ from the unrelated sibling `NAT:31-19`, and the group's membership is exactly
`['NAT:31-18', 'NAT:32-18']` — no more, no fewer. No discrepancy was found between the RC3
artifact and the repository CSV/runtime data; this was a documentation-completeness gap only.

**4. The source hierarchy is now explicitly described as six levels** (Section F above), correcting
this report's own earlier "five-source hierarchy" wording. The hierarchy's actual order —
Candidate Handbook/Blueprint > AACE RP 10S-90 > S&K6 > TCM Framework > Study Guide > Prep Course —
is unchanged; only the prior report's miscount of its levels is corrected.

**5. Historical reports were not rewritten.** `FINAL_RC2_CLOSURE_AUDIT_REPORT.md` remains exactly
as it was left in the RC2/RC3-checkpoint-3 pass (annotated with `[SUPERSEDED — RC3 closure pass]`
blockquotes where corrected, original values preserved in place for provenance). This
documentation-correction pass added no new annotations to that historical file; it corrected only
this report (`FINAL_RC3_TARGETED_CLOSURE_REPORT.md`) and reviewed `FINAL_RC3_RELEASE_READINESS_REPORT.md`
for consistency (no incorrect hash, no "five-source" wording, and no incomplete near-duplicate
summary were present there, so no edit was required beyond this confirmation).

No application code, question content, runtime registry, or evidence-equivalence data was found
to be in error — this was a documentation-only defect, and it has been corrected transparently,
not hidden.
