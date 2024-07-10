FROM node:22.4.1

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli@10.8.1

RUN npm install ldapjs

RUN npm install express

RUN npm install cors

RUN npm install bootstrap

RUN npm install @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons

CMD ["ng", "serve", "--host", "0.0.0.0"]

EXPOSE 4200