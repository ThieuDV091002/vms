FROM node:21 as build

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build:prod

FROM nginx:latest

COPY --from=build /usr/src/app/dist/UFE /usr/share/nginx/html
COPY replace_env.sh /replace_env.sh
ENV Version=1.0.0
RUN chmod +x /replace_env.sh
CMD ["/replace_env.sh"]
