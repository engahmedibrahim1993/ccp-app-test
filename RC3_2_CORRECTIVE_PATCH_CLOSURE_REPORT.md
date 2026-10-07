# CCP Exam Coach Study Studio v1.2.0 RC3.2 — Corrective Patch Closure Report

This is a **narrowly scoped corrective patch report**, not a comprehensive re-audit and not
a "final" release document. It covers exactly the three issues assigned, verified
independently rather than assumed correct from prior reports or embedded comments. It does
not claim any structural check, runtime gate, or diagnostic-coverage pass establishes
comprehensive source validity beyond what was directly verified against primary source text.

**Baseline preserved.** `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.1.html` and all earlier HTML
files are byte-for-byte unchanged (confirmed via `git status` and SHA-256 below). All work is
in a separately named file, `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.2.html`.

**Input file SHA-256** (recorded before any work began):
`ddfdf68f93ddcb6ccc4ab759d81af77ef252568f56604c6bdf62a85a370448b0`

---

## Issue 1 — cx20_3 source support

### Reproduction / verification

The native `QUESTIONS` bank and all companion banks were never edited for this issue — the
defect was in a single `V520_CHALLENGE_EXTRAS` item, `cx20_3` ("Situational Leadership and
Delegation Readiness"), whose stem and explanation asserted that "situational leadership"
(matching a delegation/leadership approach to a follower's task-specific readiness) is S&K6
Ch.20 content, cited only generically ("S&K6 Ch.20 (Leadership & Management)") with no page
number and no prior direct-text verification. `CCP_v1.2_Source_Audit_Ledger.csv` rows
20-1..20-20 record that a *prior* session read Ch.20 in full and enumerated its actual
contents (McGregor Theory X/Y, Herzberg, Argyris, Likert, Blake & Mouton, Katzenbach & Smith,
cross-cultural concerns, the Four Key Roles, motivation theories, ethics) — situational
leadership is conspicuously absent from that enumeration, but this session did not treat that
as sufficient on its own; it was used only as a lead to investigate, per the mission's
explicit instruction that "standard management theory" and passing code-quality gates are not
evidence.

**Direct primary-source verification performed this session.** The full 663-page S&K6 6th
Edition PDF (Google Drive, 18.59 MB) exceeded this session's direct-read size limits
(`download_file_content` refuses files over 10 MB; `read_file_content` truncates large PDFs
before reaching Ch.20 at printed p.271; `search_files` snippets for this file were found to be
query-independent, always returning the same early-chapter excerpt regardless of search
terms). A targeted search for a smaller, pre-split companion file
(`fullText contains 'four PM roles' and fullText contains 'facilitator' and fullText contains
'mentor'`) located **"SK6_Part_3_Ch16-26.pdf"** (2.39 MB, well under the size limit), a
chapter-range split of the same book. `read_file_content` returned this file's full,
untruncated text (311,381 characters), from which pages 271–280 (Chapter 20 in full) were
extracted verbatim using the file's own embedded page-break markers.

**Finding, direct from source text:** S&K6 6th Edition, Ch.20 ("Leadership & Management of
Project People," pp.271–280, author Dr. Ginger Levin) does **not** discuss situational or
contingency leadership, or readiness-based delegation, anywhere. The chapter's actual content
is: McGregor Theory X/Y, Herzberg Motivation-Hygiene, Argyris, Likert's four leadership styles
+ linking pin, Blake & Mouton's Managerial Grid, Katzenbach & Smith and G.M. Parker on teams,
cross-cultural concerns, a section titled "Leading, Managing, Facilitating, and Mentoring"
describing the project manager's **Four Key Roles** (Leader, Manager, Facilitator,
Mentor/Coach), motivator/de-motivator theories (Biology, Drives, Incentive, Needs/McClelland,
Fear of Failure, Maslow's 7-level Hierarchy, Schein's Career Theory + 8 career anchors,
Empowerment/Meredith & Mantel), and ethics. This confirms the ledger's prior finding and
directly falsifies cx20_3's governing claim — this is now a directly verified fact, not an
inference from absence in a secondary summary.

### Disposition

**cx20_3 is retired (preserved unedited, flagged excluded), not deleted.** Its original
stem/options/explanation are untouched in `V520_CHALLENGE_EXTRAS['20']` for historical
provenance, matching the codebase's established precedent for content retirement (the same
discipline already used for native `1-17` and for `cx14_2`). It is flagged
`sourceConflict = true` and added to the existing `V57_SOURCE_UNSUPPORTED_IDS` registry (the
same mechanism already excluding `cx14_2`), which the codebase's own generic candidate-pool
filter already uses to remove any flagged id from every Apply/Challenge/Retention build,
regardless of bank — no new exclusion mechanism was invented.

**Replacement: `cx20_3R1`**, added to `V520_CHALLENGE_EXTRAS['20']`, `replacesId:'cx20_3'`.

- **Concept tested:** the Management role (one of the Four Key Roles) must balance
  administrative structure/discipline against the team's need for autonomy and flexibility.
- **Source support:** S&K6 6th Edition, Ch.20, **printed p.274**, "Leading, Managing,
  Facilitating, and Mentoring" section, Management-role paragraph, quoted verbatim: *"an
  administrative system with enough structure and discipline to complete the project without
  having the structure stretch into the realm of excessive bureaucracy... It is important to
  balance the need for structure and the need for autonomy and flexibility."* (PDF page: the
  source text was retrieved from a chapter-range split file whose own internal page numbering
  differs from the full 663-page PDF's pagination; the printed textbook page number, 274 —
  which is what the app's existing citation convention uses throughout, e.g. "S&K6 Ch.14,
  p.213-214" — is the citation actually recorded, consistent with every other item in this
  codebase.)
