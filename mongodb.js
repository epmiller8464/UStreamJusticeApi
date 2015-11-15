//var config = require('config');
var util = require('util');
var config = require('./config/environment');
var credentials = require('./credentials.js');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var dbConn = 'mongodb://localhost:27017/usj';//config.get('connString');

var dbOptions = {
  db: {native_parser: true},
  server: {poolSize: 5, socketOptions: {keepAlive: 1}},
  //replset: {rs_name: 'myReplicaSetName', socketOptions: {keepAlive: 1}},
  user: credentials.mongo.user,
  pass: credentials.mongo.pwd
};

mongoose.connect(dbConn, dbOptions);
var db = mongoose.connection;

db.on('open', function () {
  "use strict";
  console.log('connected to ' + dbConn);
});

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log('open');
});


module.exports = db;
module.exports = dbOptions;
