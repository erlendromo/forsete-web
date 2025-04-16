# Lightweight node image
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE ${PORT}

# Start the Express server
CMD ["node", "server.js"]