// Node-only regression checks for the self-contained offline prototype.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { readBrowserResult } = require('./browser-result');

const successNode = '<pre id="browserSmokeResult">BROWSER-SMOKE-OK</pre>';
assert.equal(readBrowserResult(`<script>result = '${successNode}'</script>`), null);
assert.equal(readBrowserResult(`<script>result = '${successNode}'</script><pre id="browserSmokeResult">BROWSER-SMOKE-FAIL: drag failed</pre>`), 'BROWSER-SMOKE-FAIL: drag failed');
assert.equal(readBrowserResult(`<script>result = '${successNode}'</script>${successNode}`), 'BROWSER-SMOKE-OK');
assert.equal(readBrowserResult(successNode + successNode), null);

const html = fs.readFileSync(path.join(__dirname, '..', 'uninest_canvas_studio_v11.3.html'), 'utf8');
const slice = (start, end) => {
  const from = html.indexOf(start);
  const to = html.indexOf(end, from + start.length);
  assert(from >= 0 && to > from, `Missing source section: ${start} → ${end}`);
  return html.slice(from, to);
};
for (const [, script] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
  if (script.trim()) new Function(script);
}
assert.equal((html.match(/function drawCityMapBackground\s*\(/g) || []).length, 1);
assert.equal((html.match(/let mapPinViewport\s*=/g) || []).length, 1);
assert.equal((html.match(/<div\b/g) || []).length, (html.match(/<\/div>/g) || []).length);

const data = slice('const PROVINCES_CITIES_LIST =', 'const MOCK_ACCOUNTS =') +
  slice('const ROOMS_DATABASE =', 'const LANDLORD_ROOMS_DATA =');
const distance = slice('function mapDistanceKm(', '// Danh sách phòng gần nhất tính từ 1 vị trí');
const ai = slice('function aiNormalize(', 'function aiGoToRoom(');
const { parseAiRequest, aiFindRooms, aiEscape, rooms, universities, state, aiSearchRooms } =
  new Function(`'use strict'; ${data}\n${distance}\n${ai}\n` +
    `const state = { showAllRooms: false, appliedFilters: { selectedCity: 'Hồ Chí Minh' }, selectedAmenities: [] };` +
    `return {parseAiRequest, aiFindRooms, aiEscape, aiSearchRooms, rooms: ROOMS_DATABASE, universities: UNIVERSITIES_LIST, state};`)();
assert.equal(rooms.length, 32);
const ids = new Set(universities.map(u => u.id));
assert(rooms.every(r => ids.has(r.universityTag) && r.mapCoord && r.nearbyFood && r.amenities));

const before = JSON.stringify(state);
const combined = aiFindRooms('Khu Quận 10 TP.HCM gần UEH dưới 3 triệu có xe buýt và quán cơm');
assert.equal(combined.criteria.city, 'Hồ Chí Minh');
assert.equal(combined.criteria.area, 'Q.10');
assert.deepEqual(combined.criteria.universities, ['ueh_b', 'ueh_a']);
assert.equal(combined.criteria.maxPrice, 3000000);
assert(combined.rooms.length > 0);
assert(combined.rooms.every(r => r.city === 'Hồ Chí Minh' &&
  combined.criteria.universities.includes(r.universityTag) &&
  `${r.title} ${r.landlord} ${r.feedback}`.includes('Q.10') && r.priceNum <= 3000000 &&
  r.amenities.includes('bus') && r.nearbyFood.quanCom));
assert.equal(JSON.stringify(state), before, 'AI must not modify the homepage filters');

assert.equal(parseAiRequest('phòng từ 2,5 đến 3,5 triệu').minPrice, 2500000);
assert.equal(parseAiRequest('phòng từ 2,5 đến 3,5 triệu').maxPrice, 3500000);
assert.equal(parseAiRequest('gần trạm buýt dưới 300m').busMeters, 300);
assert.equal(parseAiRequest('gần UEH 2 km').nearKm, 2);
for (const prompt of ['gần trạm buýt dưới 300m', 'gần trạm buýt dưới 300 mét', 'gần UEH dưới 2 km', 'gần UEH từ 1 đến 2 km', 'cách trường tối đa 500m']) {
  const criteria = parseAiRequest(prompt);
  assert.equal(criteria.minPrice, null, `${prompt}: distance is not a minimum price`);
  assert.equal(criteria.maxPrice, null, `${prompt}: distance is not a maximum price`);
}
const priceAndDistance = parseAiRequest('gần UEH dưới 2 km, trạm buýt dưới 300m, giá dưới 3 triệu');
assert.equal(priceAndDistance.nearKm, 2);
assert.equal(priceAndDistance.busMeters, 300);
assert.equal(priceAndDistance.maxPrice, 3000000);
assert.equal(parseAiRequest('dưới 900k').maxPrice, 900000);
assert.equal(parseAiRequest('giá dưới 3000000 đồng').maxPrice, 3000000);
assert.equal(parseAiRequest('giá từ 900k đến 1,5 triệu').minPrice, 900000);
assert.equal(parseAiRequest('giá từ 900k đến 1,5 triệu').maxPrice, 1500000);
assert(!parseAiRequest('gần trạm buýt 300m').notes.some(n => n.includes('số tuyến')));
assert.equal(parseAiRequest('Phòng gần NEU, Hà Nội').universities[0], 'neu');
assert.deepEqual(parseAiRequest('UEH cơ sở A').universities, ['ueh_a']);
assert.deepEqual(parseAiRequest('UEH CS B').universities, ['ueh_b']);
assert(aiFindRooms('Cần Thơ gần Đại học Cần Thơ dưới 3 triệu').rooms.length > 0);
assert(aiFindRooms('gần UEH 2 km').rooms.every(r => r.city === 'Hồ Chí Minh'));
assert(aiFindRooms('Đà Nẵng dưới 1 triệu có hồ bơi và thang máy').rooms.length === 0);
assert.equal(parseAiRequest('phi thuyền trên mặt trăng').recognized, false);
assert(parseAiRequest('UEH có máy lạnh').notes.some(n => n.includes('máy lạnh')));
assert(parseAiRequest('gần trạm bus 150').notes.some(n => n.includes('số tuyến')));
assert.equal(aiFindRooms('tất cả phòng').rooms.length, 32);
assert.equal(aiSearchRooms('tất cả phòng').length, 5);
assert.equal(aiEscape(`<img src="x" onerror='alert(1)'>&`), '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt;&amp;');

// Roommate matching: candidates, real shared interests, gender and interest filters.
const candidateSource = slice('const MATCH_INTERESTS =', 'function computeMatchScore(');
const rankingSource = slice('function getRankedCandidates()', 'const LIFESTYLE_QUESTIONS =');
const lifestyleProfile = slice('const MY_MATCH_PROFILE =', 'const MY_MATCH_INTERESTS =');
const matchingApi = new Function(`${candidateSource}\nreturn { CANDIDATES, MATCH_INTERESTS };`)();
const matchingState = { myMatchInterests: ['study', 'cooking', 'quiet'], quizCompleted: false,
  myLifestyleAnswers: null, matchGenderFilter: 'all', matchInterestFilter: 'all' };
const getRanked = new Function('state', 'CANDIDATES', 'MY_MATCH_PROFILE', 'computeMatchScore', 'scoreColorFor',
  `${rankingSource}\nreturn getRankedCandidates;`)(
    matchingState, matchingApi.CANDIDATES, new Function(`${lifestyleProfile}\nreturn MY_MATCH_PROFILE;`)(),
    (mine, theirs) => Math.round(Object.keys(mine).filter(k => mine[k] === theirs[k]).length / Object.keys(mine).length * 100),
    score => score >= 90 ? '#059669' : score >= 80 ? '#0D9488' : '#D97706');
assert(matchingApi.CANDIDATES.length >= 20, 'candidate list expanded');
assert.equal(new Set(matchingApi.CANDIDATES.map(c => c.name)).size, matchingApi.CANDIDATES.length, 'candidate names unique');
assert(matchingApi.CANDIDATES.every(c => ['male', 'female'].includes(c.gender) && c.interests.length), 'candidate profiles include gender and interests');
assert(matchingApi.CANDIDATES.some(c => c.gender === 'male') && matchingApi.CANDIDATES.some(c => c.gender === 'female'));
const allMatches = getRanked();
assert(allMatches.length > 5, 'all compatible candidates are shown');
assert(allMatches.every(c => c.sharedInterests.length > 0 && c.sharedInterests.every(id => matchingState.myMatchInterests.includes(id) && c.interests.includes(id))));
matchingState.matchGenderFilter = 'female';
const femaleMatches = getRanked();
assert(femaleMatches.length > 0 && femaleMatches.every(c => c.gender === 'female'), 'female filter returns compatible women only');
matchingState.matchGenderFilter = 'male';
const maleMatches = getRanked();
assert(maleMatches.length > 0 && maleMatches.every(c => c.gender === 'male'), 'male filter returns compatible men only');
matchingState.matchGenderFilter = 'all';
matchingState.myMatchInterests = ['study', 'cooking', 'quiet', 'sports'];
matchingState.matchInterestFilter = 'sports';
const sportsMatches = getRanked();
assert(sportsMatches.length > 0 && sportsMatches.every(c => c.interests.includes('sports') && c.sharedInterests.includes('sports')),
  'selected interest filters candidates but does not fabricate shared interests');
matchingState.matchInterestFilter = 'all';
matchingState.myMatchInterests = [];
assert.deepEqual(getRanked(), [], 'empty interest profile has no compatible candidates');
assert.match(html, /drawMatchFilters\(56, filterBoxY \+ 61, boxW - 32, false\)/);
assert.match(html, /Math\.max\(filterY \+ 290, filterY \+ used \+ 30\)/, 'mobile card start follows the filter content');

// Current and target positions must agree after direct manipulation/reset.
const scrollSource = slice('function tickSmoothMotion(', 'function shouldKeepAnimating(');
for (const reducedMotion of [false, true]) {
  const scrollState = { desktopScrollY: 0, desktopScrollTarget: 0, desktopMaxScroll: 250,
    mobileScrollY: 0, mobileScrollTarget: 0, mobileMaxScroll: 160 };
  let animations = 0;
  const scroll = new Function('state', 'REDUCED_MOTION', 'bumpAnim', 'lerp',
    `${scrollSource}; return {setCanvasScroll, resetCanvasScroll, tickSmoothMotion};`)(
      scrollState, reducedMotion, () => animations++, (a, b, k) => a + (b - a) * k);
  for (const mode of ['desktop', 'mobile']) {
    scrollState.viewMode = mode;
    const current = mode + 'ScrollY', target = mode + 'ScrollTarget', max = mode + 'MaxScroll';
    scroll.setCanvasScroll(100, true);
    assert.equal(scrollState[current], 100);
    assert.equal(scrollState[target], 100);
    scrollState[target] = scrollState[max]; // A pending smooth-scroll destination.
    scroll.setCanvasScroll(-20, true);
    assert.equal(scrollState[current], 80);
    assert.equal(scrollState[target], 80, 'Dragging cancels the old smooth destination');
    scroll.setCanvasScroll(30, false);
    assert.equal(scrollState[target], 110);
    assert.equal(scrollState[current], reducedMotion ? 110 : 80);
    for (let i = 0; i < 40; i++) scroll.tickSmoothMotion();
    assert.equal(scrollState[current], 110);
    scroll.setCanvasScroll(9999, true);
    assert.equal(scrollState[current], scrollState[max]);
    assert.equal(scrollState[target], scrollState[max]);
    scroll.setCanvasScroll(-9999, true);
    assert.equal(scrollState[current], 0);
    assert.equal(scrollState[target], 0);
  }
  assert(animations > 0);
  scrollState.desktopScrollY = 100; scrollState.desktopScrollTarget = 200;
  scrollState.mobileScrollY = 50; scrollState.mobileScrollTarget = 150;
  scroll.resetCanvasScroll();
  scroll.tickSmoothMotion();
  assert.equal(scrollState.desktopScrollY + scrollState.desktopScrollTarget +
    scrollState.mobileScrollY + scrollState.mobileScrollTarget, 0);
}
// Filter/navigation callbacks must use the helper, not reset only the current value.
assert.equal((html.match(/state\.desktopScrollY = 0;/g) || []).length, 1);
assert.equal((html.match(/state\.mobileScrollY = 0;/g) || []).length, 1);

const map = slice('let mapPinViewport = null;', 'function drawScreen6_Overview(');
const drawing = [];
const ctx = new Proxy({}, { get(target, key) {
  if (key === 'measureText') return text => ({ width: text.length * 5 });
  if (key === 'fillRect') return (...rect) => drawing.push(rect);
  return target[key] ?? (() => {});
}, set(target, key, value) { target[key] = value; return true; } });
let zones = [];
const mapState = { viewMode: 'desktop', mobileScrollY: 0 };
const mapApi = new Function('ctx', 'state', 'registerClickZone', 'drawRoundedRect', 'getCityMapTheme',
  `${map} return {drawCityMapBackground, drawMapPin, mapHash, setViewport(v) { mapPinViewport = v; }};`)(
    ctx, mapState, (x, y, w, h, cb, label) => zones.push({ x, y, w, h, cb, label }),
    () => {}, city => ({ road1: city, road2: 'Phố mẫu', park: 'Công viên mẫu' }));
for (const [x, y] of [[0, 0], [10000, -20000], [-500000, 700000]]) {
  drawing.length = 0;
  mapApi.drawCityMapBackground(40, 164, 980, 680, 'Hồ Chí Minh', x, y);
  assert(drawing.some(([rx, ry, w, h]) => rx === 40 && ry === 164 && w === 980 && h === 680), 'No blank background after panning');
  assert(drawing.length < 1000, 'Draw only visible blocks');
}
assert.equal(mapApi.mapHash(8, 5, 3), mapApi.mapHash(8, 5, 3));
mapApi.setViewport({ x: 40, y: 164, w: 980, h: 680, offsetX: 120, offsetY: -20 });
mapApi.drawMapPin(200, 350, 'Phòng mẫu', '#000', '🏠', () => {});
assert.equal(zones.length, 1);
assert(zones[0].x <= 320 && 320 <= zones[0].x + zones[0].w);
zones = [];
mapApi.setViewport({ x: 40, y: 164, w: 980, h: 680, offsetX: -3000, offsetY: 0 });
mapApi.drawMapPin(200, 350, 'Ẩn', '#000', '🏠', () => {});
assert.equal(zones.length, 0, 'Hidden pins must not catch clicks');

console.log('v11.3: syntax, data, AI filters/escaping, roommate candidate/gender/interest matching, scroll synchronization, map pan/pin zones OK');