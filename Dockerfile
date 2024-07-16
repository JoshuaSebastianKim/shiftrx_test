FROM node:20-alpine

RUN corepack enable && corepack prepare yarn@4.3.1

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN npx prisma generate

CMD ["npm", "start"]