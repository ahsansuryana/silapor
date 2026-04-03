# ─────────────────────────────────────────
# STAGE 1: Development
# ─────────────────────────────────────────
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
# --host wajib agar Vite bisa diakses dari luar container


# ─────────────────────────────────────────
# STAGE 2: Builder (production build)
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
# Hasil build ada di /app/dist


# ─────────────────────────────────────────
# STAGE 3: Production (serve dengan Nginx)
# ─────────────────────────────────────────
FROM nginx:alpine AS production

# Copy hasil build dari stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config (handle SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]