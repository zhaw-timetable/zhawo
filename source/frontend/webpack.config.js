const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV, // production or development
  entry: ['@babel/polyfill', './main.js'],
  output: {
    path: path.join(__dirname, '/bundle'),
    filename: 'index.js'
  },
  devServer: {
    inline: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'main.css',
      allChunks: true,
      disable: process.env.NODE_ENV != 'production'
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      inject: false
    })
  ]
};
