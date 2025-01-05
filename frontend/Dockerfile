FROM node:22.12.0-alpine

ARG NEXT_PUBLIC_BASE_URL=http://backend:8080

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]