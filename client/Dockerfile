FROM node:alpine

WORKDIR /usr/src/app

COPY ["package*.json", "node_modules",  "./"]

COPY . .

RUN npm build

EXPOSE 3000

CMD ["npm", "start"]
