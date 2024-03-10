# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.19.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NestJS/Prisma"

# NestJS/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Throw-away build stage to reduce size of final image
FROM base as build

# Install node modules
COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Generate Prisma Client
COPY --link prisma/schema.prisma ./prisma/schema.prisma
RUN yarn generate:schema

# Copy application code
COPY --link . .

# Build application
RUN yarn run build


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Entrypoint prepares the database.
ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD [ "node", "dist/src/main.js" ]
