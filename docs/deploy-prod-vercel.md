# Deploying luua-ui to Production on Vercel

This is the full runbook for moving **luua-ui** (the Luua app) from its current
Render hosting to Vercel, served at **`app.luua.club`**. It mirrors the setup
already used for `luua-landing` (a separate Vercel project per environment,
deployed by GitHub Actions, with no Vercel Git integration).

## How the model works (read this first)

- **Two Vercel projects, one repo.** `luua-ui` (dev, deploys on push to `main`)
  already exists. We add a **second, separate** project `luua-ui-prod` that
  deploys on push to the **`prod`** branch. They never share state.
- **GitHub Actions does the deploy, not Vercel's Git integration.** We keep
  Vercel's "Connect Git" feature **OFF** on both projects. Otherwise every push
  would deploy twice (once by Vercel, once by the Action) and race.
- **The Action authenticates with a token** (`VERCEL_TOKEN`) and targets a
  project by ID (`VERCEL_PROJECT_ID` for dev, `VERCEL_PROJECT_ID_PROD` for prod)
  inside the team (`VERCEL_ORG_ID`). It runs:
  ```
  vercel pull --yes --environment=production   # fetch project settings + env
  vercel build --prod                          # build using those settings
  vercel deploy --prebuilt --prod              # upload the prebuilt output
  ```
- **The domain `app.luua.club` does not change.** Only _where it points_
  changes (Render → Vercel). Because the hostname is identical, Google OAuth
  authorized origins, backend CORS, and the `.luua.club` auth cookie all keep
  working untouched.

## Differences from the luua-landing deploy

|               | luua-landing                    | luua-ui (this app)                                                       |
| ------------- | ------------------------------- | ------------------------------------------------------------------------ |
| Framework     | Next.js                         | **Vite SPA**                                                             |
| Build output  | `.next`                         | **`dist`**                                                               |
| Build command | `next build`                    | **`pnpm build`** (`tsc -b && vite build`)                                |
| Routing       | server routes                   | **client-side** — needs the SPA rewrite in `vercel.json`                 |
| Env vars      | runtime                         | **`VITE_*`, inlined at build time** — must exist _before_ the build runs |
| Domain        | apex `luua.club` (SEO-critical) | subdomain `app.luua.club` (authed app, low SEO risk)                     |

The two big gotchas for this app:

1. **Framework preset must be Vite.** When the landing's prod project was first
   created blank via CLI, Vercel didn't detect the framework and shipped a
   static deploy that returned a generic 404. We avoid that here by pinning the
   framework and build settings **in `vercel.json`** (Phase 1), so it can't
   depend on dashboard auto-detection.
2. **`VITE_*` env values are baked into the JS bundle at build time.** If they
   aren't set in the prod project before the build, the app ships pointing at
   the wrong API / with no Google client ID. Set them in Phase 3 (or Phase 4
   pull), before any build.

---

## Phase 0 — Prerequisites (one-time, local machine)

```bash
# Latest Vercel CLI
npm install --global vercel@latest
vercel --version

# Log in and confirm you're on the RIGHT account + team
vercel login
vercel whoami          # should be your Luua account
vercel teams ls        # note the team that owns luua-landing / luua-ui (the scope)
```

If `vercel whoami` shows the wrong account: `vercel logout`, then `vercel login`
again with the correct one.

> The team shown here is the same `VERCEL_ORG_ID` already used by the dev
> project — the prod project must live in the **same team** so the existing
> `VERCEL_ORG_ID` and `VERCEL_TOKEN` secrets keep working.

---

## Phase 1 — Pin build config in code, then create the prod project via CLI

### 1a. Pin the build settings in `vercel.json`

Edit `vercel.json` at the repo root so the framework, build command, and output
are explicit (works for both the dev and prod projects — both are Vite):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "rewrites": [{ "destination": "/index.html", "source": "/(.*)" }]
}
```

- `framework: "vite"` — stops the blank-project 404.
- `buildCommand` / `outputDirectory` — deterministic build, no reliance on
  dashboard detection.
- `rewrites` — the SPA fallback (already present). Every path serves
  `index.html` so TanStack Router handles routing client-side; without it,
  refreshing `/settings` etc. 404s.

Commit this on the same branch as the workflow (or its own PR) and get it into
`main` → `prod` along with everything else.

### 1b. Create the project with the CLI (the "make it" flow)

From the repo root:

```bash
cd /Users/rishabh/Dev/projects/luua/luua-ui

