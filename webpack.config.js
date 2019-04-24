require('dotenv').config();

const path = require('path');

const ip = require('ip');

const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

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
			test: /\.vue$/,
			loader: 'vue-loader'
		}, {
			test: /\.jsx?$/,
			loader: 'babel-loader',
			exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file))
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
			name: entrypoint => `runtime~${entrypoint.name}`
		},
		mangleWasmImports: true,
		removeAvailableModules: true,
		removeEmptyChunks: true,
		mergeDuplicateChunks: true
	},

	plugins: [
	  new webpack.DefinePlugin({
			'process.env': {
				'API_URL': JSON.stringify(`http://${ip.address()}:${process.env.API_PORT || 3030}/api`)
			}
		}),

		new CleanPlugin({
			verbose: true
		}),

		new VueLoaderPlugin(),

		new HtmlPlugin({
			template: path.resolve(__dirname, 'static/index.html'),
			inject: true
		}),

		new CopyPlugin([{
			from: path.resolve(__dirname, 'static'),
			to: path.resolve(__dirname, 'dist'),
			toType: 'dir'
		}])
	].concat(env === 'production' ? [
		new MiniCssExtractPlugin({
			filename: '[name].[hash].css'
		})
	] : []),

	devServer: {
		host: '0.0.0.0',
		port: process.env.APP_PORT || 3000,
		compress: true,
		open: false,
		overlay: true,
		hot: true
	}
};
