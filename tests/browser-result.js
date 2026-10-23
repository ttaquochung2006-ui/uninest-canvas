// Inspect rendered DOM only; a result string in an injected script is not a pass.
function readBrowserResult(dom) {
  const rendered = String(dom || '').replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
  const matches = [...rendered.matchAll(/<pre id="browserSmokeResult">(BROWSER-SMOKE-(?:OK|FAIL:[^<]+))<\/pre>/g)];
  return matches.length === 1 ? matches[0][1] : null;
}

module.exports = { readBrowserResult };