var argv = require('minimist')(process.argv.slice(2));
var dotenv = require('dotenv');
var url = require('url');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
require('node-jsx').install({extension:'.jsx'});
var React = require('react');
var Router = require('react-router');
var express = require('express');
var logger = require('morgan');
var bodyParser = require("body-parser");
var app = express();
var ApiRouter = require('../src/api');

dotenv.load();

var port = argv.port || process.env.APP_PORT || 3000;
var waitSecs = argv.waitSecs || 0;
var appServer = 'http://127.0.0.1:' + port;

console.log('bin/server.js appServer', appServer);






Promise.longStackTraces();


app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Static routes (/dist folder)
 */
app.use('/static',express.static(__dirname + '/../dist'));
app.use('/favicon.ico',express.static(__dirname + '/../dist/favicon.ico'));
app.use('/api', ApiRouter);
app.use('/examples', express.static(__dirname + '/../examples'));
app.use('/img', express.static(__dirname + '/../img'));

/**
 * React async route
 */
app.get('*',function(req,res){
    fs.readFile(path.resolve(__dirname + '/../static/index.html'), 'utf8', function(err, htmlString){
        console.log('htmlString ', htmlString);
        res.send(htmlString);
    });
});

var server = app.listen(port, function() {
    var host = server.address().address
    var port = server.address().port

    console.log('National listening at http://%s:%s', host, port);
    console.log('appServer: ', appServer);
});
