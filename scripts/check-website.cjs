#!/usr/bin/env node
// Local HTTP checks. Does not create orders, charge payments, send mail, or upload files.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const storefront = 'http://localhost:4002';
const admin = 'http://localhost:4001';
const api = 'http://localhost:1631';
const results = [];
const notes = [];
let diamond;
let token;
let refreshToken;

async function request(base, route, options = {}) {
  const response = await fetch(base + route, {
    ...options,
    signal: AbortSignal.timeout(90000),
  });
  const body = await response.text();
  let data;
  try { data = JSON.parse(body); } catch { data = null; }
  return { status: response.status, headers: response.headers, body, data };
}

async function check(name, run) {
  const started = Date.now();
  try {
    await run();
    results.push({ name, status: 'PASS', milliseconds: Date.now() - started });
    console.log(`PASS ${name}`);
  } catch (error) {
    // Never include response bodies, credentials, or auth tokens in reports.
    const message = error.code === 'ERR_ASSERTION' ? 'Assertion failed' : error.name;
    results.push({ name, status: 'FAIL', milliseconds: Date.now() - started, error: message });
    console.log(`FAIL ${name}: ${message}`);
  }
}

async function list(query, base = storefront, headers = {}) {
  const prefix = base === api ? '' : '/api';
  const response = await request(base, `${prefix}/diamond?${new URLSearchParams({
    isUserApi: 'true', take: '20', ...query,
  })}`, { headers });
  assert.equal(response.status, 200);
  assert(Array.isArray(response.data?.list));
  assert.equal(response.data.count, response.data.list.length);
  assert(response.data.list.every(row => row.status === 'ENABLED' && !row.isDeleted));
  return response.data;
}

async function page(base, route) {
  const response = await request(base, route);
  assert.equal(response.status, 200);
  assert(response.headers.get('content-type')?.includes('text/html'));
  assert(response.body.includes('<html'));
  assert(!response.body.includes('NEXT_HTTP_ERROR_FALLBACK;500'));
}

