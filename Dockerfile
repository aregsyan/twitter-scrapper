FROM node:current

RUN npm install pm2 -g

WORKDIR /app
ADD server/ /app/
RUN mkdir -p /var/log/twitter-scrapper
RUN npm install
CMD pm2 start --no-daemon ./src/app/main.js -o /var/log/twitter-scrapper/twitter-scrapper.log -e /var/log/twitter-scrapper/twitter-scrapper.err