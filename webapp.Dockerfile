FROM node:14-buster-slim AS build
COPY [".", "/usr/src/app"]
WORKDIR /usr/src/app/packages/webapp
RUN yarn set version berry && yarn workspaces focus && yarn run build

FROM abdennour/nginx-distroless-unprivileged AS run
COPY --chown=1001:0 packages/webapp/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=1001:0 /usr/src/app/packages/webapp/build/ .
WORKDIR /opt/app
EXPOSE 9090
USER 1001