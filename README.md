# Kubito - Visual Discovery Platform

Kubito is a Pinterest-inspired visual discovery platform for unique and trending products. A space where users find inspiration, discover what they want, and connect with their favorite stores.

## 🚀 Tech Stack

### Frontend
- React 19.1 + Vite 7+ TypeScript
- Sass (Module SCSS)
- TanStack Router (File-based routing)
- TanStack Query (Data fetching)
- Jotai (State management)
- Framer Motion (Animations)
- Radix UI (Accessible components)
- Axios (HTTP client)

### Backend
- Node.js + Express + TypeScript
- Supabase (Database + Auth)

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

### 1. Set Up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run `backend/database-schema.sql` in SQL Editor
3. Get Project URL and API keys from Settings → API

### 2. Backend Setup

```bash
cd backend
pnpm install
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Frontend Setup

```bash
pnpm install
cp .env.example .env
# Edit .env with your configuration
```

## 🚀 Running the App

**Terminal 1 - Backend:**
```bash
cd backend
pnpm dev
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

- Backend: http://localhost:3001
- Frontend: http://localhost:3000

## 📁 Project Structure

```
kubito/
├── backend/           # Express API
│   ├── src/
│   │   ├── config/    # Supabase config
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── types/
│   └── database-schema.sql
│
├── src/              # React frontend
│   ├── components/   # UI components
│   ├── config/       # Axios, Supabase
│   ├── pages/        # Route pages
│   ├── store/        # Jotai atoms
│   ├── styles/       # Global styles
│   └── types/        # TypeScript types
```

## 🔌 Main API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/products` - Get products
- `GET /api/favorites` - Get favorites
- `GET /api/promotions` - Get promotions

## 📦 Building for Production

```bash
# Frontend
pnpm build

# Backend
cd backend
pnpm build
pnpm start
```

## 🎨 Design

Clean, minimalist design with:
- Black & White color scheme
- Inter font family
- Rounded corners & soft shadows
- Smooth animations

---

Made with ❤️ for visual discovery
