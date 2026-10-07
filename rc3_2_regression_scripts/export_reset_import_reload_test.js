const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const context = await browser.newContext(); // isolated, non-persistent profile; SYNTHETIC data only
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push('pageerror: ' + err.message));
  await page.goto('http://localhost:8980/rc3_2.html');
  await page.waitForFunction(() => typeof integrityResults === 'function', { timeout: 30000 });
  await page.waitForTimeout(300);

  // ---- Step 1: populate a SYNTHETIC populated profile ----
  await page.evaluate(async () => {
    const q9_1 = QUESTIONS.find(q => q.id === '9-1');
    const q14_1 = QUESTIONS.find(q => q.id === '14-1');
    const now = Date.now();
    PROGRESS.attempts = [
      { qid: '9-1', correct: true, ts: now - 5000000, chapter:'9', chapterName:'Cost Estimating', topic:q9_1.topic, type:q9_1.type, difficulty:q9_1.difficulty, domain:q9_1.domain, confidence:'high' },
      { qid: '14-1', correct: false, ts: now - 4000000, chapter:'14', chapterName:'Project Labor Cost Control', topic:q14_1.topic, type:q14_1.type, difficulty:q14_1.difficulty, domain:q14_1.domain, confidence:'high' },
      // Historical attempt against the RETIRED cx20_3 identity -- must survive export/import unchanged.
      { qid: 'cx20_3', correct: false, ts: now - 3000000, chapter:'20', chapterName:'Leadership & Management', topic:'Situational Leadership and Delegation Readiness', type:'concept', difficulty:'Medium', domain:'Domain 2: Interface with Other Disciplines', confidence:'high', misconceptionCode:'SITUATIONAL_LEADERSHIP_READINESS_IGNORED' }
    ];
    PROGRESS.srs = { '9-1': {box:3, dueTs: now+86400000, lastSeenTs: now-5000000, correctStreak:2} };
    PROGRESS.exposure = { '9-1': {timesSeen:1, lastSeenTs: now-5000000, lastCorrect:true, sessions:['SYNTH_TEST_SESSION'], mocks:[]} };
    PROGRESS.everSeenIds = ['9-1','14-1','cx20_3'];
    PROGRESS.skillMastery = { 'ESTIMATE_CLASSIFICATION': {attempts:1, correct:1, recent:[true], consecutiveCorrect:1, lastReviewedTs: now-5000000, confidenceHistory:['high']} };
    PROGRESS.mockHistory = [{ts: now-2000000, score:80, total:10, domainScores:{}, byId:[]}];
    PROGRESS.coldSessionHistory = [{ts: now-1000000, chapter:'9', score:1, total:1}];
    PROGRESS.memoAttempts = [{id:'memo-synth-1', ts: now-500000, promptId:'memo-01', text:'SYNTHETIC test memo attempt text.', reviewedScore:'Pass'}];
    await saveProgress();
    // synthetic memo draft too
    try { await storageSet(ACTIVE_MEMO_KEY, JSON.stringify({promptId:'memo-01', text:'SYNTHETIC in-progress memo draft.', startTs:Date.now(), timeLimitSec:1800})); } catch(e){}
  });

  const beforeSnapshot = await page.evaluate(() => JSON.stringify(PROGRESS));

  // ---- Step 2: EXPORT (replicate exportProgress()'s payload construction) ----
  const exportedPayload = await page.evaluate(async () => {
    let memoDraftRaw = null;
    try { const x = await storageGet(ACTIVE_MEMO_KEY); memoDraftRaw = (x && x.value) ? x.value : null; } catch(e){}
    return JSON.stringify(Object.assign({}, PROGRESS, { _memoDraftBackup: memoDraftRaw }));
  });

  // ---- Step 3: RESET ----
  await page.evaluate(async () => {
    PROGRESS = defaultProgress();
    await saveProgress();
    try { await storageRemove(ACTIVE_MEMO_KEY); } catch(e){}
  });
  const afterResetAttempts = await page.evaluate(() => PROGRESS.attempts.length);

  // ---- Step 4: IMPORT (replicate importProgress()'s core logic) ----
  await page.evaluate(async (payloadStr) => {
    const data = JSON.parse(payloadStr);
    const memoDraftBackup = data._memoDraftBackup;
    delete data._memoDraftBackup;
    PROGRESS = Object.assign(defaultProgress(), data);
    sanitizeProgressShape(PROGRESS);
    rebuildEverSeenIds();
    if (memoDraftBackup) { try { await storageSet(ACTIVE_MEMO_KEY, memoDraftBackup); } catch(e){} }
    await saveProgress();
  }, exportedPayload);

  // ---- Step 5: RELOAD the page (genuine reload, not just in-memory) ----
  await page.reload();
  await page.waitForFunction(() => typeof integrityResults === 'function', { timeout: 30000 });
  await page.waitForTimeout(300);

  // ---- Step 6: verify everything round-tripped ----
  const result = await page.evaluate(async () => {
    const out = {};
    out.attemptsCount = PROGRESS.attempts.length;
    out.cx20_3Attempt = PROGRESS.attempts.find(a => a.qid === 'cx20_3');
    out.srsIntact = JSON.stringify(PROGRESS.srs['9-1']);
    out.exposureIntact = JSON.stringify(PROGRESS.exposure['9-1']);
    out.everSeenIdsIntact = PROGRESS.everSeenIds.slice().sort();
    out.skillMasteryIntact = JSON.stringify(PROGRESS.skillMastery['ESTIMATE_CLASSIFICATION']);
    out.mockHistoryLen = PROGRESS.mockHistory.length;
    out.coldSessionHistoryLen = PROGRESS.coldSessionHistory.length;
    out.memoAttemptsLen = PROGRESS.memoAttempts.length;
    let memoDraft = null;
    try { const x = await storageGet(ACTIVE_MEMO_KEY); memoDraft = x && x.value; } catch(e){}
    out.memoDraftRestored = memoDraft ? JSON.parse(memoDraft).text : null;
    // History-policy verification: cx20_3 resolves as a real (though retired/excluded) item,
    // its historical attempt is NOT silently reinterpreted under cx20_3R1's new semantics.
    const cx203item = (V520_CHALLENGE_EXTRAS['20']||[]).find(x=>x.id==='cx20_3');
    out.cx20_3StillResolvable = !!cx203item;
    out.cx20_3StillFlaggedExcluded = cx203item ? cx203item.sourceConflict===true : null;
    out.cx20_3AttemptMisconceptionCodePreserved = out.cx20_3Attempt ? out.cx20_3Attempt.misconceptionCode : null;
    // Run full regression post-reload to confirm nothing broke
    const rs = integrityResults();
    out.regressionTotal = rs.length;
    out.regressionFailing = rs.filter(r=>!r.ok).map(r=>r.name);
    return out;
  });

  console.log(JSON.stringify({ afterResetAttempts, result, consoleErrors }, null, 2));
  await browser.close();
})();
