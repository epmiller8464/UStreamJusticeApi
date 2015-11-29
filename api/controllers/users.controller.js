'use strict';

var _ = require('lodash');
var validator = require('validator');
var _stormpath = null;
var _logger = null;
var inherits = require('inherits');
var util = require('util');
var _mongoose = null;
var _models = null;
var _UserModel = null;
var hal = require('../../lib/hal');
var RootController = require('./index');

module.exports = UsersController;

function UsersController(app, mongoose) {
  var self = this;
  UsersController.super_.call(self);

  _mongoose = mongoose;
  _models = app.models;//require('../models/models')(mongoose);
  _UserModel = _models.UserModel;
  //_logger = app.get('readerLogger');
  self.path = 'users';
}
inherits(UsersController, RootController);

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

function noop(error, result) {
  if (error) console.trace(error);

  return result;
}
function formatErrorResponse(req, err) {
  var _selfUrl = req.href();
  var jsonResult = new hal.Resource({message: "error", error: err}, _selfUrl);
  return jsonResult;
}

function formatResponse(req, data) {

  var selfUrl = req.href();
  var jsonResult, next;

  if (util.isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      var resource = data[i];
      //data[i] = new hal.Resource(resource.toObject(), req.path() + '/' + resource._id);
      data[i] = new hal.Resource(resource, req.path() + '/' + resource._id);
    }
    //console.log(req.query);
    next = nextResponse(req, data);
  }

  jsonResult = new hal.Resource({users: data}, selfUrl);

  if (next)
    jsonResult.link(next);

  return jsonResult;
}

function nextResponse(req, data) {

  var offset = req.params.offset ? req.params.offset : 0;
  var limit = req.params.limit ? req.params.limit : 10;
  var _limit = util.format('?limit=%s', limit);
  var _offset = util.format('&offset=%s', offset += data.length);
  var _query = util.format('%s%s', _limit, _offset);
  var _nextUrl = util.format('%s%s', req.path(), _query);
  var next = new hal.Link('next', {href: _nextUrl});
  return next;
}

module.exports = UsersController;