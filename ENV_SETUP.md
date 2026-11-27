# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database (PostgreSQL for production)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Clerk Auth (Get these from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Twitter/X API (Optional - for live tweet fetching)
# Get your Bearer Token from https://developer.twitter.com
# Without this, sample/demo tweets will be displayed
TWITTER_BEARER_TOKEN="your_twitter_bearer_token_here"
```

## Production Database Setup

For production (Vercel), you need a proper database service. SQLite files don't work in serverless environments.

### Recommended Options:

1. **Planetscale (MySQL)** - Free tier available
   ```
   DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
   ```

2. **Neon (PostgreSQL)** - Free tier available
   ```
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
   ```

3. **Supabase (PostgreSQL)** - Free tier available
   ```
   DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
   ```

### Setup Steps:

1. Create account with one of the database providers
2. Create a new database
3. Copy the connection string
4. In Vercel dashboard:
   - Go to your project settings
   - Go to Environment Variables
   - Add `DATABASE_URL` with your connection string
5. Schema is already configured for PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Run `npx prisma migrate deploy` in production

## Local Development

1. Copy this template to `.env`
2. Replace placeholder values with your actual keys
3. Run `npx prisma generate` to generate the client
4. Run `npx prisma migrate dev` to create/update the database

## Analysis products (ODDS / STATS / NEWS / ULTIMATE)

The dashboard no longer calls n8n. `POST /api/analyze` runs the analysis in-app and needs:

| Variable | Used for |
|---|---|
| `OPENAI_API_KEY` | Report generation (`OPENAI_MODEL` optionally overrides the default `gpt-5-mini`) |
| `ODDS_API_KEY` | the-odds-api.com bookmaker lines (cached 1 hour) |
| `NEWS_API_KEY` | newsapi.org coverage of both fighters (cached 6 hours) |
| `DATABASE_URL` / `DIRECT_URL` | Neon Postgres holding users, credits and the fight history tables |

Prices in tokens: ODDS 10, STATS 5, NEWS 15, ULTIMATE 25 (see `lib/analysis/products.ts`).

### Loading the historical data

1. Apply `prisma/migrations/20261127150000_add_fight_data_tables/migration.sql` (creates `FightHistory`, `FighterProfile`, `AnalysisCache` and the `pg_trgm` extension).
2. Seed the CSVs from `prisma/data/`:

```bash
DATABASE_URL=... DIRECT_URL=... npm run db:seed-fights
```
