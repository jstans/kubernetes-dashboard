import React from "react";
import {
  Provider as UrqlProvider,
  Client,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { SubscriptionClient } from "subscriptions-transport-ws";

import { deploymentList } from "./deployment.graphql";

const cache = cacheExchange({
  updates: {
    Subscription: {
      deploymentAdded: ({ deploymentAdded }, _args, cache) => {
        cache.updateQuery({ query: deploymentList }, (data) => {
          if (data !== null) {
            data.deployments = data.deployments || [];
            data.deployments.unshift(deploymentAdded);
            return data;
          }
          return null;
        });
      },
      deploymentRemoved: ({ deploymentRemoved }, _args, cache) => {
        cache.updateQuery({ query: deploymentList }, (data) => {
          if (data !== null) {
            data.deployments = (data.deployments || []).filter(
              (deployment) => deployment.id !== deploymentRemoved.id
            );
            return data;
          }
          return null;
        });
      },
      deploymentUpdated: ({ deploymentUpdated }, _args, cache) => {
        cache.updateQuery({ query: deploymentList }, (data) => {
          if (data !== null) {
            data.deployments = (data.deployments || []).map((deployment) =>
              deployment.id === deploymentUpdated.id
                ? deploymentUpdated
                : deployment
            );
            return data;
          }
          return null;
        });
      },
    },
  },
});

const subscriptionClient = new SubscriptionClient(
  process.env.REACT_APP_GRAPHQL_SUBSCRIPTIONS_ENDPOINT,
  {
    reconnect: true,
    // connectionParams: {
    //   authToken: getToken(),
    // },
  }
);

const client = new Client({
  url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  // fetchOptions: () => {
  //   const token = getToken();
  //   return {
  //     headers: { authorization: token ? `Bearer ${token}` : "" },
  //   };
  // },
  exchanges: [
    dedupExchange,
    cache,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

const Provider = ({ children }) => (
  <UrqlProvider value={client}>{children}</UrqlProvider>
);

export default Provider;
