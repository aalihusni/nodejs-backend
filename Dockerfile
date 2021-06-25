FROM node:14-alpine

#copy package.json
COPY package.json .

#copy source code to workdir
COPY . .

EXPOSE 8080
