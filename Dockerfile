FROM node:current

RUN npm install pm2 -g

WORKDIR /app
ADD server/ /app/
RUN npm install
CMD node ./src/app/main.js