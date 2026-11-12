# Security and release status

**Prototype status — not suitable for processing live orders or personal information.**

The source currently provides a functional **local-browser demonstration**. It uses `localStorage` for account sessions, user roles, stock, pricing, customers and orders. The role selector and demo admin entry are intentionally included for local testing. They are **not authentication**. The login form does not verify the submitted password.

## Publish controls

- The GitHub Pages workflow explicitly sets `VITE_ENABLE_DEMO_MODE=true` and renders a prominent demo warning.
- Builds without demo mode disable checkout, registration, login, customer profile and admin routes. They do **not** become production commerce systems merely by providing Firebase environment variables.
- Never deploy this code under the claim that real accounts, sensitive price tiers, Firestore security, order persistence or payment processing are operational.
- Do not commit `.env.local`, private keys, JWTs, service accounts or credentials. The `.gitignore` excludes `.env*` except placeholder `.env.example`.

## Production implementation checklist

1. Implement Firebase Authentication, server-validated roles and account approvals, and server-side authorization for every privileged action.
2. Replace browser-local business data with authenticated Firestore/Cloud Functions transactions and security rules.
3. Independently validate prices, inventories, promotions, customer identity, payment state, order totals and delivery rules on the server.
4. Add operational privacy/terms policies, backup and recovery, abuse limits and integration tests.
5. Conduct security review and staging testing before taking any real order.

The original architecture plan in `docs/PHASE_1_TECHNICAL_ARCHITECTURE.md` is an intended future design, not a guarantee of implementation.
