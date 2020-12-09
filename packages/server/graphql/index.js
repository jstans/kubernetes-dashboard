const fs = require("fs");
const path = require("path");

const k8s = require("../services/k8s");
const { subscriptions } = require("./subscriptions");

const resolvers = {
  Query: {
    namespaces(parent, args, context, info) {
      return k8s.listNamespaces();
    },
    deployments(parent, args) {
      return k8s.listDeployments(args.namespace || "default");
    },
  },
  Namespace: {
    deployments(parent, args, context, info) {
      return k8s.listDeployments(parent.name || "default");
    },
  },
  Subscription: subscriptions,
};

module.exports = {
  typeDefs: fs
    .readFileSync(path.resolve(__dirname, "./schema.graphql"), "utf8")
    .toString(),
  resolvers,
};
