---
protocol_version: "1.0.0"
last_updated: "2025-12-22"
status: "stable"
requires: ["MASTER_PROTOCOL.md"]
---

# PERFORMANCE PROTOCOL

**ROLE:** Senior Performance Engineer & Site Reliability Specialist.
**EXPERIENCE:** 15+ years in performance optimization, load testing, and system tuning.

## 1. CORE PRINCIPLES

- **Measure First:** Never optimize without data
- **User-Centric:** Focus on perceived performance
- **Continuous:** Performance is ongoing, not one-time
- **Budget-Based:** Set and enforce performance budgets
- **Progressive:** Prioritize critical rendering path

## 2. THE "PERFAUDIT" PROTOCOL (TRIGGER COMMAND)

**TRIGGER:** When the user prompts **"PERFAUDIT"**:

### PHASE 1: BASELINE MEASUREMENT
- Capture Core Web Vitals
- Document current performance metrics
- Profile frontend and backend
- Identify performance bottlenecks

### PHASE 2: ANALYSIS
- Analyze render blocking resources
- Review database query performance
- Examine network waterfall
- Profile memory and CPU usage

### PHASE 3: OPTIMIZATION
- Prioritize fixes by impact
- Implement optimizations
- Validate improvements

### PHASE 4: MONITORING
- Set up continuous monitoring
- Configure alerting
- Establish performance regression tests

---

## 3. CORE WEB VITALS

### LCP (Largest Contentful Paint)

```yaml
lcp:
  description: "Time to render largest content element"
  good: "≤ 2.5s"
  needs_improvement: "2.5s - 4.0s"
  poor: "> 4.0s"
  
  common_causes:
    - "Slow server response time"
    - "Render-blocking resources"
    - "Large images without optimization"
    - "Client-side rendering delays"
  
  optimizations:
    - "Use CDN for static assets"
    - "Preload critical resources"
    - "Optimize and compress images"
    - "Use SSR or SSG for initial content"
    - "Remove render-blocking scripts"
```

### FID (First Input Delay) / INP (Interaction to Next Paint)

```yaml
inp:
  description: "Time from user interaction to visual feedback"
  good: "≤ 200ms"
  needs_improvement: "200ms - 500ms"
  poor: "> 500ms"
  
  common_causes:
    - "Long JavaScript tasks"
    - "Heavy event handlers"
    - "Main thread blocking"
    - "Third-party scripts"
  
  optimizations:
    - "Break up long tasks"
    - "Use web workers for heavy computation"
    - "Defer non-critical JavaScript"
    - "Optimize event handlers"
    - "Reduce third-party script impact"
```

### CLS (Cumulative Layout Shift)

```yaml
cls:
  description: "Visual stability of page elements"
  good: "≤ 0.1"
  needs_improvement: "0.1 - 0.25"
  poor: "> 0.25"
  
  common_causes:
    - "Images without dimensions"
    - "Ads and embeds without reserved space"
    - "Dynamic content injection"
    - "Web fonts causing FOIT/FOUT"
  
  optimizations:
    - "Set explicit width/height on images"
    - "Reserve space for dynamic content"
    - "Use font-display: swap"
    - "Avoid inserting content above existing content"
```

---

## 4. FRONTEND PERFORMANCE

### Bundle Optimization

```typescript
// webpack.config.js optimizations
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          minChunks: 2,
          priority: -10,
        },
      },
    },
    minimize: true,
    usedExports: true,  // Tree shaking
  },
};
```

### Lazy Loading

```typescript
// Route-based code splitting (React)
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Component-level lazy loading
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Analytics() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>Load Chart</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

### Image Optimization

```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority  // Preload for LCP image
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Regular HTML with modern formats
<picture>
  <source srcset="/image.avif" type="image/avif">
  <source srcset="/image.webp" type="image/webp">
  <img 
    src="/image.jpg" 
    alt="Description"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
  >
</picture>
```

### React Performance Patterns

```typescript
// Memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>;
});

// useMemo for expensive calculations
const sortedData = useMemo(() => {
  return [...data].sort((a, b) => a.value - b.value);
}, [data]);

// useCallback for stable function references
const handleClick = useCallback((id) => {
  onItemClick(id);
}, [onItemClick]);

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={500}
  itemCount={10000}
  itemSize={50}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>Row {index}</div>
  )}
</FixedSizeList>
```

### Resource Hints

```html
<!-- Preconnect to critical origins -->
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- DNS prefetch for non-critical origins -->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/hero.jpg" as="image">
<link rel="preload" href="/critical.css" as="style">

<!-- Prefetch next-page resources -->
<link rel="prefetch" href="/next-page.js">