- **Four options, one defensible answer:** correct — scale the over-built system back toward
  the structure/autonomy balance; three distractors each test a distinct, source-grounded
  misconception (assuming more structure is unconditionally better; overcorrecting to zero
  structure and conflating this point with the chapter's separate Theory Y material; confusing
  the Management role with the separate Mentor/Coach role from the same Four-Roles list).
- **Quality checks performed:** no absolute/giveaway-cue language in any distractor (verified
  live against the codebase's own `v510StrongCue`/`v510OptionCueQa` gates — an early draft
  using "always"/"entirely" was caught and rewritten); no length-tell (correct option is 200
  chars vs. a 155-char longest distractor, well under the 1.8× threshold the app's own QA
  checks for); no source-cue leakage in the stem (an early draft phrase, "According to the
  source material's description...", was caught by the app's own `V56_SOURCE_CUE_RE` gate and
  rewritten to a plain scenario question, matching the style of every other item in the bank).
  Compared against every existing Ch.20 item (native 20-1..20-20, `cx20_1`, `cx20_2`) — none
  tests the Four Key Roles or this structure-autonomy point; no near-duplicate evidence family.
- **Protected reserve / Apply-Challenge thresholds preserved:** the fixed-8 protected Cold
  reserve (160 items, 20 chapters × 8, verified live below) is entirely separate from
  `V520_CHALLENGE_EXTRAS` and untouched by this change; Ch.20's Apply/Challenge
  source-independence floor (≥5 distinct Challenge source cases) is restored to its pre-defect
  count by `cx20_3R1` replacing the one case lost to `cx20_3`'s retirement.

### Historical-attempt treatment (versioning)

No new versioning mechanism was invented. This follows the codebase's own established
`1-17` → `1-17R1` precedent exactly: **cx20_3 is never edited or deleted**, so any historical
attempt recorded against the id `cx20_3` remains exactly as recorded, resolvable, and reviewable
— it is not silently reinterpreted under `cx20_3R1`'s new governing concept. `cx20_3R1` is a
wholly separate canonical id; it shares no attempt history with `cx20_3`. This was verified with
a real, file-based Export→Reset→Import→Reload round trip (see Final Acceptance below) using a
synthetic attempt recorded against `cx20_3`: after the full round trip, the attempt's `qid`,
`misconceptionCode`, and every other field were preserved byte-for-byte, and `cx20_3` remained
resolvable and correctly flagged excluded — not migrated, not deleted, not silently reattributed.

### Companion data updated

