// Optional real-Edge smoke test; no test framework or network dependency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { readBrowserResult } = require('./browser-result');

const root = path.resolve(__dirname, '..');
const edge = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);
if (!edge) {
  console.log('Skipped browser smoke test: Microsoft Edge not installed.');
  process.exit(0);
}
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'uninest-v112-'));
const htmlFile = path.join(dir, 'browser-smoke.html');
try {
  // Only the temporary fixture skips CDN styling/fonts: canvas logic stays unchanged.
  // This makes the behavior test deterministic when the network is unavailable.
  const html = fs.readFileSync(path.join(root, 'uninest_canvas_studio_v11.2.html'), 'utf8')
    .replace(/<script\b[^>]*src="https?:[^>]*><\/script>/gi, '')
    .replace(/<link\b[^>]*href="https?:[^>]*>/gi, '')
    .replace('<head>', `<head><base href="${new URL('file:///' + root.replace(/\\/g, '/') + '/').href}"><script>window.tailwind = {};
      window.smokeErrors = [];
      window.addEventListener('error', e => window.smokeErrors.push(e.message));
      window.addEventListener('unhandledrejection', e => window.smokeErrors.push(String(e.reason)));
    </script>`);
  const probe = String.raw`<script>
  (() => {
  const errors = window.smokeErrors;
  function check(condition, message) { if (!condition) throw Error(message); }
  const canvas = document.getElementById('designCanvas');
  function near(actual, expected, message, tolerance = 0.01) {
    check(Math.abs(actual - expected) < tolerance, message + ': ' + actual + ' !== ' + expected);
  }
  function clientPoint(x, y) {
    const rect = canvas.getBoundingClientRect(), size = SIZES[state.viewMode];
    return { clientX: rect.left + x * rect.width / size.width, clientY: rect.top + y * rect.height / size.height };
  }
  function mouse(type, x, y) {
    canvas.dispatchEvent(new MouseEvent(type, { bubbles: true, ...clientPoint(x, y) }));
  }
  function touch(type, x, y) {
    const point = new Touch({ identifier: 1, target: canvas, ...clientPoint(x, y) });
    const ended = type === 'touchend' || type === 'touchcancel';
    canvas.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true,
      touches: ended ? [] : [point], changedTouches: [point] }));
  }
  function tap(x, y) { touch('touchstart', x, y); touch('touchend', x, y); }
  function zoneCenter(label) {
    const zone = interactiveZones.find(z => z.label.includes(label));
    check(zone, 'missing zone: ' + label);
    return { x: zone.x + zone.w / 2, y: zone.y + zone.h / 2 };
  }
  function hitAt(x, y) {
    return interactiveZones.find(z => x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h);
  }
  function roomPoint(label) {
    // Require a point that actually resolves to the room, not a nearby school/amenity.
    for (const z of interactiveZones.filter(z => z.label.startsWith('Ghim:') && z.label.includes(label))) {
      for (const fx of [0.5, 0.2, 0.8]) for (const fy of [0.8, 0.5, 0.2]) {
        const x = z.x + z.w * fx, y = z.y + z.h * fy;
        if (hitAt(x, y) === z) return { x, y, label: z.label };
      }
    }
    throw Error('no clickable room pin: ' + label);
  }
  function wheel(deltaY) {
    const event = new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true });
    document.getElementById('canvasViewport').dispatchEvent(event);
    check(event.defaultPrevented, 'wheel escaped to Studio page');
  }
  function settle() {
    for (let i = 0; i < 50; i++) tickSmoothMotion();
    state.screenEnterAt = performance.now() - 2000;
    resizeAndDraw();
  }
  function checkScrollReset(message) {
    check(state.desktopScrollY === 0 && state.desktopScrollTarget === 0 &&
      state.mobileScrollY === 0 && state.mobileScrollTarget === 0, message);
  }
  function homeSnapshot() {
    return JSON.stringify({ applied: state.appliedFilters, draft: state.filterDraft,
      city: state.selectedCity, university: state.selectedUniversity, price: state.priceFilter,
      amenities: state.selectedAmenities, food: state.selectedFood, showAll: state.showAllRooms });
  }
  function report(value) {
    const result = document.createElement('pre');
    result.id = 'browserSmokeResult';
    result.textContent = value;
    document.body.appendChild(result);
  }
  try {
    finishBootLoader(true);
    state.screenEnterAt = performance.now() - 2000;
    performLoginSuccess(MOCK_ACCOUNTS.student);
    // Render all 22 screens with both themes and all 3 languages using real canvas.
    let renderCount = 0;
    for (const language of ['vi', 'en', 'zh']) for (const theme of ['light', 'dark']) {
      state.language = language;
      state.theme = theme;
      for (const viewMode of ['desktop', 'mobile']) {
        state.viewMode = viewMode;
        state.isLoggedIn = false;
        state.currentUser = null;
        resetCanvasScroll();
        resizeAndDraw();
        renderCount++;
        for (const role of ['student', 'landlord']) {
          state.isLoggedIn = true;
          state.userRole = role;
          state.currentUser = MOCK_ACCOUNTS[role];
          for (let screen = 0; screen < (role === 'student' ? 6 : 4); screen++) {
            state.currentScreen = screen;
            resetCanvasScroll();
            resizeAndDraw();
            renderCount++;
          }
        }
      }
    }
    check(renderCount === 132, 'not all screens/themes/languages rendered');
    const details = document.createElement('pre');
    details.id = 'browserSmokeDetails';
    details.textContent = 'RENDER-COUNT=' + renderCount;
    document.body.appendChild(details);
    state.language = 'vi';
    state.theme = 'light';
    state.currentUser = MOCK_ACCOUNTS.student;
    state.userRole = 'student';
    resetCanvasScroll();
    state.currentScreen = 3;
    state.viewMode = 'desktop';
    state.mapOffsetX = -3200;
    state.mapOffsetY = 4100;
    resizeAndDraw();
    check(state.desktopMaxScroll === 0, 'desktop map should fit');
    check(!interactiveZones.some(z => z.label.startsWith('Ghim:')), 'far-away desktop pins still clickable');
    setZoomLevel(0.55);
    near(canvas.getBoundingClientRect().width, SIZES.desktop.width * 0.55, 'desktop zoom');
    const desktopReset = zoneCenter('Căn giữa');
    mouse('click', desktopReset.x, desktopReset.y);
    check(state.mapOffsetX === 0 && state.mapOffsetY === 0, 'desktop reset click failed at scaled zoom');
    const original = interactiveZones.find(z => z.label.startsWith('Ghim:'));
    check(original, 'desktop map pins missing');
    state.mapOffsetX = 63;
    state.mapOffsetY = 42;
    resizeAndDraw();
    const panned = interactiveZones.find(z => z.label === original.label);
    check(panned && Math.abs(panned.x - original.x - 63) < 1, 'desktop pin click-zone pan X mismatch');
    check(Math.abs(panned.y - original.y - 42) < 1, 'desktop pin click-zone pan Y mismatch');
    setZoomLevel(1.25);
    const desktopRoom = roomPoint('Studio');
    mouse('mousedown', desktopRoom.x, desktopRoom.y);
    wheel(300);
    check(state.desktopScrollTarget === 0, 'wheel scrolled while dragging map');
    mouse('mousemove', desktopRoom.x + 35, desktopRoom.y + 25);
    window.dispatchEvent(new MouseEvent('mouseup'));
    // MouseEvent rounds client pixels; at 125% zoom this is < 1 logical pixel.
    near(state.mapOffsetX, 98, 'desktop mouse drag X', 1);
    near(state.mapOffsetY, 67, 'desktop mouse drag Y', 1);
    const movedDesktopRoom = roomPoint(desktopRoom.label);
    mouse('click', movedDesktopRoom.x, movedDesktopRoom.y);
    check(state.currentScreen === 3, 'mouse release accidentally opened a room');
    mouse('click', movedDesktopRoom.x, movedDesktopRoom.y);
    check(state.currentScreen === 1 && state.selectedRoomDetail, 'panned desktop pin could not open room');
    switchScreen(0);
    settle();
    check(state.desktopMaxScroll > 0, 'desktop home fixture cannot scroll');
    wheel(200);
    near(state.desktopScrollTarget, Math.min(120, state.desktopMaxScroll), 'desktop wheel destination');
    settle();
    near(state.desktopScrollY, state.desktopScrollTarget, 'desktop smooth scroll did not settle');
    wheel(999999); settle();
    near(state.desktopScrollY, state.desktopMaxScroll, 'desktop wheel lower clamp');
    wheel(-999999); settle();
    checkScrollReset('desktop wheel upper clamp');
    wheel(200);
    setCanvasScroll(0, true);
    settle();
    checkScrollReset('direct manipulation did not cancel pending wheel');
    wheel(200);
    toggleShowAllRooms();
    settle();
    checkScrollReset('show-all retained smooth scroll target');
    toggleShowAllRooms();
    switchScreen(3);
    settle();
    wheel(200); settle();
    checkScrollReset('desktop map wheel should not scroll');
    state.viewMode = 'mobile';
    state.mapOffsetX = 0;
    state.mapOffsetY = 0;
    resetCanvasScroll();
    setZoomLevel(0.65);
    near(canvas.getBoundingClientRect().width, SIZES.mobile.width * 0.65, 'mobile zoom');
    check(state.mobileMapBox.h === 520, 'mobile map size');
    check(interactiveZones.some(z => z.label.startsWith('Ghim: Trạm buýt')), 'mobile bus layer missing');
    const m = interactiveZones.find(z => z.label.startsWith('Ghim:'));
    setCanvasScroll(Math.min(55, state.mobileMaxScroll), true);
    resizeAndDraw();
    const mScroll = interactiveZones.find(z => z.label === m.label);
    check(mScroll && Math.abs(mScroll.y - m.y + state.mobileScrollY) < 1, 'mobile scrolled pin hit-zone mismatch');
    check(interactiveZones.every(z => !z.label.startsWith('Ghim:') || (z.y >= 90 && z.y + z.h <= 762)), 'off-screen mobile pin zone');
    resetCanvasScroll();
    resizeAndDraw();
    touch('touchstart', 170, 350);
    touch('touchmove', 210, 370);
    touch('touchend', 210, 370);
    check(Math.abs(state.mapOffsetX - 40) < 0.01 && Math.abs(state.mapOffsetY - 20) < 0.01, 'mobile one-finger drag did not pan');
    checkScrollReset('mobile map pan scrolled canvas');
    let mobileReset = zoneCenter('Căn giữa');
    tap(mobileReset.x, mobileReset.y);
    check(state.mapOffsetX === 0 && state.mapOffsetY === 0, 'mobile reset tap failed');
    setZoomLevel(1.2);
    const mobileRoom = roomPoint('Studio');
    touch('touchstart', mobileRoom.x, mobileRoom.y);
    wheel(200);
    checkScrollReset('wheel scrolled during mobile map pan');
    touch('touchmove', mobileRoom.x + 20, mobileRoom.y + 10);
    touch('touchend', mobileRoom.x + 20, mobileRoom.y + 10);
    near(state.mapOffsetX, 20, 'mobile scaled pan X');
    near(state.mapOffsetY, 10, 'mobile scaled pan Y');
    check(state.currentScreen === 3, 'touch drag opened room on release');
    const movedMobileRoom = roomPoint(mobileRoom.label);
    mouse('click', movedMobileRoom.x, movedMobileRoom.y);
    check(state.currentScreen === 3, 'synthetic click after touch drag opened room');
    touch('touchstart', 170, 350);
    touch('touchcancel', 170, 350);
    touch('touchmove', 250, 430);
    touch('touchend', 250, 430);
    near(state.mapOffsetX, 20, 'cancelled touch kept panning X');
    near(state.mapOffsetY, 10, 'cancelled touch kept panning Y');
    check(state.currentScreen === 3, 'cancelled touch opened room');
    // The side gutter is outside the map and must scroll canvas content instead.
    check(!isCanvasMapPoint({ x: 390, y: 350 }), 'outside-map swipe fixture');
    touch('touchstart', 390, 350);
    touch('touchmove', 390, 290);
    touch('touchend', 390, 290);
    near(state.mobileScrollY, Math.min(72, state.mobileMaxScroll), 'outside-map swipe scroll');
    near(state.mobileScrollTarget, state.mobileScrollY, 'swipe scroll target');
    near(state.mapOffsetX, 20, 'outside-map swipe panned X');
    near(state.mapOffsetY, 10, 'outside-map swipe panned Y');
    const scrollBeforeMapDrag = state.mobileScrollY;
    touch('touchstart', 170, 250);
    touch('touchmove', 190, 265);
    touch('touchend', 190, 265);
    near(state.mapOffsetX, 40, 'scrolled mobile map pan X');
    near(state.mapOffsetY, 25, 'scrolled mobile map pan Y');
    near(state.mobileScrollY, scrollBeforeMapDrag, 'scrolled map drag moved canvas');
    check(interactiveZones.every(z => !z.label.startsWith('Ghim:') || (z.y >= 90 && z.y + z.h <= 762)), 'scrolled/panned mobile pin clipping');
    const scrolledRoom = roomPoint('Studio');
    tap(scrolledRoom.x, scrolledRoom.y);
    check(state.currentScreen === 1 && state.selectedRoomDetail, 'scrolled/panned mobile pin tap failed');
    checkScrollReset('mobile room navigation retained scroll target');
    switchScreen(3); settle();
    state.mapOffsetX = -4000; state.mapOffsetY = 4000;
    resizeAndDraw();
    check(!interactiveZones.some(z => z.label.startsWith('Ghim:')), 'far-away mobile pin still clickable');
    mobileReset = zoneCenter('Căn giữa');
    tap(mobileReset.x, mobileReset.y);
    check(state.mapOffsetX === 0 && state.mapOffsetY === 0, 'far-away mobile reset failed');
    wheel(100); settle();
    near(state.mobileScrollY, Math.min(60, state.mobileMaxScroll), 'mobile wheel scroll');
    near(state.mobileScrollTarget, state.mobileScrollY, 'mobile wheel settled target');
    wheel(999999); settle();
    near(state.mobileScrollY, state.mobileMaxScroll, 'mobile wheel lower clamp');
    wheel(-999999); settle();
    checkScrollReset('mobile wheel upper clamp');
    wheel(100);
    switchScreen(0); settle();
    checkScrollReset('screen switch retained mobile wheel destination');
    wheel(100);
    setViewMode('desktop'); settle();
    checkScrollReset('view mode switch retained wheel destination');

    async function verifyChat() {
      let chatCases = 0;
      for (const mode of ['desktop', 'mobile']) {
        setViewMode(mode); settle();
        const homeFilters = homeSnapshot();
        for (const prompt of [
          '<img src=x onerror=alert(1)> Khu Quận 10 TP.HCM gần UEH dưới 3 triệu có xe buýt và quán cơm',
          'tất cả phòng',
          'gần UEH dưới 2 km, trạm buýt dưới 300m, giá dưới 3 triệu',
          'Đà Nẵng dưới 1 triệu có hồ bơi và thang máy',
          'phi thuyền trên mặt trăng'
        ]) {
          const expected = aiFindRooms(prompt);
          document.getElementById('aiPromptInput').value = prompt;
          submitAiPrompt();
          await new Promise(resolve => setTimeout(resolve, 650));
          const chat = document.getElementById('aiChatMessages');
          check(!chat.querySelector('img'), 'chat HTML injection');
          const response = chat.lastElementChild;
          const expectedIntro = !expected.criteria.recognized ? 'Mình chưa hiểu rõ tiêu chí' :
            expected.rooms.length ? 'Tìm thấy ' + expected.rooms.length + ' phòng' : 'Chưa có phòng nào đồng thời khớp';
          check(response.textContent.includes(expectedIntro), mode + ' chat response/count mismatch: ' + prompt);
          const expectedIds = expected.rooms.slice(0, 5).map(r => r.id).join(',');
          const actualIds = [...response.querySelectorAll('button[onclick]')].map(b => {
            const match = b.getAttribute('onclick').match(/^aiGoToRoom\((\d+)\)$/);
            check(match, 'invalid chat room link');
            return Number(match[1]);
          }).join(',');
          check(actualIds === expectedIds, mode + ' chat combined filters/top-five mismatch');
          check(homeSnapshot() === homeFilters, mode + ' chat changed homepage filters');
          chatCases++;
        }
      }
      // Exercise a rendered result link and check the same filter isolation after navigation.
      const link = document.querySelector('#aiChatMessages button[onclick]');
      check(link, 'chat room link missing');
      const roomId = Number(link.getAttribute('onclick').match(/\d+/)[0]);
      const filtersBeforeLink = homeSnapshot();
      wheel(100);
      link.click();
      check(state.currentScreen === 1 && state.selectedRoomDetail.id === roomId, 'chat link opened wrong room');
      checkScrollReset('chat link retained scroll destination');
      check(homeSnapshot() === filtersBeforeLink, 'chat room navigation changed filters');
      check(errors.length === 0, 'runtime errors: ' + errors.join('; '));
      details.textContent += '; CHAT-CASES=' + chatCases + '; MAP/ZOOM/SCROLL/DRAG-CHECKS=OK';
      report('BROWSER-SMOKE-OK');
    }
    verifyChat().catch(e => report('BROWSER-SMOKE-FAIL: ' + e.message));
  } catch (e) {
    report('BROWSER-SMOKE-FAIL: ' + e.message);
  }
  })();
  </script>`;
  new Function(probe.replace(/^<script>\s*|\s*<\/script>$/g, ''));
  fs.writeFileSync(htmlFile, html.replace('</body>', probe + '\n</body>'));
  console.log('Starting real Edge: ' + edge);
  const result = spawnSync(edge, [
    '--headless=new', '--disable-gpu', '--disable-extensions', '--disable-background-networking',
    '--no-first-run', '--no-default-browser-check', '--no-sandbox',
    '--user-data-dir=' + path.join(dir, 'edge-profile'), '--virtual-time-budget=12000',
    '--dump-dom', new URL('file:///' + htmlFile.replace(/\\/g, '/')).href
  ], { encoding: 'utf8', timeout: 30000, maxBuffer: 8 * 1024 * 1024 });
  // Read the rendered result node, not the matching string inside the probe's source.
  assert.ifError(result.error);
  assert.equal(result.status, 0, `Edge exited with ${result.status}: ${result.stderr?.slice(-800)}`);
  const renderedResult = readBrowserResult(result.stdout);
  assert(renderedResult, `Edge returned no rendered smoke-test result: ${result.stderr?.slice(-800) || result.stdout?.slice(-500)}`);
  assert.equal(renderedResult, 'BROWSER-SMOKE-OK');
  const renderedDetails = result.stdout.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .match(/<pre id="browserSmokeDetails">([^<]+)<\/pre>/);
  assert(renderedDetails, 'Rendered coverage details missing');
  assert.equal(renderedDetails[1], 'RENDER-COUNT=132; CHAT-CASES=10; MAP/ZOOM/SCROLL/DRAG-CHECKS=OK');
  console.log('Edge exit code: ' + result.status + '; rendered result: ' + renderedResult);
  console.log(renderedDetails[1]);
  console.log('v11.2: Edge canvas desktop/mobile pan, zoom/reset, wheel/swipe scroll, pin zones, drag suppression, chat DOM OK');
} finally {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) { /* Edge may still be closing. */ }
}