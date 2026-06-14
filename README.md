# Tech Market - Premium Tech & Gadget Marketplace

Tech Market is a premium e-commerce tech showcase built using Next.js (App Router), styled with TailwindCSS, and secured using Firebase Authentication.

## Key Features

- 🔐 **Firebase Authentication**: Integrated secure Sign-In, Sign-Up (Email/Password), and Google Auth provider.
- ⚙️ **State Persistence**: Custom react state synchronized with local storage, enabling creation, deletion, and editing of products without database overhead.
- 📱 **Fully Responsive Layout**: Premium theme styling with dark mode elements, sticky responsive navigations, uniform styling cards, and micro-hover states.
- 🔍 **Interactive Search & Filtering**: Multi-field sorting by Keyword Search, Category, Price Limit slider, and Rating.
- 📁 **Protected Routes**: Add Product (`/items/add`) and Manage Products (`/items/manage`) routes redirect unauthorized visitors to the Login screen.
- 🛠️ **Production Ready**: Zero linting warnings/errors and builds successfully under production configurations.

---

## Setup & Installation Instructions

Follow these steps to run the application locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd techmarket
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Ensure the `.env.local` file contains valid Firebase configurations:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` on your browser.

---

## Route Summary

| Route | Type | Description |
| :--- | :--- | :--- |
| `/` | **Public** | Home Landing Page (includes Hero, Category Grids, Featured Items, testimonials, promo banner, features). |
| `/about` | **Public** | App Mission, core values description, and team showcase. |
| `/items` | **Public** | Browse tech items catalog with search inputs and multi-faceted filtering. |
| `/items/[id]` | **Public** | Dynamic segment details page, specifications table, and related products. |
| `/login` | **Public** | Firebase credentials sign-in & Google authentication. |
| `/register` | **Public** | Firebase credentials signup page. |
| `/items/add` | **Protected** | Product creation form. Redirects unauthorized users to `/login`. |
| `/items/manage` | **Protected** | Administrative dashboard with product inventory table and Delete actions. |
