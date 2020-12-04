FROM node:14-buster-slim AS build
WORKDIR /usr/src/app
COPY package.json .pnp.js .yarnrc.yml /usr/src/app/
COPY .yarn /usr/src/app/.yarn
COPY packages/server /usr/src/app/packages/server
RUN yarn set version berry && \
    yarn plugin import workspace-tools && \
    yarn workspaces focus server --production && \
    npm install pm2 -g

FROM build AS run

EXPOSE 4000

# CMD ["pm2-runtime", "packages/server/app.js"]
CMD ["yarn", "workspace server start:prd"]