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
    const originalCensus = window.v518GlobalCensus;

    // Fault A: simulate a false positive -- census wrongly reports a real runtime
    // container (FRESHCHALLENGE) as an unexpected authored bank in every call.
    window.v518GlobalCensus = function(){
      const real = originalCensus();
      return { findings: real.findings, unexpected: real.unexpected.concat([{bank:'FRESHCHALLENGE', count:3}]) };
    };
    const rsA = integrityResults();
    window.v518GlobalCensus = originalCensus;
    const falsePosCheck = rsA.find(r => r.name.indexOf('stateful census - no false positive')!==-1);
    out.faultA_gateCaughtFalsePositive = falsePosCheck ? (!falsePosCheck.ok && falsePosCheck.detail.indexOf('FRESHCHALLENGE')!==-1) : null;
    out.faultA_detail = falsePosCheck ? falsePosCheck.detail : null;

    // Fault B: simulate the negative control being defeated -- census NEVER reports
    // anything unexpected, even with the synthetic bank injected.
    window.v518GlobalCensus = function(){ return { findings: [], unexpected: [] }; };
    const rsB = integrityResults();
    window.v518GlobalCensus = originalCensus;
    const negControlCheck = rsB.find(r => r.name.indexOf('negative control - injected synthetic bank still detected')!==-1);
    out.faultB_gateCaughtDefeatedNegControl = negControlCheck ? !negControlCheck.ok : null;
    out.faultB_detail = negControlCheck ? negControlCheck.detail : null;

    // Confirm clean afterward
    const rsFinal = integrityResults();
    out.allCleanAfterRestore = rsFinal.filter(r => !r.ok).length === 0;
    out.finalFailing = rsFinal.filter(r => !r.ok).map(r => r.name);
    out.censusRestoredCorrectly = window.v518GlobalCensus === originalCensus;
    return out;
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
