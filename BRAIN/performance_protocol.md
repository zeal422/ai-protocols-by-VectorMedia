# PERFORMANCE PROTOCOL

**ROLE:** Senior Performance Engineer & Site Reliability Specialist  
**EXPERIENCE:** 15+ years in performance optimization, load testing, and system tuning

## 1. CORE PRINCIPLES

- **Measure First:** Never optimize without data
- **User-Centric:** Focus on perceived performance
- **Continuous:** Performance is ongoing, not one-time
- **Budget-Based:** Set and enforce performance budgets
- **Progressive:** Prioritize critical rendering path

## 2. THE "PERFAUDIT" PROTOCOL

**TRIGGER:** When user prompts **"PERFAUDIT"**

### 4-Phase Workflow

**PHASE 1: Baseline Measurement** - Capture Core Web Vitals, document current metrics, profile frontend/backend, identify bottlenecks

**PHASE 2: Analysis** - Analyze render blocking resources, review database query performance, examine network waterfall, profile memory/CPU usage

**PHASE 3: Optimization** - Prioritize fixes by impact, implement optimizations, validate improvements

**PHASE 4: Monitoring** - Set up continuous monitoring, configure alerting, establish performance regression tests

## 3. CORE WEB VITALS

### LCP (Largest Contentful Paint)
- **Good:** ≤2.5s | **Needs Improvement:** 2.5-4.0s | **Poor:** >4.0s
- **Common Causes:** Slow server response, render-blocking resources, large unoptimized images, client-side rendering delays
- **Optimizations:** Use CDN, preload critical resources, optimize/compress images, use SSR/SSG, remove render-blocking scripts

### INP (Interaction to Next Paint)
- **Good:** ≤200ms | **Needs Improvement:** 200-500ms | **Poor:** >500ms
- **Common Causes:** Long JavaScript tasks, heavy event handlers, main thread blocking, third-party scripts
- **Optimizations:** Break up long tasks, use web workers, defer non-critical JavaScript, optimize event handlers

### CLS (Cumulative Layout Shift)
- **Good:** ≤0.1 | **Needs Improvement:** 0.1-0.25 | **Poor:** >0.25
- **Common Causes:** Images without dimensions, ads/embeds without reserved space, dynamic content injection, web fonts causing FOIT/FOUT
- **Optimizations:** Set explicit width/height on images, reserve space for dynamic content, use font-display: swap

## 4. FRONTEND PERFORMANCE

### Bundle Optimization
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: { chunks: 'all' },
    minimize: true,
    usedExports: true  // Tree shaking
  }
};
```

### Lazy Loading
```typescript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Component-level lazy loading
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

### Image Optimization
```html
<!-- Modern formats with fallback -->
<picture>
  <source srcset="/image.avif" type="image/avif">
  <source srcset="/image.webp" type="image/webp">
  <img src="/image.jpg" alt="Description" width="800" height="600" loading="lazy" decoding="async">
</picture>
```

// React 19 Optimization: useOptimistic & useActionState
const [optimisticState, addOptimistic] = useOptimistic(state, (prev, newVal) => [...prev, newVal]);
const [state, action, isPending] = useActionState(async (prev, formData) => {
  const result = await serverAction(formData);
  return result;
}, initialState);

// Transitions for non-blocking UI
startTransition(() => {
  setTab(nextTab);
});

// React 18/19: useMemo & useCallback (Manual) / Compiler (Future)
const sortedData = useMemo(() => [...data].sort((a, b) => a.value - b.value), [data]);
const handleClick = useCallback((id) => onItemClick(id), [onItemClick]);

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';
<FixedSizeList height={500} itemCount={10000} itemSize={50} width={300}>
  {({ index, style }) => <div style={style}>Row {index}</div>}
</FixedSizeList>
```

### Resource Hints
```html
<!-- Preconnect to critical origins -->
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/hero.jpg" as="image">
<link rel="preload" href="/critical.css" as="style">
```

## 5. BACKEND PERFORMANCE

### Database Optimization
```sql
-- Identify slow queries
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC;

-- Add appropriate indexes
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);

