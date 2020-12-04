const path = require('path');

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-dotenv'],
  experiments: {
    // source: process.env.NODE_ENV === 'test' ? 'local' : 'skypack',
    optimize: {
      bundle: true,
      minify: true,
      target: 'es2018',
    },
  },
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    Components: path.resolve(__dirname, 'src/components/'),
    Graphql: path.resolve(__dirname, 'src/graphql/'),
    Views: path.resolve(__dirname, 'src/views/'),
  },
};
