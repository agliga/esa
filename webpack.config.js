var webpack = require('webpack'),
  path = require('path'),
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
