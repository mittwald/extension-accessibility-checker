FROM --platform=amd64 node:22 AS builder

WORKDIR /app

COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml nx.json ./
COPY packages/storage/package.json ./packages/storage/
COPY packages/executor/package.json ./packages/executor/

RUN yarn install

COPY packages/storage ./packages/storage
COPY packages/executor ./packages/executor

ENV NX_DAEMON=false
RUN yarn nx run executor:build


FROM --platform=amd64 node:22-slim
WORKDIR /app

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
       fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
       libxss1 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 \
       libxdamage1 libgbm1 libgtk-3-0 libxkbcommon0 libpangocairo-1.0-0 \
       libcairo2 libpango-1.0-0 libglib2.0-0 libasound2 libx11-xcb1 \
       --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# RUN npx puppeteer@22.15.0 browsers install chrome
RUN npx puppeteer@24.2.1 browsers install chrome

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY --from=builder /app /app

CMD ["node", "--no-experimental-require-module", "packages/executor/dist/index.js"]
