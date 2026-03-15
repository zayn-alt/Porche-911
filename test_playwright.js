const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
chromium.use(StealthPlugin());

const URL = "https://example.com";
const TIMES = 10;

const PROXIES = [
  { server: 'http://191.96.254.138:6185', username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://142.111.67.146:5611', username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://216.10.27.159:6837',  username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://31.59.20.176:6754',   username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://23.95.150.145:6114',  username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://198.23.239.134:6540', username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://45.38.107.97:6014',   username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://107.172.163.27:6543', username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://198.105.121.200:6462',username: 'vokbfutp', password: 'wdzsglz2uuts' },
  { server: 'http://64.137.96.74:6641',   username: 'vokbfutp', password: 'wdzsglz2uuts' },
];

const REFERERS = [
  'https://www.google.com/search?q=site',
  'https://www.google.com/',
  'https://www.facebook.com/',
  'https://www.twitter.com/',
  'https://www.youtube.com/',
  'https://www.bing.com/search?q=site',
  'https://www.reddit.com/',
  'https://www.instagram.com/',
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Denver',
  'Europe/London',
  'Europe/Paris',
];

const rand     = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randItem = (arr)      => arr[Math.floor(Math.random() * arr.length)];
const sleep    = (ms)       => new Promise(r => setTimeout(r, ms));

const stealth = () => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  delete window.__playwright;
  delete window.__pwInitScripts;
  const originalQuery = window.navigator.permissions.query;
  window.navigator.permissions.query = (parameters) =>
    parameters.name === 'notifications'
      ? Promise.resolve({ state: Notification.permission })
      : originalQuery(parameters);
  window.chrome = { runtime: {}, loadTimes: function() {}, csi: function() {}, app: {}, webstore: {} };
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => randItem([4, 8, 12, 16]) });
  Object.defineProperty(navigator, 'deviceMemory',        { get: () => randItem([4, 8]) });
  Object.defineProperty(navigator, 'languages',           { get: () => ['en-US', 'en'] });
  Object.defineProperty(navigator, 'platform',            { get: () => 'Win32' });
  Object.defineProperty(navigator, 'vendor',              { get: () => 'Google Inc.' });
  Object.defineProperty(navigator, 'plugins', {
    get: () => {
      const p = [
        { name: 'Chrome PDF Plugin',  description: 'Portable Document Format', filename: 'internal-pdf-viewer' },
        { name: 'Chrome PDF Viewer',  description: '',                          filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
        { name: 'Native Client',      description: '',                          filename: 'internal-nacl-plugin' }
      ];
      p.length = 3;
      return p;
    }
  });
  Object.defineProperty(window, 'outerWidth',  { get: () => 1366 });
  Object.defineProperty(window, 'outerHeight', { get: () => 768  });
  Object.defineProperty(window, 'innerWidth',  { get: () => 1366 });
  Object.defineProperty(window, 'innerHeight', { get: () => 768  });
  Object.defineProperty(screen,  'width',       { get: () => 1366 });
  Object.defineProperty(screen,  'height',      { get: () => 768  });
  Object.defineProperty(screen,  'availWidth',  { get: () => 1366 });
  Object.defineProperty(screen,  'availHeight', { get: () => 728  });
  Object.defineProperty(screen,  'colorDepth',  { get: () => 24   });
  Object.defineProperty(screen,  'pixelDepth',  { get: () => 24   });
  const getParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(parameter) {
    if (parameter === 37446) return 'Intel Inc.';
    if (parameter === 37445) return 'Intel Iris OpenGL Engine';
    return getParameter.call(this, parameter);
  };
  const toDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function(type) {
    const ctx = this.getContext('2d');
    if (ctx) {
      const d = ctx.getImageData(0, 0, this.width, this.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     += Math.floor(Math.random() * 3) - 1;
        d.data[i + 1] += Math.floor(Math.random() * 3) - 1;
        d.data[i + 2] += Math.floor(Math.random() * 3) - 1;
      }
      ctx.putImageData(d, 0, 0);
    }
    return toDataURL.apply(this, arguments);
  };
};

const humanMouse = async (page) => {
  for (let i = 0; i < rand(6, 14); i++) {
    await page.mouse.move(rand(50, 1300), rand(50, 650), { steps: rand(8, 30) });
    await sleep(rand(50, 300));
  }
};

const humanScroll = async (page) => {
  for (let i = 0; i < rand(3, 9); i++) {
    await page.mouse.wheel(0, rand(100, 500));
    await sleep(rand(200, 900));
  }
  await sleep(rand(500, 1500));
  for (let i = 0; i < rand(1, 3); i++) {
    await page.mouse.wheel(0, -rand(100, 300));
    await sleep(rand(200, 600));
  }
};

const humanClick = async (page) => {
  try {
    const el = await page.$('a, button, p, h1, h2, span');
    if (el) {
      await el.hover();
      await sleep(rand(200, 800));
      await el.click({ delay: rand(40, 180) });
      console.log('Clicked element');
      await sleep(rand(500, 2000));
    }
  } catch (e) {
    console.log('Click skipped');
  }
};

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--disable-dev-shm-usage',
      '--window-size=1366,768',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-default-apps',
    ]
  });

  for (let i = 1; i <= TIMES; i++) {
    const proxy     = randItem(PROXIES);
    const referer   = randItem(REFERERS);
    const userAgent = randItem(USER_AGENTS);
    const timezone  = randItem(TIMEZONES);

    console.log(`\n--- Visit ${i} of ${TIMES} ---`);
    console.log(`Proxy:    ${proxy.server}`);
    console.log(`Referer:  ${referer}`);
    console.log(`Timezone: ${timezone}`);

    const context = await browser.newContext({
      proxy,
      userAgent,
      viewport: { width: 1366, height: 768 },
      locale: 'en-US',
      timezoneId: timezone,
      javaScriptEnabled: true,
      extraHTTPHeaders: {
        'Referer':            referer,
        'Accept-Language':    'en-US,en;q=0.9',
        'Accept':             'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'sec-ch-ua':          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile':   '?0',
        'sec-ch-ua-platform': '"Windows"',
      }
    });

    const page = await context.newPage();
    await page.addInitScript(stealth);

    try {
      const initialDelay = rand(1000, 5000);
      console.log(`Initial delay: ${initialDelay}ms`);
      await sleep(initialDelay);

      await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
      console.log(`Title: ${await page.title()}`);
      console.log(`URL:   ${page.url()}`);

      await humanMouse(page);
      await humanScroll(page);
      await humanClick(page);
      await humanMouse(page);

      const wait = rand(5000, 12000);
      console.log(`Waiting ${wait}ms...`);
      await sleep(wait);

      await page.screenshot({ path: `screenshot_${i}.png` });
      console.log(`Visit ${i} done`);

    } catch (e) {
      console.log(`Visit ${i} failed: ${e.message}`);
    }

    await context.close();
    const gap = rand(3000, 8000);
    console.log(`Gap: ${gap}ms`);
    await sleep(gap);
  }

  await browser.close();
  console.log('\nAll visits completed.');
})();
