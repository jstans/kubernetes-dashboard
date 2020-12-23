A simple real-time kubernetes dashboard.

Technologies used: Pulumi, Kubernetes, Docker, React, GraphQL, GraphQL Subscriptions, NodeJS, Koa, Socket.IO

# Features

- Distroless non-root containers
- K8s watchers and GraphQL subscriptions over Websockets provide real-time dashboard updates

# Roadmap

- Ingress controller and stateless support (keydb?)
- Use ES modules on the server
- Support a more efficient binary format (CBOR or RION?) for websocket payloads
- `@snowpack/plugin-webpack` option for production builds
- Add sample for e2e tests

# Running

## Development

```shell
$ yarn start
```

## Production

### Prerequisites

- A docker registry

```shell
$ docker run -d -p 5000:5000 --restart always --name registry registry:2
```

- Pulumi

```shell
$ curl -fsSL https://get.pulumi.com | sh
```

- [Docker](https://docs.docker.com/get-docker/)
- Kubernetes ([minikube](https://minikube.sigs.k8s.io/docs/start/) will do). Kubernetes comes with [docker desktop](https://docs.docker.com/get-docker/), if you install that way.

### Deploying

```shell
$ pulumi login --local
$ DOCKER_REGISTRY="localhost:5000" pulumi up --cwd infrastructure/
```

It's recommended not to sture your state locally but instead use the pulumi service or an s3 bucket. [More](https://www.pulumi.com/docs/reference/cli/pulumi_login/)

By default this will pick up your default `KUBECONFIG`, if you want to specify a new kubeconfig you can use:

```shell
$ DOCKER_REGISTRY="localhost:5000" KUBECONFIG=./kubeconfig pulumi up --cwd infrastructure/
```
