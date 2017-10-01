const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        host: './client/host/host.js',
        contestant: './client/contestant/contestant.js',
        spectator: './client/spectator/spectator.js',
        app: [ './client/scss/app.scss' ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    use: [ 'css-loader', 'sass-loader' ]
                })
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].bundle.js',
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        }),
    ],

    resolve: {
    extensions: ['.js', '.sass'],
    modules: [path.join(__dirname, './client'), 'node_modules']
    }
};
