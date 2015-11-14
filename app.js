'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('mongoose');
var config = require('./config/environment');
var restify = require('restify');
//var config = require('config');
var logger = require("./logger");

var db = require('./mongodb');

var app = restify.createServer();
app.use(restify.queryParser());
app.use(restify.bodyParser());
var allowCrossDomain = function(req, res, next) {
  //console.dir(req);
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Headers', 'Authorization');

  next();
};
app.use(allowCrossDomain);
app.models = {};

//
//app.post('/hello', function create(req, res, next) {
//  res.send(201, Math.random().toString(36).substr(3, 8));
//  return next();
//});
//app.put('/hello', send);
//app.head('/hello/:name', send);
//app.del('hello/:name', function rm(req, res, next) {
//  res.send(204);
//  return next();
//});
require('./routes')(config, app, mongoose);

// Start server
app.listen(config.port, config.ip, function () {
  //console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
