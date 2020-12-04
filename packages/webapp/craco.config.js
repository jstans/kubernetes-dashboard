const path = require("path");
const { addBeforeLoader, loaderByName } = require("@craco/craco");

module.exports = function ({ env }) {
  return {
    webpack: {
      alias: {
        Components: path.resolve(__dirname, "src/components/"),
        Graphql: path.resolve(__dirname, "src/graphql/"),
        Views: path.resolve(__dirname, "src/views/"),
      },
      configure: (webpackConfig, { env, paths }) => {
        const graphqlLoader = {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader",
        };

        addBeforeLoader(
          webpackConfig,
          loaderByName("file-loader"),
          graphqlLoader
        );

        return webpackConfig;
      },
    },
  };
};