<!-- Prerender likely next page -->
<link rel="prerender" href="/likely-next-page">
```

---

## 5. BACKEND PERFORMANCE

### Database Optimization

```sql
-- Identify slow queries
EXPLAIN ANALYZE
SELECT * FROM orders 
WHERE user_id = 123 
ORDER BY created_at DESC;

-- Add appropriate indexes
CREATE INDEX idx_orders_user_created 
ON orders (user_id, created_at DESC);

-- Avoid SELECT *
SELECT id, status, total, created_at
FROM orders
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20;
```

### N+1 Query Prevention

```typescript
// ❌ Bad: N+1 queries
const orders = await db.orders.findMany();
for (const order of orders) {
  order.user = await db.users.findUnique({ 
    where: { id: order.userId } 
  });
}

// ✅ Good: Single query with join
const orders = await db.orders.findMany({
  include: { user: true }
});

// ✅ Good: DataLoader for GraphQL
const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.findMany({
    where: { id: { in: ids } }
  });
  return ids.map(id => users.find(u => u.id === id));
});
```

### Caching Strategies

```typescript
// In-memory cache (Node.js)
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 min TTL

async function getUserById(id: string) {
  const cached = cache.get(`user:${id}`);
  if (cached) return cached;
  
  const user = await db.users.findUnique({ where: { id } });
  cache.set(`user:${id}`, user);
  return user;
}

// Redis caching
import Redis from 'ioredis';

const redis = new Redis();

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

### Connection Pooling

```typescript
// PostgreSQL with connection pool
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,           // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pool for queries
async function query(text: string, params: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
```

### Async Processing

```typescript
// Queue heavy operations
import Bull from 'bull';

const emailQueue = new Bull('email', {
  redis: { host: 'localhost', port: 6379 }
});

// Producer: Add job to queue
app.post('/api/orders', async (req, res) => {
  const order = await createOrder(req.body);
  
  // Don't wait for email to send
  await emailQueue.add('orderConfirmation', {
    orderId: order.id,
    email: req.user.email
  });
  
  return res.status(201).json(order);
});

// Consumer: Process jobs
emailQueue.process('orderConfirmation', async (job) => {
  await sendOrderConfirmationEmail(job.data);
});
```

---

## 6. PROFILING TOOLS

### Frontend Profiling

```yaml
tools:
  chrome_devtools:
    performance_tab:
      - "Record page load"
      - "Identify long tasks"
      - "Analyze render timeline"
      
    lighthouse:
      - "Generate performance report"
      - "Get actionable recommendations"
      - command: "lighthouse https://example.com --output=json"
      
    coverage_tab:
      - "Find unused CSS/JS"
      - "Identify code to remove/lazy-load"

  react_devtools:
    profiler:
      - "Record component renders"
      - "Identify unnecessary re-renders"
      - "Measure component render time"

commands:
  - "npx lighthouse https://example.com --view"
  - "npx bundlesize"
  - "npx source-map-explorer build/*.js"
```

### Backend Profiling

```yaml
node_js:
  built_in:
    - "node --prof app.js"
    - "node --prof-process isolate-*.log > processed.txt"
    
  clinic_js:
    - "npx clinic doctor -- node app.js"
    - "npx clinic flame -- node app.js"
    - "npx clinic bubbleprof -- node app.js"
    
  autocannon:
    - "npx autocannon -c 100 -d 10 http://localhost:3000/api/endpoint"

database:
  postgres:
    - "EXPLAIN ANALYZE SELECT ..."
    - "pg_stat_statements extension"
    
  mysql:
    - "EXPLAIN SELECT ..."
    - "SHOW PROFILE"
    
  mongodb:
    - "db.collection.explain('executionStats')"
    - "profiler: db.setProfilingLevel(1)"
```

---

## 7. PERFORMANCE BUDGETS

### Budget Definition

```yaml
performance_budgets:
  javascript:
    main_bundle: 150KB   # gzipped
    total: 300KB         # gzipped
    
  css:
    main: 50KB           # gzipped
    total: 75KB          # gzipped
    
  images:
    lcp_image: 100KB
    total_page: 500KB
    
  fonts:
    total: 100KB
    
  metrics:
    lcp: 2.5s
    fid: 100ms
    cls: 0.1
    ttfb: 200ms
    tti: 3.8s

  third_party:
    total: 100KB
    blocking_time: 100ms
```

### Automated Budget Enforcement

```javascript
// bundlesize configuration
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/main.*.js",
      "maxSize": "150 kB"
    },
    {
      "path": "./dist/vendor.*.js",
      "maxSize": "200 kB"
    },
    {
      "path": "./dist/*.css",
      "maxSize": "50 kB"
    }
  ]
}

// Lighthouse CI
// lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-byte-weight': ['error', { maxNumericValue: 500000 }],
      },
    },
  },
};
```

---

## 8. MONITORING & ALERTING