# Interactive: this CREATES a new project when you decline "existing"
vercel link
```

Answer the prompts:

| Prompt                                     | Answer                                      |
| ------------------------------------------ | ------------------------------------------- |
| `Set up "…/luua-ui"?`                      | **Yes**                                     |
| `Which scope should contain your project?` | the **Luua team** (same as dev)             |
| `Link to existing project?`                | **No** ← this is what makes a _new_ project |
| `What's your project's name?`              | **`luua-ui-prod`**                          |
| `In which directory is your code located?` | `./`                                        |
| Auto-detected settings (Vite)              | accept (they come from `vercel.json`)       |

Non-interactive equivalent, if you prefer:

```bash
vercel projects add luua-ui-prod
vercel link --yes --project luua-ui-prod
```

This writes `.vercel/project.json` locally (it's gitignored). Grab the project
ID — you need it for the GitHub secret:

```bash
cat .vercel/project.json
# { "projectId": "prj_XXXX", "orgId": "team_XXXX", "projectName": "luua-ui-prod" }
```

> **Do not** click "Connect Git" on this project in the Vercel dashboard. The
> GitHub Action owns deploys. A Git connection would double-deploy.

---

## Phase 2 — Confirm framework/build in the dashboard (sanity check)

Open the new `luua-ui-prod` project → **Settings → Build & Deployment** and
confirm Vercel picked up:

- **Framework Preset:** Vite
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** default (pnpm, via corepack)
- **Root Directory:** `./`
- **Node.js Version:** 22.x

These should already match because of `vercel.json`; this is just a visual
confirm. If anything is blank, set it here.

---

## Phase 3 — Set production env vars (CLI)

`luua-ui` reads these `VITE_*` vars. **Get the real production values from the
current Render service's environment** (the local `.env` may hold dev values).

Add each to the **production** environment of the new project:

```bash
# Run from luua-ui (linked to luua-ui-prod via Phase 1)
vercel env add VITE_LUUA_BACKEND_URL production
#   value: https://api.luua.club/api/v1

vercel env add VITE_GOOGLE_CLIENT_ID production
#   value: <prod Google OAuth client ID>

vercel env add VITE_LUUA_LS_USER production
#   value: <same as Render, e.g. luua-user>

vercel env add VITE_PUBLIC_POSTHOG_KEY production
vercel env add VITE_PUBLIC_POSTHOG_HOST production
#   value: https://us.i.posthog.com  (or your reverse-proxy host)

vercel env add VITE_PUBLIC_REVERSE_PROXY_URL production
```

Verify:

```bash
vercel env ls production
```

> Reminder: these are compiled into the bundle. Any change to them requires a
> **rebuild/redeploy** to take effect — there is no runtime override.

---

## Phase 4 — Add the GitHub secret

Repo **Settings → Secrets and variables → Actions → New repository secret**:

| Secret                   | Value                                                  |
| ------------------------ | ------------------------------------------------------ |
| `VERCEL_PROJECT_ID_PROD` | the `projectId` from `.vercel/project.json` (Phase 1b) |

Already present from the dev setup (do **not** recreate):

- `VERCEL_ORG_ID`
- `VERCEL_TOKEN`

The prod workflow (`.github/workflows/deploy-vercel-prod.yml`) reads
`VERCEL_PROJECT_ID_PROD`; dev's reads `VERCEL_PROJECT_ID`.

---

## Phase 5 — Manual prod deploy from your machine (verify before automation)

Do one manual prod deploy to prove the build + output works, **before** wiring
the branch trigger. This catches preset/env problems without involving Actions.

```bash
# Still linked to luua-ui-prod
vercel pull --yes --environment=production   # confirms it pulls the env you set
vercel build --prod                          # local build with prod settings
vercel deploy --prebuilt --prod              # uploads; prints a deployment URL
```

Open the printed URL (e.g. `luua-ui-prod-xxxx.vercel.app`) and check:

- App loads (not a generic 404 — if it 404s, the framework preset is wrong).
- A deep link refresh works, e.g. `…/settings` reloaded directly (SPA rewrite).
- Google login works.
- Network calls hit `https://api.luua.club/api/v1`.

If anything is wrong, fix and redeploy. Only proceed once this URL is healthy.

---

## Phase 6 — Wire the branch trigger (the two PRs)

The deploy workflow lives in code and fires on push to `prod`.

1. **PR 1 — workflow → `main`:**
   <https://github.com/luua-club/luua-ui/compare/main...ci/prod-deploy-workflow?expand=1>
   (also carries the `vercel.json` change from Phase 1a if committed on the same
   branch). Merge it.

