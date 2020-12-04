const util = require("util");
const k8s = require("@kubernetes/client-node");

const {
  addDeployment,
  updateDeployment,
  removeDeployment,
} = require("../graphql/subscriptions");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

// const informer = k8s.makeInformer(kc, "/api/v1/namespaces/default/pods", () =>
//   k8sApi.listNamespacedPod("default")
// );

const deploymentInformer = k8s.makeInformer(
  kc,
  "/apis/apps/v1/namespaces/default/deployments",
  () => appsApi.listDeploymentForAllNamespaces()
);

const listNamespaces = async () => {
  try {
    // console.log(
    //   "k8sApi",
    //   util.inspect(Object.getOwnPropertyNames(Object.getPrototypeOf(k8sApi)), {
    //     maxArrayLength: null,
    //   })
    // );
    // console.log(
    //   "appsApi",
    //   util.inspect(Object.getOwnPropertyNames(Object.getPrototypeOf(appsApi)), {
    //     maxArrayLength: null,
    //   })
    // );
    const results = await k8sApi.listNamespace();
    // console.log(
    //   "results",
    //   (results.body?.items ?? []).map((namespace) => ({
    //     name: namespace.metadata?.name ?? "<undefined>",
    //   }))
    // );
    return (results.body?.items ?? []).map((namespace) => ({
      name: namespace.metadata?.name ?? "<undefined>",
      // deployments: await appsApi.listNamespacedDeployment(namespace)
    }));
    // return (results.body?.items ?? []).map((pod) => ({
    //   id: pod.metadata?.uid,
    //   name: pod.metadata?.name ?? "<undefined>",
    //   createdAt: pod.metadata?.creationTimestamp,
    //   status: pod.status?.conditions[0]?.type ?? "Unknown",
    // }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const listDeployments = async (namespace) => {
  try {
    const results = await appsApi.listNamespacedDeployment(namespace);
    // console.log("Deployments", results);
    return (results.body?.items ?? []).map((deployment) => ({
      id: deployment.metadata?.uid,
      name: deployment.metadata?.name ?? "<undefined>",
      createdAt: deployment.metadata?.creationTimestamp,
      status: deployment.status?.conditions[0]?.type ?? "Unknown",
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const deployments = {};

deploymentInformer.on("add", (obj) => {
  // console.log(obj);
  const namespace = obj.metadata?.namespace;
  const deployment = {
    id: obj.metadata?.uid,
    name: obj.metadata?.name ?? "<undefined>",
    createdAt: obj.metadata?.creationTimestamp,
    status: obj.status?.conditions?.[0]?.type ?? "Unknown",
    namespace: { name: namespace },
  };
  console.log("TEST");
  console.log(deployment);
  if (!deployments[namespace]) deployments[namespace] = {};
  if (deployments[namespace][deployment.id]) {
    console.warn("Deployment already exists: " + deployment.id);
  } else {
    deployments[namespace][deployment.id] = deployment;
    addDeployment(deployment);
    console.log(
      `Deployment Added: ${obj.metadata?.name}`,
      util.inspect(obj, { showHidden: true, depth: null })
    );
  }
});

deploymentInformer.on("update", (obj) => {
  const namespace = obj.metadata?.namespace;
  const deployment = {
    id: obj.metadata?.uid,
    name: obj.metadata?.name ?? "<undefined>",
    createdAt: obj.metadata?.creationTimestamp,
    status: obj.status?.conditions?.[0]?.type ?? "Unknown",
    namespace: { name: namespace },
  };
  if (!deployments[namespace]) deployments[namespace] = {};
  if (
    !deployments[namespace][deployment.id] ||
    deployments[namespace][deployment.id].name !== deployment.name ||
    deployments[namespace][deployment.id].createdAt !== deployment.createdAt ||
    deployments[namespace][deployment.id].status !== deployment.status
  ) {
    deployments[namespace][deployment.id] = deployment;
    updateDeployment(deployment);
    console.log(
      `Deployment Updated: ${obj.metadata?.name}`,
      util.inspect(obj, { showHidden: true, depth: null })
    );
  }
});

deploymentInformer.on("delete", (obj) => {
  const namespace = obj.metadata?.namespace;
  const id = obj.metadata?.uid;
  if (deployments[namespace][id]) {
    delete deployments[namespace][id];
    removeDeployment({ id, namespace: { name: namespace } });
    console.log(`Deployment Deleted: ${obj.metadata?.name}`, obj);
  }
});

module.exports = {
  listNamespaces,
  listDeployments,
  deployments,
  deploymentInformer,
};
