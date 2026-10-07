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

    // Fault 1: UNMAPPED_ACTIVE injection -- delete cx20_3R1's diagnostic rows entirely
    const savedRows = V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'];
    delete V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'];
    const rs1 = integrityResults();
    const unmappedCheck = rs1.find(r => r.name.indexOf('UNMAPPED_ACTIVE=0 across all 34 chapters')!==-1);
    out.fault1_unmappedGateCaughtIt = unmappedCheck ? (!unmappedCheck.ok && unmappedCheck.detail.indexOf('20:UNMAPPED_ACTIVE')!==-1) : null;
    out.fault1_detail = unmappedCheck ? unmappedCheck.detail : null;
    V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'] = savedRows; // restore

    // Fault 2: duplicate option_identity injection on an existing active item's rows
    const savedRows2 = JSON.parse(JSON.stringify(V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1']));
    V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'][1].option_identity = V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'][0].option_identity;
    V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'][1].option_text = V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'][0].option_text;
    const rs2 = integrityResults();
    const qualityCheck2 = rs2.find(r => r.name.indexOf('diagnostic row quality')!==-1);
    out.fault2_dupGateCaughtIt = qualityCheck2 ? (!qualityCheck2.ok && qualityCheck2.detail.indexOf('DUPLICATE option_identity')!==-1) : null;
    out.fault2_detail = qualityCheck2 ? qualityCheck2.detail : null;
    V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'] = savedRows2; // restore

    // Fault 3: mark a wrong option as is_correct='yes'
    const savedRows3 = JSON.parse(JSON.stringify(V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1']));
    V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'][0].is_correct = 'yes';
    const rs3 = integrityResults();
    const qualityCheck3 = rs3.find(r => r.name.indexOf('diagnostic row quality')!==-1);
    out.fault3_correctOptionGateCaughtIt = qualityCheck3 ? (!qualityCheck3.ok && qualityCheck3.detail.indexOf('CORRECT-option diagnostic row')!==-1) : null;
    out.fault3_detail = qualityCheck3 ? qualityCheck3.detail : null;
    V52A_DISTRACTOR_DIAGNOSTICS['cx20_3R1'] = savedRows3; // restore

    // Confirm clean state after all restores
    const rsFinal = integrityResults();
    out.allCleanAfterRestore = rsFinal.filter(r => !r.ok).length === 0;
    out.finalFailing = rsFinal.filter(r => !r.ok).map(r => r.name);

    return out;
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
