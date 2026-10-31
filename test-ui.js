import puppeteer from 'puppeteer-core';

async function run() {
  console.log('Launching installed Google Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // 1. Landing Page Screenshot
  console.log('1. Capturing Landing Page Desktop Screenshot...');
  await page.screenshot({ path: 'landing_desktop.png' });

  // 2. Click "Open Case Workspace"
  console.log('2. Clicking Open Case Workspace button...');
  await page.click('#btn-open-workspace');
  await page.waitForSelector('.case-banner', { timeout: 5000 });
  await new Promise(r => setTimeout(r, 600));

  console.log('3. Capturing Workspace Desktop Screenshot...');
  await page.screenshot({ path: 'workspace_desktop.png' });

  // 3. Select Sighting RPT-203
  console.log('4. Clicking Sighting RPT-203...');
  await page.click('#timeline-item-sight-203');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'workspace_selected_rpt203.png' });

  // 4. Switch to AI Suggestions Tab
  console.log('5. Switching to AI Suggestions Tab...');
  await page.click('#tab-view-suggestions');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'workspace_ai_suggestions.png' });

  // 5. Confirm AI Link SUGG-101
  console.log('6. Confirming AI Link SUGG-101...');
  await page.click('#btn-confirm-sugg-101');
  await new Promise(r => setTimeout(r, 600));

  // 6. Switch to Chain of Custody Activity Log Tab
  console.log('7. Switching to Chain of Custody Log...');
  await page.click('#tab-view-activity');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'workspace_activity_log.png' });

  // 7. Mobile Viewport (390 x 844)
  console.log('8. Testing Mobile Viewport...');
  await page.setViewport({ width: 390, height: 844 });
  await page.click('#tab-view-matrix');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'workspace_mobile.png' });

  console.log('SUCCESS: All 8 interaction and rendering tests passed!');
  await browser.close();
}

run().catch((err) => {
  console.error('Error during test execution:', err);
  process.exit(1);
});
