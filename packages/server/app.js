const EventEmitter = require("events");
const http = require("http");

const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const humanize = require("humanize-number");
const { ApolloServer } = require("apollo-server-koa");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const pods = require("./routes/pods");
const { typeDefs, resolvers } = require("./graphql");
const k8s = require("./services/k8s");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());

// routes
app.use(pods.routes(), pods.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback());

// const apollo = new ApolloServer({ typeDefs, resolvers, uploads: false });
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
  // subscriptions: {
  //   path: "/subscriptions",
  //   onConnect: () => {
  //     console.log("Websocket client connected");
  //   },
  //   onOperation: (message, params, webSocket) => {
  //     console.log(`GQL <-- ${message}`);
  //   },
  // },
});
apollo.applyMiddleware({ app });
//apollo.installSubscriptionHandlers(server);
// apollo.listen().then(({ url, subscriptionsUrl }) => {
//   console.log(`🚀 Server ready at ${url}`);
//   console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
// });

// const ee = new EventEmitter();

server.once("listening", () => {
  console.log("SETTING UP SUBSCRIPTION SERVER");
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: makeExecutableSchema({ typeDefs, resolvers }),
      onConnect: () => {
        console.log("Websocket client connected");
      },
      // onOperation: (message, params, webSocket) => {
      //   const opId = message.id;
      //   const start = Date.now();
      //   function time(start) {
      //     const delta = Date.now() - start;
      //     return humanize(
      //       delta < 10000 ? delta + "ms" : Math.round(delta / 1000) + "s"
      //     );
      //   }
      //   const listener = ee.on("completed", (id) => {
      //     if (id === message.id) {
      //       console.log(`Sub >-- ${id} ${time(Date.now())}`);
      //       if (listener) ee.off(listener);
      //     }
      //   });
      //   setTimeout(() => {
      //     if (listener) {
      //       console.error("Sub Timeout 30s");
      //       ee.off(listener);
      //     }
      //   }, 30000);
      //   console.log(`Sub <-- ${message.id}`, message?.payload?.query);
      // },
      // onOperationComplete: (webSocket, opId) => {
      //   ee.emit("completed", opId);
      // },
    },
    {
      server,
      path: "/subscriptions",
    }
  );
  k8s.deploymentInformer.start();
});

module.exports = server;
