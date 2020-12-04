import React from 'react';
import { useQuery, useSubscription } from 'urql';

import {
  deploymentList,
  deploymentAdded,
  deploymentRemoved,
  deploymentUpdated,
} from 'Graphql/deployment';
import Deployment from 'Components/Deployment';

const Namespace = ({ name }) => {
  const [{ fetching, error, data }] = useQuery({
    query: deploymentList,
    variables: { name },
    pollInterval: 10000,
    requestPolicy: 'cache-and-network',
  });
  useSubscription({ query: deploymentAdded });
  useSubscription({ query: deploymentRemoved });
  useSubscription({ query: deploymentUpdated });

  return (
    <>
      <h4>
        Deployments for {name} {fetching && <sub>(Loading...)</sub>}
      </h4>
      <ul>
        {error && 'Error loading deployments'}
        {data?.deployments.map((deployment) => (
          <Deployment key={deployment.id} {...deployment} />
        ))}
      </ul>
    </>
  );
};

export default Namespace;
