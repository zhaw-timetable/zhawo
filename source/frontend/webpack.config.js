const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(process.env.NODE_ENV);
console.log(process.env.NODE_ENV != 'production');

module.exports = {
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
        test: /\.jsx?$/,
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
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json' // Not to confuse with manifest.json
    }),
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        console.log(message);
      },
      minify: true, // minify and uglify the script
      navigateFallback: '/index.html',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
    }),
    new CopyWebpackPlugin([
      { from: 'app/pwa' } // define the path of the files to be copied
    ])
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
