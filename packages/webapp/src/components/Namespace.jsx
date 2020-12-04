import React from "react";
import { useQuery, useSubscription } from "urql";

import {
  deploymentList,
  deploymentAdded,
  deploymentRemoved,
  deploymentUpdated,
} from "Graphql/deployment.graphql";
import Deployment from "Components/Deployment";

const Namespace = ({ name }) => {
  const [{ fetching, error, data }] = useQuery({
    query: deploymentList,
    pollInterval: 10000,
    requestPolicy: "cache-and-network",
  });
  useSubscription({ query: deploymentAdded });
  useSubscription({ query: deploymentRemoved });
  useSubscription({ query: deploymentUpdated });

  if (fetching) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <h4>Deployments</h4>
      <ul>
        {data.deployments.map((deployment) => (
          <Deployment key={deployment.id} {...deployment} />
        ))}
      </ul>
    </>
  );
};

export default Namespace;
