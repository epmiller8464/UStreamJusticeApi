'use strict';

var _ = require('lodash');
var util = require('util');
var validator = require('validator');
var _mongoose = null;
var _models = null;
var _UserModel = null;
var _stormpath = null;
var _logger = null;

module.exports = UsersController;

function UsersController(app, mongoose) {
  var self = this;
  _mongoose = mongoose;
  _models = app.models;//require('../models/models')(mongoose);
  _UserModel = _models.UserModel;
  //_logger = app.get('readerLogger');
  self.path = 'users';
}

UsersController.prototype.get = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;

  _UserModel.find(function (err, users) {

    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
    }
    else {
      jsonResult = users;
    }
    res.send(statusCode, jsonResult);
    return next();
  });

};

UsersController.prototype.userIdGet = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  res.setHeader('Content-Type', 'application/json');

  var email = req.params.email;
  _UserModel.findOne({'email': email}, function (err, user) {
    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
    } else if (typeof user === 'undefined' || user === null) {
      errStr = util.format('user with email:%s could not be found.', email);
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};

    } else {
      jsonResult = user;
    }
    res.send(statusCode, jsonResult);

    return next();
  });

};

UsersController.prototype.post = function (req, res, next) {

  var updates = req.body;
  var userUpdates = new _UserModel(updates);
  var errStr = null;
  var statusCode = 201;
  var jsonResult = null;
  res.setHeader('Content-Type', 'application/json');

  userUpdates.save(function (err, user) {
    if (err) {
      statusCode = 400;
      errStr = err.message;
      jsonResult = {message: "error", error: err.message};
    } else {
      jsonResult = user;
    }
    res.send(statusCode, jsonResult);
    return next();
  });
};

UsersController.prototype.delete = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  var email = req.params.email;
  _UserModel.findOne({'email': email}, function (err, user) {
    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
      res.send(statusCode, jsonResult);
      return next();

    } else if (typeof user === 'undefined' || user === null) {

      errStr = util.format('user with email:%s could not be found.', email);
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
      res.send(statusCode, jsonResult);

      return next();

    } else {
      user.remove(function (err, user) {
        if (err) {
          errStr = err.message;
          statusCode = 400;
          jsonResult = {message: "error", error: errStr};
        } else {
          jsonResult = user;
        }
        res.send(statusCode, jsonResult);

        return next();
      });
    }
  });
};

UsersController.prototype.put = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  var updates = req.body;
  var email = updates.email;
  var condition = {'email': email};
  delete updates._id;
  _UserModel.update(condition/*condition*/, updates/*field updates*/, {
    runValidators: true
  }/*etc*/, function (err, raw) {

    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
    } else {
      statusCode = 200;
      jsonResult = raw;
    }
    res.send(statusCode, jsonResult);

    return next();

  });
};

module.exports = UsersController;