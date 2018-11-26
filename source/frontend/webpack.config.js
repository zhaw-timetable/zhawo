const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);

module.exports = {
  entry: ['@babel/polyfill', './main.js'],
  output: {
    path: path.join(__dirname, '../backend/dist/bundle'),
    filename: 'index.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
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
  devServer: {
    https: false,
    stats: {
      all: undefined,
      assets: false,
      assetsSort: 'field',
      builtAt: true,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkGroups: false,
      chunkModules: false,
      chunkOrigins: false,
      chunksSort: 'field',
      colors: false,
      depth: false,
      entrypoints: false,
      env: true,
      errors: true,
      errorDetails: true,
      hash: false,
      maxModules: 15,
      modules: false,
      modulesSort: 'field',
      moduleTrace: true,
      performance: true,
      providedExports: false,
      publicPath: false,
      reasons: false,
      source: false,
      timings: false,
      usedExports: false,
      version: false,
      warnings: true
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'main.css',
      allChunks: true,
      disable: process.env.NODE_ENV == 'development'
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      inject: false
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json' // Not to confuse with manifest.json
    }),
    new CopyWebpackPlugin([
      { from: 'app/pwa' } // define the path of the files to be copied
    ]),
    new WorkboxPlugin.InjectManifest({
      swDest: './service-worker.js',
      swSrc: './app/service-worker.js'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
