# Kubito Backend API

Express.js + TypeScript backend for Kubito visual discovery platform.

## 🚀 Tech Stack

- Node.js
- Express
- TypeScript
- Supabase (Database & Authentication)

## 📁 Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── supabase.ts   # Supabase client setup
│   ├── controllers/      # Route controllers
│   │   ├── authController.ts
│   │   ├── productsController.ts
│   │   ├── usersController.ts
│   │   ├── favoritesController.ts
│   │   └── promotionsController.ts
│   ├── middleware/       # Express middleware
│   │   └── auth.ts       # JWT authentication
│   ├── routes/           # API routes
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── users.ts
│   │   ├── favorites.ts
│   │   └── promotions.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── index.ts          # Main server file
├── database-schema.sql   # Supabase database schema
└── package.json
```

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Set up database:
- Go to your Supabase project
- Run `database-schema.sql` in SQL Editor

4. Start development server:
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (supports search & filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/user/:userId` - Get user's products
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile (auth required)
- `PUT /api/users/subscription` - Update subscription (auth required)

### Favorites
- `GET /api/favorites` - Get user's favorites (auth required)
- `POST /api/favorites` - Add favorite (auth required)
- `DELETE /api/favorites/:productId` - Remove favorite (auth required)
- `GET /api/favorites/check/:productId` - Check if favorited (auth required)

### Promotions
- `GET /api/promotions` - Get user's promotions (auth required)
- `GET /api/promotions/:id` - Get promotion by ID (auth required)
- `POST /api/promotions` - Create promotion (auth required)
- `PUT /api/promotions/:id` - Update promotion (auth required)
- `DELETE /api/promotions/:id` - Delete promotion (auth required)
- `POST /api/promotions/:id/impression` - Track impression
- `POST /api/promotions/:id/click` - Track click

## 🔐 Authentication

The API uses JWT-based authentication via Supabase Auth:

1. User registers/logs in
2. Server returns JWT access token
3. Client includes token in Authorization header: `Bearer <token>`
4. Auth middleware validates token on protected routes

## 📦 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## 🗄️ Database

The application uses Supabase PostgreSQL with the following tables:

- **users** - User profiles
- **products** - Product listings
- **favorites** - User favorites
- **promotions** - Promotion campaigns

See `database-schema.sql` for complete schema including Row-Level Security policies.

## 🛡️ Security

- JWT authentication for protected routes
- Row-Level Security (RLS) policies in Supabase
- CORS enabled for frontend origin
- Environment variables for sensitive data

## 📝 Environment Variables

```env
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```
