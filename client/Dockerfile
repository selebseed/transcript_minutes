FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm build

EXPOSE 3000

CMD ["npm", "start"]
