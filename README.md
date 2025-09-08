# Todo App - FastAPI + React + Tailwind + Docker Compose

A production-like full‑stack application demonstrating **clean API design**, **JWT auth with roles (admin/user)**, **containerized deployment**, and a **PostgreSQL** data layer. The stack is split into:

- **Frontend**: React (Vite) + Tailwind CSS, served by **Nginx** (which also proxies `/api/*` to the backend)
- **Backend**: FastAPI + Pydantic + SQLAlchemy + passlib(bcrypt) + python‑jose (JWT)
- **Infrastructure**: Docker Compose services - `frontend`, `backend`, `db` (Postgres), `pgadmin`

## Why this is relevant (Placement / Software Engineering)

- **Engineering quality** - typed models, clear separation of concerns, robust error handling.
- **Data & reliability** - relational schema, repeatable local environment, ops UI via pgAdmin.
- **Operational mindset** - reverse proxy, service orchestration, healthcheck endpoints, logs.
- **Security & access control** - OAuth2 + JWT with role in token payload; admin‑only endpoints.
- **Developer experience** - one‑command bootstrap, cohesive docs, `.env.example`, and CI‑ready layout.

## Table of Contents

1. Architecture
2. Features
3. Tech Stack
4. Quickstart (Docker)
5. Manual Dev (without Docker)
6. Environment Variables
7. Project Structure
8. API Overview
9. Security Notes
10. Useful Commands
11. Troubleshooting
12. References
13. Contributing

## **1. Architecture**

```
Browser
   │
   ▼
Nginx (frontend container)
 • serves React build
 • proxies /api/*  ─────────► FastAPI (backend)
                                   │
                                   ▼
                              PostgreSQL (db)
                                   │
                                   ▼
                                pgAdmin (ops UI)
```

- The frontend always calls the backend via **`/api/*`**. Nginx forwards these to the FastAPI service.
- FastAPI is instantiated with a reverse‑proxy‑friendly base (e.g. `root_path="/api"`), so generated URLs and redirects are correct when running behind Nginx.

## **2. Features**

- Register / Login with server‑side hashing (**bcrypt**).
- **Roles**: `user` and `admin`.
  - `user`: CRUD for own todos.
  - `admin`: global Todos view and Users view; can delete users (and all their todos).
- SPA routing with protected and admin‑only routes.
- Fully containerized local setup (frontend + backend + Postgres + pgAdmin).

## **3. Tech Stack**

- **Frontend**: React (Vite), TailwindCSS (+ optional `@tailwindcss/forms`), Axios, Nginx
- **Backend**: FastAPI, Pydantic, SQLAlchemy, passlib[bcrypt], python‑jose (JWT)
- **DB & Ops**: Postgres, pgAdmin
- **Containers**: Docker Compose

## **4. Quickstart (Docker)**

> Requirements: Docker Desktop with Compose v2.

1. Create env file from template and set values:

   ```bash
   cp .env.example .env
   ```

2. Build and run all services:

   ```bash
   docker compose up -d --build
   ```

3. Open the apps:
   - Frontend: `http://localhost:8080`
   - Backend (direct): `http://localhost:8000` (bypasses Nginx)
   - pgAdmin: `http://localhost:5050` (or the port you mapped). In pgAdmin add a server with **Host `db`**, **Port `5432`**, and credentials from `.env`.

Useful:

```bash
docker compose ps
docker compose logs -f backend   # tail backend logs
docker compose down              # stop/remove containers
```

## **5. Manual Dev (without Docker)**

**Backend**

```bash
cd app
python -m venv .venv && . .venv/Scripts/activate   # Windows
# source .venv/bin/activate                        # macOS/Linux
pip install -r ../requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm ci
npm run dev
# Open http://localhost:5173
# If you develop without Nginx proxy, set VITE_API_URL=http://localhost:8000
```

## **6. Environment Variables**

Copy `.env.example` → `.env` and fill:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `PGADMIN_DEFAULT_EMAIL`, `PGADMIN_DEFAULT_PASSWORD`
- Backend reads DB config from `DATABASE_URL` or `POSTGRES_*` vars.
- Frontend uses **Vite** envs: only variables prefixed with `VITE_` are exposed to the client (e.g., `VITE_API_URL`).

**Do not commit `.env`** — add real values only locally or in your secret manager.

