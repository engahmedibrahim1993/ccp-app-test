# CCP Exam Coach — Controlled Mastery + Adaptive Retesting + Retention Engine Report

## 1. Baseline

- Baseline file: `CCP_Exam_Coach_AACE_VALIDATED.html`, branch `claude/ccp-exam-prep-eval-48nukj`, commit `136ebb8` (AACE validation complete, 0 remaining NOT SOURCE-VALIDATED across all 830 questions).
- Baseline SHA-256 (confirmed identical at the start of this pass): `778259c2bf75981137af31406b4cc6dff503f55669e9d2bf395c2cb44d89c0c9`.
- Pre-edit backup created before any change: `CCP_Exam_Coach_PRE_MASTERY_ENGINE.html` (byte-identical to the baseline; verified with `sha256sum`).
- Prior reports re-read at the start of this pass: `ccp_aace_source_validation_report.md`, `ccp_repair_report.md`, `ccp_content_pedagogy_report.md` (section headers + prior body reads from this session).
- All editing was performed in `CCP_Exam_Coach_AACE_VALIDATED.html`. The final build, `CCP_Exam_Coach_MASTERY_RETENTION.html`, is a byte-for-byte copy of the edited baseline made only after all tests below passed.

## 2. Existing Learner-State Architecture (Phase 1 audit findings)

The codebase already contains a mature, multi-generation ("V2.5" through "V58") learner-state system. Before writing any new code, the following was confirmed by direct code reading (not assumption):

- **Attempt log**: `recordAttempt(q, correct, confidence, timeSpentSec, deferSave)` is the single source of truth, pushing `{qid, correct, ts, chapter, chapterName, topic, type, difficulty, domain, confidence, evidenceClass, sessionTag, mockTag, timeSpentSec}` into `PROGRESS.attempts[]`. This pass adds **zero** new attempt-log fields and hooks nothing new into `recordAttempt` itself — every new function reads `PROGRESS.attempts[]` through the existing `trainingAnalyticsAttempts()`/`analyticsAttempts()` accessors.
- **Confidence-aware evidence classification**: `classifyAttempt(a)` already implements the 5-way taxonomy (Misconception / Uncertain Knowledge / Knowledge Gap / Fragile Knowledge / Solid) the new spec calls for, and `classifyTopic(t)` aggregates it per topic with a `MIN_EVIDENCE=3` floor.
- **Per-question "latest attempt" helpers**: `weakQuestionIds()`, `wrongOnlyIds()`, `highConfidenceMissIds()`, `fragileKnowledgeIds()`, `repeatedMissIds()`, and `adaptiveScore()` all key off the **most recent attempt on that exact question ID**. This is the precise architectural gap the new spec is aimed at: a correct retry of the *same* question fully clears a high-confidence-wrong flag everywhere these helpers are used (Readiness penalty, Study Plan "weak" bucket, Adaptive Practice scoring), with no concept of "different question, same skill" fresh evidence. This was confirmed empirically before writing any fix (a same-question correct retry made `highConfidenceMissIds()` drop the question immediately).
- **Multi-stage chapter mastery pipeline** (`chapterTrainingGate` → `officialStudyGuideGate` → Apply (`latestFreshLevelEvidence(ch,2)`, ≥80%) → Mastery Test (`latestInternalMasteryEvidence`/Cold/Independent, ≥85% closed-book) → Challenge (`latestFreshLevelEvidence(ch,3)`, ≥75%, closed-book via `effectiveClosedBookEvidence`) → Retention (`chapterMasteryStatus`, 5-day delay: `dueTs = baseTs + 5*86400000`)) already implements almost the entire Mastered-vs-Retained distinction the spec asks for, with status keys `retained` / `failed` (Retention Gap) / `due` (Retention Due) / `provisional` (Provisional Mastery) / `developing`. **This pipeline was left functionally unmodified** — historical evidence in `PROGRESS.externalEvidence[]` is append-only and was never touched.
- **Fresh-question generation engine** (`buildVettedScenarioItem`, `selectVettedPack`, `buildAssessmentPackV56`) already reframes existing validated questions' own four options into new scenario/error-diagnosis presentations for Apply/Mastery/Challenge tests, and already hard-blocks (throws) instead of padding with weak filler when insufficient quality items exist. This is reused as-is; no new content-generation logic was written.
- **Layered "capture base, then reassign" pattern**: functions like `chapterMasteryStatus`, `chapterExitNextAction`, `readinessScore`-adjacent helpers, etc. are re-declared multiple times across `V56_*`/`V58_*` prefixed blocks, each capturing the previous version (`var V56_baseX = X; X = function(){ ... V56_baseX() ... }`) and layering new behavior on top. This is a deliberate, repo-native pattern (not a bug) — confirmed by reading every duplicate declaration site rather than assuming "last wins" implies breakage. Two apparent duplicate-declaration conflicts were specifically resolved by inspection: `masteryRequiredCount` (a later flat `return 10` correctly supersedes an earlier chapter-scaled version, consistent with the v5.6 fixed-10-question quality-gated Mastery Test) and `latestInternalMasteryEvidence` (a later version is a backward-compatible superset that also recognizes `INTERNAL_MASTERY_V3_CURATED` evidence, not just `INTERNAL_MASTERY_V2`) — neither is a defect.
- **A derived-data cache exists** (`V58_CACHE` / `V58_REV`, invalidated by `v58Bump()` inside `saveProgress()`), memoizing `analyticsAttempts()`, `chapterMasteryStatus()`, `chapterCoachingFacts()`, `officialStudyGuideGate()`, `coldEligibleStaticQuestions()`. This was discovered during test-writing (see Section 16) and is important context: any new derived function must be read **after** a `saveProgress()` call to see fresh data, exactly like every pre-existing consumer.
- **Export/Import** (`exportProgress`/`importProgress`) serializes/deserializes the *entire* `PROGRESS` object with `Object.assign(defaultProgress(), data)`. Because this pass adds no new persisted fields, export/import already round-trips every new capability with zero changes.

