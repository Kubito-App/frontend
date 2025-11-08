# Frontend for Kubito - Visual Discovery Platform

Kubito is a Pinterest-inspired visual discovery platform for unique and trending products. A space where users find inspiration, discover what they want, and connect with their favorite stores.

## 🚀 Tech Stack

- React 19.1 + Vite 7+ TypeScript
- Sass (Module SCSS)
- TanStack Router (File-based routing)
- TanStack Query (Data fetching)
- Jotai (State management)
- Framer Motion (Animations)
- Radix UI (Accessible components)
- Axios (HTTP client)

## ✨ Features

- User Authentication (Register/Login/Logout)
- Products Feed with Search & Filters
- Favorites System
- User Profiles (View & Edit)
- Settings Page
- Subscription Plans
- Product Promotions
- Fully Responsive Design

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- pnpm package manager
- Backend API running (separate repository)

### Setup

```bash
# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your backend API URL and configuration
```

## 🚀 Running the App

```bash
# Start development server
pnpm dev
```

The app will be available at http://localhost:3000

**Note:** Make sure your backend API is running and the `VITE_API_URL` environment variable is correctly configured.

## 📁 Project Structure

```
kubito-frontend/
├── src/
│   ├── components/   # UI components
│   ├── config/       # Axios, Supabase config
│   ├── pages/        # Route pages
│   ├── routes/       # TanStack Router routes
│   ├── store/        # Jotai atoms (state management)
│   ├── styles/       # Global SCSS styles
│   └── types/        # TypeScript types
├── public/           # Static assets
└── index.html        # Entry point
```

## 📦 Building for Production

```bash
# Build optimized production bundle
pnpm build

# Preview production build locally
pnpm preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service (Vercel, Netlify, etc.).

## 🎨 Design

Clean, minimalist design with:
- Black & White color scheme
- Inter font family
- Rounded corners & soft shadows
- Smooth animations

---

Made with ❤️ for visual discovery
