# Mindex

Mindex is a minimalist psychology journal search UI. The original Figma design is available at https://www.figma.com/design/k8wISJUeoxuVUOlenngLn2/Minimalist-Psychology-Journal-UI.

## Running the code

```bash
npm i
cp .env.example .env.local
npm run dev
```

Open http://localhost:3005

Set `VITE_API_BASE_URL` to your Go API origin (default `https://mindex-api.duckdns.org`). See [docs/api-endpoints.md](docs/api-endpoints.md).

If the API is offline, the UI falls back to local seed data (read-only).

## Install as app (PWA)

This site is a Progressive Web App (still a website, installable to the home screen).

After deploying over **HTTPS** (or testing on `localhost`):

- **Android (Chrome):** menu → **Install app** / **Add to Home screen**
- **iOS (Safari):** Share → **Add to Home Screen**

Regenerating icons: `npm run icons:pwa`
