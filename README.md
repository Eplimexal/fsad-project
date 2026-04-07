# LoanHub Full-Stack Project (React + Spring Boot + MySQL)

This repository runs as:

- **Frontend:** React + Vite in `frontend/`
- **Backend:** Spring Boot REST API in `backend/`
- **Database (local):** MySQL Local Instance (`root` / `root`) with auto-create DB

## 1) Quick Start (Run Both Apps)

## Prerequisites

- Node.js 20+
- Java 21+
- MySQL Server running locally (MySQL Workbench Local Instance)

## Step A — Start backend

```bash
cd backend
sh mvnw spring-boot:run
```

Backend uses by default:

- DB URL: `jdbc:mysql://localhost:3306/loanhub?createDatabaseIfNotExist=true...`
- DB username/password: `root` / `root`

If `loanhub` DB does not exist, it is created automatically.

## Step B — Start frontend

Open second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Step C — Verify

- Health: `curl http://localhost:8080/api/health`
- Login with seeded users (`admin@example.com`, `lender@example.com`, `borrower@example.com`, `analyst@example.com`) using password `password123`.

## 2) Persistence behavior

- Data is now persisted in MySQL (users, offers, applications, loans, payments).
- New registrations and loan workflow data are saved to DB.
- On startup, seed data is added only when tables are empty.

## 3) Deployment configuration

For server/deployment, override DB and app settings with env vars:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `APP_CORS_ALLOWED_ORIGINS`, `APP_JWT_SECRET`, `SERVER_PORT`