## **7. Project Structure**

```
.
├─ app/                    # FastAPI application
│  ├─ main.py              # FastAPI(root_path="/api"), routers include
│  ├─ models.py            # SQLAlchemy models (Users, Todos)
│  ├─ database.py          # Session/engine
│  └─ routers/             # auth, todos, admin, users
├─ frontend/               # React + Vite + Tailwind + Nginx
│  ├─ src/
│  │  ├─ api.js            # axios baseURL = "/api"
│  │  ├─ auth.jsx          # JWT decode, role, guards
│  │  ├─ components/       # navbar components
│  │  ├─ store/            # context storage
│  │  └─ pages/            # url based pages
│  ├─ nginx.conf           # serves build and proxies /api to backend
│  └─ Dockerfile           # build (node) → runtime (nginx)
├─ requirements.txt
├─ docker-compose.yml
├─ backend.Dockerfile
├─ .env.example
└─ README.md
```

## **8. API Overview (selected)**

- `GET  /api/healthy` — health check
- `POST /api/auth` — create user (register)
- `POST /api/auth/token` — login (form‑urlencoded) → `{ "access_token": "..." }`
- `GET  /api/todos/` — list current user’s todos
- `POST /api/todos/todo` — create todo
- `GET  /api/admin/todo` — list all todos (admin)
- `GET  /api/admin/users` — list users (admin)
- `DELETE /api/admin/users/{id}` — delete user & all their todos (admin)

## **9. Security Notes**

- Passwords hashed with **bcrypt** (`passlib[bcrypt]`).
- JWT payload includes `sub`, `id`, `role`, `exp`; the backend enforces `role == "admin"` for admin endpoints.
- Reverse proxy aware: app configured to run under `/api` with Nginx forwarding, avoiding broken redirects and path issues behind a proxy.

## **10. Useful Commands (dev & smoke)**

**Smoke through the proxy (Nginx):**

```bash
curl -i http://localhost:8080/api/healthy
```

**Register (Windows CMD — escape quotes):**

```bat
curl -i -X POST http://localhost:8080/api/auth ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"u1@example.com\",\"username\":\"u1\",\"first_name\":\"U\",\"last_name\":\"One\",\"role\":\"user\",\"phone_number\":\"123\",\"password\":\"pass1234\"}"
```

**Register (PowerShell / macOS / Linux):**

```bash
curl -i -X POST http://localhost:8080/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"u1@example.com","username":"u1","first_name":"U","last_name":"One","role":"user","phone_number":"123","password":"pass1234"}'
```

**Login (form‑urlencoded):**

```bash
curl -i -X POST http://localhost:8080/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=u1&password=pass1234"
```

## **11. Troubleshooting**

- **pgAdmin can’t connect**: in pgAdmin use **Host `db`**, **Port `5432`** (containers resolve service names in the Compose network). If you run pgAdmin on host, connect to `localhost:5432` (or the mapped host port).
- **Port already allocated**: change the host port in `docker-compose.yml` (e.g., map pgAdmin `5051:80`) or stop the other process.
- **Requests end up at `/auth` (not `/api/auth`)**: frontend must call `/api/...` and Nginx must proxy `/api` to backend. FastAPI should be created with a compatible base (e.g., `FastAPI(root_path="/api")`) to make redirects/docs URLs correct behind a proxy.
- **Windows curl JSON 422**: in CMD escape double quotes inside `-d` (see commands above) or use PowerShell.

## **12. References (official docs)**

- Docker Compose — overview and CLI: https://docs.docker.com/compose/ ; https://docs.docker.com/reference/cli/docker/compose/
- Compose file reference: https://docs.docker.com/reference/compose-file/
- How Compose works: https://docs.docker.com/compose/intro/compose-application-model/
- FastAPI behind a proxy (`root_path`): https://fastapi.tiangolo.com/advanced/behind-a-proxy/
- Vite env variables (prefix `VITE_`): https://vite.dev/guide/env-and-mode
- Tailwind CSS forms plugin: https://v3.tailwindcss.com/docs/plugins and https://github.com/tailwindlabs/tailwindcss-forms
- SQLAlchemy documentation: https://docs.sqlalchemy.org/ (project site: https://www.sqlalchemy.org/)

## **13. Contributing**

Contributions are welcome: open an issue/PR with steps to reproduce and screenshots for UI changes.
