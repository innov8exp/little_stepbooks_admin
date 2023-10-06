FROM nginx:stable-alpine

WORKDIR /app

COPY ./build /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

COPY docker-entrypoint.sh /

EXPOSE 8082

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]