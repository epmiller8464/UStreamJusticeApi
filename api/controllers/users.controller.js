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
  var resultStatus = 200;
  var resultJSON = null;
  //console.log('userIdGet');
  res.setHeader('Content-Type', 'application/json');

  var email = req.params['email'];
  _UserModel.findOne({'email': email}, function (err, user) {
    if (err) {
      errStr = err.message;
      res.status(400);
      resultJSON = {message: "error", error: errStr};
    } else if (typeof user === 'undefined' || user === null) {
      errStr = util.format('user with email:%s could not be found.', email);
      res.status(400);
      resultJSON = {message: "error", error: errStr};

    } else {
      res.status(200);
      resultJSON = user;
      //res.send(user);
    }
    //console.log(resultJSON);
    res.send(resultJSON);

    return next();
  });

};

UsersController.prototype.post = function (req, res, next) {

  var user = req.body;
  //console.debug(util.inspect(user));
  var newUser = new _UserModel(user);
  res.setHeader('Content-Type', 'application/json');

  newUser.save(function (err, user) {
    if (err) {
      //_logger.error("Mongoose error creating new account for " + user.email);
      //_logger.error(err);
      res.status(400);
      //res.json({message: "error", error: err.message});
      res.send({message: "error", error: err.message});

    } else {
      //_logger.debug("Successfully added User object for " + user.email);
      res.status(201);
      //res.json(user);
      //
      res.send(user);
    }
    return next();
  });
};

UsersController.prototype.delete = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  //console.log(util.inspect(_user));
  //var newUser = new _UserModel(user);
  var email = req.params['email'];

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
      //statusCode = 200;
      user.remove(function (err, user) {
        if (err) {
          errStr = err.message;
          //res.status(400);
          statusCode = 400;
          jsonResult = {message: "error", error: errStr};
        } else {
          //_logger.debug("Successfully added User object for " + user.email);
          statusCode = 200;
          //res.json(user);
          //
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
  var _user = req.body;
  var email = _user.email;
  var condition = {'email': email};
  delete _user._id;
  var updates = _user;
  //console.log('updates: ',updates);
  _UserModel.update(condition/*condition*/, updates/*field updates*/, {upsert: true}/*etc*/, function (err, raw) {

    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
    } else {
      //_logger.debug("Successfully added User object for " + user.email);
      statusCode = 200;
      jsonResult = raw;
    }
    res.send(statusCode, jsonResult);

    return next();

  });
};

//module.exports = UsersController;
//UsersController.prototype.enroll = function (req, res) {
//  var errStr = undefined;
//
//  // Structure required by Stormpath API
//  var account = {};
//  account.givenName = account.surname = account.username = account.email
//      = account.password = undefined;
//
//  if (undefined == req.param('firstName')) {
//    errStr = "Undefined First Name";
//    _logger.debug(errStr);
//    res.status(400);
//    res.json({error: errStr});
//    return;
//  } else if (undefined == req.param('lastName')) {
//    errStr = "Undefined Last Name";
//    _logger.debug(errStr);
//    res.status(400);
//    res.json({error: errStr});
//    return;
//  } else if (undefined == req.param('email')) {
//    errStr = "Undefined Email";
//    _logger.debug(errStr);
//    res.status(400);
//    res.json({error: errStr});
//    return;
//  } else if (undefined == req.param('password')) {
//    errStr = "Undefined Password";
//    _logger.debug(errStr);
//    res.status(400);
//    res.json({error: errStr});
//    return;
//  }
//  if (!validator.isEmail(req.param('email'))) {
//    res.status(400);
//    res.json({error: 'Invalid email format'})
//    return;
//  }
//  _UserModel.find({'email': req.param('email')}, function dupeEmail(err, results) {
//    if (err) {
//      _logger.debug("Error from dupeEmail check");
//      console.dir(err);
//      res.status(400);
//      res.json(err);
//      return;
//    }
//    if (results.length > 0) {
//      res.status(400);
//      res.json({error: 'Account with that email already exists.  Please choose another email.'});
//      return;
//    } else {
//      account.givenName = req.param('firstName');
//      account.surname = req.param('lastName');
//      account.username = req.param('email');
//      account.email = req.param('email');
//      account.password = req.param('password');
//
//      _logger.debug("Calling stormPath createAccount API");
//      _stormpath.getApplication().createAccount(account, function (err, acc) {
//        if (err) {
//          _logger.debug("Stormpath error: " + err.developerMessage);
//          res.status(400);
//          res.json({error: err.userMessage});
//        } else {
//          acc.createApiKey(function (err, apiKey) {
//            if (err) {
//              _logger.debug("Stormpath error: " + err.developerMessage);
//              res.status(400);
//              res.json({error: err.userMessage});
//            } else {
//              _logger.debug(apiKey);
//              _logger.debug("Successfully created new SP account for "
//                  + "firstName=" + acc.givenName
//                  + ", lastName=" + acc.surname
//                  + ", email=" + acc.email);
//              var newUser = new _UserModel(
//                  {
//                    active: true,
//                    email: acc.email,
//                    firstName: acc.givenName,
//                    lastName: acc.surname,
//                    spApiKeyId: apiKey.id,
//                    spApiKeySecret: apiKey.secret
//                  });
//              newUser.save(function (err, user) {
//                if (err) {
//                  _logger.error("Mongoose error creating new account for " + user.email);
//                  _logger.error(err);
//                  res.status(400);
//                  res.json({error: err});
//                } else {
//                  _logger.debug("Successfully added User object for " + user.email);
//                  res.status(201);
//                  res.json(user);
//                }
//              });
//            }
//          });
//        }
//      });
//    }
//  });
//};
