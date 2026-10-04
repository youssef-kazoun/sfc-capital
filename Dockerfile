# ---- deps ----
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- build ----
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# DATABASE_URL isn't needed at build time (no DB calls happen during `next build`
# beyond type-checking), but Next.js still wants the env file present.
RUN test -f .env || cp .env.example .env
RUN npm run build

# ---- run ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Next.js standalone output includes a minimal server + only the deps it needs.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/db/migrations ./db/migrations
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

EXPOSE 8080
CMD ["node", "server.js"]
