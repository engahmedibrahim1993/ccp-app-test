# CCP Exam Coach — Blind Independent Student Usability Evaluation

**Subject:** `CCP_Exam_Coach_SIMPLIFIED.html` (SHA-256 `2544b4d7a18b5320514b1f06d0395bac34776fa99872a300a03d1db767c5c14e`, unchanged by this evaluation).

**Method:** this is an independent re-test, not a re-read of `ccp_ux_simplification_report.md`. Every finding below comes from actually loading the live file in a headless browser and clicking through it — real button clicks (`page.locator('button', {hasText:...}).click()`), real screenshots, real confirm-dialog handling, real controlled-clock retention fixtures reusing the app's own pipeline functions (never stubbed). Nothing here was assumed from the implementation report; several things it claimed were checked and found to be **only partially true** (see Section 2). No code was changed.

---

## 1. What Was Tested

All 13 required situations were driven through real UI interaction: opening cold, normal daily study, deliberately studying a chapter, returning with a populated history (5 chapters + a mock), correcting a weak skill, a fresh high-confidence misconception, a genuinely-earned Retention Due state (built by running the real Practice→Official Questions→Apply→Mastery Test→Challenge pipeline for Chapter 18 and then advancing a controlled test clock — not faked), Calculation Drill, Formula Lab, a Timed Mock, a Blueprint Mock (including its confirmation dialog), Memo Practice, Progress with real accumulated history, and a simulated exam date 6 days out.

## 2. Findings

### Today

**Genuinely good, for a clean day.** A brand-new student sees exactly one card, one sentence, one button ("Start Chapter 1 →"), and nothing else. That is the strongest single result of this whole redesign — verified by screenshot, not just DOM text.

**Falls apart the moment there's an active misconception — which is not an edge case, it's a normal state.** With a genuine high-confidence-wrong recorded, Today's primary card reads:

> **Resolve Chapter 9 misconception**
> High-confidence misconception — Estimate Classification (Ch.9) — a same-question retry did not resolve this; a different question on the same skill must be answered correctly.
> • High-confidence misconception — Estimate Classification (Ch.9)
> • High-confidence misconception — Stakeholder Communication (Ch.18)
> • High-confidence misconception — Communication (Ch.18)
> • Fragile knowledge — Percent Complete from Physical Progress (Ch.4)
> **[ Complete Official Questions → ]**

Two real problems here, confirmed by screenshot as well as text:

