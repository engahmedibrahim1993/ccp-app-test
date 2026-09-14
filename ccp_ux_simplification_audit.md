# CCP Exam Coach — Student-Facing Simplification Audit

**Scope of this pass:** audit only. No code was changed. This document is the input to a future simplification implementation pass, not the implementation itself.

**Method:** the live build (`CCP_Exam_Coach_MASTERY_RETENTION.html`) was navigated as a real candidate would — every reachable screen was opened, every button's actual on-screen label and description text was captured (via a scripted crawl of the real rendered DOM, not just function names), and every "mode" was traced back to the code that runs it to check for duplication, dead ends, and decision points. Ten realistic student journeys (new student, daily study, one chapter, correcting a weakness, retention due, high-confidence misconception, calculation weakness, one week out, taking a mock, "I don't know what to click") were walked click-by-click.

---

## 1. Current Sources of Clutter and Confusion

1. **Home looks simple, but it is a facade over five hub screens that are each their own wall of choices.** The live Home shows 4 tiles + a 6-item "More tools" strip (11 buttons total). But three of those tiles (*Fix Mistakes*, *Exam & Readiness*, and — one hop further — *Readiness Center*) open **Review Center** (7 buttons), **Exam Center** (9 buttons), and **Readiness Center** (4 buttons) respectively. A student who clicks one "simple" tile lands on another full menu. Total distinct destinations reachable within two clicks of Home: **~40**.

2. **There are two competing Home-screen architectures still in the code.** An older, three-column "Study & Exam / Resources & Tools" Home (`HOME_SECTIONS`, `STUDY_RESOURCES`, `ADVANCED_RESOURCES`, ~20+ buttons) is still fully defined and still styles/labels Practice Center, Review Center, and Exam Center — those three hub screens are its surviving children even though the Home screen itself was replaced by a simpler v5.5.1 version. This is not a student-visible bug, but it explains *why* the hub screens still feel like a leftover, unsimplified generation of the app: they were built for a Home screen that no longer exists.

3. **"How am I doing?" is answered in five different places, with five different slices of the same underlying numbers.** Dashboard, Weakness Report, Readiness Center, the Evidence ("Chapter Readiness & Evidence") page, and My Final Review all independently show overlapping combinations of: overall accuracy, calc/concept accuracy, high-confidence misses, fragile-correct counts, domain performance, and weak-topic lists. A student chasing "where am I weak" has to check up to five screens to be sure they've seen everything, and each screen phrases it slightly differently ("Fragile (low-confidence correct)" vs. "Correct + Low (Fragile)" vs. "Fragile correct").

4. **The mastery/retention pipeline is exposed as jargon-heavy manual actions instead of background intelligence.** A student trying to progress a chapter is shown named buttons for *Apply Test*, *Internal Mastery Test*, *Challenge Test*, and *Retention Test*, plus qualifiers like "closed-book attestation," "L3 Transfer," "Provisional Mastery," "sealed one-use," and "Cold Static." This is the single biggest source of "I don't know what I'm supposed to click" in the whole app — the underlying evidence logic is sound (and should stay), but no real candidate should have to learn a five-stage internal taxonomy to know what to do next.

5. **Four different modes all produce "a fresh calculation with new numbers."** Calculation Drill, Generated Practice, Fresh Challenge Level 1 ("Fresh Calculation Drill"), and the Timed Calculation Set all serve the same underlying need (practice calculating instead of recalling a memorized answer), reachable through four separately-branded entry points.

6. **Formula Lab presents 26 nearly identical repeated buttons** ("Drill this chapter's calculations →" × 26, one per chapter) rather than one action with a chapter picker — this is a scaling problem baked into the current design, not a one-off.

7. **Some screens exist purely to link to other screens.** Readiness Center's 4th tile links to Session History (already reachable from Exam Center); the Dashboard's "Cold Exam Readiness" card exists only to link to Cold Readiness; Exam Center's footer links to Readiness Center. These are navigational connective tissue disguised as content.

8. **Two review surfaces do the same job under different names.** *Error Notebook* (read/filter your saved mistakes) and *Wrong Answers Review* (re-practice your saved mistakes) are functionally one workflow — "look at what I got wrong, then fix it" — split into a passive screen and a separate practice mode that a student has to know both exist and use in sequence.

