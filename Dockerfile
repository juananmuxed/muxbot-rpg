FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm install pm2 -g

RUN npm run build

CMD pm2 start dist/index.js -i 1 && tail -f /dev/null