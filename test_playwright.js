kconst { chromium } = require('playwright');

(async () => {

  // =========================================
  // *** حط الرابط بتاعك هنا ***
  const URL = "https://gumyfui.com?directlink=1&code_type=1&sid=941721";
  // =========================================

  console.log('جاري فتح الموقع:', URL);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // فتح الرابط
  await page.goto(URL, { waitUntil: 'networkidle' });

  // عنوان الصفحة
  const title = await page.title();
  console.log('عنوان الصفحة:', title);

  // الرابط الحالي بعد أي redirect
  const currentURL = page.url();
  console.log('الرابط الحالي:', currentURL);

  // حفظ screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  console.log('تم حفظ screenshot.png');

  await browser.close();
  console.log('تم بنجاح ✔');

})();

