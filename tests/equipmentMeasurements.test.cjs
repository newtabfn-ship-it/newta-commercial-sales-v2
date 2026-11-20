'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
// No database or external service can be contacted by these synthetic tests.
require('../scripts/build-isolated.cjs');

function loader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(root, file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      fileName: file, compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const localRequire = (id) => {
      if (Object.hasOwn(overrides, id)) return overrides[id];
      if (id.startsWith('@/') || id.startsWith('.')) {
        const base = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(file), id);
        const found = [base, base + '.ts', base + '.tsx'].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
        if (!found) throw new Error('Unresolved local test import');
        return load(found);
      }
      return require(id);
    };
    vm.runInThisContext('(function(require,module,exports){' + code + '\n})', { filename: file })(localRequire, module, module.exports);
    return module.exports;
  }
  return load;
}
const load = loader();
const measurements = load('lib/equipmentMeasurements.ts');
const publishing = load('lib/equipmentPublishing.ts');
const truck = { category: 'Commercial Vehicles', subcategory: 'Dropside Trucks', status: 'Available', slug: 'synthetic-truck' };
function matches(record, filter) {
  return Object.entries(filter).every(([key, value]) => key === '$or'
    ? value.some((branch) => matches(record, branch))
    : value && typeof value === 'object' && '$in' in value
      ? value.$in.includes(record[key]) : record[key] === value);
}
for (const [unit, label] of [[undefined, 'KM / Hours'], ['', 'KM / Hours'], ['km', 'Mileage (km)'], ['hours', 'Operating hours'], ['unknown', 'KM / Hours']]) {
  test('reading label: ' + String(unit), () => assert.equal(measurements.usageLabel(unit), label));
}
for (const weight of measurements.truckWeightClasses) {
  test(weight + ': new field and legacy membership, single record', () => {
    const filter = measurements.truckWeightFilter(weight);
    const record = { ...truck, truckWeightClass: weight };
    assert(matches(record, filter));
    assert(matches({ ...truck, subcategory: weight }, filter));
    assert.equal([record].filter((item) => matches(item, filter)).length, 1);
    assert(!matches({ ...record, status: 'Sold' }, filter));
    assert(!matches({ ...record, category: 'Plant & Machinery' }, filter));
    assert(!matches({ ...record, subcategory: 'Cars / Passenger Vehicles' }, filter));
    assert(!matches({ ...truck, title: weight + ' crane', description: weight }, filter));
    const publication = publishing.equipmentPublication(record);
    assert(publication.expectedPages.includes('/equipment/dropside-trucks-for-sale-south-africa'));
    assert(publication.expectedPages.includes('/equipment/' + weight.split(' ')[0] + '-ton-trucks-for-sale-south-africa'));
    assert.equal(publication.publicUrl, '/equipment/synthetic-truck');
  });
  test(weight + ': API validation accepts confirmed truck class', () => {
    assert.equal(publishing.validateEquipmentClassification({ ...truck, truckWeightClass: weight, usageUnit: 'km' }), null);
    assert.equal(publishing.validateEquipmentClassification({ ...truck, subcategory: weight, truckWeightClass: weight }), null);
  });
}
test('conflicting legacy and confirmed weight classes rejected', () => {
  assert(publishing.validateEquipmentClassification({ ...truck, subcategory: '8 Ton Trucks', truckWeightClass: '10 Ton Trucks' }));
});
for (const value of [null, 10, '18 Ton Trucks', '10', {}, []]) {
  test('reject invalid weight ' + JSON.stringify(value), () => assert(publishing.validateEquipmentClassification({ ...truck, truckWeightClass: value })));
}
for (const value of [null, 10, 'KM', 'miles', {}, []]) {
  test('reject invalid unit ' + JSON.stringify(value), () => assert(publishing.validateEquipmentClassification({ ...truck, usageUnit: value })));
}
test('new field validation is not bypassed by unchanged legacy classification', () => {
  assert(publishing.validateEquipmentClassification({ ...truck, usageUnit: 'miles' }, truck));
  assert(publishing.validateEquipmentClassification({ ...truck, truckWeightClass: '18 Ton Trucks' }, truck));
});
test('missing and explicitly cleared fields remain valid without rewriting readings', () => {
  assert.equal(publishing.validateEquipmentClassification(truck), null);
  assert.equal(publishing.validateEquipmentClassification({ ...truck, truckWeightClass: '', usageUnit: '' }), null);
  const body = publishing.equipmentWriteFields({ ...truck, kmHours: '+- 560000km', usageUnit: 'km', truckWeightClass: '10 Ton Trucks', unexpected: 'ignored' });
  assert.equal(body.kmHours, '+- 560000km');
  assert(!Object.hasOwn(body, 'unexpected'));
  assert(!Object.hasOwn(publishing.equipmentWriteFields({ title: 'Older client' }), 'usageUnit'));
});
test('truck tractors retain their own page and machinery/trailer publication is preserved', () => {
  assert(publishing.equipmentPublication({ ...truck, subcategory: 'Truck Tractors' }).expectedPages.includes('/equipment/truck-tractors-for-sale-south-africa'));
  assert(publishing.equipmentPublication({ ...truck, category: 'Plant & Machinery', subcategory: 'Crushing & Screening' }).expectedPages.includes('/equipment/mining-equipment-for-sale-south-africa'));
  assert(publishing.equipmentPublication({ ...truck, subcategory: 'Trailers', trailerType: 'dropside' }).expectedPages.includes('/equipment/dropside-trailers-for-sale-south-africa'));
  assert.throws(() => measurements.truckWeightFilter('18 Ton Trucks'));
});
test('model accepts legacy documents and validates optional enums without connecting', async () => {
  const Equipment = load('models/Equipment.ts').default;
  const legacy = new Equipment({ referenceNumber: 'SYNTHETIC', title: 'Synthetic truck', category: 'Commercial Vehicles', subcategory: 'Trucks', kmHours: '620262/872205' });
  await legacy.validate();
  assert.equal(legacy.usageUnit, undefined);
  assert.equal(legacy.truckWeightClass, undefined);
  legacy.usageUnit = 'km'; legacy.truckWeightClass = '10 Ton Trucks';
  await legacy.validate();
  assert.equal(legacy.kmHours, '620262/872205');
  legacy.usageUnit = 'miles'; await assert.rejects(legacy.validate());
});

