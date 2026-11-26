'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), ts = require('typescript');
require('../scripts/build-isolated.cjs');
const root = path.resolve(__dirname, '..');
function load(p, mocks = {}) {
  const m = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, p), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInThisContext('(function(require,module,exports){' + code + '\n})')(id => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id === 'next/server') return require(id);
    if (id.startsWith('@/')) return load(id.slice(2) + '.ts', mocks);
    throw Error('Unexpected dependency: ' + id);
  }, m, m.exports); return m.exports;
}
const sales = load('lib/directSales.ts'), api = load('lib/directSalesApi.ts');
const body = extra => ({ title: 'Synthetic', referenceNumber: 'SYNTHETIC', category: 'plant-machinery', status: 'Draft', images: [], ...extra });
for (const [name, extra, valid] of [
  ['legacy omission', {}, true], ['empty', { subcategory: '' }, true],
  ['construction', { subcategory: 'construction-equipment' }, true],
  ['wrong parent', { subcategory: 'truck-tractors' }, false],
  ['display name rejected', { subcategory: 'Construction Equipment' }, false],
  ['no configured children', { category: 'mining-equipment', subcategory: '' }, true],
  ['unsupported child', { category: 'mining-equipment', subcategory: 'cranes' }, false],
  ['null', { subcategory: null }, false], ['object', { subcategory: {} }, false],
  ['overlong', { subcategory: 'a'.repeat(101) }, false],
]) test('API subcategory: ' + name, () => {
  const data = body(extra), before = JSON.stringify(data), result = api.assetInput(data);
  assert.equal(!!result, valid); assert.equal(JSON.stringify(data), before);
  if (valid) assert.equal(Object.hasOwn(result, 'subcategory'), Object.hasOwn(extra, 'subcategory'));
});
test('every configured category/subcategory slug pair is accepted unchanged', () => {
  for (const c of sales.directSaleCategories) for (const sub of c.subcategories) {
    const parsed = api.assetInput(body({ category: c.slug, subcategory: sub.slug }));
    assert.equal(parsed.category, c.slug); assert.equal(parsed.subcategory, sub.slug);
  }
});
class ApiError extends Error { constructor(status, message) { super(message); this.status = status; } }
function saveFixture(existing, stale = false) {
  const writes = [], locks = [], session = {}, database = { assets: {
    findOneAndUpdate: (filter, update, options) => {
      writes.push({ filter, update, options });
      if (writes.length === 1) return { lean: async () => stale ? null : existing };
      return Promise.resolve({ ...existing, ...update.$set });
    }, findById: () => ({ session: () => ({ maxTimeMS: () => ({ select: () => ({ lean: async () => ({ _id: 'synthetic' }) }) }) }) }),
    create: async (docs, options) => { writes.push({ docs, options }); return docs; },
  } };
  const f = load('lib/directSalesAssetPortfolios.ts', {
    mongoose: { mongo: { ObjectId: class { constructor(value) { this.value = value; } } } },
    '@/lib/directSalesPortfolioAdmin': { PortfolioApiError: ApiError },
    '@/lib/directSalesPortfolioDb': { portfolioDatabase: async () => database,
      withPortfolioTransaction: async (db, fn) => { assert.equal(db, database); return fn(session); },
      lockPortfolios: async (db, ids, s) => { assert.equal(s, session); locks.push(ids); },
    },
  }).saveAssetWithPortfolio;
  return { writes, locks, session, f };
}
for (const [name, stored, extra, expected, status] of [
  ['older client retains stored', 'construction-equipment', {}, 'construction-equipment'],
  ['legacy missing remains missing', undefined, {}, undefined],
  ['explicit clear', 'construction-equipment', { subcategory: '' }, ''],
  ['explicit edit', 'construction-equipment', { subcategory: 'cranes' }, 'cranes'],
  ['category and subcategory change', 'construction-equipment', { category: 'commercial-vehicles', subcategory: 'truck-tractors' }, 'truck-tractors'],
  ['category change without clearing', 'construction-equipment', { category: 'mining-equipment' }, undefined, 400],
  ['category change with explicit clear', 'construction-equipment', { category: 'mining-equipment', subcategory: '' }, ''],
]) test('transaction edit: ' + name, async () => {
  const old = { category: 'plant-machinery', ...(stored === undefined ? {} : { subcategory: stored }), portfolioId: undefined, title: 'Original', description: 'Preserved by normal form', images: [] };
  const x = saveFixture(old), input = api.assetInput(body(extra)), target = { id: '123456789012345678901234', updatedAt: new Date('2026-11-26T10:00:00Z') };
  if (status) { await assert.rejects(x.f(input, target), e => e.status === status); assert.equal(x.writes.length, 1); return; }
  const result = await x.f(input, target); assert.equal(result.subcategory, expected);
  assert.equal(x.writes[0].filter.updatedAt, target.updatedAt);
  assert.equal(x.writes[1].filter.updatedAt, target.updatedAt);
  assert.equal(x.writes[1].options.session, x.session); assert.equal(x.writes[1].options.runValidators, true);
  assert.equal(Object.hasOwn(x.writes[1].update.$set, 'subcategory'), Object.hasOwn(extra, 'subcategory'));
});
for (const extra of [{}, { subcategory: '' }, { subcategory: 'construction-equipment' }]) test('transaction create ' + JSON.stringify(extra), async () => {
  const x = saveFixture(null), result = await x.f(api.assetInput(body(extra)), { slug: 'synthetic' });
  assert.equal(result.subcategory, extra.subcategory); assert.equal(x.writes[0].options.session, x.session);
});
test('stale edits still fail before the final write', async () => {
  const x = saveFixture({}, true);
  await assert.rejects(x.f(api.assetInput(body()), { id: '123456789012345678901234', updatedAt: new Date() }), e => e.status === 409);
  assert.equal(x.writes.length, 1);
});
const jsx = (type, props) => ({ type, props });
function nodes(v) { if (Array.isArray(v)) return v.flatMap(nodes); return !v || typeof v !== 'object' ? [] : [v, ...[].concat(v.props?.children ?? []).flatMap(nodes)]; }
async function page(params, rows = []) {
  let query, skip;
  const component = load('app/direct-sales/page.tsx', {
    'react/jsx-runtime': { jsx, jsxs: jsx }, 'next/link': { default: 'Link' },
    '@/app/components/Navbar': { default: 'Navbar' }, '@/app/components/Footer': { default: 'Footer' },
    '@/lib/directSalesPublicPortfolios': { eligiblePublicPortfolios: async () => [], portfolioPath: x => x },
    '@/lib/mongodb': { default: async () => {} },
    '@/models/DirectSaleAsset': { default: { find: q => { query = q; const chain = { select: () => chain, sort: () => chain,
      skip: n => { skip = n; return chain; }, limit: () => chain, lean: async () => rows }; return chain; } } },
    './AssetCard': { default: 'AssetCard' },
  }).default;
  return { tree: await component({ searchParams: Promise.resolve(params) }), query, skip };
}
for (const [params, expected] of [
  [{}, {}], [{ category: 'plant-machinery' }, { category: 'plant-machinery' }],
  [{ category: 'plant-machinery', subcategory: 'cranes' }, { category: 'plant-machinery', subcategory: 'cranes' }],
  [{ category: 'plant-machinery', subcategory: 'truck-tractors' }, { category: 'plant-machinery' }],
  [{ subcategory: 'cranes' }, {}], [{ category: { $ne: null }, subcategory: { $ne: null } }, {}],
]) test('public filter query ' + JSON.stringify(params), async () => {
  const { query } = await page(params); assert.equal(query.status, 'Published'); assert.ok(query.$or);
  const { status, $or, ...actual } = query; assert.deepEqual(actual, expected);
});
test('pagination retains both filters; changing filters starts at page 1', async () => {
  const result = await page({ category: 'plant-machinery', subcategory: 'cranes', page: '2' }, Array.from({ length: 25 }, (_, i) => ({ _id: i })));
  assert.equal(result.skip, 24);
  const links = nodes(result.tree).filter(x => x.type === 'Link');
  assert.ok(links.some(x => x.props.href === '/direct-sales?category=plant-machinery&subcategory=cranes&page=3'));
  assert.ok(links.some(x => x.props.href === '/direct-sales?category=plant-machinery&subcategory=cranes'));
  assert.ok(links.some(x => x.props.href === '/direct-sales?category=plant-machinery&subcategory=construction-equipment'));
});
test('model field is optional and no index change is introduced', () => {
  const s = fs.readFileSync(path.join(root, 'models/DirectSaleAsset.ts'), 'utf8');
  assert.match(s, /subcategory: \{ type: String, default: undefined \}/);
  assert.equal((s.match(/schema\.index\(/g) || []).length, 2);
});
function admin(asset) {
  const states = [], refs = []; let stateIndex, refIndex;
  if (asset) { states[0] = [asset]; states[8] = false; }
  states[12] = false;
  const Component = load('app/admin/(protected)/direct-sales/AssetManager.tsx', {
    react: { useEffect: () => {}, useState: initial => { const i = stateIndex++; if (!(i in states)) states[i] = initial;
      return [states[i], value => states[i] = typeof value === 'function' ? value(states[i]) : value]; },
      useRef: initial => refs[refIndex++] ??= { current: initial } },
    'react/jsx-runtime': { jsx, jsxs: jsx }, 'next/link': { default: 'Link' },
    '@/app/admin/components/equipment/ImageUploader': { default: 'Uploader' },
  }).default;
  const render = () => { stateIndex = 0; refIndex = 0; return Component(); };
  const select = (tree, name) => nodes(nodes(tree).find(n => n.type === 'label' && [].concat(n.props.children)[0] === name)).find(n => n.type === 'select');
  return { render, select, states };
}
test('dependent Admin dropdown uses slugs, remains optional and clears incompatible parents', () => {
  const a = admin(); let tree = a.render();
  assert.equal(a.select(tree, 'Subcategory (optional)').props.disabled, true);
  a.select(tree, 'Category').props.onChange({ target: { value: 'plant-machinery' } }); tree = a.render();
  let sub = a.select(tree, 'Subcategory (optional)'); assert.equal(sub.props.disabled, false); assert.equal(sub.props.required, undefined);
  assert.ok(nodes(sub).some(n => n.type === 'option' && n.props.value === 'construction-equipment'));
  sub.props.onChange({ target: { value: 'construction-equipment' } });
  assert.equal(a.select(a.render(), 'Subcategory (optional)').props.value, 'construction-equipment');
  a.select(a.render(), 'Category').props.onChange({ target: { value: 'commercial-vehicles' } });
  assert.equal(a.select(a.render(), 'Subcategory (optional)').props.value, '');
});
for (const clear of [false, true]) test('Admin edit reloads subcategory and sends only explicit changes: clear=' + clear, async () => {
  const record = { _id: '123456789012345678901234', slug: 'synthetic', title: 'Synthetic', referenceNumber: 'SYNTHETIC',
    category: 'plant-machinery', subcategory: 'construction-equipment', description: 'Description', specifications: 'Specs',
    location: 'Synthetic', askingPriceCents: 59500000, closesAt: null, status: 'Draft', updatedAt: new Date().toISOString(), images: [{ url: 'synthetic', publicId: 'synthetic', cover: true }] };
  const a = admin(record); let tree = a.render();
  const text = v => Array.isArray(v) ? v.map(text).join('') : typeof v === 'string' ? v : !v || typeof v !== 'object' ? '' : [].concat(v.props?.children ?? []).map(text).join('');
  nodes(tree).find(n => n.type === 'button' && text(n) === 'Edit').props.onClick(); tree = a.render();
  assert.equal(a.select(tree, 'Subcategory (optional)').props.value, record.subcategory);
  if (clear) { a.select(tree, 'Subcategory (optional)').props.onChange({ target: { value: '' } }); tree = a.render(); }
  const original = global.fetch; let sent;
  global.fetch = async (url, options) => { assert.equal(options.method, 'PUT'); sent = JSON.parse(options.body); return { ok: false, status: 400, headers: new Headers({ 'content-type': 'application/json' }), json: async () => ({ error: 'Synthetic rejection' }) }; };
  try { await nodes(tree).find(n => n.type === 'form').props.onSubmit({ preventDefault() {} }); } finally { global.fetch = original; }
  assert.equal(Object.hasOwn(sent, 'subcategory'), clear); if (clear) assert.equal(sent.subcategory, '');
  assert.deepEqual(sent.images, record.images); assert.equal(sent.askingPrice, '595000.00');
  assert.equal(sent.description, record.description); assert.equal(sent.specifications, record.specifications);
});
