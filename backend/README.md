# Backend (Spring Boot + MySQL)

## Local DB defaults (MySQL Workbench Local Instance)

By default, backend expects:

- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `root`
- Database: `loanhub`

It uses JDBC URL with `createDatabaseIfNotExist=true`, so the DB is automatically created when missing.

## Run backend

```bash
sh mvnw spring-boot:run
```

## Default URL

- App: `http://localhost:8080`
- API base: `http://localhost:8080/api`
- Health: `GET /api/health`
- Swagger: `http://localhost:8080/swagger-ui/index.html`

## Seeded users

If DB tables are empty, backend auto-seeds:

- `admin@example.com` / `password123`
- `lender@example.com` / `password123`
- `borrower@example.com` / `password123`
- `analyst@example.com` / `password123`

## Deploy/server overrides

Use env vars on server/deployment:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `APP_CORS_ALLOWED_ORIGINS`
- `APP_JWT_SECRET`
- `SERVER_PORT`
