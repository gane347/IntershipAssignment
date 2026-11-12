# Eneba Assignment

An Eneba-style digital game marketplace built as a TypeScript monorepo. Users can browse games, compare seller offers, manage favourites and carts, and complete a simulated checkout.

## Technologies

- **Monorepo:** pnpm workspaces and Turborepo
- **Frontend:** Next.js 16, React 19, TypeScript, Material UI 9, Emotion
- **Backend:** Node.js, Express 5, TypeScript
- **Database:** PostgreSQL 16, Prisma 7
- **Authentication:** JWT and bcrypt
- **Validation:** Zod
- **Infrastructure:** Docker Compose

## Repository structure

```text
apps/
  api/                 Express API, Prisma schema, migrations, and seed
  web/                 Next.js application
packages/
  shared-types/        Shared package for cross-app types
infra/
  docker-compose.yml   Local PostgreSQL service
```

## Prerequisites

- Node.js
- pnpm 12.18.0
- Docker Desktop, for the local PostgreSQL database

Install dependencies from the repository root:

```powershell
pnpm install
```

## Configuration

Create the API environment files:

```powershell
Copy-Item apps\api\.env.example apps\api\.env
Copy-Item apps\api\.env.test.example apps\api\.env.test
Copy-Item apps\web\.env.local.example apps\web\.env.local
```

The API environment requires:

| Variable | Description |
| --- | --- |
| `PORT` | API port, normally `4000` |
| `DATABASE_URL` | PostgreSQL connection string |
| `CORS_ORIGIN` | Frontend origin, normally `http://localhost:3000` |
| `JWT_SECRET` | At least 32 characters |
| `DIGITAL_KEY_ENCRYPTION_KEY` | Exactly 64 hexadecimal characters |

The frontend uses `NEXT_PUBLIC_API_URL` when provided. Otherwise it defaults to `http://localhost:4000`.

For local development, replace the placeholder secrets in `apps/api/.env`. Do not commit environment files or real secrets.

## Database setup

Start PostgreSQL:

```powershell
pnpm db:up
```

Apply migrations:

```powershell
pnpm --filter api exec prisma migrate deploy
```

Generate the Prisma client:

```powershell
pnpm --filter api exec prisma generate
```

Populate sample data:

```powershell
pnpm --filter api db:seed
```

The seed is idempotent and creates sample buyers, sellers, games, encrypted digital keys, and seller listings.

Sample accounts:

| Role | Email | Password |
| --- | --- | --- |
| Buyer | `alex.buyer@example.com` | `BuyerPass123!` |
| Seller | `game.store@example.com` | `SellerPass123!` |

## Running the application

Run the API and frontend together:

```powershell
pnpm dev
```

Or run them separately:

```powershell
pnpm --filter api dev
pnpm --filter web dev
```

The applications are available at:

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`
- API base path: `http://localhost:4000/api/v1`

## Useful commands

```powershell
pnpm build
pnpm lint
pnpm typecheck
pnpm --filter api test
pnpm db:down
```

The API test command currently contains the existing API tests; if no matching test files are present, Vitest reports that no test files were found.

## Architecture

### Frontend

The Next.js app uses route groups:

- `(site)` contains the public marketplace layout with the header and footer.
- `(auth)` contains login and registration pages without the marketplace header or footer.

Reusable UI is kept in `apps/web/app/components`. MUI's `styled` API is used for shared components such as the header, footer, informational pages, and [GameCard](apps/web/app/components/GameCard.tsx).

The search catalog is available at `/games`. Query parameters control:

- `search`
- `platform`
- `region`
- `minPrice`
- `maxPrice`
- `sort`
- `page`

The landing page at `/` requests only featured sections from the API:

- `/api/v1/bestsellers`
- `/api/v1/best-deals`

Recently viewed game IDs are stored in browser local storage and fetched individually.

### Backend

The Express application is mounted under `/api/v1`. Market functionality is implemented in:

- `src/routes/market.routes.ts` for HTTP validation and serialization
- `src/services/market.service.ts` for marketplace queries and cart/wishlist operations
- `src/services/checkout.service.ts` for simulated checkout

Prisma models represent users, games, seller listings, favourites, and seller-specific cart items. A cart row identifies `(user, game, seller)`, allowing the same game to be purchased from different sellers at different prices.

## Implemented functionality

### Marketplace

- Landing page with best sellers, best deals, and recently viewed games
- Paginated catalog at `/games`
- Search by game name
- Platform, region, and price filters
- Sorting by name and price
- Game details with seller offers
- Lowest offer displayed on shared game cards
- Seller-specific pricing
- Seller-only game creation endpoint

### Accounts and favourites

- User registration and login
- JWT access tokens stored in browser local storage
- Current-user lookup and logout
- Seller accounts
- Favourites page at `/wishlist`
- Add/remove favourite games

### Cart and checkout

- Guest cart stored in local storage
- Authenticated cart stored in PostgreSQL
- Guest cart migration after login
- Add-to-cart action on game cards and details pages
- Exact seller listing tracked in every cart item
- Simulated authenticated checkout
- Cart total calculated from the selected seller price

### Digital keys

- Game keys are generated during seeding or seller game creation
- Keys are encrypted with AES-256-GCM before database storage
- Stored format is `iv:authTag:ciphertext`
- Keys are decrypted and returned only after successful simulated payment
- Database migration constraints reject unencrypted key formats

## API endpoint overview

### Public

- `GET /games`
- `GET /games/:gameId`
- `GET /bestsellers`
- `GET /best-deals`

### Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Authenticated marketplace actions

- `GET /wishlist`
- `POST /wishlist/:gameId`
- `DELETE /wishlist/:gameId`
- `GET /cart`
- `POST /cart/:gameId`
- `DELETE /cart/:gameId?sellerId=...`
- `POST /checkout`

## Database migrations

Migrations are stored in `apps/api/prisma/migrations` and include:

- Initial item schema
- Users, games, authentication, and seller listings
- Moving prices to `game_sellers`
- Encrypted digital keys and orders
- Encrypted key constraints
- Seller-specific cart entries

Use Prisma migration commands from the `apps/api` workspace when changing the schema:

```powershell
pnpm --filter api exec prisma migrate dev --name describe_change
pnpm --filter api exec prisma generate
```