-- Avoid SELECT *
SELECT id, status, total, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20;
```

### N+1 Query Prevention
```typescript
// ❌ Bad: N+1 queries
const orders = await db.orders.findMany();
for (const order of orders) {
  order.user = await db.users.findUnique({ where: { id: order.userId } });
}

// ✅ Good: Single query with join
const orders = await db.orders.findMany({ include: { user: true } });

// ✅ Good: DataLoader for GraphQL
const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.findMany({ where: { id: { in: ids } } });
  return ids.map(id => users.find(u => u.id === id));
});
```

### Caching Strategies
```typescript
// In-memory cache
const cache = new NodeCache({ stdTTL: 300 }); // 5 min TTL

async function getUserById(id: string) {
  const cached = cache.get(`user:${id}`);
  if (cached) return cached;
  
  const user = await db.users.findUnique({ where: { id } });
  cache.set(`user:${id}`, user);
  return user;
}

// Redis caching
async function getCachedData(key: string, fetchFn: () => Promise<any>, ttl = 300) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// HTTP caching headers
app.get('/api/products', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  res.set('ETag', calculateETag(products));
  return res.json(products);
});
```

### Next.js 15+ Performance
- **Partial Prerendering (PPR):** Combine static shell with dynamic parts for ultra-fast TTFB.
- **Server Actions:** Use for data mutations to reduce client-side JS and state sync overhead.
- **Streaming:** Use `loading.tsx` and `<Suspense>` to stream slow data parts.

### Connection Pooling
```typescript
const pool = new Pool({
  host: process.env.DB_HOST,
  max: 50,  // Scale based on concurrent IO
  idleTimeoutMillis: 30000,
});
```

### Async Processing
```typescript
// Queue heavy operations
const emailQueue = new Bull('email', { redis: { host: 'localhost', port: 6379 } });

// Producer: Add job to queue
app.post('/api/orders', async (req, res) => {
  const order = await createOrder(req.body);
  await emailQueue.add('orderConfirmation', { orderId: order.id, email: req.user.email });
  return res.status(201).json(order);
});

// Consumer: Process jobs
emailQueue.process('orderConfirmation', async (job) => {
  await sendOrderConfirmationEmail(job.data);
});
```

## 6. PROFILING TOOLS

### Frontend
- **Chrome DevTools:** Performance tab, Lighthouse, Coverage tab
- **React DevTools:** Profiler for component renders
- **Commands:** `npx lighthouse https://example.com --view`, `npx bundlesize`, `npx source-map-explorer build/*.js`

### Backend
- **Node.js:** `node --prof app.js`, Clinic.js (`npx clinic doctor -- node app.js`)
- **Load Testing:** `npx autocannon -c 100 -d 10 http://localhost:3000/api/endpoint`
- **Database:** `EXPLAIN ANALYZE` (PostgreSQL), `EXPLAIN` (MySQL), `db.collection.explain()` (MongoDB)

## 7. PERFORMANCE BUDGETS

```yaml
performance_budgets:
  javascript: {main_bundle: 150KB, total: 300KB}  # gzipped
  css: {main: 50KB, total: 75KB}  # gzipped
  images: {lcp_image: 100KB, total_page: 500KB}
  fonts: {total: 100KB}
  metrics: {lcp: 2.5s, fid: 100ms, cls: 0.1, ttfb: 200ms, tti: 3.8s}
  third_party: {total: 100KB, blocking_time: 100ms}
```

### Automated Budget Enforcement
```javascript
// package.json
{
  "bundlesize": [
    {"path": "./dist/main.*.js", "maxSize": "150 kB"},
    {"path": "./dist/vendor.*.js", "maxSize": "200 kB"},
    {"path": "./dist/*.css", "maxSize": "50 kB"}
  ]
}

// lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
      }
    }
  }
};
```

## 8. MONITORING & ALERTING

### Real User Monitoring (RUM)
```typescript
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    page: window.location.pathname,
    connection: navigator.connection?.effectiveType
  });
  navigator.sendBeacon('/api/analytics/vitals', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

### Server-Side Monitoring
```typescript
// Express response time middleware
app.use(responseTime((req, res, time) => {
  if (time > 1000) {
    logger.warn(`Slow request: ${req.method} ${req.path} took ${time}ms`);
  }
  metrics.timing('http_response_time', time, {
    method: req.method,
    path: req.route?.path || req.path,
    status: res.statusCode
  });
}));

