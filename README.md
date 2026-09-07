# TechMarket - Premium Tech & Gadget Marketplace

TechMarket is a full-stack e-commerce app: Next.js (App Router) + TailwindCSS + Firebase Authentication on the frontend, Express + MongoDB on the backend, with a **local-AI hybrid product search** (keyword + semantic vectors, zero API cost).

## Key Features

- 🔐 **Firebase Authentication**: Email/Password + Google sign-in, protected routes, persistent sessions.
- 👥 **Role-Based Access**: Admin (`admin@techmarket.com`) gets Add Product, Manage Products, Orders, Customers; customers get cart, checkout, profile/orders.
- 🛒 **Cart & Checkout**: Cart context with localStorage persistence, checkout flow, order placement with generated order IDs.
- 📦 **Orders Management**: Filter by status/email/date, text search, sorting, pagination, single + bulk status updates.
- 🗂️ **Categories API**: MongoDB-backed categories with create/delete, dynamic filters across the shop.
- 📱 **Responsive Premium UI**: Dark/light theme, sticky nav, animated cards, skeleton loaders, toasts.
- ✨ **AI Hybrid Product Search**: Keyword + semantic (vector) ranking with Hybrid / Keyword / AI-only modes, `% match` badges, debounced live results.
- 🔍 **Global Navbar Search**: Search overlay anywhere in the app with live top-6 suggestions, mode toggle, Enter → full results page, click → product page, mobile support.
- 🔎 **Shop Filters**: Server-side search + category + max-price slider + min-rating, deep-linkable via URL (`/items?search=&mode=&category=`).

---

## How the AI Hybrid Search Works

No paid AI API. The server runs the `Xenova/all-MiniLM-L6-v2` embedding model locally via `@xenova/transformers` (`techmarket-server/embed.js`). Text is converted to a 384-dimension meaning-vector; similar meanings sit close together even with different words (e.g. "phone for gaming" matches gaming phones).

**Indexing (once at startup, refreshed on changes):**
1. `productText(p)` builds one searchable string per product: title + category + shortDescription + description + all specs.
2. `buildIndex()` embeds every product with `embedText()` (mean-pooling, normalized) into an in-memory `Map<productId, vector>`, warmed in the background so the server never blocks.
3. POST/PUT `/products` triggers a background `rebuildIndex()`; DELETE removes that id from the map. `POST /products/search/reindex` rebuilds on demand.

**Querying (`GET /products?search=&category=&mode=&limit=`):**
1. Candidates are fetched from MongoDB respecting the `category` filter.
2. `keywordScore()` gives exact-phrase/whole-word matches (title weighted over body/specs), normalized to 0–1.
3. The query is embedded and compared to each product vector with `cosineSimilarity()` (0–1).
4. Final rank: `score = 0.35 × keyword + 0.65 × semantic` (`WEIGHTS` in `embed.js`). `mode=keyword` skips the model; `mode=semantic` uses vectors only with a `0.2` relevance floor; `mode=hybrid` (default) keeps items with any keyword hit or semantic ≥ floor, sorted, sliced to `limit` (max 100).
5. If the model fails (cold start/offline), the route falls back to MongoDB regex search over title/shortDescription/description/category so search never breaks.

**Frontend flow:**
- `useProducts().searchProducts(q, { category, mode, limit })` (`src/hooks/useProducts.js`) hits the API.
- Shop page (`src/app/items/page.jsx`) debounces typing by 400ms, shows "AI ranking…" + result counts + `% match` badges, and syncs state with the URL so links are shareable.
- Navbar (`src/components/Navbar.jsx`) debounces by 350ms for top-6 live suggestions with thumbnails, price, and score; Enter pushes `/items?search=…&mode=…`, suggestion click pushes `/items/[id]`.

---

## API Quick Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/products?search=&category=&mode=hybrid\|keyword\|semantic&limit=` | List products; hybrid AI ranking when `search` is present |
| GET | `/products/:id` | Single product by string `id` or ObjectId |
| POST | `/products` | Create product (auto-reindexes search) |
| PUT | `/products/:id` | Update product (auto-reindexes search) |
| DELETE | `/products/:id` | Delete product (evicts from index) |
| POST | `/products/search/reindex` | Manually rebuild the semantic index |
| GET/POST/DELETE | `/categories`, `/categories/:slug` | List / create / delete categories |
| GET/POST/PATCH | `/orders`, `/orders/:id`, `/orders/:id/status`, `/orders/bulk-status` | Orders with search, filters, pagination, status updates |

---

## Demo Credentials

**Admin Demo:**
- **Email:** `admin@techmarket.com`
- **Password:** `admin123`

**Customer Demo:**
- **Email:** `customer@techmarket.com`
- **Password:** `customer123`

---

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd techmarket
   ```
2. **Server setup** (`techmarket-server/`):
   ```bash
   npm install
   ```
   Create `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/?appName=Cluster0
   DB_NAME=techmarketDB
   CLIENT_URL=http://localhost:3000
   ```
   First run downloads the embedding model (~90MB, one-time), then it is cached locally.
   ```bash
   npm run dev
   ```
3. **Client setup** (`techmarket-client/`):
   ```bash
   npm install
   ```
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

---

## Route Summary

| Route | Type | Description |
| :--- | :--- | :--- |
| `/` | **Public** | Home landing (hero, category grids, featured items, testimonials, promo). |
| `/about` | **Public** | Mission, values, team showcase. |
| `/contact` | **Public** | Contact page. |
| `/items` | **Public** | Catalog with AI hybrid search, category, price, rating filters. Accepts `?search=&mode=&category=`. |
| `/items/[id]` | **Public** | Details page, specs table, related products. |
| `/items/add` | **Protected (Admin)** | Product creation form. Redirects others to `/login`. |
| `/items/manage` | **Protected (Admin)** | Inventory table with edit/delete. |
| `/cart` | **Public/Protected** | Cart contents; checkout requires login. |
| `/checkout` | **Protected** | Secure checkout process. |
| `/orders` | **Protected (Admin)** | All orders with filters, search, bulk actions. |
| `/customers` | **Protected (Admin)** | Customer list. |
| `/profile` | **Protected** | User profile + own orders. |
| `/login` | **Public** | Firebase sign-in + Google auth. |
| `/register` | **Public** | Firebase sign-up. |

---

## Developer Info

- **Developer**: Sultan Md. Ayman
- **Portfolio**: [https://sm-ayman.netlify.app/](https://sm-ayman.netlify.app/)
