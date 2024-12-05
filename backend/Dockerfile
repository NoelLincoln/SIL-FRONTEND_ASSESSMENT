# Stage 1: Build the application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and yarn.lock
COPY backend/package*.json ./ 
COPY backend/yarn.lock ./ 

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the server application
COPY . .

# Generate Prisma Client
RUN yarn prisma generate

# Build the TypeScript application
RUN yarn build

# Stage 2: Run the application in a lightweight container
FROM node:18-alpine

WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app /app

# Install only production dependencies
RUN yarn install --production

# Expose the server port
EXPOSE 5000

# Optional: Add a health check to ensure the server is running
HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -f http://localhost:3000/health || exit 1

# Run migrations and start the server
CMD ["sh", "-c", "yarn prisma migrate deploy && yarn start"]
