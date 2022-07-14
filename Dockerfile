FROM node:18-slim

WORKDIR /usr/src/app

COPY . .

RUN rm -rf node_modules

RUN apt-get update || : && apt-get install python -y

RUN apt-get -y install ffmpeg

RUN npm install

RUN npm install pm2 -g

RUN npm run build

CMD pm2 start dist/index.js -i 1 --name muxbot && pm2 logs muxbot