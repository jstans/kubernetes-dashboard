import React from 'react';
import { useQuery, useSubscription } from 'urql';
import { CircularProgress } from '@chakra-ui/react';

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
      {fetching && <CircularProgress isIndeterminate color="green.300" />}
      {error && 'Error loading deployments'}
      {(data?.deployments.length &&
        data.deployments.map((deployment) => (
          <Deployment key={deployment.id} {...deployment} />
        ))) ||
        'No deployments'}
    </>
  );
};

export default Namespace;
