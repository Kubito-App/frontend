# Kubito - Visual Discovery Platform

A Pinterest-inspired visual discovery platform for unique and trending products built with React, Node.js, and Supabase.

## 🚀 Tech Stack

- **Frontend**: React 19.1, Vite 7, TypeScript, TanStack Router, TanStack Query, Jotai, Framer Motion, Radix UI
- **Backend**: Node.js, Express, TypeScript
- **Database & Auth**: Supabase

## 📁 Project Structure

```
kubito/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/
│   │   ├── store/
│   │   └── styles/
│   └── package.json
│
└── backend/           # Express backend API
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/
    │   └── config/
    └── package.json
```

## ✨ Features

- User Authentication (Register/Login/Logout)
- Products Feed with Search & Filters
- Favorites System
- User Profiles (View & Edit)
- Settings Page
- Subscription Plans (Free, Premium, Business)
- Product Promotions System
- Fully Responsive Design

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- pnpm (v8+) - Install with `npm install -g pnpm`
- Supabase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd kubito
```

### 2. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `backend/database-schema.sql` in Supabase SQL Editor
3. Get your Project URL and API keys from Settings → API

### 3. Backend Setup
```bash
cd backend
pnpm install
cp .env.example .env
# Edit .env with your Supabase credentials
pnpm dev
```

Backend runs on `http://localhost:3001`

### 4. Frontend Setup
```bash
cd frontend
pnpm install
cp .env.example .env
# Edit .env with your configuration
pnpm dev
```

Frontend runs on `http://localhost:3000`

## 🔌 Environment Variables

### Backend (.env)
```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Building for Production

### Frontend
```bash
cd frontend
pnpm build
```

### Backend
```bash
cd backend
pnpm build
pnpm start
```

## 🎨 Design

Clean, minimalist design featuring:
- Black & White color scheme
- Inter font family
- Rounded corners & soft shadows
- Smooth animations with Framer Motion
- Pinterest-inspired masonry grid layout

## 📚 Documentation

For detailed documentation, see:
- [Frontend README](./frontend/README.md)
- [Backend API Documentation](./backend/README.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

---

Made with ❤️ for visual discovery
