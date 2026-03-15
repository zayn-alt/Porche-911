const { chromium } = require('playwright');

const URL = "https://gumyfui.com?directlink=1&code_type=1&sid=941721";
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

const stealth = () => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  delete window.__playwright;
  delete window.__pwInitScripts;
  const originalQuery = window.navigator.permissions.query;
  window.navigator.permissions.query = (parameters) =>
    parameters.name === 'notifications'
      ? Promise.resolve({ state: Notification.permission })
      : originalQuery(parameters);
  window.chrome = { runtime: {}, loadTimes: function() {}, csi: function() {}, app: {} };
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
  Object.defineProperty(navigator, 'deviceMemory',        { get: () => 8 });
  Object.defineProperty(navigator, 'languages',           { get: () => ['en-US', 'en'] });
  Object.defineProperty(navigator, 'platform',            { get: () => 'Win32' });
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
  Object.defineProperty(screen,  'width',       { get: () => 1366 });
  Object.defineProperty(screen,  'height',      { get: () => 768  });
  Object.defineProperty(screen,  'availWidth',  { get: () => 1366 });
  Object.defineProperty(screen,  'availHeight', { get: () => 728  });
  Object.defineProperty(screen,  'colorDepth',  { get: () => 24   });
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

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const humanMouse = async (page) => {
  for (let i = 0; i < rand(5, 10); i++) {
    await page.mouse.move(rand(100, 1200), rand(100, 600), { steps: rand(10, 25) });
    await page.waitForTimeout(rand(80, 250));
  }
};

const humanScroll = async (page) => {
  for (let i = 0; i < rand(4, 8); i++) {
    await page.mouse.wheel(0, rand(150, 400));
    await page.waitForTimeout(rand(300, 800));
  }
};

const humanClick = async (page) => {
  try {
    const el = await page.$('a, button, p, h1, h2');
    if (el) {
      await el.hover();
      await page.waitForTimeout(rand(300, 700));
      await el.click({ delay: rand(50, 150) });
      console.log('Clicked element');
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
    const proxy = PROXIES[Math.floor(Math.random() * PROXIES.length)];
    console.log(`\n--- Visit ${i} of ${TIMES} ---`);
    console.log(`Proxy: ${proxy.server}`);

    const context = await browser.newContext({
      proxy,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1366, height: 768 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      javaScriptEnabled: true,
      extraHTTPHeaders: {
        'Referer':            'https://www.google.com/',
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
      await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
      console.log(`Title: ${await page.title()}`);
      console.log(`URL:   ${page.url()}`);

      await humanMouse(page);
      await humanScroll(page);
      await humanClick(page);

      const wait = rand(5000, 12000);
      console.log(`Waiting ${wait}ms...`);
      await page.waitForTimeout(wait);

      await page.screenshot({ path: `screenshot_${i}.png` });
      console.log(`Visit ${i} done`);

    } catch (e) {
      console.log(`Visit ${i} failed: ${e.message}`);
    }

    await context.close();
    await new Promise(r => setTimeout(r, rand(2000, 5000)));
  }

  await browser.close();
  console.log('\nAll visits completed.');
})();
