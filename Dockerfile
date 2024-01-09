# --------------------------------------
# Build

FROM node:18 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN yarn install --production
RUN yarn add dotenv-cli

COPY . .

RUN yarn build

# --------------------------------------
# Run

FROM node:18-alpine

# Define work directory of container
WORKDIR /usr/app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.prod ./

EXPOSE 3000
CMD [ "npm", "run", "start:migrate:prod" ]