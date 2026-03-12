const { chromium } = require('playwright');

(async () => {
  console.log('تشغيل Playwright...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://example.com');
  const title = await page.title();
  console.log('عنوان الصفحة:', title);

  await page.screenshot({ path: 'screenshot.png' });
  console.log('تم حفظ screenshot.png');

  await browser.close();
  console.log('تم الانتهاء بنجاح ✔');
})();
