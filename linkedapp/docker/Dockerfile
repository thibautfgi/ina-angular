FROM node:16

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install bootstrap

RUN npm install @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons

CMD ["ng", "serve", "--host", "0.0.0.0"]

EXPOSE 4200