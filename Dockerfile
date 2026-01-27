### Frontend build stage
FROM node:20-alpine AS fe-build
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_GEMINI_API_KEY
ARG VITE_GEMINI_PROXY_URL
ARG VITE_OSRM_URL
ARG VITE_ETA_URL
WORKDIR /app

# Dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Source
COPY . .

# Build static assets
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID \
    VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY \
    VITE_GEMINI_PROXY_URL=$VITE_GEMINI_PROXY_URL \
    VITE_OSRM_URL=$VITE_OSRM_URL \
    VITE_ETA_URL=$VITE_ETA_URL
RUN npm run build

### ETA build stage
FROM node:20-alpine AS eta-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY server/eta-service.ts server/eta-service-spec.md ./server/
COPY tsconfig.json ./
# Keep folder layout (dist-eta/server/eta-service.js) so the runtime CMD path stays valid
RUN npx tsc server/eta-service.ts --outDir dist-eta --rootDir . --esModuleInterop --skipLibCheck --module commonjs
RUN npm prune --production

### Proxy build stage
FROM node:20-alpine AS proxy-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY server/gemini-proxy.ts ./server/
COPY tsconfig.json ./
# Keep layout dist-proxy/server/gemini-proxy.js
RUN npx tsc server/gemini-proxy.ts --outDir dist-proxy --rootDir . --esModuleInterop --skipLibCheck --module commonjs
RUN npm prune --production

### Frontend serve stage
FROM nginx:1.25-alpine AS fe-serve
RUN apk add --no-cache curl
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=fe-build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

### ETA runtime image
FROM node:20-alpine AS eta-serve
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl
COPY --from=eta-build /app/node_modules ./node_modules
COPY --from=eta-build /app/dist-eta ./dist-eta
ENV PORT=8788
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:8788/health || exit 1
CMD ["node", "./dist-eta/server/eta-service.js"]

### Proxy runtime image
FROM node:20-alpine AS proxy-serve
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl
COPY --from=proxy-build /app/node_modules ./node_modules
COPY --from=proxy-build /app/dist-proxy ./dist-proxy
ENV PORT=8787
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:8787/health || exit 1
CMD ["node", "./dist-proxy/server/gemini-proxy.js"]
