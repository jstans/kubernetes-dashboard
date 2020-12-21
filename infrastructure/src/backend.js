const path = require("path");
const fs = require("fs");
const pulumi = require("@pulumi/pulumi");
const k8s = require("@pulumi/kubernetes");
const docker = require("@pulumi/docker");

const packageJson = require("../../packages/server/package.json");
const { name, version } = packageJson;
const appLabels = { app: name };

const registry = process.env.DOCKER_REGISTRY || "localhost:5000";

const image = new docker.Image(name, {
  imageName: pulumi.interpolate`${registry}/${name}:v${version}`,
  build: {
    context: "../",
    dockerfile: "../server.Dockerfile",
  },
});

// https://github.com/pulumi/pulumi-docker/issues/148
const imageSHA = image.imageName.apply(
  (imageName) => `sha256:${imageName.split("-").pop()}`
);

const existingKubeConfig =
  process.env.KUBECONFIG || path.join(require("os").homedir(), "/.kube/config");

const kubeConfig = new k8s.core.v1.ConfigMap(name, {
  metadata: { labels: appLabels },
  data: {
    config: fs.readFileSync(existingKubeConfig, "utf-8"),
  },
});

const node = new k8s.apps.v1.Deployment(name, {
  metadata: { name, labels: appLabels },
  spec: {
    selector: { matchLabels: appLabels },
    replicas: 1,
    template: {
      metadata: { labels: appLabels },
      spec: {
        containers: [
          {
            name,
            image: imageSHA,
            volumeMounts: [
              { name: "kube-config", mountPath: "/home/node/.kube" },
            ],
            livenessProbe: {
              httpGet: {
                path: "/health/healthz",
                port: 4000,
              },
              initialDelaySeconds: 3,
              periodSeconds: 3,
              failureThreshold: 2,
            },
            readinessProbe: {
              httpGet: {
                path: "/health/healthz",
                port: 4000,
              },
              initialDelaySeconds: 10,
              periodSeconds: 5,
            },
          },
        ],
        volumes: [
          {
            name: "kube-config",
            // secret: { secretName: `${name}-kube-config` },
            configMap: { name: kubeConfig.metadata.apply((m) => m.name) },
          },
        ],
      },
    },
  },
});
exports.name = node.metadata.name;

const backend = new k8s.core.v1.Service(name, {
  metadata: { name, labels: node.spec.template.metadata.labels },
  spec: {
    type: "ClusterIP",
    ports: [{ port: 4000, targetPort: 4000, protocol: "TCP" }],
    selector: appLabels,
  },
});
exports.ip = backend.status.status.loadBalancer.ingress[0].ip;
