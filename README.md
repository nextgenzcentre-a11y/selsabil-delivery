# Selsabil Delivery — e-commerce demo (Arabic / French)

React 19, TypeScript, Vite, Tailwind CSS. Includes storefront, catalogue, cart, checkout simulation, registration, admin dashboard, product/stock/pricing management, customer and commercial modules, geographical selectors, and sample data.

> **Important — DEMONSTRATION ONLY.** Account roles, administration, order records, product stock and pricing currently use browser `localStorage`; Firebase Auth and Firestore are **not** wired to these business flows. The login form does not authenticate a password. Data is neither centralized nor protected for real-world use. Do **not** collect real customer data, fulfill orders, or assume admin access is secure. The demo banner is always shown when demo features are enabled.

## Run locally

Recommended: install [Bun](https://bun.sh/).

```bash
bun install --frozen-lockfile
cp .env.example .env.local   # Windows: Copy-Item .env.example .env.local
bun run dev
```

Vite opens on http://localhost:3000. The demo mode is automatically enabled in local development; it is disabled by default for production builds. The environment example contains only placeholders. Never commit real API keys or credentials.

## Check and build

```bash
bun run lint
bun run build
bun run preview
```

## Create a new public GitHub repository

GitHub CLI and Git must be installed, and `gh auth login` must have been completed on your computer. From the **extracted project folder**:

**Windows PowerShell:**

```powershell
.\scripts\publish-github.ps1 -RepoName selsabil-delivery
```

**macOS/Linux:**

```bash
./scripts/publish-github.sh selsabil-delivery
```

Both scripts create a **new public repository** and push all source files. If a repo of that name already exists, choose another name. The scripts do not overwrite an existing repository.

## Publish demo on GitHub Pages

1. Open the new repository on GitHub.
2. Select **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Under **Actions**, verify the `Deploy Selsabil Demo to GitHub Pages` workflow completed successfully (re-run after enabling Pages if needed).
4. Find the public site URL in **Settings → Pages** or in the deployment summary. For a standard project repository it is normally `https://<your-login>.github.io/<repository-name>/`.

The workflow deploys a clearly labeled local-browser **demo**, uses hash routing for client pages, and configures the subpath for GitHub Pages. Changing Pages settings and a successful Actions deployment are required; uploading files alone does not publish a working site.

## Before taking real orders or collecting personal data

- Replace demo `loginAs` and localStorage sessions with actual Firebase Authentication and secure server-validated roles (admin via custom claims, not email or client inputs).
- Move product prices, customer accounts, inventories, order records and invoices to server-side Firestore/Cloud Functions; enforce authorization in Firebase rules and transactions; do not trust browser totals or stock.
- Add verified order creation, inventory reservations, official merchant contact/delivery policies, legitimate privacy notices and real payment/order confirmation.
- Validate all flows in staging and remove demo-only role-switcher and sample records before enabling real commerce.
- Confirm Firebase configuration, access-control rules and database indexes; environment variables alone do not enable secure backend behavior.

See `docs/PHASE_1_TECHNICAL_ARCHITECTURE.md` for the original intended architecture (a **specification**, not all implemented). These implementation gaps are intentionally disclosed rather than represented as completed integrations.