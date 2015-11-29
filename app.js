'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('mongoose');
var config = require('./config/environment');
global.httpStatusCodes = require('http').STATUS_CODES;
var restify = require('restify');
//var config = require('config');
var logger = require("./logger");

var db = require('./mongodb');

var app = restify.createServer();
app.use(restify.queryParser());
app.use(restify.bodyParser());
var allowCrossDomain = function (req, res, next) {
  //console.dir(req);
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Headers', 'Authorization');

  next();
};
app.use(allowCrossDomain);
app.models = {};

require('./routes')(config, app, mongoose);

// Start server
app.listen(config.port, config.ip ? config.ip : config.host, function () {
  //console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
