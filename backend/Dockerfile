# ─────────────────────────────────────────
# STAGE 1: Development
# ─────────────────────────────────────────
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]   # pakai ts-node atau tsx


# ─────────────────────────────────────────
# STAGE 2: Builder (compile TS → JS)
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build   # tsc → output ke /dist


# ─────────────────────────────────────────
# STAGE 3: Production (jalankan JS hasil compile)
# ─────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/index.js"]   # jalankan JS, bukan TS