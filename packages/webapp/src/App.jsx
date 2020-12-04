import React from 'react';

import Provider from 'Graphql';
import Main from 'Views/Main';

function App() {
  return (
    <Provider>
      <Main />
    </Provider>
  );
}

export default App;
