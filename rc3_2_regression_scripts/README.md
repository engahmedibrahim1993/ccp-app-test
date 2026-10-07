# RC3.2 Regression Scripts

Playwright/Node scripts used to verify the RC3.2 corrective patch. All scripts use an
**isolated, non-persistent browser context** (`browser.newContext()`) and **synthetic
data only** — none of them read or write the operator's personal browser profile or
real study data, per the mission's explicit privacy constraint.

## Prerequisites

- Node.js with `playwright` installed (`npm install playwright` in this directory, or
  point `NODE_PATH` at an existing install).
- Chromium available at `/opt/pw-browsers/chromium` (or edit `executablePath` in each
  script to match your environment).
- Serve `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.2.html` over local HTTP (file:// origins
  break `localStorage`/module-scoped fetches in some browsers). From the repo root:

  ```
  cp CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.2.html rc3_2_regression_scripts/rc3_2.html
  cd rc3_2_regression_scripts && python3 -m http.server 8980
  ```

  Each script assumes `http://localhost:8980/rc3_2.html`.

## Scripts

- **issue2_full_proof.js** — Issue 2 (self-tests mutating SESSION state). Proves all six
  required properties: clean-session unchanged, populated-session state retained, an
  intentionally-thrown exception mid-self-test still restores state, repeated-run safety,
  persisted `localStorage` unchanged, and the six proofs are checked against the live
  `integrityResults()` suite (131–141 checks depending on when it's run).
- **fault_injection_3a.js** — Issue 3A (diagnostic-completeness gate). Injects three
  controlled faults (delete a canonical item's diagnostic rows, duplicate an
  `option_identity`, mark a wrong option `is_correct:"yes"`) one at a time, confirms the
  gate catches each, and confirms full state cleanliness afterward.
- **fault_injection_3b_v2.js** — Issue 3B (stateful census gate). Monkey-patches the
  globally-reachable `v518GlobalCensus()` to simulate (a) a false positive against a real
  runtime container and (b) a defeated negative control, confirms the gate catches both,
  and restores the original function.
- **fault_injection_3c_v2.js** — Issue 3C (self-test non-mutation gate). Monkey-patches
  the top-level `V532_FINAL_BASE_INTEGRITY` reference to throw, confirms
  `integrityResults()` never propagates the exception to its caller, confirms
  PROGRESS/SESSION are still restored, and confirms the gate itself reports the
  exception-path event honestly.
- **export_reset_import_reload_test.js** — Real file-based Export → Reset → Import →
  Reload round-trip using a synthetic populated profile (attempts, SRS, exposure,
  everSeenIds, skill mastery, mock/cold history, memo attempts, an in-progress memo
  draft, and one historical attempt against the retired `cx20_3` identity). Verifies
  every field round-trips exactly and that the retired item's historical attempt is
  preserved unedited under its original id, not silently reinterpreted under the
  `cx20_3R1` replacement's semantics.
- **verify_numeric_claims.js** — Confirms the protected Cold reserve is exactly 160 (20
  qualifying chapters × 8) and that Blueprint Mock / Full Simulation packs are exactly
  119 items with the 43/28/13/20/6/9 domain quota.
- **extract_native_bank.js** — Precise, string-literal-aware bracket-matching extractor
  (not regex) for the native `QUESTIONS` array. Usage: `node extract_native_bank.js
  <path-to-html>`. Prints the item count and SHA-256 of the exact array literal.

## Running everything

```
node issue2_full_proof.js
node fault_injection_3a.js
node fault_injection_3b_v2.js
node fault_injection_3c_v2.js
node export_reset_import_reload_test.js
node verify_numeric_claims.js
node extract_native_bank.js ../CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.1.html
node extract_native_bank.js ../CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.2.html
```

For the full embedded self-test suite (135–141 checks depending on session state),
open `CCP_Exam_Coach_Study_Studio_v1.2.0_RC3.2.html` in a browser and navigate to its
"Build Integrity / Self-check" page, or call `integrityResults()` in the console.
