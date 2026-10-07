const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:8980/rc3_2.html');
  await page.waitForFunction(() => typeof integrityResults === 'function', { timeout: 30000 });
  await page.waitForTimeout(300);

  const result = await page.evaluate(() => {
    const out = {};
    out.v532Reachable = typeof window.V532_FINAL_BASE_INTEGRITY === 'function';

    const original = window.V532_FINAL_BASE_INTEGRITY;
    window.V532_FINAL_BASE_INTEGRITY = function(){ throw new Error('INJECTED_FAULT_FOR_3C_TEST'); };
    const progressBefore = JSON.stringify(PROGRESS);
    const sessionBefore = JSON.stringify(SESSION);
    let threwToOuter = false;
    let rs2 = null;
    try {
      rs2 = integrityResults();
    } catch(e) {
      threwToOuter = true;
    }
    window.V532_FINAL_BASE_INTEGRITY = original;
    const progressAfter = JSON.stringify(PROGRESS);
    const sessionAfter = JSON.stringify(SESSION);

    out.integrityResultsDidNotThrowToOuterCaller = !threwToOuter;
    out.progressRestoredDespiteFault = progressBefore === progressAfter;
    out.sessionRestoredDespiteFault = sessionBefore === sessionAfter;
    const excCheck = rs2 ? rs2.find(r => r.name.indexOf('exception-path restoration')!==-1) : null;
    out.gateReportedTheThrow = excCheck ? !excCheck.ok : null;
    out.gateDetail = excCheck ? excCheck.detail : null;

    // Confirm fully clean afterward
    const rsFinal = integrityResults();
    out.allCleanAfterRestore = rsFinal.filter(r => !r.ok).length === 0;
    out.finalFailing = rsFinal.filter(r => !r.ok).map(r => r.name);
    out.v532RestoredCorrectly = window.V532_FINAL_BASE_INTEGRITY === original;
    return out;
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