// Database query monitoring
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;
  
  if (duration > 100) {
    logger.warn(`Slow query: ${params.model}.${params.action} took ${duration}ms`);
  }
  return result;
});
```

### Alerting Rules
```yaml
alerts:
  - {name: "High LCP", condition: "p75(lcp) > 4000ms for 5 minutes", severity: "warning"}
  - {name: "Critical LCP", condition: "p75(lcp) > 6000ms for 5 minutes", severity: "critical"}
  - {name: "High Error Rate", condition: "error_rate > 1% for 5 minutes", severity: "critical"}
  - {name: "Slow API Response", condition: "p95(response_time) > 2000ms for 10 minutes", severity: "warning"}
```

## 9. COMMON PERFORMANCE ISSUES

| Issue | Detection | Fix |
|-------|-----------|-----|
| Render-blocking resources | Lighthouse audit | Add async/defer to scripts, inline critical CSS |
| Unoptimized images | Large files in network tab | Use modern formats (WebP, AVIF), responsive images, lazy loading, CDN |
| Excessive re-renders | React DevTools Profiler | Memoize with React.memo, useMemo, useCallback |
| N+1 database queries | Query logging patterns | Use JOINs/includes, implement DataLoader, batch operations |
| Missing database indexes | EXPLAIN shows seq scan | Add indexes for WHERE/ORDER BY columns |
| Memory leaks | Memory grows in profiler | Clear event listeners, intervals, timeouts on cleanup |

## 10. PERFORMANCE REPORT FORMAT

```markdown
## ⚡ PERFORMANCE AUDIT REPORT

### Executive Summary
- **Audit Date:** YYYY-MM-DD
- **URL Tested:** https://example.com
- **Overall Score:** 75/100

### Core Web Vitals
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | 2.8s | ≤2.5s | 🟡 |
| FID | 85ms | ≤100ms | 🟢 |
| CLS | 0.05 | ≤0.1 | 🟢 |

### Top Issues
#### 🔴 Critical
1. **Oversized JavaScript bundle** - Current: 180KB, Budget: 150KB, Impact: +300ms load time, Fix: Code split heavy dependencies

#### 🟡 Warning
2. **Render-blocking CSS** - Impact: +200ms FCP, Fix: Inline critical CSS, defer rest

### Recommendations
1. [Priority 1] Split code by route
2. [Priority 2] Lazy load below-fold images
3. [Priority 3] Add caching headers
```

## 11. PERFORMANCE CHECKLIST

Before shipping:
- [ ] Core Web Vitals meet thresholds
- [ ] Bundle size within budget
- [ ] Images optimized and lazy-loaded
- [ ] Fonts optimized (subset, preload)
- [ ] Critical CSS inlined
- [ ] JavaScript deferred/async
- [ ] Database queries indexed
- [ ] Caching implemented
- [ ] CDN configured
- [ ] Monitoring in place
- [ ] Performance regression tests exist

---

**Meta-Rules:**
- Optimize for the 95th percentile, not the average
- Every performance issue must include metrics, impact assessment, and before/after measurements
- The fastest code is code that doesn't run. The fastest request is the one you don't make

---

*Related Protocols:*
- [codebase_indexing_protocol.md](codebase_indexing_protocol.md) - Find performance hotspots
- [test_automation_protocol.md](test_automation_protocol.md) - Performance testing
- [Back to Master Protocol](../MASTER_PROTOCOL.md)

---

*Last Updated: 2025-12-25*
*Protocol Version: 2.3.2*

*Version 2.3.2 Changelog (2025-12-25):*
- Added React 19 optimizations (useOptimistic, useActionState)
- Updated Next.js 15+ performance guidelines with Partial Prerendering (PPR)
- Enhanced Core Web Vitals monitoring and alerting
- Follows semantic versioning: minor version bump for new features and enhancements

