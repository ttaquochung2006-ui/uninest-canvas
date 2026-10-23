// Real Tailwind shell regression: no fixed-stage or replacement-layout CSS.
// Tailwind is fetched once (or supplied as a local file) for deterministic file:// rendering.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);

async function main() {
  if (!edge) throw Error('Edge required for production-shell layout verification');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'uninest-layout-'));
  try {
    const tailwind = process.env.UNINEST_TAILWIND_FILE
      ? fs.readFileSync(process.env.UNINEST_TAILWIND_FILE, 'utf8')
      : await fetch('https://cdn.tailwindcss.com', { signal: AbortSignal.timeout(15000) }).then(r => {
        if (!r.ok) throw Error('Tailwind download failed: ' + r.status);
        return r.text();
      });
    fs.writeFileSync(path.join(dir, 'tailwind.js'), tailwind);
    const results = [];
    for (const [width, height] of [[1856, 991], [1366, 855], [390, 931]]) {
      for (const mode of ['desktop', 'mobile']) for (const version of ['11.5', '11.6']) {
        const probe = `<script>
          const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
          window.addEventListener('load', async () => {
            const result = document.createElement('pre'); result.id = 'layoutResult';
            try {
              finishBootLoader(true); setViewMode('${mode}');
              await wait(600); autoFitToViewport();
              const shownZoom = state.zoom;
              toggleStudioChrome(true);
              await wait(1500); autoFitToViewport();
              const rect = id => {
                const r = document.getElementById(id).getBoundingClientRect();
                return { left:r.left, top:r.top, right:r.right, bottom:r.bottom, width:r.width, height:r.height };
              };
              const hidden = { zoom:state.zoom, canvas:rect('designCanvas'), dock:rect('chromeRevealDock'),
                stage:rect('canvasStage'), chrome:rect('studioChrome'), viewport:rect('canvasViewport') };
              document.getElementById('chromeRevealDock').querySelector('button').click();
              await wait(600); autoFitToViewport();
              const restored = { hidden:state.studioChromeHidden, zoom:state.zoom, chrome:rect('studioChrome') };
              toggleStudioChrome(true); await wait(600); autoFitToViewport();
              result.textContent = JSON.stringify({ version:'${version}', mode:'${mode}', width:innerWidth,
                height:innerHeight, shownZoom, hidden, restored, css:getComputedStyle(document.body).display });
            } catch(e) { result.textContent = JSON.stringify({ error:e.message }); }
            result.style.display = 'none'; document.body.appendChild(result);
          });
        </script>`;
        const html = fs.readFileSync(path.join(root, version === '11.6' ? '' : 'versions', `uninest_canvas_studio_v${version}.html`), 'utf8')
          .replace(/<base\b[^>]*>/gi, '')
          .replace('src="https://cdn.tailwindcss.com"', `src="${pathToFileURL(path.join(dir, 'tailwind.js')).href}"`)
          .replace(/<link\b[^>]*href="https?:[^>]*>/gi, '')
          .replace('<head>', `<head><base href="${pathToFileURL(root + path.sep).href}">`)
          .replace('</body>', probe + '</body>');
        const file = path.join(dir, `v${version}-${mode}-${width}.html`);
        fs.writeFileSync(file, html);
        const args = ['--headless=new', '--disable-gpu', '--disable-extensions', '--no-first-run',
          '--force-prefers-reduced-motion',
          '--no-default-browser-check', '--no-sandbox', '--disable-background-networking',
          '--user-data-dir=' + path.join(dir, `profile-${version}-${mode}-${width}`),
          `--window-size=${width},${height}`, '--virtual-time-budget=6000', '--dump-dom'];
        if (process.env.UNINEST_SCREENSHOT_DIR && width === 1856) {
          fs.mkdirSync(process.env.UNINEST_SCREENSHOT_DIR, { recursive: true });
          args.push('--screenshot=' + path.join(process.env.UNINEST_SCREENSHOT_DIR, `v${version}-${mode}.png`));
        }
        const run = spawnSync(edge, [...args, pathToFileURL(file).href],
          { encoding: 'utf8', timeout: 30000, maxBuffer: 10 * 1024 * 1024 });
        assert.ifError(run.error); assert.equal(run.status, 0);
        const match = run.stdout.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
          .match(/<pre id="layoutResult"[^>]*>([^<]+)<\/pre>/);
        assert(match, 'Missing actual layout result');
        const r = JSON.parse(match[1]); assert(!r.error, r.error);
        results.push(r);
        assert.equal(r.css, 'flex', 'Tailwind shell did not load');
        assert(!r.restored.hidden && r.restored.chrome.height > 50, 'Recovery failed');
        if (version === '11.6') {
          assert(r.hidden.chrome.height < 1, 'Studio did not collapse fully');
          const { canvas:c, dock:d, stage:s } = r.hidden;
          assert(c.top - s.top >= 11 && c.top - s.top <= 64, 'Large hidden-chrome top gap');
          assert(d.top >= s.top + 7 && d.bottom <= s.bottom, 'Recovery dock is clipped by stage');
          assert(!(d.left < c.right && d.right > c.left && d.top < c.bottom && d.bottom > c.top), 'Dock overlap');
          if (width >= 1366 || mode === 'mobile') {
            assert(c.bottom <= r.height + 1 && c.left >= -1 && c.right <= r.width + 1, 'Canvas clipped');
          }
          const old = results[results.length - 2];
          console.log(`${mode} ${r.width}x${r.height}: v11.5 ${Math.round(old.hidden.zoom * 100)}%, top ${Math.round(old.hidden.canvas.top)}px -> v11.6 ${Math.round(r.hidden.zoom * 100)}%, top ${Math.round(c.top)}px`);
          assert(r.hidden.zoom >= old.hidden.zoom, 'New auto-fit shrank');
          if (width === 1856) {
            assert(c.top - s.top <= 13, 'Screenshot-sized viewport must have only 12px top space');
            assert(r.hidden.zoom > old.hidden.zoom * 1.05, 'No meaningful enlargement over v11.5');
          }
        }
      }
    }
    console.log('PRODUCTION-SHELL-OK: 12 cases, both versions/modes, actual Tailwind, hide/restore and top-gap assertions');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });