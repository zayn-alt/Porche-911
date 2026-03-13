const { chromium } = require('playwright');

(async () => {
  const URL = "https://gumyfui.com?directlink=1&code_type=1&sid=941721";
  const TIMES = 10;

  const browser = await chromium.launch({ headless: true });

  for (let i = 1; i <= TIMES; i++) {
    console.log(`زيارة رقم ${i}...`);
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`رقم ${i} - العنوان: ${title}`);
    await page.screenshot({ path: `screenshot_${i}.png`, fullPage: true });
    await page.close();
  }

  await browser.close();
  console.log('تم بنجاح - 10 زيارات');
})();