**Conclusion of Phase 1**: the existing attempt log, SRS, exposure tracking, and multi-stage mastery pipeline could be extended safely. **No second, competing learner-history system was created.**

## 3. New Evidence Model

A new, purely derived "Mastery/Adaptive Retesting/Retention Engine" (MRE) layer was appended at the very end of the `<script>` block, following the same "capture base, then reassign" convention already used throughout the file (prefix `MRE_` mirrors the existing `V56_`/`V58_` convention).

Core primitive: **skill identifier** `mreSkillId(chapter, topic) = "${chapter}::${topic}"` — built only from metadata every question already carries (no new tags invented, no question IDs changed). This mirrors the exact grouping `topicStats()`/`topicStatsFor()` already use (`chapterName + " — " + topic`).

Evidence types are computed by scanning `trainingAnalyticsAttempts()` (the same cold/training-isolated view every other analytics function uses) grouped by skill and sorted chronologically (`mreSkillAttemptMap()`):

- **`mreUnresolvedMisconceptions()`** — Wrong+High confidence, not yet resolved (Section 5).
- **`mreFragileSkills()`** — most recent skill evidence is Correct+Low (Section 6).
- **`mreRepeatedErrorSkills(minDistinctWrong)`** — ≥2 (default) distinct wrong question IDs within a skill.

Correct+Medium/High and ordinary Correct/Wrong+Low continue to be handled entirely by the pre-existing `classifyAttempt`/topic-stats machinery — nothing new was needed there, consistent with "do not invent certainty the app cannot defend."

## 4. Skill Mapping

Skill IDs are `chapter::topic`, derived at read time from `q.chapter` and `q.topic` — both existing, stable fields already used for `topicStats()`, `domainStats()`-style grouping, and chapter mastery. No new tagging pass over the question bank was performed and no question IDs were touched. `mreHasAlternateQuestion(skillId, excludeQid)` walks `QUESTIONS` for a second quality-eligible, non-suspended question sharing the same chapter+topic, which is how "is a different-question retest even possible for this skill" (Phase 5 / LIMITED FRESH EVIDENCE) is determined without inventing content.

## 5. High-Confidence Wrong Logic

