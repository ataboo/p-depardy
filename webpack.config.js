const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        host: './client/host/host.js',
        contestant: './client/contestant/contestant.js',
        spectator: './client//spectator/spectator.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js',
    },
};