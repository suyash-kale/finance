# Drizzle-Kit Database Management Guide

## Overview

This guide covers how to use Drizzle-Kit for database schema management during active development and when preparing code for production deployment.

---

## Table of Contents

1. [Available Commands](#available-commands)
2. [Development Workflow](#development-workflow)
3. [Production Release Workflow](#production-release-workflow)
4. [CI/CD Integration](#cicd-integration)
5. [Troubleshooting](#troubleshooting)

---

## Available Commands

### `npm run db:generate`

Generate migration files from schema changes.

```bash
npm run db:generate
```

**What it does:**

1. Compares current schema with last migration
2. Generates SQL migration file in `drizzle/migrations/`
3. Prompts you to name the migration
4. Outputs the migration path

**Output example:**

```
drizzle/migrations/0001_create_users_table.sql
drizzle/migrations/0002_add_accounts_table.sql
drizzle/migrations/0003_add_transaction_status.sql
```

---

### `npm run db:push`

Apply schema directly to database (skips migrations).

```bash
npm run db:push
```

**What it does:**

1. Connects to database using DATABASE_URL
2. Introspects current database schema
3. Compares with local schema files
4. Applies differences directly
5. No migration files created

**Use for:**

- Local development
- Quick prototyping
- Schema exploration

---

### `npm run db:migrate`

Apply all pending migrations to database.

```bash
npm run db:migrate
```

**What it does:**

1. Reads all `.sql` files in `drizzle/migrations/`
2. Checks which migrations were already applied
3. Executes pending migrations in order
4. Updates `_drizzle_migrations` tracking table

**Use for:**

- Applying migrations in any environment
- CI/CD pipelines
- Deployment scripts

---

### `npm run db:studio`

Open Drizzle Studio - visual database management UI.

```bash
npm run db:studio
```

**What it does:**

1. Starts Drizzle Studio web server
2. Connects to your database
3. Opens browser to view/manage data

**Features:**

- Browse tables and data
- Run SQL queries
- Visual schema explorer
- Data editing UI

---

## Development Workflow

### Quick Iteration with `db:push`

For rapid development when you're frequently changing schemas:

```bash
# 1. Edit your schema files
# Example: src/database/schema/users.ts
# Add a new column or modify existing structure

# 2. Apply changes directly to database
npm run db:push

# 3. Test your changes immediately
npm run start:dev
```

**When to use `db:push`:**

- ✅ Active feature development
- ✅ Local development environment
- ✅ Quick prototyping and iterations
- ✅ When schema history isn't critical
- ❌ NOT for team collaboration
- ❌ NOT before production release

**Advantages:**

- Fastest feedback loop
- No manual migration naming
- Simple for solo development

**Disadvantages:**

- No migration history
- Can't track schema changes over time
- Difficult to rollback

---

## Production Release Workflow

### Generate and Commit Migrations

When preparing code for production, use migrations to ensure safe, traceable deployments:

```bash
# 1. Make all schema changes in src/database/schema/
# Review your changes carefully

# 2. Generate migration files from schema changes
npm run db:generate
# You'll be prompted to name the migration
# Example: "add_transaction_status_column"
# This creates: drizzle/migrations/0005_add_transaction_status_column.sql

# 3. Review the generated migration file
# ✓ Check the SQL is correct
# ✓ Ensure no data loss
# ✓ Verify backward compatibility if needed

# 4. Commit migration to version control
git add drizzle/migrations/
git commit -m "feat: add transaction status column"

# 5. Update related code
# Update types, services, controllers if necessary
# Commit these changes

# 6. Test in staging environment
npm run db:migrate
npm run test
npm run test:e2e
```

**When to use `db:generate` + `db:migrate`:**

- ✅ Before pulling to main/production branch
- ✅ Team collaboration projects
- ✅ Changes require audit trail
- ✅ Need rollback capability
- ✅ Multiple environments (dev, staging, prod)

**Advantages:**

- Full migration history
- Can rollback to any point
- Team-friendly version control
- Safe for multiple environments
- Audit trail for compliance

---

## CI/CD Integration

### GitHub Actions

#### Basic Migration Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: finance_prod
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/finance_prod
        run: npm run db:migrate

      - name: Run tests
        run: npm test

      - name: Run e2e tests
        run: npm run test:e2e

      - name: Build application
        run: npm run build

      - name: Deploy to production
        run: npm run start:prod
```

#### Pre-Production Validation

```yaml
# .github/workflows/validate.yml
name: Validate Migrations
on:
  pull_request:
    paths:
      - 'drizzle/migrations/**'
      - 'src/database/schema/**'
      - 'package.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: finance_test
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate migrations are present
        run: |
          if git diff --name-only origin/main | grep -q 'src/database/schema/'; then
            if ! git diff --name-only origin/main | grep -q 'drizzle/migrations/'; then
              echo "ERROR: Schema changed but no migrations generated!"
              exit 1
            fi
          fi

      - name: Test migrations on clean database
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/finance_test
        run: npm run db:migrate

      - name: Run full test suite
        run: npm test

      - name: Run e2e tests
        run: npm run test:e2e
```

#### Staging Environment Sync

```yaml
# .github/workflows/staging.yml
name: Deploy to Staging
on:
  push:
    branches: [develop]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run migrations on staging
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
        run: npm run db:migrate

      - name: Deploy to staging server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /app/finance
            git pull origin develop
            npm install
            npm run build
            npm restart
```

### Environment Variables Setup

#### GitHub Secrets Configuration

For security, store database credentials as GitHub secrets:

```bash
# In GitHub repo settings: Settings → Secrets and variables → Actions

STAGING_DATABASE_URL=postgresql://user:password@staging-db.example.com:5432/finance_staging
PROD_DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/finance_prod
STAGING_HOST=staging.example.com
STAGING_USER=deploy
STAGING_SSH_KEY=<private-ssh-key>
```

#### Local Environment Variables

```bash
# .env (NOT committed)
DATABASE_URL=postgresql://user:password@localhost:5432/finance_dev

# .env.staging (reference only, use GitHub Secrets for real values)
DATABASE_URL=postgresql://user:password@staging-db:5432/finance_staging

# .env.production (NEVER create this - use environment variables only)
# Always use GitHub Secrets or deployment platform variables instead
```

### Docker & Container Deployments

#### Dockerfile with Migrations

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY drizzle/ ./drizzle/

ENV NODE_ENV=production
EXPOSE 3000

# Run migrations before starting app
CMD ["sh", "-c", "npm run db:migrate && npm start:prod"]
```

#### Docker Compose for Testing

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: finance_test
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/finance_test
      NODE_ENV: test
    command: npm run db:migrate && npm test
```

### Continuous Integration Checklist

Before deploying migrations to production:

- [ ] All migrations reviewed for correctness
- [ ] No manual SQL edits in migration files
- [ ] Test migrations on staging database
- [ ] Run full test suite (unit + e2e)
- [ ] Verify application works with new schema
- [ ] Check for performance issues (indexes, queries)
- [ ] Backup production database before migration
- [ ] Have rollback plan if migration fails
- [ ] Monitor production logs after deployment
- [ ] Verify data integrity post-migration

### Rollback Strategy

```yaml
# .github/workflows/rollback.yml
name: Rollback Migration
on:
  workflow_dispatch:
    inputs:
      migration_version:
        description: 'Migration version to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Notify team
        run: |
          echo "⚠️ Starting rollback to migration: ${{ github.event.inputs.migration_version }}"

      - name: Create database backup
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
        run: |
          # Backup production database before rollback
          pg_dump $DATABASE_URL > backup_$(date +%s).sql

      - name: Rollback migrations
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
        run: |
          # Manual rollback: Remove migrations after target version
          # Delete migration files and re-run remaining migrations
          npm run db:migrate

      - name: Verify rollback
        run: npm test

      - name: Notify team of completion
        run: echo "✓ Rollback completed successfully"
```

---

## Troubleshooting

### Issue: Migration fails to generate

```bash
# Solution 1: Verify DATABASE_URL is set
echo $DATABASE_URL

# Solution 2: Check .env file exists
cat .env

# Solution 3: Ensure all imports are correct in schema files
npm run db:generate

# Solution 4: Clear drizzle cache
rm -rf drizzle/
npm run db:generate
```

### Issue: Schema doesn't sync to database

```bash
# Check connection string
npm run db:studio  # Try studio first to verify connection

# Manually retry push
npm run db:push

# Check database permissions
# User must have CREATE, ALTER, DROP permissions
```

### Issue: Different schemas between environments

```bash
# Generate from actual database (introspect)
npm run db:generate
# Review generated changes
cat drizzle/migrations/

# If unwanted, revert and investigate
git checkout drizzle/
```

### Issue: Too many migrations (cleanup)

```bash
# Create consolidated migration for production
npm run db:generate  # Gets current diff

# This creates a single migration with all changes
# Previous migrations still exist for reference
```

---

## Environment Setup

### Development Environment

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/finance_dev
NODE_ENV=development
```

### Staging Environment

```bash
# .env.staging
DATABASE_URL=postgresql://user:password@staging-db:5432/finance_staging
NODE_ENV=staging
```

### Production Environment

```bash
# Use environment variables, not files
# CI/CD sets: DATABASE_URL via secrets
# Never commit production credentials
```

---

## Summary

| Phase             | Command               | Use Case                       |
| ----------------- | --------------------- | ------------------------------ |
| **Development**   | `npm run db:push`     | Quick iteration, local testing |
| **Ready to Ship** | `npm run db:generate` | Create versioned migrations    |
| **Testing**       | `npm run db:migrate`  | Test migrations work           |
| **Production**    | `npm run db:migrate`  | Deploy to production           |
| **Debug**         | `npm run db:studio`   | Visual inspection              |

**Golden Rule:** Use `db:push` for development, `db:generate` + `db:migrate` for production.
