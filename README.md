# HelpHub — Community Help & Volunteer Coordination Platform

A MERN-stack web app that connects people who need assistance with volunteers willing to help.

## Features

- 🔐 JWT authentication with role-based access (Requester, Volunteer, Admin)
- 📝 Help requests with categories, urgency, location, and image upload
- 🔍 Volunteer discovery with search, filter, and sort
- 🤝 Assignment flow — accept, progress, complete
- 📊 Live status tracking with timeline & progress bar
- 🔔 In-app notifications (polling, no socket setup needed)
- 📈 Dashboards with statistics and simple charts
- 🛡️ Admin console for user & request management

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Tailwind CSS v4, Axios, React Router, Recharts, lucide-react |
| Backend | Node.js, Express, JWT, bcrypt, express-validator, Multer |
| Database | MongoDB + Mongoose |
| Security | Helmet, express-rate-limit, express-mongo-sanitize, hpp |
| Tooling | Git, Postman, nodemon |

## Architecture

```
React (Vite)  →  Axios / REST  →  Express  →  Mongoose  →  MongoDB
```

React never touches MongoDB directly. All data flows through the REST API.

## Project Structure

```
helphub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, StatCard, Modal, …)
│   │   ├── context/        # AuthContext, NotificationContext
│   │   ├── pages/          # Route pages (Home, Login, Dashboard, …)
│   │   ├── services/       # Axios instance
│   │   ├── utils/          # Validators
│   │   └── App.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/             # DB connection
│   ├── controllers/        # Route logic
│   ├── middleware/         # auth, error, upload, validation, security
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── utils/              # helpers
│   ├── validators/         # express-validator chains
│   └── server.js
│
├── docs/                   # Postman collection, test cases, screenshots
│   ├── HelpHub.postman_collection.json
│   ├── TEST_CASES.md
│   └── screenshots/
│
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone

```bash
git clone https://github.com/<your-username>/helphub.git
cd helphub
```

### 2. Install backend

```bash
cd server
npm install
cp .env.example .env       # then edit values
npm run dev                # http://localhost:5000
```

### 3. Install frontend (new terminal)

```bash
cd client
npm install
cp .env.example .env
npm run dev                # http://localhost:5173
```

### 4. Open the app

Visit **http://localhost:5173** and register an account.

## Environment Variables

### `server/.env`

| Key | Purpose | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Mode | `development` |
| `MONGO_URI` | Mongo connection string | `mongodb://127.0.0.1:27017/helphub` |
| `JWT_SECRET` | Signing secret | long random string |
| `JWT_EXPIRE` | Token lifetime | `7d` |
| `CLIENT_URL` | CORS origin | `http://localhost:5173` |

### `client/.env`

| Key | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:5000/api` |

## API Overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Private | Logout |
| GET | `/api/auth/me` | Private | Current user |
| GET | `/api/users/profile` | Private | Get own profile |
| PUT | `/api/users/profile` | Private | Update own profile |
| PUT | `/api/users/profile/picture` | Private | Upload avatar |
| PUT | `/api/users/password` | Private | Change password |
| GET | `/api/requests` | Private | List (role-scoped, filterable) |
| POST | `/api/requests` | Requester | Create |
| GET | `/api/requests/:id` | Private | Get one |
| PUT | `/api/requests/:id` | Requester | Update pending |
| PATCH | `/api/requests/:id/cancel` | Requester | Cancel |
| PATCH | `/api/requests/:id/accept` | Volunteer | Accept |
| PATCH | `/api/requests/:id/status` | Volunteer | Progress update |
| GET | `/api/requests/stats/me` | Requester | Own stats |
| GET | `/api/requests/stats/volunteer` | Volunteer | Volunteer stats |
| GET | `/api/requests/stats/admin` | Admin | Global stats + charts |
| GET | `/api/notifications` | Private | List |
| PATCH | `/api/notifications/:id/read` | Private | Mark read |
| PATCH | `/api/notifications/read-all` | Private | Mark all read |
| DELETE | `/api/notifications/:id` | Private | Delete |
| GET | `/api/admin/users` | Admin | List users |
| GET | `/api/admin/users/:id` | Admin | User detail |
| PATCH | `/api/admin/users/:id/toggle-active` | Admin | Activate/deactivate |
| PATCH | `/api/admin/users/:id/role` | Admin | Change role |
| DELETE | `/api/requests/:id/admin` | Admin | Remove request |

## Response Format

All responses follow the same shape:

```json
{ "success": true, "message": "OK", "data": { } }
{ "success": false, "message": "Bad Request", "errors": [{ "field": "email", "message": "Invalid email" }] }
```

HTTP codes: **200** OK, **201** Created, **400** Bad Request, **401** Unauthorized, **403** Forbidden, **404** Not Found, **429** Rate Limited, **500** Server Error.

## Testing

Import `docs/HelpHub.postman_collection.json` into Postman and run the folders in order:

1. Auth → Register, Login (auto-saves token)
2. Requests → Create, List, Accept (as volunteer)
3. Notifications → List
4. Admin → Users, Stats

See `docs/TEST_CASES.md` for the full manual QA checklist.

## Security Notes

- Passwords hashed with **bcrypt** (10 rounds)
- JWT stored in **HTTP-only cookies** + `Authorization` header fallback
- All routes validated server-side with **express-validator**
- Rate limiting on auth (`20 / 15 min`) and general API (`300 / 15 min`)
- **Helmet** security headers
- **NoSQL injection** and **HPP** sanitization
- Request body limited to **10 KB** (uploads: 2 MB)
- Global error handler maps Mongoose/JWT/Multer errors to clean responses

## Deployment

### Backend (Render / Railway / Fly.io)

1. Push to GitHub.
2. Create a new Web Service, root directory `server/`.
3. Set environment variables (same as `.env.example`, plus `NODE_ENV=production`).
4. Build: `npm install`. Start: `npm start`.

### Frontend (Vercel / Netlify)

1. Root directory `client/`.
2. Build command: `npm run build`. Output: `dist/`.
3. Set env var `VITE_API_URL=https://<your-backend>/api`.

### Database

Use **MongoDB Atlas**. Update `MONGO_URI` on the backend host.

### Post-deploy checklist

- [ ] `CLIENT_URL` in backend env matches your deployed frontend
- [ ] CORS allows the frontend origin
- [ ] `/api/health` responds 200
- [ ] Register + login works from deployed frontend
- [ ] Uploaded images load (check `crossOriginResourcePolicy`)

## Future Enhancements

- [ ] Real-time notifications via Socket.io
- [ ] In-app chat between requester and volunteer
- [ ] Cloudinary image storage
- [ ] Automated test suite (Jest + Supertest + React Testing Library)

## License

MIT — free to use for learning and portfolio purposes.
