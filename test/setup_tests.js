/**
 * Created by ghostmac on 11/10/15.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
TU_EMAIL_REGEX = 'testuser*';
SP_APP_NAME = 'Reader Test';

//var stormpath = require('stormpath');
var async = require('async');
var util = require('util');
var client = null;
var app = null;
var testAccounts = null;
var config = require('../config/environment');
var mongodb = require('mongodb');
var assert = require('assert');

var mongoClient = mongodb.MongoClient;
var _db = null;
console.log("Starting test setup");

var setupTasksArray = [
  function connectDB(callback) {
    mongoClient.connect(config.mongo.uri, function (err, db) {
      assert.equal(null, err);
      _db = db;
      console.log("Connected correctly to server");
      callback(0);
    });
  },
  function dropIncidentSnapshotCollection(callback) {
    console.log("dropIncidentSnapshotCollection");
    var model = _db.collection('incidentSnapshot');
    if (undefined !== model) {
      model.drop(function (err, reply) {
        console.log('incidentSnapshot collection dropped');
        callback(0);
      });
    } else {
      callback(0);
    }
  },
  function dropIncidentCollection(callback) {
    console.log("dropIncidentCollection");
    var user = _db.collection('incident');
    if (undefined !== user) {
      user.drop(function (err, reply) {
        console.log('incident collection dropped');
        callback(0);
      });
    } else {
      callback(0);
    }
  },
  function dropIncidentLocationCollection(callback) {
    console.log("dropIncidentLocationCollection");
    var user = _db.collection('incidentLocation');
    if (undefined !== user) {
      user.drop(function (err, reply) {
        console.log('incidentLocation collection dropped');
        callback(0);
      });
    } else {
      callback(0);
    }
  },
  function dropUserCollection(callback) {
    console.log("dropUserCollection");
    var user = _db.collection('user');
    if (undefined !== user) {
      user.drop(function (err, reply) {
        console.log('user collection dropped');
        callback(0);
      });
    } else {
      callback(0);
    }
  },
  function closeDB(callback) {
    _db.close();
  },
  function callback(err, results) {
    console.log("Setup callback");
    console.log("Results: %j", results);
  }
];

async.series(setupTasksArray);