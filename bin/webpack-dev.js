var WebpackDevServer = require("webpack-dev-server"),
    webpack = require("webpack"),
    webpackConfig = require('../webpack.config');

var compiler = webpack(webpackConfig);
var server = new WebpackDevServer(compiler, {
  // webpack-dev-server options

  contentBase: "app",
  // or: contentBase: "http://localhost/",

  hot: true,
  // Enable special support for Hot Module Replacement
  // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
  // Use "webpack/hot/dev-server" as additional module in your entry point
  // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback: false,

  // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
  // Use "*" to proxy all paths to the specified server.
  // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
  // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
  proxy: {
   "*": "http://localhost:8081"
  },

  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  filename: "main.js",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  publicPath: "/assets/",
  headers: { "X-Custom-Header": "yes" },
  stats: { colors: true },
});
server.listen(8080, "localhost", function() {});
// server.close();