const renderLoad = loader({
  'next/link': { default: ({ children, ...props }) => React.createElement('a', props, children) },
  'next/image': { default: ({ unoptimized, ...props }) => React.createElement('img', props) },
  '@/lib/cloudinaryImage': { cloudinaryImage: (image) => image },
});
for (const unit of [undefined, '', 'km', 'hours']) {
  for (const file of ['app/components/EquipmentCard.tsx', 'app/components/EquipmentSpecifications.tsx', 'app/components/EquipmentSummary.tsx', 'app/admin/components/equipment/EquipmentRow.tsx']) {
    test('render ' + file + ' unit ' + String(unit), () => {
      const component = renderLoad(file).default;
      const html = renderToStaticMarkup(React.createElement(component, {
        id: 'synthetic', slug: 'synthetic', equipmentId: 'synthetic', title: 'Synthetic truck', image: '/placeholder.jpg',
        year: '2020', status: 'Available', price: 'ZAR 1', hours: '620262/872205', usageUnit: unit,
        location: 'Synthetic', manufacturer: 'Synthetic', model: 'Synthetic', engine: '', power: '', operatingWeight: '', bucket: '', fuel: '', drive: '', serialNumber: '',
      }));
      assert(html.includes(measurements.usageLabel(unit)));
      assert(html.includes('620262/872205'));
    });
  }
}

