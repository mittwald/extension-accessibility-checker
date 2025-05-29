FROM node:22 AS builder

WORKDIR /app

COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml nx.json ./

COPY packages/web2 ./packages/web2
COPY packages/storage ./packages/storage

RUN corepack enable && yarn install

ENV NX_DAEMON=false
RUN yarn nx run web2:build

FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/packages/web2/.vinxi ./.vinxi
COPY --from=builder /app/packages/web2/.output ./.output

RUN corepack enable && yarn install

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
