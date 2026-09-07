FROM node:22-slim

WORKDIR /app

COPY package.json ./
COPY node_modules ./node_modules
COPY dist ./dist
COPY db ./db

EXPOSE 3000

USER node

CMD ["node", "dist/main.js"]
