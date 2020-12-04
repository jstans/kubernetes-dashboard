FROM node:14-buster-slim AS build
WORKDIR /usr/src/app
COPY package.json .pnp.js .yarnrc.yml /usr/src/app/
COPY .yarn /usr/src/app/.yarn
COPY packages/webapp /usr/src/app/packages/webapp
RUN yarn set version berry && \
    yarn plugin import workspace-tools && \
    yarn workspaces focus webapp --production && \
    cd packages/webapp && yarn run build

FROM nginx

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ONBUILD COPY ./package.json /usr/src/app
# ONBUILD RUN npm install

# ONBUILD COPY ./public /usr/src/app/public
# ONBUILD COPY ./src /usr/src/app/src
# ONBUILD RUN npm run build

# ONBUILD RUN rm -rf /usr/share/nginx/html/* || true
# ONBUILD RUN chmod -R 777 ./build/*
# ONBUILD RUN cp -r ./build/* /usr/share/nginx/html/

COPY packages/webapp/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/packages/webapp/build/ /usr/share/nginx/html/