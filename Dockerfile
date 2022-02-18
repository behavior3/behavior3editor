FROM node:11.15.0
WORKDIR /app

RUN npm install -g bower gulp

COPY ["package.json","bower.json", "package-lock.json*", "./"]

RUN npm install --production
RUN bower install --allow-root

COPY . .

EXPOSE 8000

CMD [ "gulp", "serve" ]