`mreUnresolvedMisconceptions()` finds, per skill, the **most recent** Wrong+High attempt and checks whether any attempt **after** it in that skill is Correct with Medium/High confidence **on a different question ID**. If not, the misconception is reported unresolved, carrying `{skillId, chapter, topic, qid, ts, sameQFixed}` — `sameQFixed` records whether the *same* question was later answered correctly (visible for transparency) without that fact resolving the flag.

Consequences wired in:
1. Recorded prominently — surfaced in Study Plan reasons, Chapter Progress transparency card, and `overallStats().unresolvedMisconceptionCount`.
2. High adaptive priority — `adaptiveScore()` wrapper adds +12 for any question in an unresolved-misconception skill (Section 10).
3. Remains unresolved after same-question correction — verified directly (Test 2, Section 15/16).
4. Requires fresh (different-question) evidence — the resolution condition itself.
5. `chapterMasteryStatus()` wrapper additionally blocks `provisional`/`retained`/`due` chapter status while any unresolved misconception exists in that chapter (Section 8) — a stronger bar than a single fresh answer for chapter-level mastery credit.
6. Returns in Final Week (Section 12) and Readiness (Section 13) until resolved.

## 6. Fragile Knowledge Logic

`mreFragileSkills()` reports a skill whose **most recent** training evidence is Correct+Low. Because it is always defined as "most recent," a later fresh (different-question) Correct+Medium/High attempt on that skill automatically becomes the new "most recent" record and the skill silently drops out of the fragile list — exactly the "a later fresh correct answer with Medium/High confidence can strengthen the evidence" rule, with no separate strengthening counter needed. This is **not** treated as a failure anywhere (it never touches `wrongOnlyIds`/misconception logic), only as a lower-priority adaptive/study-plan signal (`adaptiveScore` +3, vs +12 for misconceptions).

## 7. Error Recovery / Fresh Retesting

The mandatory Same-Question Retry Rule example from the spec was implemented and tested literally:
- Attempt 1: Wrong+High on question Q → `mreUnresolvedMisconceptions()` includes the skill.
- Attempt 2: Correct+High on the **same** Q → still included (`sameQFixed:true`), i.e. still Retest Required.
- Attempt 3: Correct+High (or Medium) on a **different** question Q′ testing the same skill → resolved.

No new fresh-question *generation* mechanism was created for ordinary practice — the existing `buildVettedScenarioItem`/`selectVettedPack`/`buildAssessmentPackV56` engine already produces genuinely fresh scenario variants for the Apply/Mastery/Challenge tiers, and remains untouched. For ordinary Chapter Practice / Adaptive Practice, "fresh" simply means "a different existing validated question ID in the same skill," which is what the resolution condition above checks. When no second question exists for a skill, the engine says so plainly ("LIMITED FRESH EVIDENCE") rather than pretending a same-question retry proved anything (Section 8, tested in Section 15).

## 8. Mastery Gate

