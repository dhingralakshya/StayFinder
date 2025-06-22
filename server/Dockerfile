FROM node:20.16.0-bullseye-slim
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose backend port
EXPOSE 4000

# Run migrations then start server
CMD npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && node src/server.js
