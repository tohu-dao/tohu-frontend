FROM node:16 as build

ARG GA_API_KEY
ENV REACT_APP_GA_API_KEY=$GA_API_KEY

WORKDIR /app
COPY . .
RUN rm -r src/locales/translations
RUN git clone https://github.com/ExodiaFinance/exodia-translations.git src/locales/translations
RUN yarn install --frozen-lockfile
RUN yarn lingui:extract
RUN yarn lingui:compile
RUN yarn build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY ./vhost.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
