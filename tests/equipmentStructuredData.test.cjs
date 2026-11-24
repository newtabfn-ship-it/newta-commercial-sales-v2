'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
require('../scripts/build-isolated.cjs');
const source = fs.readFileSync(path.join(__dirname, '../app/equipment/[slug]/structuredData.ts'), 'utf8');
function load(code, record) {
  const module = { exports: {} };
  const compiled = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2018, module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInThisContext('(function(require,module,exports){' + compiled + '\n})')((id) => {
    if (id === '@/lib/mongodb') return { default: async () => {} };
    if (id === '@/models/Equipment') return { default: { findOne: (filter) => {
      assert.deepEqual(filter, { slug: 'synthetic' }); return { lean: async () => record };
    } } };
    throw new Error('Unexpected dependency');
  }, module, module.exports);
  return module.exports;
}
const normalize = load(source, null).normalizeEquipmentSku;
for (const [input, expected] of [
  ['Newta 2026-0014', 'Newta-2026-0014'], ['Newta-2026-0014', 'Newta-2026-0014'],
  ['  Newta\t2026-0014\n', 'Newta-2026-0014'], ['Newta\u00a02026-0014', 'Newta-2026-0014'],
  ['Newta\u20032026-0014', 'Newta-2026-0014'], ['A._-1', 'A._-1'],
  [undefined, undefined], [null, undefined], ['', undefined], [' \t\n', undefined],
  [123, undefined], [{}, undefined], [['reference'], undefined],
  ['Newta\u00002026', undefined], ['Newta\u200b2026', undefined], ['<invalid>', undefined], ['\ud800', undefined],
]) test('normalizes or omits reference: ' + JSON.stringify(input), () => assert.equal(normalize(input), expected));
for (const status of ['Available', 'Sold']) for (const price of ['R 435,000', 'POA']) {
  test('only SKU changes: ' + status + '/' + price, async () => {
    const record = { slug: 'synthetic', title: 'Synthetic asset', referenceNumber: 'Newta 2026-0014',
      description: 'Synthetic description', images: [{ url: '/test.jpg' }], category: 'Commercial Vehicles',
      manufacturer: 'Synthetic', status, price, currency: 'ZAR' };
    const snapshot = JSON.stringify(record);
    const before = await load(source.replace('sku: normalizeEquipmentSku(item.referenceNumber),', 'sku: item.referenceNumber,'), record).generateStructuredData('synthetic');
    const after = await load(source, record).generateStructuredData('synthetic');
    assert.deepEqual(after, { ...before, sku: 'Newta-2026-0014' });
    assert.equal(JSON.stringify(record), snapshot);
    assert.equal(after.url, 'https://newtacommercialsales.com/equipment/synthetic');
    assert.equal('price' in after.offers, price !== 'POA');
    for (const key of ['shippingDetails', 'hasMerchantReturnPolicy', 'aggregateRating', 'review']) assert.equal(key in after, false);
  });
}
test('missing SKU is omitted from serialized markup; missing listing remains null', async () => {
  const result = await load(source, { slug: 'synthetic', title: 'Synthetic' }).generateStructuredData('synthetic');
  assert.equal('sku' in JSON.parse(JSON.stringify(result)), false);
  assert.equal(await load(source, null).generateStructuredData('synthetic'), null);
});
test('normalization can collide: inventory checks must reject ambiguous references', () => {
  const values = ['Newta 2026-0014', 'Newta-2026-0014'].map(normalize);
  assert.equal(new Set(values).size, 1);
});
