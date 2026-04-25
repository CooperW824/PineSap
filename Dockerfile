# ---------- Builder Stage ----------
FROM node:22-slim AS builder

# Create and set working directory
WORKDIR /usr/src/app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json prisma ./
# Install dependencies (use npm ci for reproducibility if you have package-lock.json)
RUN npm install


# Copy rest of source
COPY . .
RUN npx prisma generate

# Build Next.js app
RUN npm run build


# ---------- Runner Stage ----------
FROM node:22-slim AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ARG NEXT_PUBLIC_BETTER_AUTH_URL
ENV NEXT_PUBLIC_BETTER_AUTH_URL=${NEXT_PUBLIC_BETTER_AUTH_URL}

# Install only production dependencies
COPY package*.json ./
RUN npm install --production
# Install OpenSSL
RUN apt-get update && apt-get install -y openssl


# Copy necessary files from builder
COPY --from=builder /usr/src/app/utils ./utils
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.ts ./next.config.ts
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/generated/prisma ./generated/prisma

# Expose Next.js port
EXPOSE 3000

CMD ["npm", "run", "start"]
