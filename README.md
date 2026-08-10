# Web Site

A Node.js project with PostgreSQL database, Drizzle ORM, and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v10 or higher)
- [Docker](https://www.docker.com/) and Docker Compose

## Setup from Scratch

### 1. Clone the repository

```bash
git clone <repository-url>
cd web_site
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the database

Start PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

This runs PostgreSQL 16 on port 5432 with:

- **User:** admin
- **Password:** admin
- **Database:** db

### 4. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

> **Note:** If you changed the database credentials in `docker-compose.yml`, update `DATABASE_URL` in `.env` accordingly.

### 5. Run database migrations

Generate and apply the schema to the database:

```bash
pnpm db:gen
pnpm db:push
```

Alternatively, use `pnpm db:pull` to introspect an existing database and generate the schema.

## Available Scripts

| Command          | Description                             |
| ---------------- | --------------------------------------- |
| `pnpm db:gen`    | Generate Drizzle migrations from schema |
| `pnpm db:push`   | Push schema changes to the database     |
| `pnpm db:pull`   | Introspect database and generate schema |
| `pnpm db:studio` | Open Drizzle Studio (database GUI)      |
| `pnpm format`    | Format code with Prettier               |

## Project Structure

```
web_site/
├── src/
│   └── db/
│       └── schema.ts    # Database schema (Drizzle)
├── drizzle/             # Generated migrations
├── docker-compose.yml   # PostgreSQL container
├── drizzle.config.ts    # Drizzle Kit configuration
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment variables template
└── .env                 # Copy from .env.example (see step 4)
```

## Stopping the Database

```bash
docker compose down
```

To remove the database volume as well:

```bash
docker compose down -v
```
