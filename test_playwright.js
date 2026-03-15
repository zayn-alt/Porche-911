const { chromium } = require('playwright');

const URL = "https://gumyfui.com?directlink=1&code_type=1&sid=941721";
const TIMES = 10;
const PROXY = {
  server: 'http://31.59.20.176:6754',
  username: 'vokbfutp',
  password: 'wdzsglz2uuts'
};

const stealth = () => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

  delete window.__playwright;
  delete window.__pwInitScripts;

  const originalQuery = window.navigator.permissions.query;
  window.navigator.permissions.query = (parameters) =>
    parameters.name === 'notifications'
      ? Promise.resolve({ state: Notification.permission })
      : originalQuery(parameters);

  window.chrome = {
    runtime: {},
    loadTimes: function() {},
    csi: function() {},
    app: {}
  };

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

const printFingerprint = async (page) => {
  const fp = await page.evaluate(() => {
    const gl  = document.createElement('canvas').getContext('webgl');
    const ext = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
    return {
      userAgent:           navigator.userAgent,
      webdriver:           navigator.webdriver,
      platform:            navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory:        navigator.deviceMemory,
      languages:           navigator.languages,
      pluginsCount:        navigator.plugins.length,
      outerWidth:          window.outerWidth,
      outerHeight:         window.outerHeight,
      screenWidth:         screen.width,
      screenHeight:        screen.height,
      colorDepth:          screen.colorDepth,
      timezone:            Intl.DateTimeFormat().resolvedOptions().timeZone,
      webglVendor:         ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)   : 'N/A',
      webglRenderer:       ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'N/A',
      chromeObject:        typeof window.chrome !== 'undefined',
    };
  });

  console.log('\n======= BROWSER FINGERPRINT =======');
  Object.entries(fp).forEach(([k, v]) => console.log(`  ${k.padEnd(22)}: ${JSON.stringify(v)}`));
  console.log('====================================\n');
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
  const launchOptions = {
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
  };
  if (PROXY) launchOptions.proxy = PROXY;

  const browser = await chromium.launch(launchOptions);

  for (let i = 1; i <= TIMES; i++) {
    console.log(`\n--- Visit ${i} of ${TIMES} ---`);

    const contextOptions = {
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
    };
    if (PROXY) contextOptions.proxy = PROXY;

    const context = await browser.newContext(contextOptions);
    const page    = await context.newPage();

    await page.addInitScript(stealth);

    try {
      await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
      console.log(`Title: ${await page.title()}`);
      console.log(`URL:   ${page.url()}`);

      if (i === 1) await printFingerprint(page);

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
