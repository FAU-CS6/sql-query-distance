const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	//devtool: 'inline-source-map',
	devServer: {
		static: {
			directory: './html'
		},
		devMiddleware: {
			publicPath: '/js/'
		},
	},
	module: {
    rules: [
		{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
		},
	],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	optimization: {
		minimize: false,
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'html', 'js'),
		publicPath: '/js/',
	},
};
