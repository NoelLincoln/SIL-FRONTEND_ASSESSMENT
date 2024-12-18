# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /app

# Install required system dependencies (including OpenSSL)
RUN apt-get update && apt-get install -y openssl

# Copy package.json, yarn.lock, and install dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the application code and Prisma schema
COPY . .

# Generate Prisma Client
RUN yarn prisma generate

# Build the TypeScript application
RUN yarn build

# Stage 2: Run the application in a lightweight container
FROM node:18-slim

WORKDIR /app

# Install required system dependencies (including OpenSSL)
RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Copy the built application and production dependencies
COPY --from=build /app /app
RUN yarn install --production

# Expose the server port
EXPOSE 5000

# Add a health check (optional)
HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the server
CMD ["sh", "-c", "yarn prisma migrate deploy && node dist/src/app.js"]
