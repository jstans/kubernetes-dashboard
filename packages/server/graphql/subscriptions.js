const { PubSub } = require("graphql-subscriptions");

const DEPLOYMENT_ADD = "deployment_add";
const DEPLOYMENT_DEL = "deployment_del";
const DEPLOYMENT_UPDATE = "deployment_update";

const pubsub = new PubSub();

const subscriptions = {
  deploymentAdded: {
    subscribe: () => pubsub.asyncIterator(DEPLOYMENT_ADD),
  },
  deploymentRemoved: {
    subscribe: () => pubsub.asyncIterator(DEPLOYMENT_DEL),
  },
  deploymentUpdated: {
    subscribe: () => pubsub.asyncIterator(DEPLOYMENT_UPDATE),
  },
};

const addDeployment = (deployment) =>
  pubsub.publish(DEPLOYMENT_ADD, {
    deploymentAdded: deployment,
  });
const updateDeployment = (deployment) =>
  pubsub.publish(DEPLOYMENT_UPDATE, {
    deploymentUpdated: deployment,
  });
const removeDeployment = (deployment) =>
  pubsub.publish(DEPLOYMENT_DEL, {
    deploymentRemoved: deployment,
  });

module.exports = {
  subscriptions,
  addDeployment,
  updateDeployment,
  removeDeployment,
};
