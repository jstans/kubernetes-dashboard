const fs = require("fs");
const pulumi = require("@pulumi/pulumi");
const k8s = require("@pulumi/kubernetes");
const docker = require("@pulumi/docker");

const appLabels = { app: "server" };

const name = require("../../packages/server/package.json").name;

const imageName = name;
const image = new docker.Image(name, {
  // imageName: pulumi.interpolate`${name}:v1.0.0`,
  imageName,
  localImageName: name,
  build: {
    context: "../",
    dockerfile: "../server.Dockerfile",
  },
  skipPush: true,
});

const kubeConfig = new k8s.core.v1.ConfigMap(appName, {
  metadata: { labels: appLabels },
  data: {
    config: ```
      apiVersion: v1
      clusters:
      - cluster:
          certificate-authority: fake-ca-file
          server: https://1.2.3.4
        name: development
      contexts:
      - context:
          cluster: development
          namespace: frontend
          user: developer
        name: dev-frontend
      current-context: dev-frontend
      kind: Config
      preferences: {}
      users:
      - name: developer
        user:
          client-certificate: fake-cert-file
          client-key: fake-key-file
    ```,
  },
});

const node = new k8s.apps.v1.Deployment(name, {
  spec: {
    selector: { matchLabels: appLabels },
    replicas: 1,
    template: {
      metadata: { labels: appLabels },
      spec: {
        containers: [
          {
            name,
            image,
            // env: [{ name: "KUBECONFIG", value: "/home/node/.kube/config" }],
            volumeMounts: [
              { name: "kube-config", mountPath: "/home/node/.kube" },
            ],
          },
        ],
        volumes: [
          {
            name: "kube-config",
            secret: { secretName: `${name}-kube-config` },
          },
        ],
      },
    },
  },
});
exports.name = node.metadata.name;

const backend = new k8s.core.v1.Service(name, {
  metadata: { labels: node.spec.template.metadata.labels },
  spec: {
    //type: isMinikube === "true" ? "ClusterIP" : "LoadBalancer",
    type: "LoadBalancer",
    ports: [{ port: 4000, targetPort: 4000, protocol: "TCP" }],
    selector: appLabels,
  },
});
exports.ip = backend.status.status.loadBalancer.ingress[0].ip;
