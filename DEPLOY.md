# Deploying SFC Capital for free (Neon + Google Cloud Run)

This gets you a real, publicly-reachable URL at $0/month for low traffic.
Google Cloud Run's free tier covers 2 million requests/month; Neon's free
tier covers a small always-on Postgres database. Google still requires a
credit card on file even for the free tier (you won't be charged as long as
you stay under the free quota).

## 1. Create the database on Neon (free, no credit card)

1. Go to https://neon.tech and sign up.
2. Create a new project (any name, pick a region close to where you'll
   deploy Cloud Run — e.g. `us-central1` on GCP pairs well with Neon's
   `us-east-2` or `us-west-2`).
3. Copy the **connection string** Neon gives you — it looks like:
   `postgres://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. From your machine, with this project's dependencies installed:
   ```bash
   export DATABASE_URL="<paste Neon connection string>"
   npm run db:migrate
   npm run db:seed   # optional — loads demo data
   ```

## 2. Set up Google Cloud

1. Go to https://console.cloud.google.com, create a project (or use an
   existing one), and enable billing (required even for free-tier usage).
2. Enable the required APIs:
   ```bash
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com
   ```
3. Install the `gcloud` CLI if you haven't: https://cloud.google.com/sdk/docs/install
   Then authenticate:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

## 3. Create an Artifact Registry repo (one-time)

```bash
gcloud artifacts repositories create sfc-capital \
  --repository-format=docker \
  --location=us-central1
```

## 4. Build and push the image

From the project root (where the `Dockerfile` is):

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/sfc-capital/app
```

This builds the Docker image in the cloud (no local Docker needed) and
pushes it to your Artifact Registry repo.

## 5. Store secrets

```bash
echo -n "postgres://user:password@ep-xxxx.neon.tech/neondb?sslmode=require" | \
  gcloud secrets create database-url --data-file=-

echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create auth-secret --data-file=-
```

## 6. Deploy to Cloud Run

```bash
gcloud run deploy sfc-capital \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/sfc-capital/app \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets DATABASE_URL=database-url:latest,AUTH_SECRET=auth-secret:latest \
  --set-env-vars NEXT_PUBLIC_APP_URL=https://REPLACE-AFTER-FIRST-DEPLOY
```

Cloud Run prints a URL like `https://sfc-capital-xxxxx-uc.a.run.app` once
deployed. Update `NEXT_PUBLIC_APP_URL` to match it with a second deploy:

```bash
gcloud run services update sfc-capital \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_APP_URL=https://sfc-capital-xxxxx-uc.a.run.app
```

## 7. (Optional) Custom domain

```bash
gcloud beta run domain-mappings create \
  --service sfc-capital \
  --domain yourdomain.com \
  --region us-central1
```

Then add the DNS records Google gives you at your domain registrar.

## Redeploying after code changes

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/sfc-capital/app
gcloud run deploy sfc-capital --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/sfc-capital/app --region us-central1
```

## Notes

- The Dockerfile uses Next.js's `standalone` output — a minimal, self-contained
  server bundle. This was built and smoke-tested (login, RBAC, all page
  routes) in this environment before packaging.
- `trustHost: true` is set in `auth.config.ts` because Cloud Run sits behind
  Google's own reverse proxy/load balancer — without it, Auth.js rejects the
  forwarded host header. This is already fixed in the code.
- If you'd rather avoid the credit-card requirement entirely, Vercel's free
  tier deploys this same Next.js app with zero Docker/gcloud steps — connect
  your GitHub repo, set the same environment variables, done. Not "Google",
  but truly card-free.

## Taking real payments (Moyasar — settles to a Saudi bank account)

Stripe does **not** support Saudi Arabia as a settlement country — a Stripe
account would pay out to a foreign (US/UK) bank account, not a local Saudi
one. For real riyals landing in a real Saudi bank account, use a
SAMA-licensed Saudi gateway. This app is wired for **Moyasar**
(moyasar.com), chosen for its low fees, fast settlement (next-day for Mada),
and simple API — but the same pattern (`services/payments/moyasar.ts`)
would work similarly for Tap Payments or HyperPay if you prefer one of
those instead.

### 1. Sign up with Moyasar

1. Go to https://moyasar.com and create a merchant account.
2. You'll need either a **Commercial Registration (CR)** or, if you're an
   individual/freelancer, a **Watheeq freelance certificate** — both are
   acceptable for Moyasar onboarding.
3. Add your **Saudi IBAN** (bank account) during onboarding — this is where
   settled funds are paid out.
4. Once approved, go to Dashboard → Developers → API Keys. You'll see a
   **test** key pair and (after your account is fully verified) a **live**
   key pair. Each pair has a `sk_` (secret) and `pk_` (publishable) key.

### 2. Set environment variables

In Vercel (or your `.env` locally), set:

```
MOYASAR_SECRET_KEY=sk_live_xxxxxxxx
MOYASAR_PUBLISHABLE_KEY=pk_live_xxxxxxxx
```

Use the `sk_test_` / `pk_test_` pair first and test with
[Moyasar's test cards](https://docs.moyasar.com/testing) before switching to
live keys. Leaving both empty makes the app fall back to the built-in mock
payment flow (useful for local development without touching real money).

### 3. Set real SAR prices for each package

Moyasar only charges in SAR. Go to `/admin/packages` on your deployed site
and fill in the **"السعر بالريال السعودي — فعلي"** fields for each paid
package — this is the amount that actually gets charged. The USD fields
stay as the display price shown to visitors; they're cosmetic and don't
affect what's charged.

### 4. How the checkout flow works

1. User clicks **Subscribe** on `/packages` → `/api/checkout` creates a
   `PENDING` subscription and redirects to `/checkout/[id]`.
2. That page embeds Moyasar's own hosted **Payment Form** widget — card
   numbers go straight to Moyasar, never through this app's server.
3. Moyasar redirects back to the same page with a `?id=<payment_id>` query
   param. The app calls `/api/checkout/verify`, which fetches that payment
   from Moyasar's API **server-side** using the secret key and checks it's
   actually `paid` with the right amount and currency before marking the
   subscription `ACTIVE`. The client-side redirect is never trusted alone.

### 5. What's not built yet

Moyasar's card flow is a one-time charge per checkout, not a native
recurring-billing product (unlike Stripe Subscriptions). This integration
charges once per billing cycle selected at checkout; it does **not**
automatically re-charge the customer when that cycle ends. For true
auto-renewal, you'd add a scheduled job (e.g. a Vercel Cron Job) that
re-charges a saved card token via Moyasar's token-payment API a few days
before `endsAt` — happy to build that next if you want it.
