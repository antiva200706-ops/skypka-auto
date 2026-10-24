FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["node", "--max-old-space-size=512", "node_modules/next/dist/bin/next", "start"]
