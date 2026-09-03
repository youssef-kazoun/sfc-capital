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
