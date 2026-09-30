const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:8980/rc3_2.html');
  await page.waitForFunction(() => typeof integrityResults !== 'undefined', { timeout: 30000 });
  await page.waitForTimeout(300);
  const result = await page.evaluate(() => {
    const out = {};
    // Protected Cold reserve: 20 qualifying chapters x 8 = 160
    let reserveTotal = 0, reserveByChapter = {};
    try {
      for (const c of CHAPTER_LIST) {
        const ids = v513ProtectedColdIds(String(c.num));
        if (ids && ids.size) { reserveByChapter[c.num] = ids.size; reserveTotal += ids.size; }
      }
    } catch(e){ out.reserveErr = e.message; }
    out.reserveTotal = reserveTotal;
    out.qualifyingChapters = Object.keys(reserveByChapter).length;
    out.allExactly8 = Object.values(reserveByChapter).every(n => n===8);

    // Blueprint Mock / Full Sim domain quotas
    out.blueprintDomains = BLUEPRINT_DOMAINS.map(b => ({domain: b.domain, n: b.n}));
    out.blueprintTotal = BLUEPRINT_DOMAINS.reduce((s,b)=>s+b.n, 0);

    // Build an actual Blueprint pack and check length + domain breakdown
    try {
      const pack = buildOfflineFreshBlueprintPack();
      out.blueprintPackLen = pack.length;
      const byDomain = {};
      pack.forEach(it => { byDomain[it.domain] = (byDomain[it.domain]||0)+1; });
      out.blueprintPackByDomain = byDomain;
    } catch(e){ out.blueprintPackErr = e.message; }

    return out;
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
