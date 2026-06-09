# Vercel Deployment — Luua App (Studio)

This app is deployed to Vercel through **GitHub Actions + the Vercel CLI**, not
through Vercel's native Git integration. Vercel never needs access to this private
repository: the project is built inside GitHub Actions and only the prebuilt
`.vercel/output` artifacts are uploaded.

## Project

| Item               | Value                                         |
| ------------------ | --------------------------------------------- |
| Vercel project     | `luua-ui-dev`                                 |
| Public hostname    | `app-dev.luua.club`                           |
| Framework preset   | Vite                                          |
| Deployment trigger | Push to `main`, or manual `workflow_dispatch` |
| Deployment target  | Vercel **production** (`--prod`)              |
| Workflow           | `.github/workflows/deploy-vercel.yml`         |

> The hostname says `app-dev`, but the workflow deploys to Vercel's **production**
> target on purpose. That keeps `app-dev.luua.club` pointed at the latest
> successful deployment of this project. The real `app.luua.club` will live in a
> separate `luua-ui-prod` project later — do not map both domains to this one.

## How it works

This is a **Vite single-page app** (client-side routing via TanStack Router). The
workflow follows Vercel's documented CI sequence:

1. `vercel pull --environment=production` — pulls project settings and the
   production environment variables into a local `.vercel/` directory.
2. `vercel build --prod` — runs `pnpm build` (`tsc -b && vite build`) on the runner
   and writes the deployable static output to `.vercel/output`.
3. `vercel deploy --prebuilt --prod` — uploads only those prebuilt artifacts and
   promotes them to the project's production domain (`app-dev.luua.club`).

The build uses **pnpm** (pinned via the `packageManager` field in `package.json`);
`corepack enable` in the workflow makes that exact pnpm version available.

Because `main` is built and deployed on every push, **`main` must stay green** —
a TypeScript error fails `tsc -b` and the whole deploy.

### SPA deep-link routing

`vercel.json` rewrites every unmatched path to `/index.html` so client-side routes
(e.g. opening `app-dev.luua.club/dashboard` directly, or refreshing a deep link)
resolve to the SPA instead of 404ing. Static assets are served first; only paths
with no matching file fall through to `index.html`.

## Required GitHub repository secrets

Configure these under **Settings → Secrets and variables → Actions** on the
`luua-ui` repo. They are never committed, printed, or logged.

| Secret              | Source                                                    |
| ------------------- | --------------------------------------------------------- |
| `VERCEL_TOKEN`      | Personal/team access token from Vercel → Account → Tokens |
| `VERCEL_ORG_ID`     | `orgId` from `.vercel/project.json` after `vercel link`   |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json`                   |

> `VERCEL_TOKEN` and `VERCEL_ORG_ID` are the same values used by the landing repo
> (same Vercel account/team); `VERCEL_PROJECT_ID` is unique to this project.

## Required Vercel environment variables (Production scope)

Set these in **Vercel → `luua-ui-dev` → Settings → Environment Variables** for the
**Production** environment (the workflow runs `vercel build --prod`). These are the
`VITE_*` names the app reads — Vite inlines them into the bundle at **build time**,
so they must exist before `vercel build` runs.

| Variable                        | Required? | Set to (for `app-dev.luua.club`)     | Notes                                                                                   |
| ------------------------------- | --------- | ------------------------------------ | --------------------------------------------------------------------------------------- |
| `VITE_GOOGLE_CLIENT_ID`         | **Yes**   | dev OAuth client ID                  | Google sign-in. The OAuth client must allow `https://app-dev.luua.club` as a JS origin. |
| `VITE_LUUA_BACKEND_URL`         | **Yes**   | `https://api-dev.luua.club/api/v1`   | API base (`BASE_API_URL`). Dev app → dev backend.                                       |
| `VITE_LUUA_LS_USER`             | Optional  | `luua-user`                          | LocalStorage key for cached user data.                                                  |
| `VITE_PUBLIC_POSTHOG_KEY`       | Optional  | _(leave unset to disable analytics)_ | The prod build calls `posthog.init()`; unset just disables it with a harmless warning.  |
| `VITE_PUBLIC_POSTHOG_HOST`      | Optional  | `https://us.i.posthog.com`           | Only relevant if analytics is enabled.                                                  |
| `VITE_PUBLIC_REVERSE_PROXY_URL` | Optional  | reverse-proxy origin                 | Used as PostHog `api_host` when analytics is enabled.                                   |

Vercel applies env-var changes only to **new** deployments — re-run the workflow
(or push to `main`) after changing them.

## `.vercel` must not be committed

`vercel link` and `vercel pull` write a local `.vercel/` directory containing the
org/project IDs and pulled env values. It is listed in `.gitignore` and must stay
local — never commit `.vercel/project.json` or anything under `.vercel/`.

## Domain & DNS

`app-dev.luua.club` and its DNS record are configured **manually**:

- Add the domain under **Vercel → `luua-ui-dev` → Settings → Domains**.
- Add the CNAME record Vercel shows you at the DNS provider managing `luua.club`
  (copy Vercel's exact target — it can be project-specific).
- Vercel provisions the SSL certificate automatically once DNS verifies.

## Why no native Vercel Git integration

This repository is a private organization repo. Connecting it to Vercel's native
Git integration is a paid capability, so deployment is driven entirely from GitHub
Actions using repository secrets instead. This is intentional — do not enable
Vercel's Git integration for this project.
