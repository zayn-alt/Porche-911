const { chromium } = require('playwright');

(async () => {
  const URL = "https://gumyfui.com?directlink=1&code_type=1&sid=941721";
  const TIMES = 10;

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--disable-dev-shm-usage',
    ]
  });

  for (let i = 1; i <= TIMES; i++) {
    console.log(`Visit ${i} of ${TIMES}...`);

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1366, height: 768 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      javaScriptEnabled: true,
      extraHTTPHeaders: {
        'Referer': 'https://www.google.com/',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    const page = await context.newPage();

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });

    try {
      await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

      const title = await page.title();
      console.log(`Visit ${i} - Title: ${title}`);

      await page.evaluate(() => {
        return new Promise((resolve) => {
          let total = 0;
          const distance = 120;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            total += distance;
            if (total >= document.body.scrollHeight * 0.6) {
              clearInterval(timer);
              resolve();
            }
          }, 200);
        });
      });

      const wait = Math.floor(Math.random() * 4000) + 3000;
      console.log(`Visit ${i} - Waiting ${wait}ms...`);
      await page.waitForTimeout(wait);

      await page.screenshot({ path: `screenshot_${i}.png` });
      console.log(`Visit ${i} - Done`);

    } catch (e) {
      console.log(`Visit ${i} - Failed: ${e.message}`);
    }

    await context.close();

    const gap = Math.floor(Math.random() * 3000) + 2000;
    await new Promise(r => setTimeout(r, gap));
  }

  await browser.close();
  console.log('All visits completed.');
})();
