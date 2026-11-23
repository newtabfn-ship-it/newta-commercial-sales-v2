'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { resolveTitle } = require('next/dist/lib/metadata/resolvers/resolve-title');
require('../scripts/build-isolated.cjs');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app/equipment/[slug]/metadata.ts'), 'utf8');
const previousSource = source.replace('title: { absolute: title },', 'title,');
const layout = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8');
const template = layout.match(/template:\s*"([^"]+)"/)[1];
const brand = 'NEWTA Commercial Sales';

async function metadata(code, record) {
  const module = { exports: {} };
  let connections = 0, queries = 0;
  const compiled = ts.transpileModule(code, {
    compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInThisContext('(function(require,module,exports){' + compiled + '\n})')((id) => {
    if (id === '@/lib/mongodb') return { default: async () => { connections++; } };
    if (id === '@/models/Equipment') return { default: {
      findOne: (filter) => {
        queries++; assert.deepEqual(filter, { slug: 'synthetic-asset' });
        return { lean: async () => record };
      },
    } };
    throw new Error('Unexpected metadata dependency');
  }, module, module.exports);
  const result = await module.exports.generateEquipmentMetadata('synthetic-asset');
  assert.equal(connections, 1); assert.equal(queries, 1);
  return result;
}

const examples = [
  ['Commercial Vehicles', 'Used MAN TGX 26.540 Truck Tractor'],
  ['Commercial Vehicles', 'Synthetic Water Tank Truck'],
  ['Commercial Vehicles', 'Synthetic Honey Sucker Truck'],
  ['Commercial Vehicles', 'Synthetic Bus'],
  ['Commercial Vehicles', 'Synthetic Car'],
  ['Commercial Vehicles', 'Synthetic Bakkie'],
  ['Commercial Vehicles', 'Used Afrit Tautliner Link Trailer'],
  ['Plant & Machinery', 'Synthetic Agricultural Tractor'],
  ['Plant & Machinery', 'Synthetic Construction Machine'],
  ['Plant & Machinery', 'Synthetic Crane'],
  ['Plant & Machinery', 'Synthetic Compressor'],
  ['Plant & Machinery', 'Synthetic Crusher'],
  ['Mining Equipment', 'Synthetic Mining Asset'],
  ['Drilling Rigs', 'Synthetic Drilling Rig'],
  ['Other Assets', 'Synthetic Workshop Lathe'],
];
for (const [category, title] of examples) {
  for (const status of ['Available', 'Sold']) {
    test(category + ': ' + title + ' (' + status + ') has one brand and unchanged metadata', async () => {
      const record = { title, category, status, slug: 'synthetic-asset', year: '2020', province: 'Synthetic',
        manufacturer: 'Synthetic', model: 'Synthetic', images: [{ cover: true, url: 'https://example.invalid/synthetic.jpg' }] };
      const before = await metadata(previousSource, record), after = await metadata(source, record);
      assert.equal(resolveTitle(before.title, template).absolute, title + ' | ' + brand + ' | ' + brand);
      const actualTitle = resolveTitle(after.title, template).absolute;
      assert.equal(actualTitle, title + ' | ' + brand);
      assert.equal(actualTitle.split(brand).length - 1, 1);
      const { title: ignoredBefore, ...otherBefore } = before;
      const { title: ignoredAfter, ...otherAfter } = after;
      assert.deepEqual(otherAfter, otherBefore);
      assert.equal(after.openGraph.title, title + ' | ' + brand);
      assert.equal(after.twitter.title, title + ' | ' + brand);
      assert.equal(after.alternates.canonical, 'https://newtacommercialsales.com/equipment/synthetic-asset');
      assert.equal(after.robots.index, status === 'Available');
    });
  }
}
test('missing listing behavior remains unchanged and noindex', async () => {
  const before = await metadata(previousSource, null), after = await metadata(source, null);
  assert.deepEqual(after, before);
  assert.equal(after.robots.index, false);
});
test('root template still applies normally to ordinary child category titles', () => {
  assert.equal(resolveTitle('Trucks for Sale South Africa', template).absolute, 'Trucks for Sale South Africa | ' + brand);
  assert.equal(resolveTitle({ absolute: 'Unchanged absolute category title' }, template).absolute, 'Unchanged absolute category title');
});
