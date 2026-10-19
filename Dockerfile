# syntax=docker/dockerfile:1

# IMPORTANT: the working directory must NOT be /app.
#
# This repo has an `app/app/` route segment (the authenticated shell at
# /app/*). When the project root is literally /app, Next.js mis-resolves the
# App Router layout hierarchy and promotes app/app/layout.tsx into the root
# layout position for every route. That layout redirects to /login when there
# is no session, so every page -- including /login itself -- 307s to /login.
# Railway's default builder (Railpack) copies the repo to /app, which is why
# the site was down. Any other path builds correctly.
FROM node:20-slim AS base
# openssl is required by Prisma's query engine; ca-certificates for outbound TLS.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /srv/web

FROM base AS build
# prisma/ is copied before `npm ci` because the postinstall hook runs
# `prisma generate`, which needs the schema.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
# Build-time placeholders only, scoped to this one command so they never reach
# an image layer. `next build` constructs a PrismaClient while collecting page
# data and Auth.js requires a secret to initialise; neither value is baked into
# the output. The real values come from Railway at runtime.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    AUTH_SECRET="build-time-placeholder-not-used-at-runtime" \
    NEXT_TELEMETRY_DISABLED=1 \
    npm run build
# The standalone output leaves out static assets and public/; put them next to
# server.js so it can serve them.
RUN cp -r public .next/standalone/ \
    && cp -r .next/static .next/standalone/.next/

FROM base AS runner
# server.js reads HOSTNAME and PORT instead of CLI flags. `::` keeps the
# dual-stack bind that Railway's proxy needs (it connects over IPv6).
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=:: \
    PORT=8080
# Copies node_modules too, so the prisma CLI is available for the
# `prisma migrate deploy` pre-deploy step. Only .next/standalone runs.
COPY --from=build /srv/web ./
EXPOSE 8080
# Run the standalone server directly: no npx wrapper process and no full next
# CLI, which roughly halves resident memory compared to `npx next start`.
CMD ["node", ".next/standalone/server.js"]
