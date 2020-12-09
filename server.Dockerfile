FROM node:14-buster-slim AS build
COPY package.json .yarnrc.yml yarn.lock /home/node/app/
COPY packages/server /home/node/app/packages/server
WORKDIR /home/node/app/packages/server
#RUN npm install
RUN yarn install --focus --frozen-lockfile --production=true
# RUN yarn set version berry && yarn plugin import workspace-tools && yarn workspaces focus
#    npm install pm2 -g

FROM gcr.io/distroless/nodejs-debian10:14 AS run
COPY --from=build /home/node/app/node_modules /home/node/app/node_modules
COPY --from=build /home/node/app/packages/server /home/node/app
WORKDIR /home/node/app
EXPOSE 4000
USER 1000
# CMD ["pm2-runtime", "packages/server/app.js"]
# CMD ["pm2-runtime", "bin/www", "--json" "--uid", "1000"]
CMD ["bin/www"]