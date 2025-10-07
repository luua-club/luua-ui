# Luua UI

**Testing URL:** https://dev.luua.club/

**Local Development URL:** http://localhost:3000/

## Prerequisites

Docker (optional, for dev in container)

OR

Node: 22.14.0 (see `.nvmrc` / `.node-version`)

pnpm: 10.x (repo uses `packageManager: pnpm@10.12.4`)

Only pnpm is allowed (`preinstall` uses `only-allow`)

## Environment Variables

Create a `.env` file in the project root (ignored in Git):

```bash
# Google OAuth client ID
VITE_GOOGLE_CLIENT_ID=<your_key>

# API backend URL
VITE_LUUA_BACKEND_URL=https://api-dev.luua.club/

# Optional environment name
VITE_LUUA_LS_USER=luua-user

# Optional PostHog analytics key (for dev)
VITE_PUBLIC_POSTHOG_KEY=<posthog_key>
VITE_PUBLIC_POSTHOG_HOST=<posthog_host>
```

## Install & Run

Local Development (with Docker, Recommended)

```bash
docker compose up --build
```

Local Development (without Docker)

```bash
pnpm install
pnpm dev
```

## Stop containers

```bash
docker compose down
```

### Notes

1. Dev server runs on port localhost:3000
2. Docker dev container supports hot reload with mounted volumes
3. Commit hooks via Husky and formatting via lint-staged are enabled
4. Use nvm use if Node version issues arise (reads .nvmrc)
