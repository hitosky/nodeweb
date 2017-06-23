'use strict'

const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const {appPath,buildPath} = require('../directory')

const entry = {}
const plugins = []
const root = __dirname;
const env = process.env.NODE_ENV || 'development'

// 入口文件
glob.sync('{common,pages}/**/*.js', {
  cwd: appPath
}).forEach((filePath) => {
  const chunk = filePath.slice(0, -3)
  entry[chunk] = [`./${chunk}`]
})

// 模版文件
glob.sync('**/*.html', {
  cwd: appPath
}).forEach((filePath) => {
  const chunk = filePath.slice(0, -5)
  const chunkFile = `${chunk}.html`

  if (chunk.match(/^pages\//) && entry[chunk]) {
    plugins.push(new HtmlWebpackPlugin({
      filename: chunkFile,
      template: chunkFile,
      chunks: [
        'common/index',
        chunk
      ]
    }))
  } else {
    plugins.push(new HtmlWebpackPlugin({
      inject: false,
      filename: chunkFile,
      template: chunkFile
    }))
  }
})

const config = {
  context: appPath,
  entry: entry,
  devtool: 'cheap-module-source-map',
  output: {
    pathinfo: true,
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  resolve: {
    alias: {
      c: path.join(appPath, 'components'),
      common: path.join(appPath, 'common'),
      components: path.join(appPath, 'components')
    },
    modules: [
      appPath,
      path.join(appPath,'components'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'happypack/loader',
        options: {
          id: 'js'
        }
      },
      {
        test: /\.tpl$/,
        loader: 'dot-tpl-loader'
      },
      {
        oneOf: [
          {
            test: /\.html$/,
            resourceQuery: /\?.*/,
            use: [
              'nunjucks-loader',
              'extract-loader',
              'html-loader'
            ]
          },
          {
            test: /\.html$/,
            loader: 'html-loader'
          }
        ]
      },
      {
        oneOf: [
          {
            test: /\.(png|gif|jpg|jpeg|svg|woff|ttf|eot)$/,
            resourceQuery: /\?.*/,
            loader: 'url-loader'
          },
          {
            test: /\.(png|gif|jpg|jpeg|svg|woff|ttf|eot)$/,
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'happypack/loader',
            options: {
              id: 'less'
            }
          }]
        })
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: [ 'babel-loader' ],
      verbose: true,
      verboseWhenProfiling: true
    }),
    new HappyPack({
      id: 'less',
      threadPool: happyThreadPool,
      loaders: [{
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      },
      //{
        //loader: 'postcss-loader'
      //},
      {
        loader: 'less-loader',
        options: {
          sourceMap: true
        }
      }],
      verbose: true,
      verboseWhenProfiling: true,
      cache: false
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common/index',
      filename: 'common.js',
      minChunks: 4
    })
  ].concat(plugins)
}

module.exports = config
