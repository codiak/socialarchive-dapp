const path = require('path');
const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};

  Object.assign(fallback, {
    // ENABLE OR DISABLE YOUR POLYFILLS HERE
    assert: require.resolve("assert/"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
  });

  config.resolve.fallback = fallback;
  config.resolve.alias['@process'] = path.resolve(__dirname, 'src/process/');

  config.resolve.alias['@components'] = path.resolve(__dirname, 'src/components/');
  config.resolve.alias['@auth'] = path.resolve(__dirname, 'src/components/auth/');

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      // process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.resolve.extensions.push(".tsx");
  config.module.rules.push({
    test: /\.tsx/,
    resolve: {
      fullySpecified: false,
    },
  });
  config.resolve.extensions.push(".mjs");
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};