`chapterMasteryStatus()` was wrapped (`MRE_baseChapterMasteryStatus` captures the pre-existing pipeline's result). The wrapper only acts when the base result is `provisional`, `retained`, or `due` (i.e., chapter-level mastery/retention has otherwise been earned); it leaves `developing`/`failed`/`transfer` untouched. If `mreUnresolvedMisconceptionsForChapter(ch)` is non-empty, the status is downgraded to a new key, `retestRequired` ("Retest Required"), naming the affected topic(s) and explicitly stating that a same-question retry does not clear it. If no alternate question exists for the misconception's skill, the detail text says **"LIMITED FRESH EVIDENCE"** instead of implying an easy fix. Historical evidence (`PROGRESS.externalEvidence[]`) is never modified or deleted by this wrapper — only the status label surfaced to `chapterCoachingFacts`, `chapterExitNextAction`, `recommendedNextStep`, Study Plan, and Final Week is affected, so "previously mastered, currently weakened" is representable without erasing history. `chapterExitNextAction()` and `recommendedNextStep()` were each given a small additional wrapper so `retestRequired` routes to a concrete "Resolve Chapter N Misconception" action (reusing the existing `repair` action key) instead of falling through to a generic "Open Study Plan."

## 9. Retention Engine

The 5-day delayed-retention pipeline (`baseTs + 5*86400000`, `retained`/`failed`/`due`/`provisional` keys, retention history preserved as an append-only `PROGRESS.externalEvidence[]` log) was **already present and compliant** and was intentionally left unmodified. This pass's only retention-relevant addition is that `due`/`retained` are now also gated by unresolved misconceptions (Section 8) — e.g., a chapter can be `Retention Due` per the existing 5-day clock and still show `Retest Required` if a fresh misconception has appeared since. Verified directly: with the base pipeline stubbed to return `due`, an unresolved misconception downgrades the result to `retestRequired`; with no misconception, `due`/`failed`/`retained` pass through unchanged (Section 15/16).

## 10. Adaptive Priority

`adaptiveScore(q)` was wrapped to add, on top of its existing score: **+12** if the question's skill has an unresolved high-confidence misconception, **+8 to +12** (scaled by count) if the skill has ≥2 distinct-question repeated errors, **+3** if the skill is fragile, and a small **-2** same-day-exposure nudge (not a hard exclusion, to preserve the existing, deliberately documented "Adaptive/Final Week may override no-repeat" behavior — see the in-code comment near `buildAdaptivePool`/Section J test #10, which this pass does not disturb). This produces the required outranking: unresolved HC-wrong and repeated-error skills score highest, then fragile knowledge, on top of the pre-existing due/weak/hard/calc factors.

## 11. Study Plan Integration

`buildTodayMission()` was wrapped to add a purely additive `mission.reasonItems[]` array — specific strings like *"High-confidence misconception — EAC method selection (Ch.7)"*, *"Repeated errors — CPM Float (Ch.6)"*, *"Fragile knowledge — Estimate Classification (Ch.9)"*, *"Retention due — Chapter 12"* — without touching the existing `mission.queue`/`mission.reasons` selection algorithm. `renderStudyPlan()` was wrapped to append a "Why these are recommended" card listing these reasons under the existing mission-step markup, wrapped in `try/catch` so a UI addition can never break the base render.

## 12. Final Week Integration

`buildFinalWeekPool()` was wrapped to **reorder** (not rebuild) its existing pool: questions belonging to an unresolved-misconception skill are moved to the front, then questions belonging to a repeated-error skill, then the rest in their original (already-shuffled) order. The underlying pool contents, exposure rules, and difficulty/type inclusion logic are all untouched.

## 13. Readiness Integration

`readinessScore()` was wrapped to add a bounded extra penalty (up to 15 points, 5 per unresolved misconception) on top of the existing formula, and to `unshift` an explicit driver string naming the count. Because the penalty is driven by `mreUnresolvedMisconceptions()` — which, per Section 5, is *not* cleared by a same-question retry — the same-question anti-inflation guarantee carries through to Readiness (verified directly: after a same-question correct retry, the misconception driver and its penalty are still present). The existing weighted-formula transparency (`drivers[]`) and disclaimer language elsewhere in the app were not touched; `overallStats()` gained two new, purely additive counters (`unresolvedMisconceptionCount`, `fragileSkillCount`) for any UI that wants skill-level counts, without altering any existing field (protecting the earlier P0-B Dashboard-vs-Mastery fix).

## 14. Data Migration

**No schema migration was required.** Every new function in this pass is a pure, derived read over fields that already exist in `PROGRESS.attempts[]` (`qid`, `correct`, `confidence`, `chapter`, `topic`, `ts`) and `PROGRESS.externalEvidence[]`. No new top-level `PROGRESS` fields were added, so:
- Existing localStorage data loads and is immediately usable by the new engine with no conversion step.
- `exportProgress()`/`importProgress()` needed no changes — they already serialize/restore the whole `PROGRESS` object, so historical attempts (and therefore all new skill-level evidence, since it's derived) survive export → import → restore untouched (tested directly, Section 15/16, Test 19).
- All prior attempts, confidence values, mistakes, bookmarks, mock/memo history, and statistics are read as-is; nothing was wiped or reset.

## 15. Learner Profile Tests (A–J)

All profiles were exercised with a headless Chromium instance loading the actual final build (`CCP_Exam_Coach_MASTERY_RETENTION.html`) via Playwright, driving state through the app's own `recordAttempt()` function (never a parallel test-only writer), then reading the app's own live functions.

| Profile | Setup | Expected | Actual | Result |
|---|---|---|---|---|
| A. New Student | Fresh `PROGRESS` | No fake weaknesses; Study Plan gives a clear starting prompt | `mreUnresolvedMisconceptions()==0`, `mreFragileSkills()==0`, `buildTodayMission().needsStart===true` | **PASS** |
| B. Strong Knowledge | 3× Correct+High across a skill (incl. a repeat) | Strong evidence, no fake flags, not instant chapter retention | 0 misconceptions, 0 fragile flags recorded | **PASS** |
| C. Fragile Knowledge | Correct+Low on Qa, then fresh Correct+Medium on different Qb | Fragile status created, then cleared by fresh medium-confidence evidence | Fragile flag present after Qa, absent after Qb | **PASS** |
| D. Normal Mistake | Wrong+Low on Qa | Weak/retest state, not flagged as a misconception | `weakQuestionIds()` includes Qa; `mreUnresolvedMisconceptions()==0` | **PASS** |
| E. High-Confidence Wrong | Wrong+High on Qa | Recorded as a dangerous misconception, high priority | Unresolved misconception recorded for the skill | **PASS** |
| F. Formula-Selection Error | Existing `mistakeClassifications` entry with `primaryType:'Formula/Method Selection'` | Existing classification is used/preserved, not overwritten with invented certainty | Classification round-trips unchanged | **PASS** |
| G. Repeated Error | Wrong (any confidence) on two *different* questions in the same skill | Higher adaptive priority than an untouched skill | `mreRepeatedErrorSkills(2)` reports the skill; `adaptiveScore()` for a question in it exceeds an untouched question's score | **PASS** |
| H. Recovery | Wrong+High → same-Q Correct+High → different-Q Correct+High | Improvement is recognized (`sameQFixed:true`) but chapter/skill is not prematurely marked resolved until the fresh question passes | Unresolved after same-Q retry; resolved only after the fresh different question (this is the same sequence validated as Tests 1–3, applied here as the Recovery narrative) | **PASS** |
| I. Retention Due | Base mastery pipeline stubbed to `due` (no misconception) | Retention Due status is presented for review, undisturbed by the new gate | `chapterMasteryStatus()` returns `due` unchanged | **PASS** |
| J. Retention Failure | Base pipeline stubbed to `failed` (no misconception) *and* to `due` *with* a fresh unresolved misconception present | A previously-mastered skill that fails/weakens is not silently upgraded; a fresh misconception demotes even a Retention-Due chapter | `failed` passes through unchanged; `due`+misconception → `retestRequired` | **PASS** |

**Result: 10/10 learner profiles passed.**

*Method note on I/J*: the pre-existing 5-day delayed-retention pipeline itself (dates, `dueTs` arithmetic, `retained`/`failed`/`due` determination) is unmodified by this pass (Section 9) and was regression-tested directly in Section 16 using a controlled clock. Profiles I/J here specifically validate the **new** gate wrapper's interaction with that pipeline's output (pass-through when clean, override when a misconception is present), which is the actual code this pass added.

## 16. Time-Based Retention Tests

No real 5-day wait was used. A controlled test-clock was applied by overriding `Date.now` **inside the isolated Playwright browser page only**, for the duration of one test block, then restored:

```js
window.__MRE_REAL_NOW = Date.now.bind(Date);
Date.now = () => window.__MRE_REAL_NOW() + window.__MRE_FAKE_OFFSET;
// ... exercise the real dueTs = baseTs + 5*86400000 gate at offset 0 (not due) ...
// ... then set __MRE_FAKE_OFFSET = 5 days + 1s (due) ...
Date.now = window.__MRE_REAL_NOW; // restored
```
- This fixture lives **only** in the Node/Playwright test script (`mre_tests.js`), never in the shipped HTML/JS file. No learner-facing control to change dates was added anywhere in the app.
- Test 8: at offset 0, the 5-day gate correctly reports "not due yet." **PASS**
- Test 9: at offset (5 days + 1s), the same gate correctly reports "due now." **PASS**
- Production code paths were not altered to support this — they still call the real, unmodified `Date.now()`.

## 17. Regression Suite

**A) Structural** — Verified via direct in-browser comparison of `JSON.stringify(QUESTIONS)` between `CCP_Exam_Coach_PRE_MASTERY_ENGINE.html` and the edited `CCP_Exam_Coach_AACE_VALIDATED.html`: **byte-for-byte identical** (1,004,388 bytes both sides). 830 questions confirmed present with unique IDs (Test STRUCT-1/2). **PASS.**

**B) P0/P1** — `overallStats()` new fields are additive only; no existing field, label, or Dashboard/Mastery text was changed. `wrongOnlyIds()`/`highConfidenceMissIds()` (the functions behind the P1-A Error Notebook fix) were not modified. The "Substitute and Calculate" labeling fix (`humanCalculationExplanation`) was not touched. **PASS** (no code in these paths was edited; confirmed by diff/grep of the relevant functions before and after).