- **Runtime/embedded HTML:** `V520_CHALLENGE_EXTRAS['20']` (cx20_3 flagged + cx20_3R1 added),
  `V57_SOURCE_UNSUPPORTED_IDS` (cx20_3 added), `CANONICAL_REPAIR_REGISTRY` (cx20_3 entry:
  `repairState: 'RESOLVED_REPLACED'`, `replacementId: 'cx20_3R1'`), `V52A_DISTRACTOR_DIAGNOSTICS`
  (cx20_3's 3 rows converted to `EXCLUDED_ITEM`; cx20_3R1's 3 new rows added, each
  `SPECIFIC_DIAGNOSIS_VERIFIED` with a distinct `misconception_code`/`skill_id`),
  `CENSUS_MANIFEST.V520_CHALLENGE_EXTRAS` (33 → 34, comment updated). The resolver-parity and
  exclusion-bucket-reconciliation self-tests were extended with explicit cx20_3/cx20_3R1
  assertions (previously only covered 1-17/1-17R1 and the 15 `ACTIVE_EXCLUDED` units).
- **External CSVs** (`CCP_v1.2_Content_Inventory.csv`, `CCP_v1.2_Content_Placements.csv`,
  `CCP_v1.2_Distractor_Diagnostics.csv`, `CCP_v1.2_Misconception_Taxonomy.csv`,
  `CCP_v1.2_Source_Audit_Ledger.csv`, `CCP_v1.2_Global_Source_Audit_Exception_Report.csv`):
  cx20_3 (retired, `RESOLVED_REPLACED`) and cx20_3R1 (active) rows added, cross-verified
  byte-for-byte against the embedded HTML diagnostic data (script-checked, not eyeballed).
  Three new misconception-taxonomy entries added (`MGMT_ROLE_MORE_STRUCTURE_ALWAYS_BETTER`,
  `MGMT_ROLE_STRUCTURE_ELIMINATED_NOT_BALANCED`, `MGMT_ROLE_CONFUSED_WITH_MENTOR_ROLE`); no
  existing taxonomy entry was deleted (the old `SITUATIONAL_LEADERSHIP_*` misconception codes
  were never present in `CCP_v1.2_Misconception_Taxonomy.csv` to begin with — there was nothing
  to preserve or delete there).
- `CCP_v1.2_Evidence_Equivalence.csv` was **not** touched — cx20_3R1 shares no evidence family
  with any other item, so no equivalence mapping is needed.

