FROM node:22.15-alpine3.20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE ${PORT}

# Start the Express server
CMD ["node", "public/js/model/server.js"]