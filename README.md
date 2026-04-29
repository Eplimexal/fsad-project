# LoanHub Full-Stack Project (React + Spring Boot + MySQL)

This monorepo contains:

- **Frontend:** React + Vite (`frontend/`) → deploy to **Vercel**
- **Backend:** Spring Boot REST API (`backend/`) → deploy to **Render**
- **Database:** MySQL → deploy/provision on **Railway**

---

## Local development

### Prerequisites

- Node.js 20+
- Java 21+
- MySQL Server

### 1) Start backend

```bash
cd backend
sh mvnw spring-boot:run
```

By default, backend uses local MySQL:

- URL: `jdbc:mysql://localhost:3306/loanhub?...`
- Username: `root`
- Password: `root`

### 2) Start frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 3) Verify

- Health: `curl http://localhost:8080/api/health`
- Seeded login users (password: `password123`):
  - `admin@example.com`
  - `lender@example.com`
  - `borrower@example.com`
  - `analyst@example.com`

---

## Production deployment (Vercel + Render + Railway)

Follow this exact order:

### Step A — Create Railway MySQL

1. In Railway, create a **MySQL** service.
2. Copy connection values from Railway (`host`, `port`, `database`, `user`, `password`).
3. Build a JDBC URL like:

```text
jdbc:mysql://<host>:<port>/<database>?useSSL=true&requireSSL=true&serverTimezone=UTC
```

Keep these for Render env vars:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`


### Railway values to copy (based on your screenshots)

Use these Railway values for Render:

- `DB_USERNAME` = value of `MYSQLUSER` (or `MYSQL_USER` if shown that way)
- `DB_PASSWORD` = value of `MYSQL_ROOT_PASSWORD` (or `MYSQLPASSWORD`)
- `DB_NAME` = value of `MYSQL_DATABASE`
- `DB_HOST` = **public** host from `MYSQL_PUBLIC_URL` (for example `switchback.proxy.rlwy.net`)
- `DB_PORT` = **public** port from `MYSQL_PUBLIC_URL` (for example `56481`)

Then create `DB_URL` in JDBC format:

```text
jdbc:mysql://<DB_HOST>:<DB_PORT>/<DB_NAME>?useSSL=true&requireSSL=true&serverTimezone=UTC
```

Do **not** use `mysql.railway.internal` / `MYSQL_URL` on Render, because those private hostnames only work from services running inside Railway.


### Step B — Deploy backend to Render

1. Create a **Web Service** in Render from this repo.
2. Configure:
   - Root directory: `backend`
   - Build command: `./mvnw clean package -DskipTests`
   - Start command: `java -jar target/*.jar`
3. Add environment variables:
   - `PORT=10000` (Render sets `PORT` automatically; explicit is optional)
   - `DB_URL=<railway jdbc url>`
   - `DB_USERNAME=<railway username>`
   - `DB_PASSWORD=<railway password>`
   - `APP_JWT_SECRET=<long random secret>`
   - `APP_CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>`
4. Deploy and note backend URL, e.g. `https://your-api.onrender.com`.

Health check:

```bash
curl https://your-api.onrender.com/api/health
```

### Step C — Deploy frontend to Vercel

1. Create a Vercel project from this repo.
2. Set project root to `frontend`.
3. Add env var:
   - `VITE_API_URL=https://your-api.onrender.com/api`
4. Deploy.

Because `frontend/vercel.json` rewrites all routes to `index.html`, React router deep links work.

### Step D — Final CORS check

If frontend gets CORS errors, update Render variable:

- `APP_CORS_ALLOWED_ORIGINS=https://<your-actual-vercel-domain>`

Then redeploy Render.

---

## Security notes

- Never commit real DB credentials.
- Never commit production JWT secrets.
- Rotate secrets if they were ever exposed.


---


### If you see `Unable to determine Dialect without JDBC metadata`

This almost always means Render received an invalid DB URL (usually `mysql://...` instead of `jdbc:mysql://...`) or missing DB env vars.

Checklist in Render env vars:

- `DB_URL` starts with `jdbc:mysql://`
- `DB_USERNAME` is set
- `DB_PASSWORD` is set
- Host/port in `DB_URL` come from Railway **public** URL (not `mysql.railway.internal`)

Quick conversion example:

- Railway gives: `mysql://root:***@switchback.proxy.rlwy.net:56481/railway`
- Render needs:
  `DB_URL=jdbc:mysql://switchback.proxy.rlwy.net:56481/railway?useSSL=true&requireSSL=true&serverTimezone=UTC`
  plus `DB_USERNAME=root` and `DB_PASSWORD=<password>`.

