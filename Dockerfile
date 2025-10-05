FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run generate || true
RUN npm run build || npm run build --if-present
EXPOSE 3000
CMD ["npm", "run", "start"]