**Known, pre-existing limitation flagged, not fixed (out of scope):** none of the other 8
"RC3-added" `V520_CHALLENGE_EXTRAS` items (`cx1_1`, `cx3_2`, `cx15_1`, `cx19_1`, `cx19_2`,
`cx32_1`, `cx32_2`, and `cx20_2`) have ever been backfilled into
`CCP_v1.2_Content_Inventory.csv`/`Content_Placements.csv`/`Source_Audit_Ledger.csv` (they
predate those CSVs' last comprehensive update). Backfilling all eight would be a broad audit
action explicitly out of this patch's scope ("do not start another broad audit cycle"); only
cx20_3/cx20_3R1, the two items this patch actually touches, were added.

### While-investigating discoveries fixed (data-consistency, not content)

Building the new diagnostic-completeness regression gate (Issue 3A) surfaced two small,
pre-existing, unrelated data-consistency defects in Chapter 14's diagnostic rows, both fixed
as the minimal change required to get the new (correct) gate to a legitimate green state:
- `cx14_4`'s second wrong option read `CPI≈1.25` in its diagnostic row but `CPI=1.25` in the
  actual item text (a stray "≈" character) — corrected in both the embedded HTML and
  `CCP_v1.2_Distractor_Diagnostics.csv` to match the live item text exactly.
- The same row was missing `skill_id` entirely — filled in as `COST_PERFORMANCE_REPORTING`,
  matching its sibling row's skill (both test weighted-milestone earned-value credit), in both
  the embedded HTML and the CSV.

---

## Issue 2 — self-tests mutate SESSION state

### Reproduction (before fix)

Reproduced exactly as reported, in an isolated Playwright browser context on the unmodified
RC3.1.html: `SESSION.results` was `[]` before calling `integrityResults()`; after one call, it
contained a synthetic wrong result for question `14-1` (`selected:0, correct:false`).

### Root causes found and fixed (all in RC3.2.html only — RC3.1.html was never touched)

Four distinct leaks were found and fixed, all in the same class of bug: a self-test calls a
real mutating function (`recordAttempt`, `markEverSeen`) or a real content-generation function
(`buildAssessmentPackV57`, `buildOfflineFreshPack`, `buildOfflineFreshBlueprintPack`) without
fully saving and restoring everything that function touches.

1. **"Phase 2A: recordAttempt base scoring/exposure/SRS behavior unchanged"** (the immediate
   neighbor of the reported check) only backed up/restored `PROGRESS.srs[qid]` and
   `PROGRESS.attempts` — not `PROGRESS.exposure[qid]` or `PROGRESS.recentQueue`, both also
   touched by `recordAttempt`. Fixed with try/finally, preserving array identity.
2. **"Phase 2A: High-Confidence-Wrong events carry diagnostic context automatically"** — the
   originally reported check — directly overwrote `SESSION.results` with no backup at all, and
   had the same `PROGRESS.exposure`/`recentQueue` gap as #1. Fixed with try/finally, restoring
   `SESSION.results` to its exact original reference (not a clone) where the original state was
   `undefined`.
3. **"v5.7 scored-pack generation"** and the **ts5_1 evidence-exclusion check** both build real
   scored packs across all 34 chapters via `buildAssessmentPackV57`, whose dynamic-item path
   (`v57BuildDynamicItem → buildGeneratedItem → genFamilyRecordSig`) mutates
   `PROGRESS.familyParamHistory` in place with no restore of its own. Fixed by
   snapshotting/restoring `familyParamHistory` around each simulated build.
4. **Two RC2 checks** (`buildOfflineFreshPack` calls across all 34 chapters, and
   `buildOfflineFreshBlueprintPack` + `markEverSeen`) shared a common restore helper
   (`rc2Restore()`) that already covered `everSeenIds`/`offlineFreshSeenIds`/
   `offlineFreshSourceUse`/`attempts`/`coldSessionHistory` but not `familyParamHistory` —
   folded into the same shared helper. Separately, `markEverSeen()` calls the **real**
   `saveProgress()` internally, which captures a `JSON.stringify(PROGRESS)` snapshot
   *synchronously*, before its one `await` — meaning even a complete later in-memory restore
   cannot undo an already-in-flight write of a mid-self-test, dirty snapshot to real
   `localStorage`. This was the source of the residual localStorage diff that survived fixes
   1–3.

**Closing, durable fix:** rather than trying to find and patch every future call site
individually across this ~15,000-line, still-growing self-test chain, a final wrapper
(extending the codebase's own pre-existing v5.17 "RELEASE-SAFETY CLOSURE" pattern, which
already did a full `PROGRESS` snapshot/restore around everything registered before it) was
added around the **entire** `integrityResults()` chain: full `PROGRESS` *and* `SESSION`
snapshot/restore (v5.17 only covered `PROGRESS`), plus a no-op stub for `saveProgress()` for
the duration of the whole suite (restored immediately after), closing the real-write leak at
its actual root cause rather than chasing every internal call site.

### Six required properties — all proven

Proven both by the reproducible external script (`rc3_2_regression_scripts/issue2_full_proof.js`,
isolated browser context, synthetic data only) and now permanently, by two embedded self-tests
(Issue 3C, below) that run every time `integrityResults()` is called:

1. **Clean session unchanged:** `SESSION` before/after byte-identical. ✅
2. **Populated session retains state:** a synthetic in-progress session (queue, idx, answers,
   results, confidence, flags, timing) is byte-identical before/after. ✅
3. **Exception-path restoration:** a deliberately injected exception mid-suite (fault
   injection, see below) still restores `PROGRESS`/`SESSION` and never propagates to the
   caller. ✅
4. **Repeated-run safety:** three consecutive `integrityResults()` calls leave no synthetic
   answers/progress. ✅
5. **Persisted storage unchanged:** `localStorage` byte-identical before/after (only reached
   full closure once the `saveProgress()` stub was added). ✅
6. **Learner can continue normally:** after running self-tests against a populated synthetic
   session, every accessor a real quiz-continuation flow relies on (`SESSION.queue[SESSION.idx]`,
   `flagged`, `results`, `confidence`, `timeSpentByIndex`, `sessionTag`) remained exactly intact. ✅

---

## Issue 3 — permanent regression gates

Three new gates were added to the embedded `integrityResults()` self-test chain (not a
one-off script) — they run every time the "Build Integrity / Self-check" page is opened, never
during normal startup/navigation.

### 3A — Diagnostic completeness

- **UNMAPPED_ACTIVE = 0 across all 34 chapters** (not just the 6 required), using the
  pre-existing `v52aChapterCoverage()` function, looped. Confirmed live: all 34 chapters
  already report 0 before this patch; the required 6 (Ch.1/3/15/19/20/32) are asserted
  explicitly.
- **Row-quality gate**, generalized across every active id in `V52A_DISTRACTOR_DIAGNOSTICS`
  (1,606 keys): exactly one row per actual wrong option (resolved against the item's real
  `options`/`correct`, via a broader bank resolver covering all 7 canonical content banks, not
  just `QUESTIONS`/`EXAM_STUDY_GUIDE_BANK`), no correct-option rows, no duplicate
  `option_identity`, and required fields present — calibrated against the bank's real schema
  (an initial version incorrectly required `error_class`/`misconception_code` on every active
  row; the real schema legitimately leaves both blank for `GENERAL_WRONG_REASON_VERIFIED`/
  `AMBIGUOUS_DIAGNOSTIC_CAUSE` rows, confirmed against 145 + 97 such pre-existing, already-
  reviewed rows before the check was corrected).
- **Fault injection (`rc3_2_regression_scripts/fault_injection_3a.js`):** three faults injected
  one at a time (delete a canonical item's diagnostic rows entirely; duplicate an
  `option_identity`; mark a wrong option `is_correct:"yes"`) — the gate caught all three, with
  full state cleanliness confirmed afterward.
- **Organic detection (stronger evidence than injection alone):** running this gate for real
  surfaced the two genuine, pre-existing `cx14_4` defects noted under Issue 1 above.

### 3B — Stateful census

- Drives the existing `v518GlobalCensus()` mechanism through 6 real states — clean page;
  ordinary Practice (`SESSION` populated); Apply/Challenge (`FRESHCHALLENGE` populated via the
  real `buildOfflineFreshPack`); Blueprint Transfer (`FRESHCHALLENGE` populated via the real
  `buildOfflineFreshBlueprintPack`); active Full Simulation (`FULLSIM` populated); a resumed
  session (`SESSION_CHECKPOINT` + `PENDING_ACTIVE_SESSION` populated) — confirming a real,
  in-progress session container is never misreported as a newly-discovered authored bank in
  any of them.
- **Negative control** in every one of those 6 states: a deliberately injected synthetic
  authored bank (`window.RC32_SYNTHETIC_TEST_BANK`, shaped to pass the census's own
  `v518LooksLikeLearnerItem` heuristic) IS still detected, then removed in a `finally` block —
  proving the state population itself does not blind the census.
- **Fault injection (`rc3_2_regression_scripts/fault_injection_3b_v2.js`):** the globally-
  reachable `v518GlobalCensus()` was temporarily monkey-patched to (a) simulate a false
  positive against a real container and (b) simulate a defeated negative control — the gate
  correctly caught both, and the original function was restored.

### 3C — Self-test non-mutation

- The existing PROGRESS/SESSION snapshot/restore wrapper (added while fixing Issue 2) was
  turned into two explicit, permanently-reported checks: `PROGRESS`/`SESSION` byte-identical
  to their pre-self-test snapshot after the full suite runs, computed fresh on every call — so
  this covers "clean and populated sessions" and "repeated-run safety" as the same property,
  checked live regardless of what state the learner's real session happens to be in when they
  open the self-check page.
- A third check reports honestly if the suite itself threw an exception on that run (it should
  not, in normal operation) and confirms restoration still happened.
- **Fault injection (`rc3_2_regression_scripts/fault_injection_3c_v2.js`):** the top-level
  `V532_FINAL_BASE_INTEGRITY` reference was temporarily replaced with a function that throws —
  confirmed `integrityResults()` did not propagate the exception to its caller, confirmed
  `PROGRESS` was still restored, and confirmed the gate itself correctly reported the injected
  failure rather than silently passing. Also directly fault-tested with a real populated
  synthetic session and three consecutive calls (repeated-run safety).
- **One false positive found and fixed during this gate's own development:** the byte-identical
  check initially flagged a spurious diff (`v57PackHistory`/`v57MasteryHistory` going from
  absent to `[]`) — not a self-test mutation, but the codebase's own pre-existing, expected
  lazy-schema-initialization pattern (`v57EnsureProgress()` sets these fields to `[]` on first
  call). Fixed by calling `v57EnsureProgress()` once, before taking the entry snapshot, so this
  normal one-time normalization can never be mistaken for a real leak.

---

## Final Targeted Acceptance results (run against the actual delivered RC3.2.html)

| # | Check | Result |
|---|---|---|
| 1 | Native `QUESTIONS` bank byte-identical, 702 items, SHA-256 matches mandated value | ✅ `bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c` (extracted with a string-literal-aware bracket-depth counter, not regex) |
| 2 | Protected Cold reserve = 160 (20 qualifying chapters × exactly 8) | ✅ verified live: `reserveTotal:160, qualifyingChapters:20, allExactly8:true` |
| 3 | No protected reserve sources served in ordinary training | ✅ pre-existing RC2 firewall checks (34-chapter Apply + Challenge + Blueprint Mock) pass |
| 4 | `everSeenIds` mechanism unchanged | ✅ pre-existing checks pass; round-trip tested below |
| 5 | Previously exposed sources cannot count as fresh Cold evidence again | ✅ unchanged, not touched by this patch |
| 6 | No parallel exposure-history system / no changed cold-scoring semantics | ✅ not touched by this patch |
| 7 | All 34 chapters retain progression reachability and quality thresholds | ✅ v5.10/v5.13/v5.14/v5.22 checks pass; Ch.20's Apply/Challenge floor explicitly re-verified after the cx20_3 → cx20_3R1 swap |
| 8 | Blueprint Mock / Full Simulation = 119 MCQs, domain quotas 43/28/13/20/6/9 | ✅ verified live: built pack length 119, domain breakdown exactly 43/28/13/20/6/9 |
| 9 | Memo same-session restore | ✅ pre-existing RC2 check passes; also verified in the Export/Import round trip below |
| 10 | Startup renders the final Home once, no old-UI flash | ✅ pre-existing RC3 check passes |
| 11 | No new console/page errors | ✅ `pageerror`/`console.error` listeners attached across all regression runs — none |
| 12 | Existing and new regression checks pass | ✅ **141/141**, 0 failing (135 pre-existing/prior-patch checks + 6 new RC3.2 gate checks) |
| 13 | Real file-based Export→Reset→Import→Reload, synthetic populated profile, historical cx20_3 attempt | ✅ see below |
| 14 | Earlier HTML files unchanged | ✅ `git status` shows RC3.1.html and all prior files untouched; SHA-256 matches the recorded baseline exactly |

**Export→Reset→Import→Reload detail** (`rc3_2_regression_scripts/export_reset_import_reload_test.js`,
isolated browser context, synthetic data only): a synthetic profile was built with attempts
(including one against the retired `cx20_3` identity, carrying its historical
`misconceptionCode`), SRS state, exposure state, `everSeenIds`, skill mastery, mock history,
cold-session history, a completed memo attempt, and an in-progress memo draft. The app's real
export-payload construction and import-merge logic were exercised (not a hand-rolled
substitute), followed by a genuine `page.reload()`. After reload: attempt count restored (3,
was 0 immediately post-reset), the `cx20_3` attempt's every field including
`misconceptionCode` preserved exactly, SRS/exposure/`everSeenIds`/skill-mastery/mock-history/
cold-history/memo-attempts all byte-identical to their pre-export values, the in-progress memo
draft text restored, `cx20_3` still resolvable and still correctly flagged excluded (confirming
the history-policy choice: preserved unedited, not migrated, not reinterpreted), and the full
141-check regression suite green post-reload with zero console errors.

**This Export/Import test used entirely synthetic data in an isolated browser context, per the
mission's explicit privacy constraint. It does not test, read, or migrate the user's personal
study data, and this report makes no claim that the user's personal migration has been tested.**

---

## SHA-256 values

| File | SHA-256 |
|---|---|
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.1.html` (unchanged) | `ddfdf68f93ddcb6ccc4ab759d81af77ef252568f56604c6bdf62a85a370448b0` |
| `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.2.html` (delivered) | `30468a64565101054c86ab346cc9647a16aad99544e7cce0f27914ced1e90c96` |
| Native `QUESTIONS` array literal (both RC3.1 and RC3.2, byte-identical) | `bf8682521168a7c95f625a2a25701cc07cf65ce1e48a0d10773427304a69106c` |

## Changed functions/data (complete list)

**Embedded in `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.2.html`** (RC3.1.html untouched):
- Two self-test bodies fixed in place: "Phase 2A: recordAttempt base scoring/exposure/SRS
  behavior unchanged", "Phase 2A: High-Confidence-Wrong events carry diagnostic context
  automatically".
- "v5.7 scored-pack generation" self-test: added `familyParamHistory` snapshot/restore.
- `v519Ts5_1EvidenceExclusion()`: added `familyParamHistory` snapshot/restore.
- Shared `rc2Restore()` helper (RC2 closure block): extended to also cover
  `familyParamHistory`.
- `cx20_3` (flagged `sourceConflict:true`, explanation annotated, content otherwise
  unedited); `cx20_3R1` added; `V57_SOURCE_UNSUPPORTED_IDS` extended;
  `CANONICAL_REPAIR_REGISTRY` extended; parity/exclusion-bucket self-tests extended;
  `CENSUS_MANIFEST.V520_CHALLENGE_EXTRAS` count updated.
- `V52A_DISTRACTOR_DIAGNOSTICS['cx20_3']` (3 rows converted to `EXCLUDED_ITEM`);
  `V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1']` (3 new rows added).
- `cx14_4`'s second diagnostic row: `CPI≈1.25` → `CPI=1.25` (matching live item text);
  `skill_id` filled in.
- New: "RC3.2 SELF-TEST NON-MUTATION CLOSURE" wrapper (full `PROGRESS`+`SESSION`
  snapshot/restore + `saveProgress()` stub around the entire self-test chain, extended with
  two byte-identical checks + one exception-path check).
- New: "RC3.2 PERMANENT DIAGNOSTIC-COMPLETENESS GATE" (Issue 3A, 2 checks).
- New: "RC3.2 PERMANENT STATEFUL CENSUS GATE" (Issue 3B, 3 checks).

**External companion CSVs**: `CCP_v1.2_Content_Inventory.csv`,
`CCP_v1.2_Content_Placements.csv`, `CCP_v1.2_Distractor_Diagnostics.csv` (cx20_3/cx20_3R1 rows
added + the cx14_4 typo fix), `CCP_v1.2_Misconception_Taxonomy.csv` (3 new codes added),
`CCP_v1.2_Source_Audit_Ledger.csv`, `CCP_v1.2_Global_Source_Audit_Exception_Report.csv`.

## Remaining limitations / blockers

- The 8 other "RC3-added" `V520_CHALLENGE_EXTRAS` items were never backfilled into the
  Content Inventory/Placements/Source Audit Ledger CSVs before this patch, and remain so —
  flagged above as a pre-existing gap, explicitly out of this patch's scope.
- The `cx20_3R1` PDF-page citation could not be independently distinguished from its printed
  page (274); this codebase's own citation convention throughout uses printed page only, which
  is what was recorded, consistent with every other item.
- This report's Export/Import verification used synthetic data in an isolated browser profile
  only. **No claim is made that the user's real, personal study-progress migration has been
  tested** — that would require running against the user's actual saved data, which this
  session was explicitly instructed not to touch.
- This is a corrective patch, not a new full release; it is intentionally not named or
  described as "FINAL."
