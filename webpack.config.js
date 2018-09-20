const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'


module.exports = {
    entry: [
        './source/App.js',
    ],
    output: {
        filename: './bundle.js'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
            test: /\.js$/,
            include: path.resolve(__dirname, 'source/'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'style.css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        })
    ]
};