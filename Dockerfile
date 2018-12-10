FROM node:8.14.0

RUN apt-get update -y
RUN apt-get install swi-prolog=7.2.3+dfsg-6 -y

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 3003

CMD ["npm", "start"]
