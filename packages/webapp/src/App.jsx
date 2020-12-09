import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import Provider from 'Graphql';
import Main from 'Views/Main';

function App() {
  return (
    <Provider>
      <ChakraProvider>
        <Main />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
