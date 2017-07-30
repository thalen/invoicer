const path = require('path');
const webpack = require('webpack');


module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        app: './app.jsx'
    },
    output: {
        path: path.resolve(__dirname, './dist/assets'),
        filename: '[name].bundle.js',
        publicPath: '/assets'
    },
    devServer: {
        contentBase: path.resolve(__dirname, './src'),
        port: 3000,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            }

            // Loaders for other file types can go here
        ]
    }
};