const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ProvidePlugin } = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, './index.js'),
    app: path.resolve(__dirname, './app.js'),
  },
  output: {
    path: __dirname + '../../tutt-infrastructure/site-files',
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'compile-ejs-loader',
        options: {
          htmlmin: true,
          htmlminOptions: {
            removeComments: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      chunks: ['index'],
      template: 'template.ejs',
      templateParameters: {
        page: 'index',
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      inject: 'body',
      chunks: ['app'],
      template: 'template.ejs',
      templateParameters: {
        page: 'app',
      },
    }),
    new ProvidePlugin({
      _: 'lodash',
    }),
  ],
}
