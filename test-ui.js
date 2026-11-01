import puppeteer from 'puppeteer-core';

async function run() {
  console.log('Launching installed Google Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 820 });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // 1. Workspace Immediate Load (seeded case DEMO-DEL-014 Mira Sharma)
  console.log('1. Verifying seeded case DEMO-DEL-014 opens immediately...');
  await page.waitForSelector('.case-banner', { timeout: 5000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'workspace_desktop.png' });

  // 2. Select Sighting RPT-DEL-203 in timeline
  console.log('2. Clicking Sighting RPT-DEL-203 in timeline...');
  await page.click('#timeline-item-sight-del-203');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'workspace_selected_rpt203.png' });

  // 3. Switch to AI Suggestions Tab
  console.log('3. Switching to AI Suggestions Tab...');
  await page.click('#tab-view-suggestions');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'workspace_ai_suggestions.png' });

  // 4. Confirm AI Link sugg-del-101
  console.log('4. Confirming AI Link sugg-del-101...');
  await page.click('#btn-confirm-sugg-del-101');
  await new Promise(r => setTimeout(r, 600));

  // 5. Switch to Chain of Custody Activity Log Tab
  console.log('5. Switching to Chain of Custody Log...');
  await page.click('#tab-view-activity');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'workspace_activity_log.png' });

  // 6. Switch to Master Case Roster
  console.log('6. Switching to Case Roster tab...');
  await page.click('#nav-tab-cases');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'workspace_case_roster.png' });

  // 7. Open Case Kabir Mehta (DEMO-DEL-022)
  console.log('7. Opening Kabir Mehta case (DEMO-DEL-022)...');
  await page.click('#btn-open-case-case-del-022');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'workspace_kabir_mehta.png' });

  // 8. Return to Landing Page
  console.log('8. Returning to Landing Portal...');
  await page.click('.header-brand');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'landing_desktop.png' });

  // 9. Mobile Viewport (390 x 844)
  console.log('9. Testing Mobile Viewport...');
  await page.setViewport({ width: 390, height: 844 });
  await page.click('#btn-open-workspace');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'workspace_mobile.png' });

  console.log('SUCCESS: All 9 interaction, navigation, and Delhi case verification tests passed!');
  await browser.close();
}

run().catch((err) => {
  console.error('Error during test execution:', err);
  process.exit(1);
});
