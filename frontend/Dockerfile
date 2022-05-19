FROM node:slim as build

USER node

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM steebchen/nginx-spa:stable

EXPOSE 80

WORKDIR /app
COPY --from=build /app/build .

CMD nginx
