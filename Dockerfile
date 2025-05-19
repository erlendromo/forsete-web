FROM node:22.15-alpine3.20

WORKDIR /usr/src/app

# install system deps for pdf to image conversion
RUN apk update && \
    apk add --no-cache \
      ghostscript \
      graphicsmagick

# install node deps
COPY package*.json ./
RUN npm ci

# Compile TypeScript to JavaScript
COPY tsconfig.json src ./ 
RUN npx tsc

COPY . .
RUN npm run build

# Expose port and start the server
EXPOSE ${PORT}
CMD ["node", "public/js/model/server.js"]
