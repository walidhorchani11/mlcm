'use strict';

var webpack           = require('webpack');
var path              = require('path');
var DashboardPlugin   = require('webpack-dashboard/plugin');
var webpackEnvConfig  = require('./webpack-env-config');
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    watch   : true,
    watchOptions    : {
        aggregateTimeout    : 300,
        poll                : 1000,
        ignored             : /node_modules/
    },
    output  : {
        path            : __dirname + '/web/js/build'
    },
    devtool : 'source-map',
    node    : {
        fs  : "empty"
    },
    module  : {
        loaders : [
            {
                test    : /(\.js)$/,
                loader  : 'babel-loader',
                query   : {
                    presets : [ 'es2015' ]
                },
                exclude : path.resolve(__dirname, 'node_modules'),
                query   : {
                    compact : false
                }
            },
            {
                test: /.json$/,
                loaders: ['json-loader']
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-compiled-loader?htmlmin'
            }
        ]
    },
    resolve : {
        extensions : [ '.js', '.jsx' ],
        alias: {
            querystring: 'querystring-browser'
        }
    },
    plugins : [
        new webpack.DefinePlugin({
            'process.env' : webpackEnvConfig,
            'ejs-compiled-loader': {
                'htmlmin': true, // or enable here
                'htmlminOptions': {
                    removeComments: true
                }
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
        }),
        new DashboardPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
