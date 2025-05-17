FROM openjdk:17-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8003

CMD ["node", "server.js"]
