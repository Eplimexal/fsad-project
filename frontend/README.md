# Frontend (React + Vite)

This frontend now uses the Spring Boot backend at `http://localhost:8080/api`.

## Run frontend

```bash
cp .env.example .env
npm install
npm run dev
```

## Environment variables

```
VITE_API_URL=http://localhost:8080/api
```

## Important

- No offline/mock fallback is used anymore.
- Backend must be running for login, registration, and dashboard data.
