FROM node:14-alpine

WORKDIR /usr/src/app

#copy package.json
COPY package.json .

#install dependencies
RUN npm install --quiet

#copy source code to workdir
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]