'use strict';

var webpack           = require('webpack');
var path              = require('path');
var webpackEnvConfig  = require('./webpack-env-config');
var DashboardPlugin   = require('webpack-dashboard/plugin');
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    output  : {
        path            : __dirname + '/web/js/build'
    },
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
    performance: {
        hints: false
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
            sourceMap: false,
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