async function main() {
  for (const [name, base, prefix] of [
    ['Backend', api, ''], ['Storefront proxy', storefront, '/api'], ['Admin proxy', admin, '/api'],
  ]) {
    await check(`${name}: database health`, async () => {
      const r = await request(base, `${prefix}/health`);
      assert.equal(r.status, 200);
      assert.equal(r.data?.status, 'ok');
      assert.equal(r.data?.database, 'connected');
    });
  }

  for (const origin of ['NATURAL', 'LAB_GROWN']) {
    await check(`Diamond inventory: ${origin}`, async () => {
      const data = await list({ gemOrigin: origin });
      assert(data.total > 0);
      assert.equal(data.list.length, 20);
      assert(data.list.every(row => row.gemOrigin === origin && row.price > 0));
      notes.push(`${origin}: ${data.total} enabled diamonds`);
      if (origin === 'LAB_GROWN') diamond = data.list[0];
    });
  }
  await check('Diamond pagination has distinct rows', async () => {
    const a = await list({ take: '5', skip: '0', orderBy: 'id|asc' });
    const b = await list({ take: '5', skip: '5', orderBy: 'id|asc' });
    assert.equal(a.total, b.total);
    assert.equal(b.list.length, 5);
    assert(b.list.every(row => !a.list.some(other => other.id === row.id)));
  });
  for (const direction of ['asc', 'desc']) {
    await check(`Diamond price sort ${direction}`, async () => {
      const data = await list({ orderBy: `price|${direction}` });
      assert.equal(data.list.length, 20);
      assert(data.list.every((row, i, rows) => i === 0 || (direction === 'asc'
        ? rows[i - 1].price <= row.price : rows[i - 1].price >= row.price)));
    });
  }
  await check('Diamond numeric range filters', async () => {
    const data = await list({ minWeight: '1', maxWeight: '2', minPrice: '100', maxPrice: '2000' });
    assert(data.total > 0);
    assert(data.list.every(row => row.weight >= 1 && row.weight <= 2 && row.price >= 100 && row.price <= 2000));
  });
  await check('Diamond shape filter', async () => {
    const data = await list({ shape: 'ROUND' });
    assert(data.total > 0);
    assert(data.list.every(row => row.shape === 'ROUND'));
  });
  await check('Diamond grade filters', async () => {
    const data = await list({ cut: 'EX', clarity: 'VS1', color: 'D' });
    assert(data.total > 0);
    assert(data.list.every(row => row.cut === 'EX' && row.clarity === 'VS1' && row.color === 'D'));
  });
  await check('Diamond SKU search', async () => {
    assert(diamond);
    const data = await list({ sku: diamond.sku });
    assert(data.list.some(row => row.id === diamond.id));
    assert(data.list.every(row => row.sku.includes(diamond.sku)));
  });
  await check('Diamond empty search returns an empty list', async () => {
    const data = await list({ sku: '__JE_INSPI_NO_SUCH_SKU_TEST__' });
    assert.equal(data.total, 0);
    assert.deepEqual(data.list, []);
  });
  await check('Diamond search parameters', async () => {
    const r = await request(storefront, '/api/diamond/search-params');
    assert.equal(r.status, 200);
    assert(r.data && typeof r.data === 'object');
  });
  await check('Diamond details through storefront proxy', async () => {
    assert(diamond);
    const r = await request(storefront, `/api/diamond/${diamond.id}`);
    assert.equal(r.status, 200);
    assert.equal(r.data?.id, diamond.id);
    assert.equal(r.data?.sku, diamond.sku);
  });
  await check('Stale login token can browse public diamonds', async () => {
    const data = await list({ take: '1' }, storefront, { Authorization: 'Bearer website-test-invalid-token' });
    assert.equal(data.list[0].isWishlisted, false);
  });
  await check('Missing diamond produces a controlled error', async () => {
    const r = await request(storefront, '/api/diamond/00000000-0000-0000-0000-000000000000');
    assert([400, 404].includes(r.status));
    assert(!r.body.includes('PrismaClient'));
  });
  for (const route of ['/dynamic/section-image', '/jewellery-category/get-enabled?skip=0&take=50&include=subCategory.type', '/collection/get-enabled', '/dynamic/prime-product']) {
    await check(`Startup data: ${route.split('?')[0]}`, async () => {
      const r = await request(storefront, `/api${route}`);
      assert.equal(r.status, 200);
      assert(r.data !== null);
    });
  }
  await check('Jewellery catalog responds', async () => {
    const r = await request(storefront, '/api/jewellery/list?take=5&skip=0');
    assert.equal(r.status, 200);
    assert(Array.isArray(r.data?.list));
    if (r.data.total === 0) notes.push('Jewellery catalog is empty; product detail and jewellery checkout cannot be tested with real products.');
  });
  for (const [method, route] of [
    ['GET', '/user/list'], ['GET', '/cart'], ['GET', '/auth/wishlist'],
    ['GET', '/calculator/calculator'], ['POST', '/diamond'],
    ['PATCH', '/diamond/00000000-0000-0000-0000-000000000000'],
    ['DELETE', '/diamond/00000000-0000-0000-0000-000000000000'],
    ['POST', '/purchase-order'], ['POST', '/purchase-order/from-cart'],
  ]) {
    await check(`Anonymous access blocked: ${method} ${route}`, async () => {
      const r = await request(storefront, `/api${route}`, { method });
      assert.equal(r.status, 401);
    });
  }
  await check('CORS allows local storefront', async () => {
    const r = await request(api, '/diamond', { method: 'OPTIONS', headers: {
      Origin: storefront, 'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization,content-type',
    } });
    assert([200, 204].includes(r.status));
    assert.equal(r.headers.get('access-control-allow-origin'), storefront);
    assert(r.headers.get('access-control-allow-headers')?.toLowerCase().includes('authorization'));
  });
  await check('Razorpay webhook rejects an unsigned request', async () => {
    const r = await request(api, '/purchase-order/razorpay/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
    });
    assert([400, 503].includes(r.status));
    if (r.status === 503) {
      assert.equal(r.data?.message, 'Razorpay webhook verification is not configured');
      notes.push('Razorpay webhook secret is missing; payment confirmation is not configured.');
    }
  });

  const credentials = JSON.parse(fs.readFileSync(path.join(root, '.local/admin-login.json'), 'utf8'));
  await check('Admin login rejects an incorrect password', async () => {
    const r = await request(admin, '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.email, password: 'website-test-intentionally-wrong', userType: 'ADMIN' }) });
    assert([400, 401].includes(r.status));
  });
  await check('Admin login succeeds through admin proxy', async () => {
    const r = await request(admin, '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.email, password: credentials.password, userType: 'ADMIN' }) });
    assert([200, 201].includes(r.status));
    assert(typeof r.data?.userSession?.authToken === 'string');
    token = r.data.userSession.authToken;
    refreshToken = r.data.userSession.refreshToken;
  });
  if (token) {
    try {
      for (const route of ['/user/list?take=5', '/user/pending-requests?take=5', '/purchase-order/admin/latest-orders?take=5', '/auth/wishlist?take=5', '/cart']) {
        await check(`Authenticated admin read: ${route.split('?')[0]}`, async () => {
          const r = await request(admin, `/api${route}`, { headers: { Authorization: `Bearer ${token}` } });
          assert.equal(r.status, 200);
          assert(r.data !== null);
        });
      }
      await check('Calculator reports its configuration state', async () => {
        const r = await request(admin, '/api/calculator/calculator', { headers: { Authorization: `Bearer ${token}` } });
        if (r.status === 400 && r.data?.message === 'Calculator not found') {
          notes.push('Pricing calculator is not configured; jewellery checkout pricing remains unverified.');
        } else assert.equal(r.status, 200);
      });
    } finally {
      await check('Admin logout invalidates the test session', async () => {
        const r = await request(admin, '/api/auth/logout', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        assert([200, 204].includes(r.status));
        const after = await request(admin, '/api/user/list', { headers: { Authorization: `Bearer ${token}` } });
        assert.equal(after.status, 401);
        const refresh = await request(admin, '/api/auth/refresh-token', {
          method: 'POST', headers: { Authorization: `Bearer ${refreshToken}` },
        });
        assert([400, 401].includes(refresh.status));
      });
      token = null;
    }
  }

  for (const route of ['/', '/diamond?gemOrigin=NATURAL', '/diamond?gemOrigin=LAB_GROWN',
    ...(diamond ? [`/diamond/detail?id=${diamond.id}`] : []), '/diamond/custom', '/login', '/register',
    '/jewellery', '/cart', '/wishlist', '/profile', '/orders', '/contact-us', '/about-us', '/register/thank-you',
    '/privacy-policy', '/terms-of-use', '/conditions-of-sale', '/returns-and-exchanges-policy', '/shipping-and-delivery-policy']) {
    await check(`Storefront page response: ${route.split('?')[0]}${route.includes('gemOrigin') ? ' ' + route.split('=')[1] : ''}`, () => page(storefront, route));
  }
  for (const route of ['/', '/diamond/diamond-list', '/diamond/diamond-list/add-diamond', '/diamond/certificate-pricing',
    '/users', '/users/pending-requests', '/order-management', '/calculator', '/jewellery/product-list',
    '/jewellery/product-list/add-product', '/jewellery/home-page-media', '/jewellery/filter-sort',
    '/jewellery/marketing-image', '/contact-us/location', '/contact-us/event', '/contact-us/catalogue']) {
    await check(`Admin page response: ${route}`, () => page(admin, route));
  }
  for (const [name, base] of [['Storefront', storefront], ['Admin', admin]]) {
    await check(`${name} font is available`, async () => {
      const response = await fetch(`${base}/fonts/FuturaBkBT.ttf`, { signal: AbortSignal.timeout(30000) });
      assert.equal(response.status, 200);
      assert((await response.arrayBuffer()).byteLength > 1000);
    });
    await check(`${name} logo PNG is available`, async () => {
      const response = await fetch(`${base}/assets/brand/je-inspi-logo-transparent.png`, { signal: AbortSignal.timeout(30000) });
      assert.equal(response.status, 200);
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
      assert.equal(bytes[25], 6); // PNG RGBA color type; includes an alpha channel.
    });
  }
  await check('Bundled diamond video supports partial loading', async () => {
    const response = await fetch(`${storefront}/assets/home/Diamond.mp4`, {
      headers: { Range: 'bytes=0-1023' }, signal: AbortSignal.timeout(30000),
    });
    assert.equal(response.status, 206);
    assert(response.headers.get('content-type')?.includes('video/mp4'));
    assert.equal((await response.arrayBuffer()).byteLength, 1024);
  });
  await check('Supplier diamond image loads through Next image optimizer', async () => {
    assert(diamond);
    const image = JSON.parse(diamond.images)[0];
    assert(image);
    const response = await fetch(`${storefront}/_next/image?${new URLSearchParams({ url: image, w: '640', q: '75' })}`, { signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200);
    assert(response.headers.get('content-type')?.startsWith('image/'));
    assert((await response.arrayBuffer()).byteLength > 100);
  });
}

main().catch(error => {
  results.push({ name: 'Test runner', status: 'FAIL', error: error.name });
  console.error(`Test runner failed: ${error.name}`);
}).finally(() => {
  const passed = results.filter(result => result.status === 'PASS').length;
  const failed = results.length - passed;
  fs.mkdirSync(path.join(root, '.local'), { recursive: true });
  fs.writeFileSync(path.join(root, '.local/website-test-results.json'), JSON.stringify({
    testedAt: new Date().toISOString(), scope: 'Local HTTP checks; no browser interaction or live payment',
    passed, failed, notes, results,
  }, null, 2), { mode: 0o600 });
  console.log(`\n${passed} passed; ${failed} failed.`);
  notes.forEach(note => console.log(note));
  process.exitCode = failed ? 1 : 0;
});
