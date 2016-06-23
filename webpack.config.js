var webpack = require('webpack'),
  path = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  isProduction = process.env.PRODUCTION,
  plugins = [
    //new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    //new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      React: 'react',
      'window.jQuery': 'jquery'
    })
  ],
  outPath;

if (isProduction === 'true') {
  console.log('Adding Production values');
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  outPath = 'dist/assets';
} else {
  console.log('Adding Development values');
  outPath = 'dist/assets';
}

plugins.push(new ExtractTextPlugin('main.css', {
  allChunks: true
}));

module.exports = {
  entry: [
    // 'webpack/hot/dev-server',
    // 'webpack-hot-middleware/client',
    // 'font-awesome-loader!./app/styles/font-awesome.config.js',
    __dirname + '/app/scripts/main.js'
  ],
  output: {
    path: path.resolve(__dirname, outPath),
    publicPath: '/assets/',
    filename: 'main.js'
  },
  // externals: {
  //    'React': 'react'
  // },
  devtool: '#sourcemaps',
  debug: !isProduction,
  plugins: plugins,
  resolve: {
    root: path.resolve(__dirname, 'app'),
    extensions: ['', '.js', '.jsx']
    // alias: {
    //    jqueryui: 'jquery-ui'
    // }
  },
  module: {
    loaders: [
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
        // loader: 'url?limit=10000'
        loader: 'url'
      },
      {
        test: /\.(ttf|eot|svg|png|ico)(\?[\s\S]+)?$/,
        loader: 'file'
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|styles|server)/,
        loader: 'babel'
      }
    ]
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './node_modules/compass-mixins/lib'),
      path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets/')
    ],
    indentedSyntax: true,
    sourceMap: true
  },
  amd: {jQuery: true}
};