9. **Several screens are technically unreachable by any real student.** `AI Pack Manager`, `Bug/Confusion Log`, and `Build Integrity / Self-check` have live render functions and a `VIEW` value, but **no button anywhere in the currently-executing Home/Practice/Review/Exam/Readiness screens links to them** (they were only wired into the superseded Home architecture described in #2). They are pure dead code from a student's point of view. `Question Issues` is reachable only via a small "⚑" flag icon inside an active quiz question — appropriately low-visibility, but worth confirming that's intentional rather than an oversight of the same kind.

10. **Session setup asks too many questions before the first question appears.** Starting an ordinary Chapter Practice session (the single most common action in the app) requires: pick a chapter → pick question type (Mixed/Concept/Calc) → pick a question count (5/10/20/30/50/All/Custom) → pick difficulty (All/Easy/Medium/Hard) → pick feedback timing (Immediate/End) → pick confidence-check on/off → click *Start session*. **That is 6 decisions and 7 clicks before productive studying begins**, for a mode most students will use identically every single day.

11. **Two numbers claim to answer "am I ready?" with different disclaimers attached, shown in three places each.** *Training Readiness* and *Cold (Exam) Readiness* both appear on Dashboard, Readiness Center, and (implicitly, via the underlying Cold pool stats) Cold Readiness — each repeating the "this is not an official AACE pass probability" disclaimer. One authoritative place for this is enough.

---

## 2. What Must Remain Visible (non-negotiable, high-frequency, or safety-critical)

- **A single, obvious "what do I do today" landing experience** (currently the seed of this exists in *Today's Study Plan*, but it is one tile among eleven instead of the front door).
- **Chapter-based practice** — the core, highest-frequency activity.
- **A single "fix what I'm getting wrong" surface** — currently split across Adaptive Practice / Weak Topics / Wrong Answers / Notebook; the *need* is one, visible thing.
- **A single "rehearse the real exam" surface** — Timed Mock, Blueprint Mock, Full Simulation, Memo Practice. These are genuinely different exam-format rehearsals (pacing, domain-weighted volume, writing) and should stay individually selectable, but under one roof.
- **Cold/Unseen Chapter Certification** — this is the one mode whose entire value proposition (an honestly-unseen test) would be undermined if buried or confused with ordinary practice; it needs a clear, singular presentation, not the three near-duplicate entry points it currently has (Exam Center, Readiness Center, Cold Readiness page).
- **One Progress/readiness destination** — the *existence* of rich analytics is a real strength of this app and must stay visible; the *five separate screens* currently delivering it do not need to.
- **Formula Lab content** (formulas, variable definitions, traps, worked examples) — genuinely useful reference material, valuable exactly because it is *not* scored/gamified.
- **Chapter mastery status, in plain language** ("Practicing" / "Getting there" / "Ready" / "Needs a refresh soon") — the underlying evidence engine is valuable and must keep being computed; what must remain visible is a plain-language status, not the five internal stage names.
- **Exam countdown / study pacing** (date + minutes/day) — small, useful, already low-friction.
- **The "why" behind a recommendation** (the new Mastery/Retention engine's plain-language reasons, e.g. "High-confidence misconception — EAC method selection") — this is exactly the kind of transparency that should survive simplification; it answers "why am I being asked to do this" without requiring architecture knowledge.

---

## 3. What Should Be Merged

| Merge into one surface | Currently separate as |
|---|---|
| **Fix Weak Areas** (one adaptive session type) | Adaptive Practice, Weak Topics Practice, Wrong Answers Review, Error Notebook (its "retry" affordance) |
| **Progress** (one screen, expandable sections) | Dashboard, Weakness Report, Readiness Center, Evidence ("Chapter Readiness & Evidence"), My Final Review |
| **Calculation Practice** (one mode, "timed" toggle) | Calculation Drill, Generated Practice, Fresh Challenge Level 1, Timed Calculation Set |
| **Exam Practice** (one hub, format choices inside) | Exam Center's 7 buttons + Readiness Center's "Start Unseen Chapter Test" + Cold Readiness's "Cold Chapter Certification" + Cold Readiness's "Generate Fresh Test" |
| **"Test my mastery of this chapter"** (one CTA per chapter, engine decides the stage) | Apply Test / Internal Mastery Test / Challenge Test / Retention Test / "Blueprint Transfer Check" / "Offline Fresh Transfer" as separately-named, separately-triggered actions |
| **Mistakes review** (read + retry in the same flow) | Error Notebook (read-only) and Wrong Answers Review (practice-only) |
| **Readiness numbers** (one framed pair, one place) | The Training-Readiness ring (Dashboard + Readiness Center, duplicated) and Cold-Readiness score (Dashboard card + Readiness Center + Cold Readiness page, tripled) |
| **Formula Lab chapter drill** (one picker) | 26 repeated "Drill this chapter's calculations" buttons |

---

## 4. What Should Become Background Intelligence (no dedicated button)

These are the "engines" the prompt specifically asked about. All of them are currently either fully background already (good — keep it that way) or partially exposed as manual, jargon-heavy actions (should be pulled back into the background):

- **Mastery Gate** — should decide, silently, whether a chapter's next available check is a first pass, a re-test, or a retention check. The student should see a status and a single "Test yourself" or "Retention check due" button, never "Start Internal Mastery Test (sealed, one-use, 85% closed-book target)."
- **Adaptive Retesting / same-question-vs-fresh-question evidence rule** — already fully invisible to the student (correct — it silently decides when a corrected mistake counts as resolved). Keep it that way; never surface "fresh evidence" terminology to the learner, only its consequence ("still needs one more correct answer on a different question").
- **Retention Engine (5-day delay, retained/failed/due states)** — the *decision of when a retention check becomes available* must stay automatic and silent. What the student sees is a plain due/not-due signal in Today's Plan and Progress, not the internal day-count math or evidence-record taxonomy.
- **Fragile Knowledge tracking** — should never be a destination of its own; it should silently raise the priority of a topic in the background practice queue and appear as one plain-language line in Progress ("A few topics are correct but not yet solid"), not as a separately-counted, separately-labeled metric repeated on four screens.
- **High-Confidence Wrong tracking** — same treatment: silently top-priority in the background queue, one plain-language line in Progress and in "why am I being asked this" explanations. It should never require the student to know the term "misconception."
- **Fresh Challenge generation** (scenario reframing, one-use pools, variant selection) — this is pure background machinery for producing the "next different question on the same skill." The *fact* that a fresh, non-repeated question was used should be invisible; the seven current named tiers (Apply/Challenge/Mastery/Retention/Blueprint Transfer/Offline Fresh/Fresh Calculation) should collapse into the engine silently choosing the right one.
- **SRS/spaced repetition and exposure/anti-memorization tracking** — already fully invisible; keep it that way. It should just make "Fix Weak Areas" naturally include due reviews without a separate "SRS due" button anywhere.
- **Skill-level evidence mapping (chapter+topic)** — invisible plumbing; never needs a UI.

**Direct answer to the prompt's question:** yes — Mastery, Adaptive Retesting, Retention, Fragile Knowledge, and High-Confidence Wrong should all operate almost entirely in the background and automatically determine what the student receives in *Today's Plan*, *Fix Weak Areas*, and *Exam Practice*. Fresh Challenge should also operate mostly in the background as the mechanism behind "test my mastery of this chapter," with only the *exam-format* rehearsals (Timed Mock, Blueprint Mock, Full Simulation) remaining separately visible, because those differ in a way a student actually cares about (pacing and volume), not in a way that's internal to the learning engine.

---

## 5. What Should Move to Secondary / "More Tools"

- **Random Practice** — genuinely useful for interleaved pre-exam review, but not a top-level, daily-frequency need.
- **Method Selection Drill** — valuable and should stay easy to find, but as a secondary tool under Study, not a Home tile.
- **Session History & Pacing** — useful for the curious/data-minded student, not something most students open often.
- **Memo Practice** — important but low-frequency compared to MCQ practice; belongs inside Exam Practice, not equally weighted with it on Home.
- **Topics to Relearn** — a genuinely nice personal-notes feature, but explicitly "does not create evidence or change readiness," i.e. it's a convenience list, not core learning intelligence. Secondary tool.
- **Optional external evidence entry** (manually logging an outside test result) — a real but rare need (maybe a handful of uses per student, ever). Buried appropriately already; keep it buried, one level deeper.
- **Export Coach Diagnostic / Download My Final Review / Export/Import JSON** — all legitimate, all infrequent. Group under one "Data & Export" secondary section.
- **Question Issues / report-a-problem** — correctly low-visibility already (a flag icon during practice); no change needed beyond keeping it out of primary navigation.

---

## 6. What Can Genuinely Be Removed (from the student-facing surface)

- **AI Pack Manager, Bug/Confusion Log, Build Integrity/Self-check** — unreachable dead ends today; remove from the student build entirely (or, if a maintainer needs them, gate them behind a debug flag, not a navigable screen).
- **Generated Practice as its own named mode** — fold its content-generation engine into Calculation Practice; the separate brand adds a decision without adding a distinct student benefit.
- **The old `HOME_SECTIONS` / `STUDY_RESOURCES` / `ADVANCED_RESOURCES` Home architecture** — confirmed dead relative to the live Home; safe to delete outright once Practice/Review/Exam Center are restructured per this audit (they are the last live consumers of those labels/descriptions).
- **Separate "Offline Fresh Transfer Blueprint (119Q)" as a student-facing named mode distinct from "Blueprint Mock"** — the distinction ("training-bank" vs. "transfer/derived-fresh," both still 119 questions, both still not sealed Cold evidence) is a real but *internal* nuance that adds a fifth mock-shaped button without adding a fifth mental model a student needs. Keep the underlying engine; drop it as a separately-branded top-level choice (fold into "Exam Practice → Blueprint Mock," with the fresher item pool used silently when available).
- **Redundant "Open Readiness Center" / "Pacing & Session History" links repeated across three screens** — remove the duplicated link, keep the one canonical path.

---

## 7. Engines and Visible Modes — Explicit Recommendation

| Item | Recommendation |
|---|---|
| Mastery Gate | **Background** — drives chapter status + the single "Test yourself" CTA |
| Adaptive Retesting (same-Q vs. fresh-Q rule) | **Background** — fully invisible, no change needed |
| Retention Engine | **Background** — drives a due/not-due signal only |
| Fragile Knowledge | **Background** — feeds queue priority + one Progress line |
| High-Confidence Wrong | **Background** — feeds queue priority + one Progress line, top-ranked |
| Fresh Challenge (generation engine) | **Mostly background** — powers "test my mastery," invisible tiering |
| Adaptive Practice (visible mode) | **Merge** into Fix Weak Areas — it should just *be* Fix Weak Areas, not a separate option next to it |
| Weakness Report | **Merge** into Progress (as a section) |
| Method Selection (drill) | **Secondary tool** under Study |
| Calculation Drill | **Merge** into one Calculation Practice mode |
| Formula Lab | **Keep visible**, but collapse the 26-button chapter list into one picker |
| Cold/Fresh Challenge (as named tiers) | **Background/Merge** — collapse into "test my mastery" and Exam Practice; drop the internal tier names |
| Final Week | **Keep visible**, but only in the last ~7–10 days (contextually surfaced), not as a permanent Home/Exam Center entry year-round |
| Study Plan | **Becomes the Home/landing experience itself** ("Today"), not a separate destination to navigate to |
| Mocks (Timed/Blueprint/Full Sim) | **Keep visible**, grouped under Exam Practice |
| Blueprint tools | **Keep visible** as one of the Exam Practice formats; drop the separate "Transfer" variant as its own button (see §6) |
| Progress/Readiness dashboards (all 5) | **Merge** into one Progress destination with expandable sections |
| Memo Practice | **Keep visible**, but under Exam Practice, not equal-weighted with MCQ mocks on Home |

---

## 8. Decision/Click Count — Before

| Journey | Clicks/decisions before productive work starts |
|---|---|
| First-time student, wants to just start | Land on Home (11 competing buttons) → must read/decide among them → Chapter Practice → 6 config decisions → Start = **~8 decisions** |
| Normal daily study, no specific goal | Home → decide between 4 tiles + 6 "more tools" (10 live options) → likely Study Plan → Start Today's Mission = **2–3 clicks, but only after scanning 10 options** |
| Studying one chapter | Home → Chapter Practice → 6 config decisions → Start = **7 clicks** |
| Correcting a known weakness | Home → must recognize "Fix Mistakes" is the right tile (1 of 4) → Review Center (7 more options) → decide Adaptive vs. Weak Topics vs. Wrong Answers (three plausible, overlapping choices) → Start = **4 clicks + 3-way ambiguous choice** |
| Retention due on a chapter | Not proactively surfaced on Home at all today unless the student opens the chapter's own exit-criteria card or the Evidence page; **easy to miss entirely** |
| High-confidence misconception just made | No proactive surface at all; only visible if the student separately visits Dashboard, Weakness Report, or Final Review and recognizes "High-confidence miss" as meaning "you have a misconception" | 
| Calculation weakness | Home → "more tools" → Calculation Drill, **or** Practice Center → 4 different calculation-shaped options (Calc Drill / Method Drill / Timed Calc / Generated Practice) with unclear differences = **ambiguous choice among 4** |
| One week before exam | Home → Exam & Readiness → Final Week Mode (1 of 7 options on that screen, no visual priority over Memo Practice or Full Simulation) = **2 clicks, no urgency signal** |
| Taking a mock exam | Home → Exam & Readiness → choose among Timed / Blueprint / Blueprint Transfer / Full Sim (4 similarly-worded options) = **2 clicks + 4-way ambiguous choice** |

## 8b. Decision/Click Count — After (proposed structure, §9–10)

| Journey | Clicks/decisions after |
|---|---|
| First-time student | Open app → "Today" already shows "Start Chapter 1" as the only obvious action = **1 click** |
| Normal daily study | Open app → "Today" already shows the day's mission → Start = **1 click** |
| Studying one chapter | Study tab → pick chapter → Start (sensible defaults pre-selected; "customize" optional, collapsed) = **2 clicks** |
| Correcting a known weakness | Today (already lists it by name) → Start, **or** Fix Weak Areas tab → Start = **1–2 clicks, one destination, no 3-way ambiguity** |
| Retention due | Surfaced automatically at the top of Today with a plain-language reason and one button = **1 click, cannot be missed** |
| High-confidence misconception | Surfaced automatically at the top of Today ("A high-confidence mistake needs a second look") = **1 click** |
| Calculation weakness | Today surfaces it directly, **or** Study tab → Calculation Practice (one mode, timed toggle) = **1–2 clicks, one obvious option** |
| One week before exam | Today automatically switches into Final-Week framing when the exam date is close = **0 extra clicks; it's already the front door** |
| Taking a mock exam | Exam Practice tab → three clearly-different formats (Timed / Blueprint / Full Simulation) = **2 clicks, 3-way choice instead of 4–7** |

---

## 9. Proposed Final Navigation

The prompt's suggested structure (*Today's Plan / Study / Practice Weak Areas / Exam Practice / Progress*) is directionally right and close to what the evidence in this app supports — **but it should not be adopted unmodified.** Two changes are supported by the journeys above:

1. **"Today's Plan" should not be a tab you navigate to — it should be what you see the instant the app opens.** Every journey above breaks down at the same point: the student has to *decide to go look for guidance* before receiving it. If Today's content is one tab among five, the "I don't know what to do" student still has to correctly guess that "Today's Plan" is the tab that answers their question. Making it the landing screen removes that guess entirely, which is the prompt's own success criterion ("when I open the app, I should immediately know what to do next").
2. **"Study" and "Practice Weak Areas" are both real, distinct intents** (curriculum-driven vs. error-driven) confirmed by the journeys — keep both rather than merging them, but note that "Today" will often hand the student directly into one or the other, so most days they never need to consciously choose between the two tabs at all.

**Recommended structure — 5 destinations, with Today as the landing experience rather than a peer tab:**

```
┌─────────────────────────────────────────────────────────┐
│  (opens directly into) TODAY                             │
│  — merged Home + Study Plan; the answer to "what now"    │
└─────────────────────────────────────────────────────────┘
        Persistent navigation (4 tabs, always one click away):
        ┌──────────┬────────────────────┬───────────────┬──────────┐
        │  Study   │ Fix Weak Areas     │ Exam Practice │ Progress │
        └──────────┴────────────────────┴───────────────┴──────────┘
```

- **Today** (landing, not a tab you seek out) — the day's recommended action(s), each with a one-line plain-language reason, exam countdown, and prominent surfacing of anything urgent (an unresolved high-confidence mistake, a retention check that's due). One primary button. Always answers "what do I do right now."
- **Study** — pick a chapter (or Random/interleaved) and start; sensible defaults pre-selected, advanced options (difficulty, count, confidence-check) collapsed under "Customize" for the minority who want them. Calculation Practice and Method Selection live here as secondary options, not separate top-level modes.
- **Fix Weak Areas** — one adaptive session that already blends weak topics, due reviews, high-confidence mistakes, and fragile knowledge (i.e., what "Adaptive Practice" already does under the hood); Error Notebook becomes the "review what's in this session" view reached *from* here, not a separate destination to remember.
- **Exam Practice** — Cold/Unseen Chapter Test, Timed Mock, Blueprint Mock, Full Simulation, Memo Practice, and (contextually, in the last ~10 days) Final Week Mode — one hub, clearly different *formats*, not different *engines*.
- **Progress** — one screen, expandable sections: Readiness (the one number, with the Cold/Training distinction explained once, in place, not three times), Chapter Mastery (plain-language per-chapter status), Weak Areas detail, Mistake history, and Data & Export tucked at the bottom.

Everything else identified in §5 (Random Practice, Method Selection, Session History, Memo Practice's prominence, Topics to Relearn, external evidence entry, exports) nests one level inside these five, never floating at the top level.

---

## 10. Proposed Home Screen ("Today")

```
┌───────────────────────────────────────────────────────────┐
│  CCP Exam Coach                                            │
│                                                             │
│  Today                                                     │
│  ───────────────────────────────────────────────────────  │
│  ⚠ A high-confidence mistake on EAC method selection       │
│    needs a second look before it counts as fixed.          │
│    [ Fix this now → ]                                      │
│                                                             │
│  Your plan for today (≈25 min)                              │
│    • Retention check — Chapter 12 CPM float (due today)     │
│    • Fragile knowledge — Estimate classification             │
│    • 2 new questions — Chapter 9                            │
│                                                             │
│                 [ ▶ Start Today's Session ]                 │
│                                                             │
│  12 days until your exam · 30 min/day planned    [edit]     │
└───────────────────────────────────────────────────────────┘
        Study   Fix Weak Areas   Exam Practice   Progress
```

Design intent:
- **One primary button.** Not four tiles, not a "recommend card plus a menu of ten other things" competing for attention.
- **The alert line only appears when something urgent exists** (unresolved high-confidence mistake, failed retention, retention due). On a normal day it's just the plan.
- **Plain language only** — no "Provisional Mastery," "L3 Closed-Book Transfer," or "sealed one-use" anywhere on this screen. The engine decides; the screen explains the *consequence* in one sentence.
- **New/first-time student:** the same screen, with the plan reduced to "Start Chapter 1" and the alert line absent — no separate "first run" screen needed, no version of the current Study Plan's "no chapter studied yet" branch is required as a special case if Today already degrades gracefully to "nothing recorded yet → here's where to start."
- **Last ~10 days before the exam:** the same screen re-prioritizes automatically (Final Week logic) instead of the student needing to separately discover and select "Final Week Mode."

---

## 11. Before / After Student Journeys

**A. First-time student**
- *Before:* Open app → Home shows 11 buttons plus a small recommend card → student must notice the recommend card is the "start here" signal among ten other equally-styled buttons → Chapter Practice → 6 setup decisions → Start. *(~8 decisions)*
- *After:* Open app → "Today" shows one button, "Start Chapter 1" → Start. *(1 decision)*

**B. Normal daily study**
- *Before:* Home → scan 10 live options → recognize "Today's Study Plan" is the one that removes the need to choose → open it → Start Today's Mission.
- *After:* Open app → plan is already on screen → Start. *(1 decision, no scanning)*

**C. Studying one chapter**
- *Before:* Home → Chapter Practice → chapter, type, count, difficulty, feedback, confidence → Start. *(6 decisions)*
- *After:* Study tab → pick chapter → Start (defaults pre-set). *(2 decisions; "Customize" available but not required)*

**D. Correcting a weakness**
- *Before:* Home → "Fix Mistakes" tile → Review Center → choose among Adaptive Practice / Weak Topics / Wrong Answers / Weakness Report / Error Notebook (5 plausible entry points for the same underlying need) → Start.
- *After:* Today already names the specific weak skill, **or** Fix Weak Areas tab → Start (one adaptive session, no 5-way ambiguity).

**E. Retention due**
- *Before:* Not proactively shown anywhere on Home; the student must open a chapter's own progress card or the Evidence page and correctly interpret "Retention Due" among five other possible status labels.
- *After:* Appears at the top of Today automatically, in plain language, the day it becomes due.

**F. High-confidence misconception**
- *Before:* Silently tracked; visible only if the student separately visits Dashboard/Weakness Report/Final Review and recognizes the term "high-confidence miss."
- *After:* Surfaces as the top alert on Today the session after it happens, in plain language, and stays until resolved with fresh evidence (the underlying rule from the Mastery/Retention engine is unchanged — only its visibility improves).

**G. Calculation weakness**
- *Before:* 4 similarly-named modes (Calculation Drill / Generated Practice / Fresh Challenge L1 / Timed Calculation Set) with unclear differences.
- *After:* One "Calculation Practice" mode under Study, with a "timed" toggle for the version that used to be a separate mode.

**H. One week before the exam**
- *Before:* Student must remember "Final Week Mode" exists and go find it inside Exam & Readiness, alongside Memo Practice and Full Simulation with no visual priority.
- *After:* Today automatically re-prioritizes itself into final-week framing; no new destination to discover.

**I. Taking a mock exam**
- *Before:* Exam & Readiness → choose among Timed Mock / Blueprint Mock / Blueprint Transfer Check / Full Simulation (4 similarly-worded choices, one of which — Transfer Check — is an internal nuance most students won't understand).
- *After:* Exam Practice tab → 3 clearly different formats (Timed / Blueprint / Full Simulation); the Transfer-derived item pool is used silently, behind the scenes, when available.

**J. "I genuinely don't know what to click"**
- *Before:* This student's honest options at Home number 11, before even reaching a hub screen.
- *After:* This student's only option is the single button on Today. That is the entire point of the redesign.

---

## 12. Exact Mapping of Every Current Feature Into the New Architecture

Legend: **KEEP VISIBLE**, **MERGE**, **BACKGROUND**, **SECONDARY**, **REMOVE**

| Current feature (as currently labeled) | Classification | New home |
|---|---|---|
| Home recommend card ("Continue studying") | MERGE | Becomes the entire content of **Today** |
| Chapter Practice (Home tile) | KEEP VISIBLE | **Study** (primary action) |
| Today's Study Plan (Home tile) | MERGE | Becomes **Today** itself, not a tile |
| Fix Mistakes (Home tile) | MERGE | Becomes **Fix Weak Areas** tab |
| Exam & Readiness (Home tile) | MERGE | Becomes **Exam Practice** tab |
| "More tools" — Calculation Drill | MERGE | **Study** → Calculation Practice |
| "More tools" — Method Selection | SECONDARY | **Study** → secondary option |
| "More tools" — Adaptive Practice | MERGE | Becomes the engine behind **Fix Weak Areas**, not a separate button |
| "More tools" — Readiness Center | MERGE | **Progress** (readiness section) |
| "More tools" — Formula Lab | KEEP VISIBLE | **Study** → Formula Lab (kept as-is, one chapter picker instead of 26 buttons) |
| "More tools" — Final Review | MERGE | **Progress** (mistakes/fragile section) |
| Practice Center hub screen | REMOVE (as a screen) | Its 7 children re-sorted into **Study** / **Fix Weak Areas**, hub itself deleted |
| — Random Practice | SECONDARY | **Study** → secondary option |
| — Calculation Drill | MERGE | **Study** → Calculation Practice |
| — Formula Selection/Method Selection | SECONDARY | **Study** → secondary option |
| — Timed Calculation Set | MERGE | **Study** → Calculation Practice (timed toggle) |
| — Generated Practice | REMOVE (as its own brand) | Engine folded into Calculation Practice |
| — Fresh Challenge (entry point) | BACKGROUND | Powers "Test my mastery of this chapter," no separate entry point |
| Review Center hub screen | REMOVE (as a screen) | Its children folded into **Fix Weak Areas** |
| — Adaptive Practice | MERGE | *Is* Fix Weak Areas |
| — Weak Topics Practice | MERGE | Folded into Fix Weak Areas' single session |
| — Wrong Answers Review | MERGE | Folded into Fix Weak Areas' single session |
| — Weakness Report | MERGE | **Progress** (weak-areas section) |
| — Error Notebook | MERGE | **Fix Weak Areas** → "Review" view |
| — My Final Review | MERGE | **Progress** (mistakes/fragile section) |
| — Topics to Relearn | SECONDARY | **Progress** → secondary "My notes" |
| Exam Center hub screen | KEEP VISIBLE (renamed) | Becomes **Exam Practice** directly (already close to right-sized) |
| — Cold/Unseen Chapter Test | KEEP VISIBLE | **Exam Practice** |
| — Training Timed Mock | KEEP VISIBLE | **Exam Practice** |
| — Training Blueprint Mock (119Q) | KEEP VISIBLE | **Exam Practice** |
| — Offline Fresh Transfer Blueprint (119Q) | REMOVE (as its own button) | Item pool used silently inside Blueprint Mock |
| — Memo Practice | SECONDARY (within Exam Practice) | **Exam Practice**, visually secondary to the MCQ formats |
| — Training Full CCP Simulation | KEEP VISIBLE | **Exam Practice** |
| — Final Week Mode | KEEP VISIBLE (contextual) | Auto-surfaces inside **Today** in the final ~10 days; still reachable manually from **Exam Practice** anytime |
| — "Open Readiness Center" link | REMOVE (duplicate) | One path via **Progress** tab |
| — "Pacing & Session History" link | SECONDARY | **Progress** → secondary "Session history" |
| Readiness Center hub screen | REMOVE (as a screen) | Folded into **Progress** |
| — Performance Dashboard | MERGE | **Progress** (main section) |
| — Unseen (Cold) Evidence & Readiness | MERGE | **Progress** (readiness section, same screen as Training Readiness) |
| — Chapter Progress & Mastery (Evidence page) | MERGE | **Progress** (chapter-status section, plain-language) |
| — Session History & Pacing | SECONDARY | **Progress** → secondary |
| Fresh Challenge Center hub screen | REMOVE (as a screen) | Folded into the background "Test my mastery" mechanism |
| — Choose a Chapter Test (L2/L3) | BACKGROUND | Engine picks automatically when a chapter is due for its next check |
| — Blueprint Transfer Check 119Q | REMOVE (as its own button) | Same as above |
| — Fresh Calculation Drill (L1) | MERGE | Folds into Calculation Practice |
| Dashboard | MERGE | **Progress** (primary section) |
| Weakness Report | MERGE | **Progress** (weak-areas section) |
| Error Notebook filters (All/Calc/High-conf/Repeated) | KEEP (as filters) | Carried into **Fix Weak Areas** → Review view |
| Evidence / Chapter Readiness page | MERGE | **Progress** (chapter-status section) |
| — Optional external evidence entry | SECONDARY | **Progress** → "Advanced" disclosure, unchanged in function |
| Cold Readiness page | MERGE | **Progress** (readiness section) |
| — its "Cold Chapter Certification" CTA | REMOVE (duplicate) | Single CTA lives in **Exam Practice** |
| — its "Generate Fresh Test" CTA | REMOVE (duplicate) | Folded into background mastery-check mechanism |
| My Final Review | MERGE | **Progress** (mistakes/fragile section) + its export buttons move to Progress' "Data & Export" |
| Formula Lab (26 chapter buttons) | KEEP VISIBLE (restructured) | **Study** → Formula Lab, one chapter picker |
| Method Selection Drill | SECONDARY | **Study** → secondary option |
| Calculation Drill | MERGE | **Study** → Calculation Practice |
| Timed Calculation Set | MERGE | **Study** → Calculation Practice (timed toggle) |
| Generated Practice | REMOVE (as a brand) | Folded into Calculation Practice's engine |
| AI Pack Manager | REMOVE | Unreachable today; delete or hide behind a debug flag |
| Question Issues / Suspensions | SECONDARY (already low-visibility) | Keep as the in-quiz "⚑" flag only |
| Build Integrity / Self-check | REMOVE | Unreachable today; delete or hide behind a debug flag |
| Export Coach Diagnostic | SECONDARY | **Progress** → "Data & Export" |
| Bug/Confusion Log | REMOVE | Unreachable today; delete or hide behind a debug flag |
| Topics to Relearn | SECONDARY | **Progress** → "My notes" |
| Session History | SECONDARY | **Progress** → secondary |
| Export/Import/Reset progress | SECONDARY | **Progress** → "Data & Export" |
| Random Practice | SECONDARY | **Study** → secondary option |
| Memo Practice | SECONDARY (within Exam Practice) | **Exam Practice** |
| Chapter mastery/exit-criteria card (Home) | MERGE (simplified) | Plain-language version surfaces on **Today** when relevant; full detail in **Progress** |
| Retention countdown card (Home) | MERGE | Feeds **Today**'s alert line, not a standalone card |
| **Mastery Gate engine** | BACKGROUND | Drives chapter status + single "Test yourself" CTA |
| **Adaptive Retesting / same-question rule** | BACKGROUND | No UI at all |
| **Retention Engine** | BACKGROUND | Drives due/not-due signal only |
| **Fragile Knowledge tracking** | BACKGROUND | Feeds queue priority + one Progress line |
| **High-Confidence Wrong tracking** | BACKGROUND | Feeds queue priority + top-of-Today alert |
| **Fresh Challenge generation engine** | BACKGROUND | Powers "Test my mastery," invisible tiering |
| **SRS / exposure / anti-memorization** | BACKGROUND | No UI at all (already true today) |

---

## 13. Features That Are Technically Impressive but Add Little Student Value Today

- **The five-stage mastery taxonomy exposed as named buttons** (Apply/Mastery Test/Challenge/Retention/Blueprint Transfer) — the *evidence logic* behind it is genuinely the app's strongest asset; the *naming and manual triggering* of it is pure overhead for a student who just wants to know "am I ready to move on."
- **Three separately-branded "fresh calculation" modes** beyond the one a student needs.
- **The distinction between "Training Blueprint Mock" and "Offline Fresh Transfer Blueprint"** — a real and defensible internal distinction (repeat-exposed vs. one-use-derived), but not one a candidate studying for AACE certification needs to consciously manage.
- **Six confidence/evidence buckets shown verbatim** ("Wrong + High (Misconception)," "Correct + Low (Fragile)," etc.) on the Weakness Report — accurate, but this is internal classification language leaking directly into the UI instead of being translated into plain guidance.
- **The "Chapters — All Attempts" bar list on Dashboard vs. the "Chapter Mastery Gate" pill list on the Evidence page** — two different chapter-level metrics (raw all-time accuracy vs. gated mastery stage) shown as two separate full-page lists; most students want one plain answer per chapter, not two competing charts.
- **Coach Diagnostic export vs. Final Review export vs. full JSON backup** — three different export formats for overlapping data; one export surface with format options would serve the same real (infrequent) need.

---

## 14. Missing Capabilities Discovered During Actual Student Use

1. **No single "what's urgent right now" surface.** Retention-due and high-confidence-misconception signals exist in the data (confirmed working in the underlying engine) but are not proactively pushed to the student anywhere — they must be discovered by visiting the right secondary screen. This is the single most valuable *addition* this simplification should make, not just a reshuffling of existing buttons.
2. **No "resume where I left off" framing beyond active-session banners.** The app tracks a great deal of history but doesn't narrate continuity ("Yesterday you fixed X; today, let's confirm it stuck") — a natural, low-cost use of the same evidence the Mastery/Retention engine already computes.
3. **No single onboarding moment that sets expectations.** A first-time student is dropped straight into the full app with no framing of what "confidence check," "cold certification," or "retention" mean before they're asked to use them mid-session. A one-time, dismissible explanation of *why* the app asks for confidence ratings (since it directly powers the Fragile/High-Confidence-Wrong engine) would materially improve trust in — and correct use of — the confidence-tagging feature that the whole mastery engine depends on.
4. **No visible link between "why was I asked this question" and the answer.** Fix Weak Areas sessions (via Adaptive Practice today) don't currently tell the student, at the moment of the question, *which* weakness it's targeting — the explanation only exists after the fact, in Study Plan's "why these are recommended" text. Surfacing a one-line reason at the top of each question in a Fix Weak Areas session ("Because: high-confidence miss on EAC method selection") would close the loop between the background engine's decision and the student's understanding of it, without requiring a new screen.
5. **No plain-language chapter status glossary.** Even after simplifying labels, a student will eventually ask "what does 'Ready' actually mean here?" A single, short, always-accessible explanation (not a wall of methodology) tied to the Progress screen would prevent the plain-language layer from becoming its own new source of confusion.

---

## Summary

The app's internal learning architecture — confidence-aware evidence classification, the multi-stage mastery/retention pipeline, fresh-question generation, spaced repetition, and the anti-inflation rules added in the previous engineering pass — is sound and should not be weakened. The problem is almost entirely presentational: **the same intelligence is currently exposed through roughly 40 reachable destinations, five overlapping "how am I doing" screens, a five-stage internal test taxonomy the student is expected to operate manually, and a same-day setup flow that asks six questions before the most common action even begins.**

The recommended target is **five destinations** (Today as the landing experience, plus Study / Fix Weak Areas / Exam Practice / Progress), with every engine discussed in this audit — Mastery, Adaptive Retesting, Retention, Fragile Knowledge, and High-Confidence Wrong — operating in the background and expressing itself only as: (a) what appears in Today, (b) what gets prioritized inside Fix Weak Areas, and (c) one plain-language section of Progress. Nothing about *what the app knows* needs to change. Nearly everything about *what the app shows* does.
