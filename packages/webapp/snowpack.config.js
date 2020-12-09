const path = require('path');

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    // ...(process.env.NODE_ENV === 'production'
    //   ? ['@snowpack/plugin-webpack']
    //   : []),
  ],
  experiments: {
    source: 'local',
    ...(process.env.NODE_ENV === 'production' && {
      optimize: {
        bundle: true,
        minify: true,
        target: 'es2020',
      },
    }),
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
