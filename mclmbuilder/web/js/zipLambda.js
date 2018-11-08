'use strict';
var express = require('express');
var router = express.Router();
var zip = new require('node-zip')();
var fs = require("fs");
/* GET home page. */



     var zipLambda = function (){

        zip.file('test.txt', 'hello there');

        var data = zip.generate({base64:false,compression:'DEFLATE'});
        fs.writeFileSync('test.zip', data, 'binary');
        //res.render('index', { title: 'Express' });
    };

module.exports = zipLambda;


