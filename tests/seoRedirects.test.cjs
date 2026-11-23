'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { unstable_getResponseFromNextConfig } = require('next/experimental/testing/server');
require('../scripts/build-isolated.cjs');

const source = fs.readFileSync(path.join(__dirname, '../next.config.ts'), 'utf8');
const moduleObject = { exports: {} };
vm.runInThisContext('(function(exports){' + ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText + '\n})')(moduleObject.exports);
const nextConfig = moduleObject.exports.default;
const origin = 'https://newtacommercialsales.com';
const expected = [
  ['/equipment/galion-12-ton-semi-hydraulic-crane-truck-newta-2026-0017', '/equipment/used-galion-12-ton-semi-hydraulic-crane-truck-newta-2026-0017'],
  ['/equipment/mercedes-benz-2224-8000lt-watertank-truck-no-papers-newta-2026-0019', '/equipment/used-mercedes-benz-2224-8000lt-watertank-water-tanktruck-newta-2026-0019'],
  ['/equipment/2023-tan-st-leader-side-tipper-trailer-papers-newta-2026-0003', '/equipment/used-2023-tan-st-leader-side-tipper-trailer-newta-2026-0003'],
  ['/equipment/grove-18-ton-all-terrain-crane-truck-newta-2026-0018', '/equipment/used-grove-18-ton-all-terrain-crane-truck-newta-2026-0018'],
  ['/equipment/tata-honey-sucker-newta-2026-0014', '/equipment/used-tata-honey-sucker-truck-newta-2026-0014'],
  ['/index.html', '/'],
];
const responseFor = (pathname, host = origin) => unstable_getResponseFromNextConfig({ url: host + pathname, nextConfig });

test('exactly six reviewed literal permanent mappings, without host overrides', async () => {
  const rules = await nextConfig.redirects();
  assert.deepEqual(rules, expected.map(([source, destination]) => ({ source, destination, permanent: true })));
  assert.equal(new Set(rules.map((rule) => rule.source)).size, 6);
  for (const rule of rules) {
    assert(!/[:*?()+{}]/.test(rule.source));
    assert(rule.destination.startsWith('/') && !rule.destination.startsWith('//'));
  }
});
for (const [from, to] of expected) {
  test('Next.js returns exact HTTP 308 destination: ' + from, async () => {
    const response = await responseFor(from);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), origin + to);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  });
  test('query parameters survive: ' + from, async () => {
    const response = await responseFor(from + '?utm_source=owner-review&reference=synthetic');
    const destination = new URL(response.headers.get('location'));
    assert.equal(response.status, 308);
    assert.equal(destination.pathname, to);
    assert.equal(destination.searchParams.get('utm_source'), 'owner-review');
    assert.equal(destination.searchParams.get('reference'), 'synthetic');
  });
  test('destination does not loop and nested paths do not match: ' + from, async () => {
    for (const pathname of [to, from + '/unrelated']) {
      const response = await responseFor(pathname);
      assert.equal(response.headers.get('location'), null);
    }
  });
}
for (const pathname of [
  '/equipment', '/equipment/trucks-for-sale-south-africa', '/equipment/plant-machinery-for-sale-south-africa',
  '/equipment/used-cat-320dl-excavator-newta-2026-0025',
  '/equipment/compair-holman-400-125-mobile-air-compressor-newta-2026-0020',
  '/equipment/not-a-reviewed-slug', '/direct-sales', '/direct-sales/synthetic-asset',
  '/direct-sales/portfolios/synthetic-portfolio', '/api/enquiries', '/contact', '/sitemap.xml', '/robots.txt',
  '/indexXhtml', '/other/index.html',
]) {
  test('no new redirect interferes with existing path: ' + pathname, async () => {
    const response = await responseFor(pathname);
    // This helper tests config matching, not the underlying page's HTTP status.
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('x-middleware-rewrite'), null);
  });
}
test('relative rules do not override the hosting-level www normalization', async () => {
  const response = await responseFor('/index.html', 'https://www.newtacommercialsales.com');
  assert.equal(response.headers.get('location'), 'https://www.newtacommercialsales.com/');
  assert(!('rewrites' in nextConfig));
  assert(!('basePath' in nextConfig));
});
test('existing security headers and image configuration remain present', async () => {
  assert.deepEqual(nextConfig.images.remotePatterns, [{ protocol: 'https', hostname: 'res.cloudinary.com' }]);
  const response = await responseFor('/equipment');
  assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('permissions-policy'), 'camera=(), microphone=(), geolocation=()');
});
