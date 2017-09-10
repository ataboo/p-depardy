const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        host: './client/host.js',
        contestant: './client/contestant.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js',
    },
};