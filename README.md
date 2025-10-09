# Luua UI

A modern web application built with React and TypeScript.

## 🌐 Environments

- **Development:** https://dev.luua.club/
- **Local:** http://localhost:3000/

## 📋 Prerequisites

Choose one of the following setups:

### Option 1: Docker (Recommended)

- Docker and Docker Compose

### Option 2: Local Environment

- **Node.js:** `22.14.0` (see `.nvmrc` / `.node-version`)
- **pnpm:** `10.x` (this repo uses `pnpm@10.12.4`)

> **Note:** Only pnpm is allowed as the package manager (`preinstall` script enforces this via `only-allow`)

## ⚙️ Environment Variables

Create a `.env` file in the project root (already ignored in Git). You can use `.env.example` as a template:

```bash
cp .env.example .env
```

Required variables:

```bash
# Google OAuth client ID
VITE_GOOGLE_CLIENT_ID=<your_key>

# API backend URL
VITE_LUUA_BACKEND_URL=https://api-dev.luua.club/api/v1

# LocalStorage key for user data
VITE_LUUA_LS_USER=luua-user

# PostHog analytics (optional for development)
VITE_PUBLIC_POSTHOG_KEY=<posthog_key>
VITE_PUBLIC_POSTHOG_HOST=<posthog_host>
VITE_PUBLIC_REVERSE_PROXY_URL=<reverse_proxy_url>
```

## 🚀 Getting Started

### Using Docker (Recommended)

Build and start the development server:

```bash
docker compose up --build
```

Stop the containers:

```bash
docker compose down
```

### Using Local Environment

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

> **Tip:** If you encounter Node version issues, run `nvm use` to switch to the correct version (reads from `.nvmrc`)

## 📝 Development Notes

- **Port:** Development server runs on `localhost:3000`
- **Hot Reload:** Docker development container supports hot reload with mounted volumes
- **Code Quality:** Commit hooks via Husky and formatting via lint-staged are automatically enabled
- **Node Version Management:** Use `nvm use` if Node version issues arise

## 🛠️ Available Scripts

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint

# Run tests
pnpm test
```

## 📦 Tech Stack

- React
- TypeScript
- Vite
- PostHog Analytics
- Google OAuth
