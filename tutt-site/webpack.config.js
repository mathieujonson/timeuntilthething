const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['index'],
      template: './template.ejs',
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      chunks: ['app'],
      template: './template.ejs',
    }),
  ],
}
