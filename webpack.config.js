const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  target: 'node',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  entry: [
    './source/App.js',
    './source/sass-style.scss',
  ],
  output: {
    filename: './bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'source'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(sass|scss|css)$/,
        include: path.resolve(__dirname, 'source'),
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: true,
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          ],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './css/style.bundle.css',
      allChunks: true,
    }),
  ],
};