1. **The button does not do what the headline promises.** The card is titled "Resolve Chapter 9 misconception," but the actual button — "Complete Official Questions →" — is Chapter 9's genuinely next pipeline step (it hasn't finished that gate yet), which has nothing to do with resolving the misconception. In the isolated single-issue version of this test (one wrong+high answer, nothing else), the same pattern held: title says "Resolve Chapter 9 misconception," button says "Continue Chapter 9 Practice →." **A student who clicks the button expecting to address "the misconception" will instead land somewhere unrelated.** This is a genuine trust problem, not a cosmetic one — the entire pitch of Today is "you don't have to think about why," and this is a case where the "why" it just told you turns out not to match the "what happens when you click."
2. **The same fact is repeated three times in one card** (the top alert box, the card's own reason line, and the first bullet immediately below it), while the list then quietly appends two *different* issues (a Ch.18 misconception, a Ch.4 fragile-knowledge flag) with no visual distinction from the repeated Ch.9 line. A student skimming this — which is the whole point of Today — is more likely to come away confused about how many separate things are wrong than reassured about the one thing to do next.

**Internal pipeline jargon is fully visible on Today, unsoftened**, immediately below the recommend card, whenever a chapter has any history: "Apply," "Mastery Test," "Challenge," "Retention," "Pass 10Q closed-book Mastery Test (≥85%)," "Pass closed-book Challenge (≥75%)" all appear as plain, uncollapsed text in the "Chapter N Progress" card (confirmed by screenshot — not hidden behind the "Evidence details" disclosure, which is a *separate*, additional section further down). Only the single "Next: ..." line got plain-language treatment; the step labels themselves did not.

**No exam-proximity urgency at all.** With a saved exam date 6 days out and an active misconception, Today's content was indistinguishable from a normal day — same "Continue Chapter 9 Practice" framing, no acknowledgment that the exam is a week away. The amber "exam is close" treatment only exists on Exam Practice, which nothing on Today points you toward. For the specific "one week before the exam" situation this task asked to test, Today — the one screen whose entire job is "tell me what to do" — currently says nothing different from any other day.

**Does Today genuinely guide, or just redirect?** Mostly redirect, once real history exists. It correctly identifies *what* is most important (that part of the underlying priority logic is sound and was independently re-verified, see Section 3) but the explanation it gives often doesn't match the action it's handing you, which undermines the "guide" half of the claim.

### Study

Clean and correctly scoped: "Study a chapter" is the obvious primary action, Formula Lab sits right next to it, "Calculation practice" is a clearly labeled group, and less-common modes are one tap away under "More study options." No real complaints here — this screen does what it says.

**One naming collision found**, not previously flagged: Study's "Calculation practice" group sends you to "Calculation Drill" — but the resulting screen titles itself "Calculation Drill **DYNAMIC**" and immediately advertises a *different*, unexplored button called "**Calculation Practice**" ("uses fixed, human-reviewed questions from the Master Bank"). A student arrived here *from* something Study itself called "Calculation practice" a moment ago, and is now told about a different thing with almost the identical name. This is a real, if minor, point of confusion.

That same Calculation Drill screen also lists 17 near-identical chapter tiles with no filter — the exact clutter pattern that was fixed in Formula Lab, left untouched here. Inconsistent treatment of the same problem.

### Fix Weak Areas

**This is the strongest result in the whole app, and it held up under two genuinely different real states, not just the easy case.** With an ordinary wrong answer recorded, "Start Fix Weak Areas Session" led straight into a live 15-question Adaptive Practice quiz — 2 clicks, zero menu. Separately, after actually earning a real Retention-Due status for Chapter 18 (full pipeline, not a shortcut) and going back to Fix Weak Areas, the same single button correctly detected the due retention check and routed straight into the real closed-book Retention Test instead of an ordinary practice session — again 2 clicks, no extra decision, no wrong turn. The screen's own stat counters (weak/wrong/misconception/fragile) also stayed empty in the retention-due case, which is *correct*, since those counters track question-level flags, not chapter-level retention state — verified this wasn't a display bug by confirming the retention routing worked anyway.

### Exam Practice

Genuinely organized around student goals, not internal modes: four clearly different formats (Unseen / Timed / Blueprint / Full Simulation), each described in a way that says what it's *for*, not what it's called internally. Final Week correctly and automatically became a prominent amber card when the saved exam date was set to 6 days out — this part of the "one week before the exam" story works well, it's just that nothing tells you to come here in the first place (see Today, above).

The Blueprint Mock confirmation dialog is a little shouty ("TRAINING Blueprint Mock" in caps) but it's giving genuinely important, non-obvious information — that a 3-hour training-bank mock doesn't count as unseen/cold evidence — at exactly the moment a real time commitment is being made. Worth keeping as-is.

Memo Practice and "Blueprint Transfer Check (119Q)" are both reachable from here *and* from the global More menu with identical wording in both places — harmless, but not "one clear place for everything."

### Progress

**This is the second-strongest finding of concern.** The consolidation itself (one screen, expandable sections) is the right shape, and the Readiness section at the top is genuinely good — one ring, real drivers in plain language, one link out for the separate unseen-question number. But the very next section, "Your chapters" — the largest, most prominent block on the page — showed **every single one of 34 chapters as "Practicing,"** including chapters with zero attempts ever recorded, right alongside a chapter with real graded history. Confirmed by screenshot: it is a 34-row wall of identical text. This is worse than the old raw-percentage bar chart it replaced, which at least varied row to row. As currently built, this section cannot answer the most basic question a student would open Progress to ask — "which chapters have I actually made headway on?"

The "Weak areas" list below it also dropped a real piece of information the original Weakness Report used to show: a "(low evidence)" flag next to a topic backed by only one or two attempts. A topic that shows a flat "0%" from one unlucky guess reads identically to a topic that's genuinely and reliably weak.

So: does Progress overload the student? No — it's not too much information. It's the opposite failure: its headline section currently carries almost no differentiating information at all, while still taking up the most space on the screen.

### More

Reasonable, low-effort grouping (Study / Exam formats / Personal tools / Records & export). Nothing here felt like it should have been promoted to a primary tab — these are genuinely infrequent actions, and finding them under one clearly-labeled "More" tap was not effortful.

### Studying a specific chapter — the flow this task asked to scrutinize

Measured: **Study → "Choose a Chapter" → [land on a 6-decision form: chapter / question type / count / difficulty / feedback / confidence] → Start session.** That is 2 clicks to reach the form, 6 decisions inside it, 1 click to start — 9 interactions total, one more than the old direct Home tile (which reached the *same* 6-decision form in 1 click). The extra click is a fair, disclosed trade for keeping Today single-purpose. **The 6-decision form itself is the real remaining friction**, and it is unchanged from before this redesign: a student who just wants to study Chapter 9 today is handed a form with six separate fields before anything happens. Given the task's explicit instruction not to propose new features, the honest assessment is: this is the one piece of the *original* audit's own recommendation ("defaults pre-selected, Customize collapsed") that was never implemented, and it's the most noticeable remaining friction point in the app for exactly the journey this task asked me to scrutinize most closely.

## 3. Independent Re-Verification (not just re-reading the prior report)

Before trusting Fix Weak Areas' automatic routing, I rebuilt a genuine Retention-Due state myself, from a clean profile, using only the app's own real functions (`startOfficialStudyGuide`/`autoGenerateAndStartFresh`/`attestOfflineFresh`/a controlled test-clock offset) — not a shortcut, not a stubbed status. It worked exactly as claimed: Today correctly said "Retention check — Chapter 18 / The retention delay is complete," and Fix Weak Areas' one button correctly launched the real Retention Test. Question-bank integrity was spot-checked (830 questions, all IDs present) rather than assumed from the prior report.

## 4. Classification of Findings

**MUST FIX**
1. Today's recommend-card headline can name one problem ("Resolve Chapter N misconception") while its button addresses a completely different, unrelated pipeline step — actively misleading about what the primary action will do.
2. Today repeats the identical misconception fact up to three times within one card (alert box + reason line + first bullet) while burying genuinely different issues in the same undifferentiated list.
3. Progress's "Your chapters" section shows every chapter as "Practicing" regardless of actual progress (zero attempts and near-mastery look identical) — the most prominent section of the consolidated Progress screen currently carries no useful signal.
4. Chapter-pipeline jargon ("Apply," "Mastery Test," "Challenge," "Pass 10Q closed-book Mastery Test (≥85%)") appears fully visible and uncollapsed on Today itself, not just in an expandable detail view — contradicts the stated goal for the primary screens.

**SHOULD IMPROVE**
5. Naming collision: Study's "Calculation practice" leads to a screen that promotes a different, similarly-named "Calculation Practice" mode with no explanation of the difference.
6. Calculation Drill's 17-chapter tile list has the same clutter problem Formula Lab already fixed, left inconsistent.
7. Progress's weak-topic list lost the original "(low evidence)" qualifier, so single-attempt noise reads the same as a reliable weakness.
8. Today gives zero acknowledgment of exam proximity, even 6 days out with an active misconception — the urgency logic exists but only on a screen the student has no reason to visit that day.
9. "Blueprint Transfer Check" is listed in two different secondary locations with identical wording.
10. The chapter-practice config screen's 6-decision form is unchanged and is the most noticeable remaining friction point for the single most common deliberate action in the app (see Section 2).

**ACCEPTABLE TRADEOFF**
11. One extra click to reach the chapter picker (2 vs. 1) in exchange for Today staying single-purpose.
12. Blueprint Mock's slightly shouty confirmation dialog — it's delivering information that matters at the moment it matters.

**LEAVE ALONE**
13. Today for a genuinely new student: one card, one button, nothing else.
14. Formula Lab's chapter filter.
15. Fix Weak Areas' automatic mechanism selection — verified correct in two independently rebuilt real states (ordinary weakness and genuine retention-due).
16. Exam Practice's four-format organization and its per-format "what this is for" descriptions.
17. The persistent nav bar's placement (present on the five hubs, absent during quiz/config/results, where it would be a distraction).
18. More's four-way grouping.

## 5. Final Answer

**Would I personally consider this simple enough to use every day for CCP prep without needing to understand how the app works internally?**

**Not yet, but it's close, and the gap is narrow and specific.** On a clean day — no outstanding mistakes, nothing due — this is genuinely a one-button app, and I would trust it without a second thought. The problem is that "a clean day" is not the normal state of studying for a certification exam; having at least one flagged mistake or a pending checkpoint is the *ordinary* condition, and that is exactly the state where Today currently contradicts itself (a headline about fixing one thing, paired with a button that does another) and where Progress's flagship chapter list stops being useful. A careful student — which is exactly who is likely to be preparing for a professional certification — will notice within the first week that the "trust the recommendation" premise doesn't fully hold, and will start double-checking the app's suggestions against their own memory of what's actually wrong, which is precisely the cognitive overhead this redesign set out to remove. Fix the four MUST FIX items above and this becomes a genuine yes.
