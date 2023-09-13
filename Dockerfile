FROM node:20.6.1

WORKDIR /app

COPY package.json . 
COPY package-lock.json .
RUN npm install

COPY . .

CMD ["npm", "start"]