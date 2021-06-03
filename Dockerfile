FROM node:14

WORKDIR /app

COPY . .

RUN npm install && npm install -g serve
RUN npm run build 

CMD [ "serve", "-s", "build" ]

