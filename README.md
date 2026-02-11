# FindIt — Lost & Found

[Live Demo](https://thelostlink.vercel.app/) • Public repository: mailktayyabali/Lost-and-found

A modern, secure, and user-friendly platform to report, search, and reunite lost items with their owners. Built with a React + Vite frontend, a Node.js + Express backend, MongoDB, Cloudinary for images, and Socket.io for real-time features.

---

Table of Contents
- About
- Live Demo
- Features
- Tech Stack
- Architecture Overview
- Repository Structure
- Getting Started (Local Development)
- Environment Variables
- Seeding the Database
- API Overview (short)
- Postman Collection
- WebSockets & Real-time
- Deployment
- Security & Best Practices
- Known Gaps & Future Improvements
- Contributing
- License
- Contact

---

About
FindIt (Lost & Found) helps users report lost and found items, message potential owners/finders, receive alerts, and manage listings through a polished dashboard. It aims to be simple, trustworthy, and fast so communities can return belongings securely.

Live Demo
- Production preview: https://lost-and-found-dusky.vercel.app

Features
- Report lost and found items with images
- Browse and search items with filters and categories
- User authentication (email/password + Google Sign-In)
- Admin dashboard to moderate listings
- Real-time messaging and typing indicators (Socket.io)
- Image uploads and management via Cloudinary
- Email notifications (welcome emails, alerts)
- Seed script to create an admin and sample content
- Postman API collection included for testing

Tech Stack
- Frontend: React (Vite), Tailwind CSS, React Router
- Backend: Node.js, Express (ES Modules)
- Database: MongoDB (Mongoose)
- Real-time: Socket.io
- Image storage: Cloudinary
- Deployment/Hosting: Vercel (frontend demo), typical Node host for backend
- Tools: Postman collection included

Architecture Overview
- Frontend (Vite + React): organized pages, contexts for auth, messaging, favorites, etc., and a central API client with interceptors.
- Backend (Express): MVC-style with routes, controllers, services (searchService, imageService, notificationService), middleware (auth, error handling), and Socket.io service for real-time.
- Images are uploaded to Cloudinary via a dedicated config + helpers.
- JWT-based authentication with role-based authorization (user/admin).

Repository Structure (high-level)
- frontend/ — React application (Vite)
- backend/ — Express API and services
  - backend/src/app.js — Express app setup (CORS, Helmet, body parsers)
  - backend/src/server.js — Server boot, DB connection, socket init
  - backend/src/config/ — DB, Cloudinary config
  - backend/src/controllers/ — API controllers (auth, items, etc.)
  - backend/src/middleware/ — auth, error handler
  - backend/src/models/ — Mongoose models (User, Item, etc.)
  - backend/src/services/ — socketService, emailService, imageService, etc.
  - backend/src/scripts/seed.js — seed script to create admin/sample data
- Lost_and_Found_API.postman_collection.json — Postman API collection
- GAP_ANALYSIS.md — gap analysis / notes about architecture and suggested improvements
- frontend/index.html — app entry page, fonts, icons

Getting started — Local Development

Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- Google OAuth Client ID (if using Google login)
- Optional: pm2 or process manager for production

Clone
```bash
git clone https://github.com/mailktayyabali/Lost-and-found.git
cd Lost-and-found
```

Install dependencies
Option A — install at root and in subfolders:
```bash
# From repository root
npm install            # installs root dev tooling (concurrently, etc.)

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
cd ..
```

Run development environment
From repository root:
```bash
npm run dev
```
This runs the concurrently script defined in the root package.json which launches the frontend (Vite dev server) and backend (backend `npm run dev`) simultaneously.

Alternatively, start services individually:
- Frontend:
  cd frontend && npm run dev
- Backend:
  cd backend && npm run dev

Build (frontend) for production
```bash
cd frontend
npm run build
# Then serve the static output using a static server or integrate with backend
```

Environment Variables
Create a `.env` file in `backend/` (and optionally in `frontend/` for any client-side runtime variables if needed). Minimum recommended variables:

Backend (.env)
- PORT=5000
- NODE_ENV=development
- MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/findit?retryWrites=true&w=majority
- JWT_SECRET=your_jwt_secret_here
- JWT_EXPIRE=7d
- FRONTEND_URL=http://localhost:5173
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret
- GOOGLE_CLIENT_ID=your_google_client_id
- SMTP_HOST=smtp.example.com
- SMTP_PORT=587
- SMTP_USER=your_smtp_user
- SMTP_PASS=your_smtp_password

Note: The backend code references process.env.FRONTEND_URL for CORS and sockets. Ensure FRONTEND_URL matches the dev or production frontend origin.

Seeding the Database
A script exists to create a super-admin and sample item.
```bash
# Ensure backend .env contains MONGODB_URI and other vars
node backend/src/scripts/seed.js
```
This script will attempt to create an admin user `admin@findit.com` with password `admin123` (hashed by the user model). Use immediately for local testing; remove or secure for production.

API Overview (short)
Key endpoints (base path: /api)
- GET /api/health — Health check
- POST /api/auth/register — Register
- POST /api/auth/login — Login (email/password)
- POST /api/auth/google — Google login (Google ID token)
- Items endpoints: CRUD for lost/found items (authenticated for create/update/delete)
- Admin routes: item moderation, user management (role-protected)
- Additional: messaging endpoints, notifications, favorites, search

For a complete list and examples, import the Postman collection: Lost_and_Found_API.postman_collection.json

Postman Collection
- File: Lost_and_Found_API.postman_collection.json (root)
- Base URL in collection: http://localhost:5000/api (update to your backend URL in collection variables)

WebSockets & Real-time
- Socket.io server is initialized in backend/src/services/socketService.js
- Features:
  - Client register to user-specific rooms (room naming: user_<userId>)
  - Conversation rooms for messaging
  - Typing and stop_typing events propagated to conversation rooms
- CORS for socket set to FRONTEND_URL — ensure this environment variable is correct

Image Uploads (Cloudinary)
- Config and helpers live in backend/src/config/cloudinary.js
- Images are uploaded with transformations (limit to 1200x1200, auto quality) and stored under folder `findit`.
- Deletion helper exists to remove images by extracting public_id from URL.

Security & Best Practices
- JWT-based auth with role-based authorize middleware for admin routes
- Helmet and CORS configured in backend/src/app.js
- Error formatting and centralized handler in backend/src/middleware/errorHandler.js
- Password hashing in User model pre-save hook
- Important: Keep JWT_SECRET, DB credentials, Cloudinary keys, and SMTP credentials secret and out of source control (use environment variables or a secrets manager).

Known Gaps & Future Improvements (extracted from GAP_ANALYSIS.md)
- Add retry/persistent queue for notification sending (avoid missed alerts)
- Normalize multipart/form-data array parsing for image updates
- Add backend linting and CI (frontend already has ESLint config)
- Improve environment configuration and avoid hardcoded ports/origins
- Add robust tests for critical flows
- Add logging/observability (structured logs, Sentry)

Contributing
Thank you for your interest! Please follow these steps:
1. Fork the repository
2. Create a feature branch: git checkout -b feat/my-feature
3. Commit your changes with clear messages
4. Open a Pull Request with a clear description and testing steps

If you'd like, open issues for planned features or bugs. Include reproduction steps and expected behavior.

License
- No license file present in repository. Add a LICENSE file (MIT, Apache-2.0, etc.) if you want others to reuse the code. Until a license is added, repository default copyright applies.

Contact
- Repository owner: https://github.com/mailktayyabali
- Demo: https://thelostlink.vercel.app

---

If you'd like, I can:
- Open a PR that adds this README.md to the repository.
- Add a basic LICENSE file (e.g., MIT).
- Create example .env.example with all variables.
- Add README badges and CI (GitHub Actions) example for automated linting & tests.
