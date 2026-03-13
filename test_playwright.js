const { chromium } = require('playwright');

(async () => {
  const URL = "https://gumyfui.com?directlink=1&code_type=1&sid=941721";
  console.log('جاري فتح الموقع:', URL);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  const title = await page.title();
  console.log('عنوان الصفحة:', title);
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
  console.log('تم بنجاح');
})();
