# Web Site

A Next.js blog with PostgreSQL, Payload CMS, and TypeScript.

Payload owns the content model: it generates the database schema and is the only source of
DDL. The public site reads through a thin Drizzle layer in `lib/db` for queries Payload's
Local API cannot express (recursive category paths).

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

To store Payload uploads in Vercel Blob, connect a public Blob store to the Vercel project. Vercel
adds `BLOB_READ_WRITE_TOKEN` automatically. For local development, copy that token into `.env`.
Without the token, Payload keeps uploads on the local filesystem.

### 5. Run database migrations

Apply Payload's migrations to the database:

```bash
pnpm payload:migrate
```

### 6. Seed sample content (optional)

```bash
pnpm db:seed
```

> **Warning:** the seed truncates `posts`, `categories`, `authors`, `static_contents` and
> `configs` before inserting. Only run it against an empty or throwaway database.

### 7. Create an admin user

Start the app and open [http://localhost:3000/admin](http://localhost:3000/admin) — Payload
prompts for the first user on a fresh install.

## Available Scripts

| Command                       | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| `pnpm dev`                    | Start the dev server                                 |
| `pnpm build`                  | Run Payload migrations, then build                   |
| `pnpm start`                  | Serve the production build                           |
| `pnpm lint`                   | Lint with ESLint                                     |
| `pnpm format`                 | Format code with Prettier                            |
| `pnpm db:seed`                | Seed sample content (truncates content tables first) |
| `pnpm payload:migrate`        | Apply pending Payload migrations                     |
| `pnpm payload:migrate:create` | Create a new migration from config changes           |
| `pnpm payload:types`          | Regenerate `lib/payload/generated-types.ts`          |
| `pnpm payload:db-schema`      | Regenerate `lib/payload/generated-schema.ts`         |
| `pnpm payload:importmap`      | Regenerate the admin import map                      |

## Project Structure

```
.
├── app/
│   ├── (frontend)/             # Public site routes
│   └── (payload)/              # Payload admin + REST/GraphQL routes
├── lib/
│   ├── payload/
│   │   ├── config.ts           # Payload config (aliased as @payload-config)
│   │   ├── collections/        # Collection definitions — the content model
│   │   ├── migrations/         # The only source of DDL for this database
│   │   ├── taxonomy.ts         # Status/Type values shared with the read layer
│   │   ├── seed.ts             # Sample content script
│   │   ├── generated-schema.ts # `payload generate:db-schema` — do not edit
│   │   └── generated-types.ts  # `payload generate:types` — do not edit
│   └── actions/                # Server actions for app/(payload) needs
├── docker-compose.yml          # PostgreSQL container
├── tsconfig.json               # TypeScript configuration
├── .env.example                # Environment variables template
└── .env                        # Copy from .env.example (see step 4)
```

## Stopping the Database

```bash
docker compose down
```

To remove the database volume as well:

```bash
docker compose down -v
```
