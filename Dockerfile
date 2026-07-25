FROM node:22-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./

RUN npm ci --production

COPY server/src/ ./src/

EXPOSE 3000

CMD ["node", "src/index.js"]
