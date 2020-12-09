import React from 'react';
import { useQuery } from 'urql';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';

import Namespace from 'Components/Namespace';

import { namespaceList } from 'Graphql/namespace';

const Main = () => {
  const [{ fetching, error, data }] = useQuery({
    query: namespaceList,
    pollInterval: 10000,
    requestPolicy: 'cache-and-network',
  });

  if (!data || !data.namespaces) return 'No namespaces found';

  return (
    <Tabs>
      <TabList>
        {data.namespaces.map(({ name }) => (
          <Tab>{name}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {data.namespaces.map((namespace) => (
          <TabPanel>
            <Namespace key={namespace.name} {...namespace} />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default Main;
