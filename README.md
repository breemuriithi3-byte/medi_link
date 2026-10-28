# MediLink AI

MediLink AI is a Kenya-ready healthcare access MVP for a hackathon demonstration. It connects patients to general health education, facility discovery, appointment requests, private documents and medication reminders while keeping sensitive operations behind authenticated server routes.

> **Synthetic demo only.** This project is not a medical device or clinical decision-support system. Do not use real patient data until privacy, clinical safety, security and regulatory review are complete.

## Run locally

1. Install Node.js 20+ and PostgreSQL 15+.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and a long random `AUTH_SECRET`.
3. Run `npm install`, `npm run db:push`, and optionally `npm run db:seed`.
4. Start with `npm run dev`, then open `http://localhost:3000`.

The AI route works in a safe configuration without a key and clearly reports that AI is disabled. Set `AI_API_KEY` and `AI_API_URL` to enable a compatible language-model API. Set the DigitalOcean Spaces variables to enable private document uploads. Facility seed rows are explicitly synthetic and are not a substitute for a verified national facility registry.

## Architecture

See [docs/architecture.md](./docs/architecture.md). The Next.js App Router provides the UI and server route handlers. Prisma enforces relational ownership and appointment uniqueness in PostgreSQL. Spaces objects are private; the API issues five-minute signed download URLs only after an ownership check.

## DigitalOcean App Platform

Create a PostgreSQL Managed Database and an App Platform service connected to this repository. Configure the variables from `.env.example` in App Platform (never commit secrets). Build command: `npm run build`; run command: `npm run start`; HTTP health check: `/api/health`; port: `3000`. Run `npx prisma migrate deploy` as a release/migration step before the new version receives traffic. Use a Spaces bucket with private ACLs and a restricted access key.

Enable database daily backups and a retention window, HTTPS (App Platform provides managed TLS), log forwarding, and an external error monitor such as Sentry. Keep development and production databases and Spaces buckets separate. Start with the smallest App Platform instance and scale based on observed traffic; managed database and Spaces costs should be reviewed monthly.

## Security and compliance notes

Passwords are hashed with bcrypt, sessions are HTTP-only signed cookies, routes validate input with Zod, and document objects are private. Add production-grade rate limiting (Redis/Upstash or an App Platform-compatible gateway), CSRF protections for any cross-site embedding, centralized audit event retention, dependency scanning, secret rotation, backups/restore drills and Sentry redaction before launch. Complete a Kenyan Data Protection Act assessment, data controller/processor agreements, retention schedule, cross-border transfer review, consent notices, data-subject rights workflows, breach response plan and clinical safety review with qualified professionals before real clinical use.

## Demo script

1. Create a synthetic patient account and open the dashboard.
2. Ask “What does blood pressure mean?” in AI assistant; show the safety disclaimer and server response.
3. Search seeded facilities with `GET /api/facilities?q=clinic&county=Nairobi`.
4. Submit a future appointment request through `POST /api/appointments` after selecting a provider.
5. Upload a synthetic PDF/image; confirm the API returns a short-lived URL only for the owner.
6. Create a reminder with clinician-provided instructions.
7. Sign in as a provider seed user in a configured demo database and review the appointment.

## Testing

Run `npm test` for validation tests and `npm run build` for Prisma generation and the production build. External AI, PostgreSQL, DigitalOcean Spaces and verified mapping/facility providers require credentials and configuration; they are intentionally not faked by this repository.
