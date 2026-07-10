
  # Mindex

  Mindex is a minimalist psychology journal search UI. The original Figma design is available at https://www.figma.com/design/k8wISJUeoxuVUOlenngLn2/Minimalist-Psychology-Journal-UI.

  ## Running the code

  Run `npm i` to install the dependencies.

  ### Frontend only (no database)

  Run `npm run dev` — uses local seed data if API is unavailable.

  ### Full stack (frontend + API + Postgres)

  1. Start local Postgres: `npm run db:up`
  2. Copy env: `cp .env.example .env` and set `ADMIN_PASSWORD`
  3. Run: `npm run dev:full`
  4. Open http://localhost:3005

  See [docs/local-postgres-setup.md](docs/local-postgres-setup.md) for VPS setup and troubleshooting.

  ## Install as app (PWA)

  This site is a Progressive Web App (still a website, installable to the home screen).

  After deploying over **HTTPS** (or testing on `localhost`):

  - **Android (Chrome):** menu → **Install app** / **Add to Home screen**
  - **iOS (Safari):** Share → **Add to Home Screen**

  Regenerating icons: `npm run icons:pwa`
  