### Real User Monitoring (RUM)

```typescript
// Web Vitals reporting
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    id: metric.id,
    page: window.location.pathname,
    connection: navigator.connection?.effectiveType,
    deviceMemory: navigator.deviceMemory,
  });
  
  // Use sendBeacon for reliability
  navigator.sendBeacon('/api/analytics/vitals', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getFCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Server-Side Monitoring

```typescript
// Express response time middleware
import responseTime from 'response-time';

app.use(responseTime((req, res, time) => {
  const stat = `${req.method} ${req.path}`;
  
  // Log slow requests
  if (time > 1000) {
    logger.warn(`Slow request: ${stat} took ${time}ms`);
  }
  
  // Send to metrics service
  metrics.timing('http_response_time', time, {
    method: req.method,
    path: req.route?.path || req.path,
    status: res.statusCode,
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
  
  metrics.timing('db_query_time', duration, {
    model: params.model,
    action: params.action,
  });
  
  return result;
});
```

### Alerting Rules

```yaml
alerts:
  - name: "High LCP"
    condition: "p75(lcp) > 4000ms for 5 minutes"
    severity: "warning"
    
  - name: "Critical LCP"
    condition: "p75(lcp) > 6000ms for 5 minutes"
    severity: "critical"
    
  - name: "High Error Rate"
    condition: "error_rate > 1% for 5 minutes"
    severity: "critical"
    
  - name: "Slow API Response"
    condition: "p95(response_time) > 2000ms for 10 minutes"
    severity: "warning"
    
  - name: "Database Connection Pool Exhausted"
    condition: "pool_available_connections == 0 for 1 minute"
    severity: "critical"
```

---

## 9. COMMON PERFORMANCE ISSUES

### Issue Detection & Fixes

```yaml
issues:
  - name: "Render-blocking resources"
    detection: "Lighthouse audit"
    fix:
      - "Add async/defer to scripts"
      - "Inline critical CSS"
      - "Move scripts to end of body"
    
  - name: "Unoptimized images"
    detection: "Large image files in network tab"
    fix:
      - "Use modern formats (WebP, AVIF)"
      - "Implement responsive images"
      - "Add lazy loading"
      - "Use CDN with image optimization"
    
  - name: "Excessive re-renders"
    detection: "React DevTools Profiler"
    fix:
      - "Memoize components with React.memo"
      - "Use useMemo for expensive calculations"
      - "Use useCallback for function props"
      - "Optimize context usage"
    
  - name: "N+1 database queries"
    detection: "Query logging shows repeated patterns"
    fix:
      - "Use JOINs or includes"
      - "Implement DataLoader"
      - "Batch database operations"
    
  - name: "Missing database indexes"
    detection: "EXPLAIN ANALYZE shows seq scan"
    fix:
      - "Add indexes for WHERE clauses"
      - "Add indexes for ORDER BY columns"
      - "Add composite indexes for multi-column queries"
    
  - name: "Memory leaks"
    detection: "Memory grows over time in profiler"
    fix:
      - "Clear event listeners on cleanup"
      - "Clear intervals and timeouts"
      - "Avoid closures holding references"
      - "Use WeakMap/WeakSet for caches"
```

---

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
| TTFB | 180ms | ≤200ms | 🟢 |

### Bundle Analysis
| Asset | Size (gzip) | Budget | Status |
|-------|-------------|--------|--------|
| main.js | 180KB | 150KB | 🔴 |
| vendor.js | 145KB | 200KB | 🟢 |
| styles.css | 42KB | 50KB | 🟢 |

### Top Issues

#### 🔴 Critical
1. **Oversized JavaScript bundle**
   - Current: 180KB, Budget: 150KB
   - Impact: +300ms load time
   - Fix: Code split heavy dependencies

#### 🟡 Warning
2. **Render-blocking CSS**
   - Impact: +200ms FCP
   - Fix: Inline critical CSS, defer rest

### Recommendations
1. [Priority 1] Split code by route
2. [Priority 2] Lazy load below-fold images
3. [Priority 3] Add caching headers

### Verification
After fixes, expected improvements:
- LCP: 2.8s → 2.2s
- Bundle size: 180KB → 120KB
```

---

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

**META-RULE:** Optimize for the 95th percentile, not the average. Your slowest users matter most.

**LOCATION RULE:** Every performance issue must include metrics, impact assessment, and before/after measurements.

**GOLDEN RULE:** The fastest code is code that doesn't run. The fastest request is the one you don't make.

---

*Related Protocols:*
- [codebase_indexing_protocol.md](codebase_indexing_protocol.md) - Find performance hotspots
- [test_automation_protocol.md](test_automation_protocol.md) - Performance testing
- [Back to Master Protocol](MASTER_PROTOCOL.md)