function apiHarness(existing = { ...truck, referenceNumber: 'SYNTHETIC', title: 'Synthetic', price: '1', kmHours: '620262/872205' }) {
  const state = { existing, denied: false, created: [], updates: [], conflict: false, connections: 0 };
  const model = {
    create: async (body) => { state.created.push(body); return { toObject: () => body, ...body }; },
    findById: () => ({ lean: async () => state.existing }),
    findOneAndUpdate: async (filter, update, options) => {
      state.updates.push({ filter, update, options });
      if (state.conflict) return null;
      return { toObject: () => ({ ...state.existing, ...update.$set }), ...state.existing, ...update.$set };
    },
  };
  const get = loader({
    '@/lib/requireEnquiryAdmin': { requireEnquiryAdmin: async () => state.denied ? new Response('{}', { status: 403 }) : null },
    '@/lib/mongodb': { default: async () => { state.connections++; } },
    '@/models/Equipment': { default: model },
  });
  return { state, post: get('app/api/equipment/route.ts').POST, put: get('app/api/equipment/[id]/route.ts').PUT };
}
const request = (body, method = 'POST') => new Request('https://example.invalid/api/equipment', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const context = { params: Promise.resolve({ id: 'synthetic' }) };
test('create accepts confirmed fields and preserves reading/body type', async () => {
  const h = apiHarness(); const response = await h.post(request({ ...h.state.existing, truckWeightClass: '10 Ton Trucks', usageUnit: 'km' }));
  assert.equal(response.status, 201); assert.equal(h.state.created.length, 1);
  assert.equal(h.state.created[0].subcategory, 'Dropside Trucks'); assert.equal(h.state.created[0].kmHours, '620262/872205');
  assert.equal(h.state.created[0].usageUnit, 'km'); assert.equal(h.state.created[0].truckWeightClass, '10 Ton Trucks');
});
test('old create client may omit both fields', async () => {
  const h = apiHarness(); assert.equal((await h.post(request(h.state.existing))).status, 201);
  assert(!Object.hasOwn(h.state.created[0], 'usageUnit')); assert(!Object.hasOwn(h.state.created[0], 'truckWeightClass'));
});
for (const body of [{ usageUnit: 'miles' }, { truckWeightClass: '18 Ton Trucks' }, { category: 'Plant & Machinery', subcategory: 'Cranes', truckWeightClass: '10 Ton Trucks' }]) {
  test('API rejects invalid new fields ' + JSON.stringify(body), async () => {
    const h = apiHarness(); assert.equal((await h.post(request({ ...h.state.existing, ...body }))).status, 400);
    assert.equal(h.state.created.length, 0);
    assert.equal((await h.put(request(body, 'PUT'), context)).status, 400); assert.equal(h.state.updates.length, 0);
  });
}
test('unauthorized mutations never reach connection or model', async () => {
  const h = apiHarness(); h.state.denied = true;
  assert.equal((await h.post(request(h.state.existing))).status, 403);
  assert.equal((await h.put(request({ usageUnit: 'km' }, 'PUT'), context)).status, 403);
  assert.equal(h.state.connections, 0); assert.equal(h.state.updates.length, 0); assert.equal(h.state.created.length, 0);
});
test('editing supports assignment and clearing, retaining existing reading and slug', async () => {
  const h = apiHarness(); const response = await h.put(request({ usageUnit: 'km', truckWeightClass: '10 Ton Trucks' }, 'PUT'), context);
  assert.equal(response.status, 200); const data = await response.json();
  assert.equal(data.kmHours, '620262/872205'); assert.equal(data.slug, 'synthetic-truck');
  assert.equal(h.state.updates[0].options.runValidators, true);
  assert(Object.hasOwn(h.state.updates[0].filter, 'usageUnit')); assert(Object.hasOwn(h.state.updates[0].filter, 'truckWeightClass'));
  assert.equal(h.state.updates[0].filter.kmHours, '620262/872205');
  assert.equal((await h.put(request({ usageUnit: '', truckWeightClass: '' }, 'PUT'), context)).status, 200);
  assert.equal(h.state.updates[1].update.$set.usageUnit, '');
});
test('older edit client preserves omitted new fields', async () => {
  const h = apiHarness({ ...truck, usageUnit: 'km', truckWeightClass: '10 Ton Trucks' });
  const response = await h.put(request({ title: 'Updated synthetic title' }, 'PUT'), context);
  assert.equal(response.status, 200); const data = await response.json();
  assert.equal(data.usageUnit, 'km'); assert.equal(data.truckWeightClass, '10 Ton Trucks');
  assert(!Object.hasOwn(h.state.updates[0].update.$set, 'usageUnit'));
});
test('concurrent measurement/classification update returns existing conflict response', async () => {
  const h = apiHarness(); h.state.conflict = true;
  assert.equal((await h.put(request({ usageUnit: 'km' }, 'PUT'), context)).status, 409);
});
for (const weight of measurements.truckWeightClasses) {
  test('actual weight page uses combined filter: ' + weight, async () => {
    let filter;
    const get = loader({
      '@/lib/mongodb': { default: async () => {} },
      '@/models/Equipment': { default: { find: (value) => { filter = value; return { sort: () => ({ lean: async () => [] }) }; } } },
      '../../components/Navbar': { default: () => null }, '../../components/Footer': { default: () => null },
    });
    await get('app/equipment/' + weight.split(' ')[0] + '-ton-trucks-for-sale-south-africa/page.tsx').default();
    assert(matches({ ...truck, truckWeightClass: weight }, filter));
    assert(matches({ ...truck, subcategory: weight }, filter));
    assert(!matches({ ...truck, status: 'Sold', truckWeightClass: weight }, filter));
  });
}
test('all public reading consumers forward the explicit unit', () => {
  function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
  for (const file of walk(path.join(root, 'app/equipment')).filter((file) => file.endsWith('.tsx'))) {
    const source = fs.readFileSync(file, 'utf8');
    assert.equal((source.match(/hours=\{item.kmHours\}/g) || []).length, (source.match(/usageUnit=\{item.usageUnit\}/g) || []).length, file);
  }
});
test('admin form reloads optional fields and contains explicit unknown controls', () => {
  const source = fs.readFileSync(path.join(root, 'app/admin/components/equipment/EquipmentForm.tsx'), 'utf8');
  assert(source.includes('usageUnit: equipment.usageUnit ?? ""'));
  assert(source.includes('truckWeightClass: equipment.truckWeightClass ?? ""'));
  assert(source.includes('Confirmed reading unit (optional)'));
  assert(source.includes('Confirmed truck weight class (optional)'));
  assert(source.includes('...formData,'));
});
test('offline tests enforce TCP, TLS and DNS blocking', () => {
  for (const operation of [
    () => require('node:net').connect({ host: '127.0.0.1', port: 1 }),
    () => require('node:tls').connect({ host: '127.0.0.1', port: 1 }),
    () => require('node:dns').resolveSrv('_mongodb._tcp.example.invalid', () => {}),
  ]) assert.throws(operation, (error) => error.code === 'BUILD_NETWORK_BLOCKED');
});
test('existing body-type page still selects the same single truck with a confirmed weight', async () => {
  let filter;
  const get = loader({
    '@/lib/mongodb': { default: async () => {} },
    '@/models/Equipment': { default: { find: (value) => { filter = value; return { sort: () => ({ lean: async () => [] }) }; } } },
    '../../components/Navbar': { default: () => null }, '../../components/Footer': { default: () => null },
  });
  await get('app/equipment/dropside-trucks-for-sale-south-africa/page.tsx').default();
  const record = { ...truck, truckWeightClass: '10 Ton Trucks' };
  assert.equal([record].filter((item) => matches(item, filter)).length, 1);
  assert.equal([record].filter((item) => matches(item, measurements.truckWeightFilter('10 Ton Trucks'))).length, 1);
});
test('admin edit loads, renders and submits confirmed fields with unchanged images and price', async () => {
  const cells = [], effects = [];
  let cursor = 0, effectRegistered = false, submitted;
  const synthetic = { ...truck, _id: 'synthetic', title: 'Synthetic truck', referenceNumber: 'SYNTHETIC',
    price: '123', kmHours: '+- 560000km', usageUnit: 'km', truckWeightClass: '10 Ton Trucks',
    images: [{ url: 'https://example.invalid/synthetic.jpg', publicId: 'synthetic-image', cover: true }],
  };
  const get = loader({
    react: { ...React,
      useState: (initial) => {
        const index = cursor++;
        if (!(index in cells)) cells[index] = initial;
        return [cells[index], (value) => { cells[index] = typeof value === 'function' ? value(cells[index]) : value; }];
      },
      useRef: (initial) => { const index = cursor++; return cells[index] ?? (cells[index] = { current: initial }); },
      useEffect: (effect) => { if (!effectRegistered) { effects.push(effect); effectRegistered = true; } },
    },
    './ImageUploader': { default: () => null },
  });
  const originalFetch = global.fetch, originalAlert = global.alert, alerts = [];
  global.alert = (message) => alerts.push(message);
  global.fetch = async (_url, options) => {
    if (options?.method === 'PUT') { submitted = JSON.parse(options.body); return new Response('{}'); }
    return new Response(JSON.stringify(synthetic));
  };
  try {
    const component = get('app/admin/components/equipment/EquipmentForm.tsx').default;
    const props = { isEditing: true, equipmentId: 'synthetic', onSuccess: () => {}, onBusyChange: () => {} };
    component(props); effects.forEach((effect) => effect());
    await new Promise((resolve) => setImmediate(resolve));
    cursor = 0;
    const form = component(props);
    const html = renderToStaticMarkup(form);
    assert(html.includes('value="km" selected=""'));
    assert(html.includes('value="10 Ton Trucks" selected=""'));
    await form.props.onSubmit({ preventDefault() {} });
    assert(alerts.some((message) => message.includes('Equipment updated successfully.')));
    assert.equal(submitted.usageUnit, 'km'); assert.equal(submitted.truckWeightClass, '10 Ton Trucks');
    assert.equal(submitted.kmHours, '+- 560000km'); assert.equal(submitted.price, '123');
    assert.equal(submitted.images[0].url, synthetic.images[0].url);
    assert.equal(submitted.images[0].publicId, 'synthetic-image');
    assert.equal(submitted.subcategory, 'Dropside Trucks');
  } finally { global.fetch = originalFetch; global.alert = originalAlert; }
});
