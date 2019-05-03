import 'dotenv/config';

import path from 'path';

import VueLoaderPlugin from 'vue-loader/lib/plugin';
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserJsPlugin from 'terser-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import CleanPlugin from 'clean-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const env = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT || 3000);

module.exports = {
  mode: env,

  devtool: env === 'production' ? 'source-map' : 'inline-source-map',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.esm'
    }
  },

  entry: path.resolve(__dirname, 'src/app.js'),

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file))
    }, {
      test: /\.styl(us)?$/,
      use: [
        env === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        'css-loader',
        'stylus-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        env === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        'css-loader'
      ]
    }, {
      test: /\.scss$/,
      use: [
        env === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }, {
      test: /\.(eot|ttf|otf|png|svg|jpe?g|gif)(\?[\s\S]+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'url-loader',
        options: {
          mimetype: 'application/font-woff',
          limit: 10000
        }
      }
    }]
  },

  optimization: {
    minimize: env === 'production',
    minimizer: [
      new TerserJsPlugin({
        sourceMap: true,
        parallel: true,
        cache: env === 'production'
      }),
      new OptimizeCssAssetsPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      cacheGroups: {
        vendors: {
          test: /\/node_modules\//,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: entry => `runtime~${entry.name}`
    },
    mangleWasmImports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true
  },

  plugins: [
    ...(env === 'production' ? [
      new CleanPlugin({
        verbose: true
      }),

      new MiniCssExtractPlugin({
        filename: '[name].[hash].css'
      })
    ] : []),

    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),

    new HtmlPlugin({
      template: path.resolve(__dirname, 'static/index.html'),
      inject: true
    }),

    new CopyPlugin([{
      from: path.resolve(__dirname, 'static'),
      to: path.resolve(__dirname, 'dist'),
      toType: 'dir'
    }])
  ],

  devServer: {
    host: '0.0.0.0',
    port: port,
    compress: true,
    open: false,
    overlay: true,
    hot: true,
    proxy: {
      '/api': `http://localhost:${port + 1}`
    }
  }
};
