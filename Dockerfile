# api/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Install all deps (including dev) for build
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# Remove dev deps to keep image small
RUN npm prune --production

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 8080

CMD ["node", "dist/server.js"]
