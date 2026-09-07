# Auth Full Stack — React + TypeScript + Tailwind + Express + MongoDB

A production-style authentication starter with:
- React + TypeScript + Vite
- Tailwind CSS
- Lucide React icons
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Role-based authorization (user/admin)
- Protected frontend routes
- Validation and centralized API errors
- Persistent login using localStorage token
- Logout
- Clean responsive light/dark UI

## 1. Backend
```bash
cd server
npm install
copy .env.example .env
# edit .env
npm run dev
```

Required `.env`:
```env
PORT=backend_port_number
MONGO_URI=mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=frontend_url
```

## 2. Frontend
```bash
cd client
npm install
copy .env.example .env
npm run dev
```

`.env`:
```env
VITE_API_URL=backend_url
```

Demo accounts can be created from the UI. Admin registration is intentionally restricted by an `ADMIN_REGISTRATION_KEY` configured on the server.

## API
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me` — Bearer token required
- POST `/api/auth/logout`
- GET `/api/admin/dashboard` — admin role required

For real production deployment, use HTTPS, a strong JWT secret, secure httpOnly cookies, rate limiting, CSRF protection where applicable, email verification, password reset, and a secret-managed admin creation flow.
