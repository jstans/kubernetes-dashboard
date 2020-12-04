import React from 'react';
import { useQuery } from 'urql';

import Namespace from 'Components/Namespace';

import { namespaceList } from 'Graphql/namespace';

const Main = () => {
  const [{ fetching, error, data }] = useQuery({
    query: namespaceList,
    pollInterval: 10000,
    requestPolicy: 'cache-and-network',
  });
  return (
    data?.namespaces.map((namespace) => (
      <Namespace key={namespace.name} {...namespace} />
    )) ?? 'No namespaces found'
  );
  //   return <Namespace name="default" />;
};

export default Main;
