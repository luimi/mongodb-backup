FROM node:20

# Instalar herramientas MongoDB
RUN apt-get update && apt-get install -y \
    gnupg \
    wget \
    zip \
    unzip

RUN wget -qO - https://pgp.mongodb.com/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

RUN echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" \
    | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

RUN apt-get update && apt-get install -y mongodb-database-tools

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p backups uploads

EXPOSE 3000

CMD ["npm", "start"]