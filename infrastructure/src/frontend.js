const fs = require("fs");
const pulumi = require("@pulumi/pulumi");
const k8s = require("@pulumi/kubernetes");
const docker = require("@pulumi/docker");

const appLabels = { app: "webapp" };
// const repository = new awsx.ecr.Repository("repo");
// const image = repository.buildAndPushImage("../packages/webapp")
// or
// const img = awsx.ecs.Image.fromPath("app-img", "./app");
// const image = new docker.RemoteImage("ubuntu", {
//   name: "ubuntu:precise",
// });

const name = require("../../packages/webapp/package.json").name;

// const imageName = pulumi.interpolate`${name}:v1.0.0`;
const imageName = name;
const image = new docker.Image(name, {
  imageName,
  localImageName: name,
  build: {
    context: "../",
    dockerfile: "../webapp.Dockerfile",
  },
  skipPush: true,
});

const nginxConfig = new k8s.core.v1.ConfigMap(name, {
  metadata: { labels: appLabels },
  data: {
    "default.conf": fs.readFileSync("../packages/webapp/nginx.conf").toString(),
  },
});
const nginxConfigName = nginxConfig.metadata.apply((m) => m.name);

const nginx = new k8s.apps.v1.Deployment(name, {
  spec: {
    selector: { matchLabels: appLabels },
    replicas: 1,
    template: {
      metadata: { labels: appLabels },
      spec: {
        containers: [
          {
            name,
            image: name,
            // volumeMounts: [
            //   { name: "nginx-configs", mountPath: "/etc/nginx/conf.d" },
            // ],
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
  metadata: { labels: nginx.spec.template.metadata.labels },
  spec: {
    //type: isMinikube === "true" ? "ClusterIP" : "LoadBalancer",
    type: "LoadBalancer",
    ports: [{ port: 80, targetPort: 80, protocol: "TCP" }],
    selector: appLabels,
  },
});
exports.ip = frontend.status.status.loadBalancer.ingress[0].ip;
