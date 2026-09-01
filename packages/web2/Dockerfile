FROM node:22 AS builder

WORKDIR /app

COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml nx.json ./

COPY packages/web2 ./packages/web2
COPY packages/storage ./packages/storage

RUN corepack enable && yarn install

ENV NX_DAEMON=false
# Must be production: a development NODE_ENV makes the React plugin emit the
# jsxDEV runtime, which crashes against react-dom's production server build.
ENV NODE_ENV=production
RUN yarn nx run extension-a11y-checker-web2:build

FROM node:22-slim

WORKDIR /app

# The Vite server bundle externalises dependencies, so the installed tree is required at runtime.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/packages/storage ./packages/storage
COPY --from=builder /app/packages/web2/package.json ./packages/web2/package.json
COPY --from=builder /app/packages/web2/dist ./packages/web2/dist

WORKDIR /app/packages/web2

EXPOSE 3000
CMD ["/app/node_modules/.bin/srvx", "--prod", "-s", "../client", "dist/server/server.js"]
