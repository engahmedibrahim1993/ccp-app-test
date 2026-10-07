const { chromium } = require('playwright');

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const context = await browser.newContext(); // isolated, non-persistent profile
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push('pageerror: ' + err.message));
  await page.goto('http://localhost:8980/rc3_2.html');
  await page.waitForFunction(() => typeof V52A_DISTRACTOR_DIAGNOSTICS !== 'undefined' && typeof integrityResults === 'function', { timeout: 30000 });
  await page.waitForTimeout(300);

  const out = {};

  // ---------- Proof 1: clean session unchanged ----------
  out.proof1_cleanSession = await page.evaluate(() => {
    const before = JSON.parse(JSON.stringify(SESSION));
    const rs = integrityResults();
    const after = JSON.parse(JSON.stringify(SESSION));
    return { before, after, unchanged: JSON.stringify(before) === JSON.stringify(after), failing: rs.filter(x=>!x.ok).map(x=>x.name) };
  });

  // ---------- Proof 5: persisted storage unchanged ----------
  out.proof5_storageBefore = await page.evaluate(() => {
    const snap = {};
    for (let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); snap[k]=localStorage.getItem(k); }
    return snap;
  });

  // ---------- Proof 2 + 6: populated session retains full state; learner can continue ----------
  out.proof2_populated = await page.evaluate(() => {
    // Build a SYNTHETIC in-progress session using only real QUESTIONS metadata (no personal data).
    const q0 = QUESTIONS[0], q1 = QUESTIONS[1], q2 = QUESTIONS[2];
    SESSION.queue = [q0, q1, q2];
    SESSION.idx = 1;
    SESSION.answered = 0;
    SESSION.answeredSeq = 1;
    SESSION.selectedOpt = 2;
    SESSION.results = [{ q: q0, selected: 2, correct: (q0.correct===2), confidence: 'medium', timeSpentSec: 12 }];
    SESSION.startTs = Date.now() - 60000;
    SESSION.timeLimitSec = 3600;
    SESSION.deadlineTs = Date.now() + 3600000;
    SESSION.confidence = 'high';
    SESSION.flagged = [q1.id];
    SESSION.deferred = [];
    SESSION.deferredReview = false;
    SESSION.sessionTag = 'SYNTHETIC_TEST_TAG';
    SESSION.mockTag = null;
    SESSION.mockAnswers = {};
    SESSION.navigatorOpen = true;
    SESSION.mockSubmitted = false;
    SESSION.questionEnterTs = Date.now();
    SESSION.timeSpentByIndex = { 0: 12 };
    SESSION.evidenceClass = 'training';

    const before = JSON.parse(JSON.stringify(SESSION));
    const rs = integrityResults();
    const after = JSON.parse(JSON.stringify(SESSION));

    // "learner can continue": the accessors a real quiz-continuation flow relies on
    const canContinue = {
      currentQuestionResolvable: !!SESSION.queue[SESSION.idx],
      currentQuestionId: SESSION.queue[SESSION.idx] && SESSION.queue[SESSION.idx].id,
      idxUnchanged: after.idx === 1,
      queueLenUnchanged: after.queue.length === 3,
      flaggedIntact: JSON.stringify(after.flagged) === JSON.stringify([q1.id]),
      resultsIntact: after.results.length === 1 && after.results[0].selected === 2 && after.results[0].confidence === 'medium' && after.results[0].timeSpentSec === 12,
      confidenceIntact: after.confidence === 'high',
      timeSpentByIndexIntact: JSON.stringify(after.timeSpentByIndex) === JSON.stringify({0:12}),
      sessionTagIntact: after.sessionTag === 'SYNTHETIC_TEST_TAG'
    };

    const unchanged = JSON.stringify(before) === JSON.stringify(after);

    // clean up synthetic session so it doesn't leak into subsequent proofs
    SESSION.queue = []; SESSION.idx = 0; SESSION.answered = null; SESSION.answeredSeq = null;
    SESSION.selectedOpt = null; SESSION.results = []; SESSION.startTs = null; SESSION.timeLimitSec = null;
    SESSION.deadlineTs = null; SESSION.confidence = null; SESSION.flagged = []; SESSION.deferred = [];
    SESSION.deferredReview = false; SESSION.sessionTag = null; SESSION.mockTag = null; SESSION.mockAnswers = {};
    SESSION.navigatorOpen = false; SESSION.mockSubmitted = false; SESSION.questionEnterTs = null;
    SESSION.timeSpentByIndex = {}; SESSION.evidenceClass = 'training';

    return { unchanged, canContinue, integrityFailing: rs.filter(x=>!x.ok).map(x=>x.name), integrityTotal: rs.length };
  });

  // ---------- Proof 3: exception-path restoration via fault injection ----------
  out.proof3_exceptionPath = await page.evaluate(() => {
    const q0 = QUESTIONS[0];
    const priorSrs = PROGRESS.srs[q0.id];
    const hadSrs = Object.prototype.hasOwnProperty.call(PROGRESS.srs, q0.id);
    const priorExposure = PROGRESS.exposure[q0.id];
    const hadExposure = Object.prototype.hasOwnProperty.call(PROGRESS.exposure, q0.id);
    const priorRecentQueue = JSON.parse(JSON.stringify(PROGRESS.recentQueue));
    const priorAttemptsLen = PROGRESS.attempts.length;
    const priorSessionResults = JSON.parse(JSON.stringify(SESSION.results));

    const originalRecordAttempt = window.recordAttempt;
    window.recordAttempt = function(){ throw new Error('INJECTED_FAULT_FOR_TEST'); };

    let threwOutOfIntegrityResults = false;
    let rs = null;
    try {
      rs = integrityResults();
    } catch (e) {
      threwOutOfIntegrityResults = true;
    } finally {
      window.recordAttempt = originalRecordAttempt;
    }

    const afterSrs = PROGRESS.srs[q0.id];
    const afterHadSrs = Object.prototype.hasOwnProperty.call(PROGRESS.srs, q0.id);
    const afterExposure = PROGRESS.exposure[q0.id];
    const afterHadExposure = Object.prototype.hasOwnProperty.call(PROGRESS.exposure, q0.id);
    const afterRecentQueue = PROGRESS.recentQueue;
    const afterAttemptsLen = PROGRESS.attempts.length;
    const afterSessionResults = SESSION.results;

    const stateRestoredDespiteFault =
      hadSrs === afterHadSrs && (!hadSrs || priorSrs === afterSrs) &&
      hadExposure === afterHadExposure && (!hadExposure || JSON.stringify(priorExposure) === JSON.stringify(afterExposure)) &&
      JSON.stringify(priorRecentQueue) === JSON.stringify(afterRecentQueue) &&
      priorAttemptsLen === afterAttemptsLen &&
      JSON.stringify(priorSessionResults) === JSON.stringify(afterSessionResults);

    const relevantChecks = rs ? rs.filter(x => x.name.indexOf('Phase 2A: recordAttempt base scoring') === 0 || x.name.indexOf('Phase 2A: High-Confidence-Wrong') === 0) : [];

    return {
      integrityResultsDidNotThrow: !threwOutOfIntegrityResults,
      stateRestoredDespiteFault,
      relevantChecksCaughtTheInjectedFault: relevantChecks.map(c => ({ name: c.name, ok: c.ok, detailMentionsInjectedFault: c.detail.indexOf('INJECTED_FAULT_FOR_TEST') !== -1 }))
    };
  });

  // ---------- Proof 4: repeated-run safety (re-verify on this same fresh page) ----------
  out.proof4_repeated = await page.evaluate(() => {
    const runs = [];
    for (let i=0;i<3;i++){
      const before = SESSION.results.length;
      const rs = integrityResults();
      runs.push({ resultsLenBefore: before, resultsLenAfter: SESSION.results.length, failing: rs.filter(x=>!x.ok).map(x=>x.name) });
    }
    return runs;
  });

  // ---------- Proof 5 (cont'd): storage after ----------
  out.proof5_storageAfter = await page.evaluate(() => {
    const snap = {};
    for (let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); snap[k]=localStorage.getItem(k); }
    return snap;
  });
  out.proof5_storageUnchanged = deepEqual(out.proof5_storageBefore, out.proof5_storageAfter);

  out.consoleErrors = consoleErrors;

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
