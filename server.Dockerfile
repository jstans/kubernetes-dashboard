FROM node:14-buster-slim AS build
WORKDIR /home/node/app
COPY [".", "."]
RUN echo '\nnodeLinker: node-modules' >> .yarnrc.yml && yarn set version berry && cd packages/server && yarn workspaces focus --production

FROM gcr.io/distroless/nodejs-debian10:14 AS run
COPY --from=build /home/node/app/packages/server /home/node/app
COPY --from=build /home/node/app/node_modules /home/node/app/node_modules
WORKDIR /home/node/app
EXPOSE 4000
USER 1000
CMD ["bin/www"]