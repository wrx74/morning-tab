// Скриншоты страницы: node shot.cjs <index.html> <out>
// Отдельно от render.ts, потому что под Bun на Windows chromium.launch() зависает.
const { chromium } = require("playwright");
const { pathToFileURL } = require("node:url");
const { join } = require("node:path");

const [html, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(pathToFileURL(html).href, { waitUntil: "load", timeout: 60000 });
  await p.evaluate(async () => { for (const im of Array.from(document.images)) im.loading = "eager"; await document.fonts.ready; await new Promise((r) => setTimeout(r, 4000)); });
  await p.screenshot({ path: join(out, "screenshot-top.png") });
  await p.screenshot({ path: join(out, "screenshot.png"), fullPage: true });
  await b.close();
})().catch((e) => { console.error(e.message.split("\n")[0]); process.exit(1); });
