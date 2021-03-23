const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = {
  mode: "development",
  entry: './src/js/main.js',
  target: "web",

  output: {
    publicPath: '/',
    path: require('path').resolve(__dirname, './dist/'),
    filename: 'js/bundle.js',
    chunkFilename: 'js/[name].js',
    // becomes a global object on window.EntryPoint with our exported functions
    library: "EntryPoint"
  },

  module: {},

  plugins: [
    new WebpackBuildNotifierPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/html/index.html'
    }),
  ],
}
