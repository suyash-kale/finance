# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal finance application built as a TypeScript monorepo with three packages:

- **`packages/database`** (`@root/database`) — Shared Drizzle ORM schemas and types for PostgreSQL
- **`packages/services`** (`@root/services`) — NestJS backend API
- **`packages/website`** (`@root/website`) — React + Vite frontend

## Common Commands

### Build

```bash
npm run build                    # Build all packages (from root)
npm run build -w packages/database   # Build database package only
npm run build -w packages/services   # Build services package only
```

### Database (run from packages/database)

```bash
npm run db:generate   # Generate migrations from schema changes
npm run db:migrate    # Apply pending migrations
npm run db:push       # Push schema directly (dev only)
npm run db:studio     # Open Drizzle Studio UI
```

### Services (run from packages/services)

```bash
npm run start:dev     # Dev server with watch mode
npm run lint          # ESLint with auto-fix
npm run format        # Prettier
npm run test          # Run all unit tests
npm run test -- --testPathPattern=accounts   # Run tests matching pattern
npm run test:watch    # Watch mode
npm run test:e2e      # E2E tests (uses test/jest-e2e.json)
```

### Website (run from packages/website)

```bash
npm run dev           # Vite dev server
npm run build         # Production build
npm run lint          # ESLint
```

## Architecture

### Database Package

Exports schemas and types via three entry points:

- `@root/database` — everything
- `@root/database/schema` — Drizzle table definitions (Users, Accounts, Transactions)
- `@root/database/types` — Request/response DTOs and type aliases

Schema type convention: each schema file exports `<Name>SchemaType = typeof <Table>.$inferSelect`.

### Services Package — NestJS Patterns

**Module structure**: Feature modules follow `module → controller → service` pattern. Each feature module imports `DatabaseModule` to get the Drizzle connection.

**Database injection**: Services receive `DrizzleDB` via `@Inject(DRIZZLE)`. The `DRIZZLE` symbol and `DrizzleDB` type are defined in `src/database/database.module.ts`.

**Auth flow**: `CurrentUserMiddleware` runs on all routes and populates `request.user` from JWT. The `@Auth()` guard (from `src/guards/auth.guard.ts`) rejects unauthenticated requests. `@CurrentUser()` decorator extracts the session. All API routes are prefixed with `/service` (GLOBAL_PREFIX).

**Ownership enforcement**: Every service query filters by `user_id` from the JWT session. Missing resources return `NOTFOUND` (not `FORBIDDEN`) to prevent information leakage.

**Error handling**: Services throw `ServiceError` (from `src/utility/error.ts`) with codes `EXISTS`, `NOTFOUND`, `VALIDATION`. Controllers map these to HTTP exceptions.

**Validation**: Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`. DTOs use `class-validator` decorators.

**Path alias**: `@/*` maps to `src/*` in services.

### Website Package

React 19 with Vite, React Router, React Hook Form, TanStack React Query for server state, Zustand for client state, and Tailwind CSS with Radix UI components.

## Environment

PostgreSQL is required. Each package needing DB access has its own `.env` with `DATABASE_URL`. The services package also requires `HASH_SALT`, `ENCRYPTION_IV`, `ENCRYPTION_PASSWORD`, and `JWT_SECRET`.