2. **PR 2 — `main` → `prod`:**
   <https://github.com/luua-club/luua-ui/compare/prod...main?expand=1>
   This brings _everything in `main`_ into `prod`, including the workflow and the
   updated `vercel.json` (the old `prod` had no `vercel.json` at all).

> **Order matters.** Merging PR 2 pushes to `prod`, which **immediately fires
> the Action**. Phases 1–4 (project, build config, env, secret) must all be done
> first, or the Action fails. (A failed Action is harmless — nothing deploys —
> but do it in order to avoid noise.)

After PR 2 merges, watch the **Actions** tab for the "Deploy Luua App to Vercel
(Production)" run. On success, the prod project has a new production deployment
on `luua-ui-prod.vercel.app`.

---

## Phase 7 — Verify the production deployment (pre-DNS)

On `luua-ui-prod.vercel.app`, repeat the Phase 5 checks: load, deep-link
refresh, Google login, API origin. **Do not touch DNS until this is green.**

---

## Phase 8 — DNS cutover at Namecheap (`app.luua.club`)

This is the only step that affects live users. Subdomain swap, lower risk than
the apex, but still do it carefully.

### 8a. Attach the domain in Vercel

`luua-ui-prod` → **Settings → Domains → Add** → `app.luua.club`.

Vercel shows the DNS record it expects. For a subdomain it's a **CNAME**:

```
Type:  CNAME
Host:  app
Value: cname.vercel-dns.com         (use the exact value Vercel shows)
```

Vercel's status will read "Invalid Configuration" until DNS is updated — expected.

### 8b. Update the record at Namecheap

Namecheap → **Domain List → luua.club → Manage → Advanced DNS**.

1. **Screenshot the current records first** (rollback reference).
2. Find the existing `app` record (currently pointing at Render — a CNAME to
   something like `*.onrender.com`).
3. **Lower its TTL** (e.g. 1 min / Automatic) and save. Wait for the old TTL to
   expire so the change propagates fast.
4. Edit the `app` record's value to Vercel's `cname.vercel-dns.com` (Phase 8a).

> **Touch ONLY the `app` host.** Leave the apex `@`, `www`, `api`, `app-dev`,
> `api-dev`, `dev`, all `MX`, and all `TXT` (SPF/DKIM/Google verification)
> records exactly as they are. Confirm the domain is on Namecheap **BasicDNS**
> (not custom nameservers) so Advanced DNS records are authoritative.

### 8c. Wait for propagation + Vercel verification

Vercel's domain status flips to "Valid Configuration" and issues a TLS cert
automatically (usually minutes). Check propagation:

```bash
dig +short app.luua.club CNAME
# expect: cname.vercel-dns.com.
```

---

## Phase 9 — Post-cutover verification

```bash
# Resolves to Vercel, serves 200, TLS valid
curl -sI https://app.luua.club | head -n 20

# Deep link still served by SPA (200, not 404)
curl -sI https://app.luua.club/settings | head -n 5
```

In a browser on `app.luua.club`: Google login, authed routes, API calls to
`api.luua.club`, and a hard refresh on a nested route.

---

## Phase 10 — Decommission Render (after a safety window)

- Keep the Render service **running but idle** for ~1 week as rollback.
- **Rollback** = revert the `app` CNAME at Namecheap back to the Render target
  (you screenshotted it in Phase 8b). DNS-only, no redeploy.
- Once Vercel has been stable for the window, suspend/delete the Render service.

---

## Rollback summary

| Problem              | Action                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Bad deploy on Vercel | In `luua-ui-prod` → Deployments, **promote** a previous good deployment, or revert the offending commit on `prod`.   |
| DNS / domain broken  | Revert the `app` CNAME at Namecheap to the Render value.                                                             |
| Env wrong            | Fix in `vercel env`, then redeploy (`vercel build --prod && vercel deploy --prebuilt --prod`, or re-run the Action). |

## Quick reference — secrets & IDs

| Name                     | Where                        | Value                             |
| ------------------------ | ---------------------------- | --------------------------------- |
| `VERCEL_ORG_ID`          | GitHub repo secret (exists)  | the Luua team ID                  |
| `VERCEL_TOKEN`           | GitHub repo secret (exists)  | personal/team token               |
| `VERCEL_PROJECT_ID`      | GitHub repo secret (exists)  | **dev** project (`luua-ui`)       |
| `VERCEL_PROJECT_ID_PROD` | GitHub repo secret (**add**) | **prod** project (`luua-ui-prod`) |
