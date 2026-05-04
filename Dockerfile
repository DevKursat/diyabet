FROM node:20-alpine AS base

RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV DATABASE_URL="file:./data/diyabet.db"

CMD ["npm", "start"]
