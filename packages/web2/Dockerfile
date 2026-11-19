FROM node:24 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./
# pnpm checks every workspace project against the lockfile, so the executor
# manifest is needed even though only web2 and storage get installed.
COPY packages/executor/package.json ./packages/executor/

COPY packages/web2 ./packages/web2
COPY packages/storage ./packages/storage

RUN corepack enable \
    && pnpm install --frozen-lockfile --filter . --filter "extension-a11y-checker-web2..."

ENV NX_DAEMON=false
# Must be production: a development NODE_ENV makes the React plugin emit the
# jsxDEV runtime, which crashes against react-dom's production server build.
ENV NODE_ENV=production
RUN pnpm nx run extension-a11y-checker-web2:build

FROM node:24-slim

WORKDIR /app

# The Vite server bundle externalises dependencies, so the installed tree is required at runtime.
# pnpm keeps the packages in the root store and links each project's own
# dependencies into its node_modules, so both are needed.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/storage ./packages/storage
COPY --from=builder /app/packages/web2/package.json ./packages/web2/package.json
COPY --from=builder /app/packages/web2/node_modules ./packages/web2/node_modules
COPY --from=builder /app/packages/web2/dist ./packages/web2/dist

WORKDIR /app/packages/web2

EXPOSE 3000
CMD ["/app/packages/web2/node_modules/.bin/srvx", "--prod", "-s", "../client", "dist/server/server.js"]
