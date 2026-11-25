'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), ts = require('typescript');
require('../scripts/build-isolated.cjs');
const root = path.resolve(__dirname, '..');
const source = p => fs.readFileSync(path.join(root, p), 'utf8');
function load(p, mocks = {}) {
  const m = { exports: {} };
  const compiled = ts.transpileModule(source(p), { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  vm.runInThisContext('(function(require,module,exports){' + compiled + '\n})')(id => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id === 'next/server') return require(id);
    if (id.startsWith('@/')) return load(id.slice(2) + '.ts', mocks);
    throw Error('Unexpected dependency: ' + id);
  }, m, m.exports);
  return m.exports;
}
const sales = load('lib/directSales.ts');
const api = load('lib/directSalesApi.ts');
process.env.CLOUDINARY_CLOUD_NAME = 'synthetic';
const photo = i => ({ url: `https://res.cloudinary.com/synthetic/image/upload/v1/newta/direct-sales/photo-${i}.jpg`, publicId: `newta/direct-sales/photo-${i}`, cover: i === 0 });
const body = n => ({ title: 'Synthetic excavator', referenceNumber: 'SYNTHETIC-ONLY', category: 'plant-machinery', status: 'Draft', portfolioId: '123456789012345678901234', description: 'Synthetic', specifications: 'Synthetic', location: 'Synthetic', askingPrice: '595000', closingSast: '2027-02-26T16:00', images: Array.from({ length: n }, (_, i) => photo(i)) });
const req = (data, method = 'POST', origin = 'https://newtacommercialsales.com') => new Request('https://newtacommercialsales.com/api/admin/direct-sales/assets', { method, headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(data) });
function routes(denied = false) {
  const calls = [];
  const mocks = {
    '@/lib/mongodb': { default: async () => { throw Error('Unexpected DB'); } },
    '@/models/DirectSaleAsset': { default: {} },
    '@/lib/directSalesSaveDb': { directSalesSaveModels: async () => { throw Error('Unexpected DB'); } },
    '@/lib/requireEnquiryAdmin': { requireEnquiryAdmin: async () => denied ? new Response(null, { status: 403 }) : null },
    '@/lib/directSalesAssetPortfolios': { saveAssetWithPortfolio: async (input, target) => { calls.push({ input, target }); return { ...input, _id: 'synthetic', slug: 'synthetic' }; } },
    '@/lib/directSalesPortfolioAdmin': { PortfolioApiError: class extends Error {} },
    '@/lib/slugify': { createEquipmentSlug: () => 'synthetic' },
  };
  return { calls, create: load('app/api/admin/direct-sales/assets/route.ts', mocks).POST,
    edit: load('app/api/admin/direct-sales/assets/[id]/route.ts', mocks).PUT };
}
test('shared photo limit is 50', () => assert.equal(sales.directSalePhotoLimit, 50));
for (const n of [0, 20, 26, 50, 51]) {
  test('asset validator photo boundary ' + n, () => {
    const input = body(n), snapshot = JSON.stringify(input), parsed = api.assetInput(input);
    assert.equal(!!parsed, n <= 50); assert.equal(JSON.stringify(input), snapshot);
    if (parsed) { assert.equal(parsed.images.length, n); assert.equal(parsed.askingPriceCents, 59500000); }
  });
  for (const mode of ['create', 'edit']) test(mode + ' route photo boundary ' + n, async () => {
    const r = routes(), data = { ...body(n), updatedAt: '2026-11-25T10:00:00.000Z' };
    const result = mode === 'create' ? await r.create(req(data)) : await r.edit(req(data, 'PUT'), { params: Promise.resolve({ id: '123456789012345678901234' }) });
    assert.equal(result.status, n <= 50 ? mode === 'create' ? 201 : 200 : 400);
    assert.equal(r.calls.length, n <= 50 ? 1 : 0);
    if (n > 50) assert.equal((await result.json()).error, sales.directSalePhotoLimitMessage);
    else assert.deepEqual(r.calls[0].input.images, data.images);
  });
}
for (const [name, change] of [
  ['no cover', b => b.images.forEach(x => x.cover = false)],
  ['two covers', b => b.images[1].cover = true],
  ['duplicate public ID', b => b.images[1] = { ...b.images[0], cover: false }],
  ['foreign origin', b => b.images[0].url = b.images[0].url.replace('res.cloudinary.com', 'example.invalid')],
  ['wrong cloud', b => b.images[0].url = b.images[0].url.replace('/synthetic/', '/foreign/')],
  ['wrong folder', b => b.images[0].publicId = 'equipment/photo-0'],
  ['ID mismatch', b => b.images[0].publicId += '-wrong'],
  ['URL query', b => b.images[0].url += '?token=synthetic'],
  ['invalid portfolio', b => b.portfolioId = 'invalid'],
]) test('security preserved: ' + name, () => { const b = body(26); change(b); assert.equal(api.assetInput(b), null); });
test('any one cover index and photo order are retained', () => {
  const b = body(50); b.images[0].cover = false; b.images[25].cover = true;
  assert.deepEqual(api.assetInput(b).images, b.images);
});
test('edit omission preserves assignment semantics and stale version validation', async () => {
  const r = routes(), b = body(26); delete b.portfolioId;
  assert.equal(Object.hasOwn(api.assetInput(b), 'portfolioId'), false);
  const response = await r.edit(req(b, 'PUT'), { params: Promise.resolve({ id: '123456789012345678901234' }) });
  assert.equal(response.status, 400); assert.equal(r.calls.length, 0);
});
for (const mode of ['create', 'edit']) for (const failure of ['unauthorized', 'foreign origin']) test(mode + ' rejects ' + failure + ' before save', async () => {
  const r = routes(failure === 'unauthorized'), b = { ...body(26), updatedAt: new Date().toISOString() };
  const request = req(b, mode === 'create' ? 'POST' : 'PUT', failure === 'foreign origin' ? 'https://example.invalid' : undefined);
  const response = mode === 'create' ? await r.create(request) : await r.edit(request, { params: Promise.resolve({ id: '123456789012345678901234' }) });
  assert.equal(response.status, 403); assert.equal(r.calls.length, 0);
});
test('body bound covers maximum valid fields, including fully escaped JSON', async () => {
  const b = body(50); b.title = 'T'.repeat(150); b.referenceNumber = 'R'.repeat(60);
  b.location = 'L'.repeat(120); b.description = '\u0001'.repeat(6000); b.specifications = '\u0001'.repeat(6000);
  b.images = b.images.map((x, i) => {
    const id = ('newta/direct-sales/' + String(i).padStart(3, '0')).padEnd(300, 'a');
    return { publicId: id, url: 'https://res.cloudinary.com/synthetic/image/upload/' + id + '.jpg', cover: i === 0 };
  });
  assert.ok(api.assetInput(b));
  // Encode each string code unit once, including controls, preserving JSON syntax.
  function escapedJson(value) {
    if (typeof value === 'string') return '"' + Array.from(value, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('') + '"';
    if (Array.isArray(value)) return '[' + value.map(escapedJson).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.entries(value).map(([k, v]) => escapedJson(k) + ':' + escapedJson(v)).join(',') + '}';
    return JSON.stringify(value);
  }
  const raw = escapedJson(b);
  assert.ok(Buffer.byteLength(raw) > 64000);
  assert.ok(Buffer.byteLength(raw) < sales.directSaleAssetBodyLimit);
  const request = new Request('https://example.invalid', { method: 'POST', headers: { 'content-type': 'application/json' }, body: raw });
  assert.ok(api.assetInput(await api.readJson(request, sales.directSaleAssetBodyLimit)));
  // Conservative bound for all text/URL/public-ID code units escaped as six ASCII bytes.
  const upperBound = 6 * (150 + 60 + 6000 + 6000 + 120 + 16 + 15 + 24 + 40 + 100 + 50 * 1300) + 10000;
  assert.ok(upperBound < sales.directSaleAssetBodyLimit);
});
test('oversized requests remain rejected', async () => {
  const request = new Request('https://example.invalid', { method: 'POST', body: 'x'.repeat(sales.directSaleAssetBodyLimit + 1), headers: { 'content-type': 'application/json' } });
  assert.equal(await api.readJson(request, sales.directSaleAssetBodyLimit), null);
});
function uploader(count, limited = true) {
  let images = Array.from({ length: count }, (_, i) => photo(i)), cover = 0, index = 0, uploads = 0;
  const states = [], refs = [];
  const react = {
    useRef: initial => { const i = index++; return refs[i] ??= { current: initial }; },
    useState: initial => { const i = index++; if (!(i in states)) states[i] = initial; return [states[i], value => states[i] = typeof value === 'function' ? value(states[i]) : value]; },
  };
  const jsx = (type, props) => ({ type, props });
  const Component = load('app/admin/components/equipment/ImageUploader.tsx', {
    react: { default: react }, 'react/jsx-runtime': { jsx, jsxs: jsx },
    'next/image': { default: 'Image' },
    'browser-image-compression': { default: async file => { uploads++; return file; } },
    '@/lib/cloudinaryImage': { cloudinaryImage: url => url },
  }).default;
  function render() { index = 0; return Component({ images, coverImage: cover, disabled: false, onUploadChange: () => {},
    setImages: f => images = f(images), setCoverImage: f => cover = typeof f === 'function' ? f(cover) : f,
    ...(limited ? { maxImages: sales.directSalePhotoLimit, limitMessage: sales.directSalePhotoLimitMessage, uploadUrl: '/api/admin/direct-sales/upload' } : {}) }); }
  function nodes(tree) { if (!tree || typeof tree !== 'object') return []; return [tree, ...[].concat(tree.props?.children ?? []).flatMap(nodes)]; }
  return { render, nodes, images: () => images, cover: () => cover, uploads: () => uploads };
}
test('Direct Sales counter and rejected upload preserve photos and cover', async () => {
  const u = uploader(26); const tree = u.render();
  assert.ok(u.nodes(tree).some(x => x.props?.['aria-live'] === 'polite' && x.props.children.join('') === '26/50 photographs'));
  const before = JSON.stringify(u.images());
  await u.nodes(tree).find(x => x.type === 'input').props.onChange({ target: { files: Array(25).fill(new Blob(['synthetic'])) } });
  assert.equal(u.uploads(), 0); assert.equal(JSON.stringify(u.images()), before); assert.equal(u.cover(), 0);
  assert.ok(u.nodes(u.render()).some(x => x.props?.role === 'alert' && x.props.children === sales.directSalePhotoLimitMessage));
});
test('50-photo boundary prevents another upload before compression or fetch', async () => {
  const u = uploader(50);
  await u.nodes(u.render()).find(x => x.type === 'input').props.onChange({ target: { files: [new Blob(['synthetic'])] } });
  assert.equal(u.uploads(), 0); assert.equal(u.images().length, 50);
});
test('ordinary Equipment remains uncapped without a counter', async () => {
  const u = uploader(51, false); const tree = u.render();
  assert.ok(!u.nodes(tree).some(x => x.props?.['aria-live'] === 'polite'));
  const oldFetch = global.fetch;
  global.fetch = async (url) => { assert.equal(url, '/api/upload'); return { ok: true, json: async () => ({ url: 'https://example.invalid/synthetic.jpg', publicId: 'synthetic' }) }; };
  try { await u.nodes(tree).find(x => x.type === 'input').props.onChange({ target: { files: [new Blob(['synthetic'])] } }); }
  finally { global.fetch = oldFetch; }
  assert.equal(u.uploads(), 1); assert.equal(u.images().length, 52);
});
test('existing cover, ordering and removal controls retain their behavior', () => {
  const u = uploader(26); let tree = u.render();
  u.nodes(tree).filter(x => x.type === 'button' && x.props.children === 'Make Cover')[4].props.onClick();
  assert.equal(u.cover(), 5); tree = u.render();
  u.nodes(tree).filter(x => x.type === 'button' && x.props.children === '→')[5].props.onClick();
  assert.equal(u.cover(), 6); assert.equal(u.images()[6].publicId, photo(5).publicId);
  const old = global.confirm; global.confirm = () => true;
  try { u.nodes(u.render()).filter(x => x.type === 'button' && x.props.children === 'Delete Image')[6].props.onClick(); }
  finally { global.confirm = old; }
  assert.equal(u.images().length, 25); assert.equal(u.cover(), 0);
});

test('Direct Sales accepts upload reaching exactly 50 and keeps its upload endpoint', async () => {
  const u = uploader(49), original = global.fetch;
  global.fetch = async (url) => { assert.equal(url, '/api/admin/direct-sales/upload'); return { ok: true, json: async () => photo(49) }; };
  try { await u.nodes(u.render()).find(x => x.type === 'input').props.onChange({ target: { files: [new Blob(['synthetic'])] } }); }
  finally { global.fetch = original; }
  assert.equal(u.uploads(), 1); assert.equal(u.images().length, 50); assert.equal(u.cover(), 0);
});