**C) Content/AACE** — Question bank confirmed byte-identical (see A). No source citations, worked solutions, or terminology were touched — this pass added code only, after the bootstrap `init()` IIFE, no earlier code was edited. **PASS.**

**D) Core flows** — A full headless run of Chapter 4 Practice (5 questions, answer + submit + next through the whole queue) completed with no JS errors, followed by navigating `home, dashboard, notebook, weaknessReport, reviewCenter, evidence, formulaLab, methodDrillConfig, studyPlan, coldReadiness, practiceCenter` — all rendered non-empty with zero JS errors. Additional spot checks of `memoPractice`, `blueprintMockConfig`, `timedMockConfig`, `fullSimConfig`, `finalWeekConfig`, `freshChallengeCenter` raised no errors. **PASS.**

**E) Persistence** — `overallStats().total` before/after a full page reload matched (5/5) in the core-flow run; a dedicated engine-level test also confirmed `mreUnresolvedMisconceptions()` survives a reload (Test 18) and an export→wipe→import round trip (Test 19). **PASS.**

Both the engine-specific suite (37 assertions) and the core-flow suite were run **twice**: once against the edited `CCP_Exam_Coach_AACE_VALIDATED.html`, and again against the final, locked `CCP_Exam_Coach_MASTERY_RETENTION.html`, with identical results both times.

