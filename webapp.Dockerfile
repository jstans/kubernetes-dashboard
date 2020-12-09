FROM node:14-buster-slim AS build
COPY package.json .yarnrc.yml yarn.lock /usr/src/app/
COPY packages/webapp /usr/src/app/packages/webapp
WORKDIR /usr/src/app/packages/webapp
RUN yarn install --focus --frozen-lockfile
# RUN yarn set version berry && yarn plugin import workspace-tools && yarn workspaces focus
# RUN yarn install --frozen-lockfile && \
#     yarn run build

FROM abdennour/nginx-distroless-unprivileged as run
COPY --chown=1001:0 packages/webapp/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=1001:0 /usr/src/app/packages/webapp/build/ .
WORKDIR /opt/app
EXPOSE 9090
USER 1001