const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      Pages: path.resolve(__dirname, 'src/client/pages'),
      Actions: path.resolve(__dirname, 'src/client/actions'),
      Components: path.resolve(__dirname, 'src/client/components'),
      Reducers: path.resolve(__dirname, 'src/client/reducers'),
      Constants: path.resolve(__dirname, 'src/client/constants'),
      Utils: path.resolve(__dirname, 'src/client/utils')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader","css-loader", "sass-loader"
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  devServer: {
    port: 3333,
    proxy: {
      '/api': 'http://localhost:8080'
    },
    historyApiFallback: true
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
};
