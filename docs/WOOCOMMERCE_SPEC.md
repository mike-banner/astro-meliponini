# WooCommerce Integration Specification

## 1. Architecture Constraints
- **Pattern**: Static Site Generation (SSG) strict.
- **Data Source**: WooCommerce REST API (Read-Only).
- **Fetch Timing**: Build time only (`getStaticPaths`).
- **No Client-Side Fetching**: Direct calls to WooCommerce from the browser are **FORBIDDEN** to protect API keys and performance.
- **No Ecommerce Logic**: Cart, Checkout, and Account management are handled externally (e.g., redirect to WordPress or headless checkout URL).

## 2. API Security & Connection
### Credentials
- **Access**: Read-Only Consumer Key/Secret.
- **Storage**: Environment variables **ONLY**.
  - `WOOCOMMERCE_URL`
  - `WOOCOMMERCE_CONSUMER_KEY`
  - `WOOCOMMERCE_CONSUMER_SECRET`
- **Exposure**: NEVER expose these keys in `import.meta.env.PUBLIC_*`. Access them only in server-side frontmatter or `getStaticPaths`.

### Allowed Endpoints
Only the following endpoints are permitted for SSG ingestion:
1.  `GET /wc/v3/products` - List all products.
2.  `GET /wc/v3/products/categories` - List categories (for filtering).
3.  `GET /wc/v3/products/{id}` - Single product details (if not hydrated from list).

## 3. Data Schema & Normalization
Incoming WooCommerce data must be normalized into a strict TypeScript interface before use in components.

### Core Interface
```typescript
interface Product {
  id: number;
  slug: string;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string; // HTML content
  short_description: string;
  images: {
    src: string;
    alt: string;
  }[];
  attributes: {
    name: string;
    options: string[];
  }[];
  permalink: string; // Link to WP checkout/product page
}
```

## 4. SEO Responsibility
### Astro (Frontend)
- **Title**: `name` from product.
- **Description**: `short_description` (stripped of HTML) or manual excerpt.
- **Canonical**: Self-referencing to the Astro domain.
- **Open Graph**: Generated from product `images[0]`.
- **Structured Data**: `Product` JSON-LD generated at build time.

### WordPress (cms)
- Acts solely as the data entry point.
- Yoast/RankMath settings in WP are **IGNORED** unless explicitly fetched and mapped to head tags (not recommended for simplicity).

## 5. Caching & Rebuild Strategy
### Build Lifecycle
1.  **Trigger**: Webhook from WooCommerce (`product.create`, `product.update`, `product.delete`).
2.  **Action**: Triggers Cloudflare Pages deployment.
3.  **Frequency**: Rebuilds occur only on content changes.

### Image Optimization
- Source images are hosted on WordPress.
- Astro `<Image />` component must be used to optimize remote images at build time.
- `remotePatterns` must be configured in `astro.config.mjs` to allow the WP domain.

## 6. Forbidden Patterns
- ❌ **NO** `client:load` components fetching product data.
- ❌ **NO** "Add to Cart" buttons calling internal API routes.
- ❌ **NO** User authentication on the Astro side.
- ❌ **NO** Dynamic price checking (prices are static until next rebuild).
