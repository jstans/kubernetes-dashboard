FROM node:14-buster-slim AS build
WORKDIR /usr/src/app
COPY ../../package.json ../../.yarnrc.yml ../../.pnp.js /
RUN yarn set version berry && \
    yarn plugin import workspace-tools && \
    yarn workspaces focus server --production && \
    npm install pm2 -g

FROM build AS run

EXPOSE 4000

CMD ["pm2-runtime", "app.js"]