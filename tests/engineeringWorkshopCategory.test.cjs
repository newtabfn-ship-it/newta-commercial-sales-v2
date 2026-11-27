'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), cp = require('node:child_process'), ts = require('typescript');
require('../scripts/build-isolated.cjs');
const root = path.resolve(__dirname, '..');
const slug = 'engineering-workshop-machinery', seo = slug + '-for-sale-south-africa', route = '/equipment/' + seo, url = 'https://newtacommercialsales.com' + route;
const label = 'Engineering & Workshop Machinery';
function load(p, mocks = {}, raw) {
  const m = { exports: {} }, source = raw ?? fs.readFileSync(path.join(root, p), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInThisContext('(function(require,module,exports){' + code + '\n})')(id => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id === 'next/server') return require(id);
    if (id.startsWith('@/')) return load(id.slice(2) + '.ts', mocks);
    throw Error('Unexpected dependency: ' + id);
  }, m, m.exports); return m.exports;
}
const jsx = (type, props) => ({ type, props });
function nodes(v) { if (Array.isArray(v)) return v.flatMap(nodes); return !v || typeof v !== 'object' ? [] : [v, ...nodes(v.props?.children)]; }
const text = v => Array.isArray(v) ? v.map(text).join('') : typeof v === 'string' ? v : v && typeof v === 'object' ? text(v.props?.children) : '';
const basic = { 'react/jsx-runtime': { jsx, jsxs: jsx }, 'next/link': { default: 'Link' }, '@/app/components/Navbar': { default: 'Navbar' }, '@/app/components/Footer': { default: 'Footer' }, '@/app/components/EquipmentCard': { default: 'Card' }, '@/lib/mongodb': { default: async () => {} } };
const categories = load('app/data/categories.ts').equipmentCategories;
test('one new subcategory only; every existing taxonomy entry is unchanged', () => {
  const baseline = cp.execFileSync('git', ['show', '12e06c199d3105b65b2567c2225c9c9d35d57caf:app/data/categories.ts'], { cwd: root, encoding: 'utf8' });
  const old = load('app/data/categories.ts', {}, baseline).equipmentCategories;
  assert.deepEqual(categories.map(c => ({ ...c, subcategories: c.subcategories.filter(s => s.slug !== slug) })), old);
  const entries = categories.flatMap(c => c.subcategories.filter(s => s.slug === slug)); assert.equal(entries.length, 1);
  assert.deepEqual(entries[0], { name: label, slug, seoSlug: seo });
});
for (const editing of [false, true]) test('Equipment Admin ' + (editing ? 'edit' : 'create') + ' exposes the new display-name option', () => {
  const states = []; let i = 0;
  const react = { useEffect: () => {}, useRef: v => ({ current: v }), useState: init => { const n = i++; if (!(n in states)) states[n] = init; return [states[n], v => states[n] = typeof v === 'function' ? v(states[n]) : v]; } };
  const Form = load('app/admin/components/equipment/EquipmentForm.tsx', { ...basic, react, './ImageUploader': { default: 'Uploader' } }).default;
  const render = () => { i = 0; return Form({ onSuccess() {}, equipmentId: editing ? 'synthetic' : null, isEditing: editing, onBusyChange() {} }); };
  render(); states[0] = { ...states[0], category: 'Plant & Machinery', subcategory: editing ? label : '' };
  const tree = render(), select = nodes(tree).find(n => n.type === 'select' && n.props.name === 'subcategory');
  assert.ok(nodes(select).some(n => n.type === 'option' && n.props.value === label));
  if (editing) assert.equal(select.props.value, label);
  const { validateEquipmentClassification } = load('lib/equipmentPublishing.ts');
  assert.equal(validateEquipmentClassification({ category: 'Plant & Machinery', subcategory: label }), null);
});
for (const editing of [false, true]) test('Direct Sales Admin ' + (editing ? 'edit' : 'create') + ' exposes slug and validates it', () => {
  const states = []; let i = 0;
  const react = { useEffect: () => {}, useRef: v => ({ current: v }), useState: init => { const n = i++; if (!(n in states)) states[n] = init; return [states[n], v => states[n] = typeof v === 'function' ? v(states[n]) : v]; } };
  const Form = load('app/admin/(protected)/direct-sales/AssetManager.tsx', { ...basic, react, '@/app/admin/components/equipment/ImageUploader': { default: 'Uploader' } }).default;
  const render = () => { i = 0; return Form(); }; render();
  states[2] = { ...states[2], category: 'plant-machinery', subcategory: editing ? slug : '' };
  const select = nodes(nodes(render()).find(n => n.type === 'label' && text(n).startsWith('Subcategory (optional)'))).find(n => n.type === 'select');
  assert.ok(nodes(select).some(n => n.type === 'option' && n.props.value === slug));
  if (editing) assert.equal(select.props.value, slug);
  const { assetInput } = load('lib/directSalesApi.ts');
  const input = assetInput({ title: 'Synthetic', referenceNumber: 'Synthetic', category: 'plant-machinery', subcategory: slug, status: 'Draft', images: [] });
  assert.equal(input.subcategory, slug);
});
for (const populated of [false, true]) test('SEO page metadata, exact inventory query and JSON-LD; populated=' + populated, async () => {
  const records = populated ? [{ _id: 'synthetic', title: 'Synthetic lathe </script>', slug: 'synthetic-lathe', price: '1000', currency: 'ZAR', status: 'Available', images: [], kmHours: '10', usageUnit: 'hours' }] : [];
  let query;
  const Page = load('app/equipment/' + seo + '/page.tsx', { ...basic, '@/models/Equipment': { default: { find: q => { query = q; return { sort: () => ({ lean: async () => records }) }; } } } });
  assert.equal(Page.metadata.title, 'Engineering & Workshop Machinery for Sale South Africa');
  assert.equal(Page.metadata.alternates.canonical, url); assert.equal(Page.metadata.openGraph.url, url);
  const tree = await Page.default();
  assert.deepEqual(query, { category: 'Plant & Machinery', subcategory: label, status: 'Available' });
  const scripts = nodes(tree).filter(n => n.type === 'script'); assert.equal(scripts.length, 2);
  const parsed = scripts.map(n => { assert.ok(!n.props.dangerouslySetInnerHTML.__html.includes('</script>')); return JSON.parse(n.props.dangerouslySetInnerHTML.__html); });
  assert.equal(parsed[0]['@type'], 'CollectionPage'); assert.equal(parsed[0].mainEntity.numberOfItems, records.length);
  assert.equal(parsed[1]['@type'], 'BreadcrumbList'); assert.equal(parsed[1].itemListElement.at(-1).item, url);
  const cards = nodes(tree).filter(n => n.type === 'Card'); assert.equal(cards.length, records.length);
  if (populated) { assert.equal(cards[0].props.slug, 'synthetic-lathe'); assert.equal(cards[0].props.price, 'ZAR 1000'); assert.equal(cards[0].props.usageUnit, 'hours'); }
  else assert.ok(text(tree).includes('No engineering or workshop machinery currently available'));
});
test('Plant landing page inherits the new category card', async () => {
  const Page = load('app/equipment/plant-machinery-for-sale-south-africa/page.tsx', { ...basic,
    '../../components/Navbar': { default: 'Navbar' }, '../../components/Footer': { default: 'Footer' }, '../../components/EquipmentCard': { default: 'Card' },
    '@/models/Equipment': { default: { find: () => ({ sort: () => ({ lean: async () => [] }) }) } },
  }).default;
  assert.ok(nodes(await Page()).some(n => n.type === 'Link' && n.props.href === route));
});
test('public Equipment catalogue links to the new filtered SEO inventory', async () => {
  const Page = load('app/equipment/page.tsx', { ...basic,
    '../components/Navbar': { default: 'Navbar' }, '../components/Footer': { default: 'Footer' }, '../components/EquipmentCard': { default: 'Card' },
    '../components/MobileActionBar': { default: 'MobileActionBar' }, '@/app/components/EnquiryButton': { default: 'EnquiryButton' },
    '@/models/Equipment': { default: { countDocuments: async () => 0, find: () => ({ sort: () => ({ lean: async () => [] }) }) } },
  }).default;
  assert.ok(nodes(await Page()).some(n => n.type === 'Link' && n.props.href === route));
});
test('Direct Sales public filter uses the new slug, preserves pagination, and still requires Published', async () => {
  let query;
  const Page = load('app/direct-sales/page.tsx', { ...basic, './AssetCard': { default: 'AssetCard' },
    '@/lib/directSalesPublicPortfolios': { eligiblePublicPortfolios: async () => [], portfolioPath: s => s },
    '@/models/DirectSaleAsset': { default: { find: q => { query = q; const chain = { select: () => chain, sort: () => chain, skip: () => chain, limit: () => chain, lean: async () => [] }; return chain; } } },
  }).default;
  const tree = await Page({ searchParams: Promise.resolve({ category: 'plant-machinery', subcategory: slug, page: '2' }) });
  assert.equal(query.category, 'plant-machinery'); assert.equal(query.subcategory, slug); assert.equal(query.status, 'Published'); assert.ok(query.$or);
  assert.ok(nodes(tree).some(n => n.type === 'Link' && text(n) === 'Previous page' && n.props.href === '/direct-sales?category=plant-machinery&subcategory=' + slug));
});
test('desktop and mobile menus expose all Plant categories and existing links', () => {
  let open = false;
  const Nav = load('app/components/Navbar.tsx', { ...basic, 'next/image': { default: 'Image' }, react: { useState: () => [open, v => open = v] } }).default;
  let tree = Nav(); assert.equal(nodes(tree).filter(n => n.type === 'Link' && n.props.href === route).length, 1);
  const summary = nodes(tree).find(n => n.type === 'summary'); assert.ok(text(summary).includes('Plant'));
  nodes(tree).find(n => n.type === 'button' && n.props['aria-label'] === 'Open menu').props.onClick(); tree = Nav();
  const links = nodes(tree).filter(n => n.type === 'Link' && n.props.href === route); assert.equal(links.length, 2);
  links.at(-1).props.onClick(); assert.equal(open, false);
  assert.ok(nodes(tree).some(n => n.type === 'Link' && n.props.href === '/direct-sales'));
  assert.ok(nodes(tree).some(n => n.props?.className?.includes('overflow-y-auto')));
});
test('dynamic sitemap includes new SEO URL once and preserves existing URLs', async () => {
  const mocks = { '@/lib/mongodb': { default: async () => {} },
    '@/models/Equipment': { default: { find: () => ({ sort: () => ({ lean: async () => [] }) }) } },
    '@/models/DirectSaleAsset': { default: { find: () => ({ select: () => ({ lean: async () => [] }) }) } },
    '@/lib/directSalesPublicPortfolios': { eligiblePublicPortfolios: async () => [], portfolioUrl: s => s },
  };
  const current = await load('app/sitemap.ts', mocks).default();
  const old = cp.execFileSync('git', ['show', '12e06c199d3105b65b2567c2225c9c9d35d57caf:app/sitemap.ts'], { cwd: root, encoding: 'utf8' });
  const baseline = await load('app/sitemap.ts', mocks, old).default();
  assert.equal(current.filter(x => x.url === url).length, 1);
  assert.deepEqual(current.filter(x => x.url !== url).map(x => x.url), baseline.map(x => x.url));
});
test('publication diagnostics discover the new SEO page without new classification logic', () => {
  const { equipmentPublication } = load('lib/equipmentPublishing.ts');
  const result = equipmentPublication({ category: 'Plant & Machinery', subcategory: label, status: 'Available', slug: 'synthetic' });
  assert.ok(result.expectedPages.includes(route));
});