## 18. Previous Fix Preservation

- P0-B (Dashboard-vs-Mastery labeling) and P1-B ("Substitute and Calculate" mislabeling): the functions involved (`chapterStaticStats`, `humanCalculationExplanation`) were not edited in this pass.
- P1-A (Error Notebook stale-miss bug): `wrongOnlyIds()` was read but not modified; its recency-check pattern was reused conceptually (not copied) for `mreSkillAttemptMap()`'s chronological-sort approach.
- The "Adaptive/Final Week may override no-repeat" behavior (Section J test #10 in the app's own prior regression history) was explicitly preserved: the new anti-repetition logic in `adaptiveScore()` is a soft score penalty, never a hard exclusion.
- All 830 AACE-validated question contents (stems, options, correct-answer indices, explanations, citations) are confirmed byte-identical to the pre-pass baseline (Section 17-A).

## 19. Known Limitations

- The Mastery Gate integration test (Section 15/16) validates the new wrapper's logic against a **stubbed** base pipeline result rather than driving the full real 5-stage pipeline (Practice → Official Study Guide → Apply → Mastery Test → Challenge → Retention) end-to-end through the UI, because constructing a fully valid `externalEvidence` fixture for every one of those gates is a large undertaking independent of this pass's actual code changes. The wrapper boundary itself (what happens to a `provisional`/`retained`/`due`/`failed` result) is fully and directly tested; the pre-existing pipeline that produces those results was not modified and was separately confirmed to still execute without errors via the full view-regression sweep.
- "Fresh vs. Repeat vs. Cold-Unseen" evidence classification (Phase 4) is satisfied for the specific case this pass targets — resolving a misconception/fragile flag requires a *different question ID* — but a full three-way exposure-recency classifier (using `exposureOf()`/SRS timing to label evidence as strictly COLD_UNSEEN vs. REPEAT vs. FRESH for every UI surface) was not built as a separate subsystem, since the existing Cold/Fresh architecture (Cold Certification, Apply/Challenge fresh-item generation) already owns that distinction for its own tiers and was left untouched per the content-freeze/no-new-competing-system instructions.
- Formula/Method-Selection-specific weakness detection (Profile F) relies on the app's existing `mistakeClassifications`/`methodSelectionAttempts` ledgers; this pass does not add new automatic inference of *why* an answer was wrong beyond what those existing, explicitly-tagged sources already provide, per the "do not invent certainty about the learner's mental process" instruction.
- The Chapter Progress UI addition (Section 12/"Why am I not mastered yet?") is appended as an additional card rather than integrated into the existing exit-criteria checklist's visual design, to avoid a UI redesign that was explicitly out of scope.

## 20. Intentionally Not Changed

- All 830 question stems, options, correct-answer indices, worked solutions, explanations, and AACE source citations.
- The existing SRS box system, exposure/anti-memorization tracking, and no-repeat override behavior for Adaptive/Final Week/Wrong-Answer sessions.
- The existing 5-stage chapter mastery pipeline's internal pass/fail thresholds and evidence-source rules (`chapterTrainingGate`, `officialStudyGuideGate`, Apply/Mastery Test/Challenge scoring, the 5-day retention delay itself).
- The existing fresh-question/scenario generation engine (`buildVettedScenarioItem`, `buildAssessmentPackV56`, etc.) and its hard-block-on-insufficient-quality behavior.
- Export/Import format, Memo Practice, Formula Lab content, personal notes, Blueprint Mock composition, and all timer/session mechanics.
- The readiness score's existing weighted formula and its "not an official AACE pass probability" framing (only an additional bounded penalty/driver was layered on top).

---

## 21. Live End-to-End Mastery Pipeline Verification (post-lock, verification-only pass)

A separate, follow-up verification pass was run against the **locked final build**, `CCP_Exam_Coach_MASTERY_RETENTION.html` (SHA-256 unchanged, see below), to directly exercise the real, unmodified 5-stage pipeline end-to-end — Practice → Official Study Guide → Apply → Mastery Test → Challenge → Retention — for one real chapter (Chapter 18) carrying one weak skill, one high-confidence-wrong skill, and one fragile-correct skill, all seeded from real bank questions. **No evaluation function was stubbed or monkey-patched at any point in this pass** (unlike the earlier isolated unit tests in Section 15, which deliberately stubbed the base pipeline to test the gate wrapper in isolation) — `chapterTrainingGate`, `officialStudyGuideGate`, `chapterMasteryStatus`, `chapterExitNextAction`, `recommendedNextStep`, `buildTodayMission`, and `buildFinalWeekPool` all ran as their real, live production code throughout.

**Method**: Chapter Practice's own question pool is intentionally randomized/exposure-based and cannot be aimed at specific question IDs, so — to deterministically plant the three required skills — the Practice stage called the app's own `recordAttempt()` (the exact function every "Submit answer" click invokes) for chosen question IDs, rather than clicking through a randomly-drawn queue. Every later stage was driven through its real UI handler functions with no shortcuts: `startOfficialStudyGuide`/`v56PickOfficial`/`finishOfficialStudyGuide` for the Official Study Guide; `autoGenerateAndStartFresh`/`selectFreshChallengeAnswer`/`confirmFreshChallengeAnswer`/`nextFreshChallengeItem`/`attestOfflineFresh` for Apply, Mastery Test, Challenge, and Retention. A controlled test-clock (`Date.now` overridden inside the isolated Playwright page only, invalidating the app's own derived-data cache the same way a real `saveProgress()` call does) simulated the 5-day retention delay; production code itself was never touched.

**Sequence and real (unstubbed) results**:

| Step | Real pipeline action | Result |
|---|---|---|
| 1 | Practice: seeded one weak (wrong+low), one high-confidence-wrong (wrong+high), one fragile-correct (correct+low) skill, plus 7 filler correct+high answers, via `recordAttempt()` | `chapterTrainingGate('18').pass === true`; all three skills correctly classified by the real engine |
| 2 | Official Study Guide: all 10 real Chapter 18 items answered via `v56PickOfficial`/`finishOfficialStudyGuide` | `officialStudyGuideGate('18').pass === true` (100%) |
| 3 | Apply Test (L2): 10-item real Fresh Challenge, 100% | `latestFreshLevelEvidence('18',2).scorePct >= 80` |
| 4 | Mastery Test (Internal, sealed): 10-item real Fresh Challenge, 100%, closed-book attested | `latestInternalMasteryEvidence('18')` real record, `scorePct>=85`, `closedBook && closedBookAttested === true` |
| 5 | Challenge (L3): 10-item real Fresh Challenge, 100%, closed-book attested | `latestFreshLevelEvidence('18',3)` real record, `scorePct>=75`, `effectiveClosedBookEvidence === true` |
| 6 | **Gate check** — real, unstubbed `chapterMasteryStatus('18')` | The base 5-stage pipeline had everything it needs to call this chapter mastered, but the engine correctly returned **`retestRequired`** because the Stage-1 misconception was still unresolved. `chapterExitNextAction('18')` correctly offered "Resolve Chapter 18 Misconception" (not "move forward"); `recommendedNextStep()` correctly surfaced it first; the real Study Plan screen rendered the specific reason text; `buildFinalWeekPool()` front-loaded the misconception question |
| 7 | Same-question retry: `recordAttempt()` correct+high on the **same** misconception qid | `chapterMasteryStatus('18')` **still** `retestRequired`; `mreUnresolvedMisconceptionsForChapter('18')` still reports it (with `sameQFixed:true`) — confirms the mandatory rule live, inside a pipeline that had otherwise fully earned mastery |
| 8 | Fresh (different) question, same skill, correct+high | `chapterMasteryStatus('18')` now real, unstubbed **`provisional`** |
| 9 | Controlled clock at t=0 after mastery | Still `provisional` (retention correctly not yet due) |
| 10 | Controlled clock at 5 days + 1 hour | Real, unstubbed **`due`**; real Study Plan's `retentionCh` includes Chapter 18 |
| 11 | Delayed Retention test (real, closed-book, 100%) | Real, unstubbed **`retained`** |
| 12 | A second delayed retention test (real, closed-book, 20%) | Real, unstubbed **`failed`** (Retention Gap) — demonstrates failure at the retention stage correctly demotes an already-retained chapter, without deleting the earlier `retained` evidence record itself (only the currently-reported status changes; both evidence records remain in `PROGRESS.externalEvidence[]`); `chapterExitNextAction` correctly offered repair; Study Plan and Final Week both still surfaced the chapter |
| 13 | Reload | `chapterMasteryStatus('18')` still real, unstubbed `failed` — full pipeline state (all seven pipeline stages' worth of evidence) survives a reload |
| 14 | Structural check | All 830 questions still present with unique IDs; question bank confirmed byte-identical to the locked build |

**Result: 28/28 real, live, end-to-end assertions passed.** No JS errors occurred during the run.

**Defect found**: none in the engine. One issue surfaced during script development — the derived-data cache (`V58_CACHE`/`V58_REV`, pre-existing and unrelated to this pass, see Section 2) needs invalidating (via `saveProgress()`, exactly as every real learner action already triggers) before re-reading `chapterMasteryStatus()` after advancing the controlled test-clock; the first draft of the *test script* forgot this and briefly showed a stale cached status. This was a test-harness omission, not an application defect — a real learner's clock never jumps discontinuously mid-session, and every real state-changing action already calls `saveProgress()`. **No engine code was modified as a result of this verification pass.**

**Regression re-run**: the existing core-flow regression (Chapter 4 Practice session end-to-end, all core views, reload persistence) was re-run against the exact same locked `CCP_Exam_Coach_MASTERY_RETENTION.html` and passed cleanly with zero JS errors, exactly as in Section 17.

## Final Build

- **Final build filename**: `CCP_Exam_Coach_MASTERY_RETENTION.html`
- **SHA-256** (unchanged by this verification-only pass — no code was edited): `16aa6924a1736ca43a203929fae2d1898a45a15d556beb6c329d8b64d6ec0fd6`
- **Report filename**: `ccp_mastery_adaptive_retention_report.md`
