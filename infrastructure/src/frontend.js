const pulumi = require("@pulumi/pulumi");
const k8s = require("@pulumi/kubernetes");
const docker = require("@pulumi/docker");

const packageJson = require("../../packages/webapp/package.json");
const { name, version } = packageJson;
const appLabels = { app: name };

const registry = process.env.DOCKER_REGISTRY || "localhost:5000";

const image = new docker.Image(name, {
  imageName: pulumi.interpolate`${registry}/${name}:v${version}`,
  localImageName: name,
  build: {
    context: "../",
    dockerfile: "../webapp.Dockerfile",
  },
});

// https://github.com/pulumi/pulumi-docker/issues/148
const imageSHA = image.imageName.apply(
  (imageName) => `sha256:${imageName.split("-").pop()}`
);

// const nginxConfig = new k8s.core.v1.ConfigMap(name, {
//   metadata: { labels: appLabels },
//   data: {
//     "default.conf": fs.readFileSync("../packages/webapp/nginx.conf").toString(),
//   },
// });
// const nginxConfigName = nginxConfig.metadata.apply((m) => m.name);

const nginx = new k8s.apps.v1.Deployment(name, {
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
            // volumeMounts: [
            //   { name: "nginx-configs", mountPath: "/etc/nginx/conf.d" },
            // ],
            readinessProbe: {
              httpGet: {
                path: "/healthz",
                port: 9090,
              },
              initialDelaySeconds: 10,
              periodSeconds: 5,
            },
          },
        ],
        // volumes: [
        //   { name: "nginx-configs", configMap: { name: nginxConfigName } },
        // ],
      },
    },
  },
});
exports.name = nginx.metadata.name;

const frontend = new k8s.core.v1.Service(name, {
  metadata: { name, labels: nginx.spec.template.metadata.labels },
  spec: {
    type: "NodePort",
    ports: [{ port: 9090, targetPort: 9090, protocol: "TCP" }],
    selector: appLabels,
  },
});
exports.ip = frontend.status.status.loadBalancer.ingress[0].ip;
