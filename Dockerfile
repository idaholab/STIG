# --- Build stage ---
FROM node:20 AS builder

# Corporate proxy support (opt-in, off by default). Preferred: if you're
# behind a proxy that intercepts TLS and its root CA is fetchable via URL,
# pass --build-arg CORP_PROXY_CA_URL=<url> to install and trust it -- this
# alone is enough for npm to verify certificates correctly. Only fall back
# to --build-arg CORP_PROXY_INSECURE_SSL=true (disables certificate
# verification for the build) if installing a CA isn't possible.
ARG CORP_PROXY_CA_URL=""
ARG CORP_PROXY_INSECURE_SSL=false

RUN apt install -y wget ca-certificates
RUN if [ -n "$CORP_PROXY_CA_URL" ]; then \
        mkdir -p /usr/local/share/ca-certificates && \
        wget -q -P /usr/local/share/ca-certificates/ "$CORP_PROXY_CA_URL" && \
        update-ca-certificates; \
    fi

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

WORKDIR /STIG

COPY package*.json ./
RUN if [ "$CORP_PROXY_INSECURE_SSL" = "true" ]; then \
        npm config set strict-ssl false; \
        export NODE_TLS_REJECT_UNAUTHORIZED=0; \
    fi; \
    npm install

COPY app app
COPY public public
COPY src src
COPY server server
COPY *.html ./
COPY *.json ./
COPY *.cjs ./
COPY *.ts ./

RUN npm run build:all

# --- Production stage ---
FROM node:20-slim

# This stage starts from a fresh base image, so it needs the corp proxy CA
# installed again -- it doesn't inherit anything from the builder stage.
ARG CORP_PROXY_CA_URL=""
ARG CORP_PROXY_INSECURE_SSL=false

RUN if [ -n "$CORP_PROXY_CA_URL" ]; then \
        apt-get update && apt-get install -y --no-install-recommends wget ca-certificates && \
        rm -rf /var/lib/apt/lists/* && \
        mkdir -p /usr/local/share/ca-certificates && \
        wget -q -P /usr/local/share/ca-certificates/ "$CORP_PROXY_CA_URL" && \
        update-ca-certificates; \
    fi

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

WORKDIR /STIG

ENV NODE_ENV=production

COPY package*.json ./
RUN if [ "$CORP_PROXY_INSECURE_SSL" = "true" ]; then \
        npm config set strict-ssl false; \
        export NODE_TLS_REJECT_UNAUTHORIZED=0; \
    fi; \
    npm install --omit=dev; \
    npm config set strict-ssl true

COPY --from=builder /STIG/dist ./dist
COPY --from=builder /STIG/dist-server ./dist-server

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npm", "start"]
