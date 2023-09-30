FROM node:lts AS install
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates procps libxss1 \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     # Install google chrome and all its deps (used by puppeteer)
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh

EXPOSE 3000

WORKDIR /app

COPY package.json .
COPY package-lock.json .

FROM install as build

RUN npm ci

COPY . .

RUN npm run build

CMD node build/index.js

FROM install as production-build

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/build /app/build

RUN npm ci --only=production

EXPOSE 3000

CMD node build/index.js
