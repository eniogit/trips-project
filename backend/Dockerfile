FROM node:22.12.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run test

RUN npm run build

CMD ["npm", "run", "start"]