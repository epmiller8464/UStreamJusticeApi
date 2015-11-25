'use strict';

var util = require('util');
var _mongoose = null;
var _models = null;
var _mediaBundleModel = null;

module.exports = MediaStreamsController;

function MediaStreamsController(app, mongoose) {
  var self = this;
  _mongoose = mongoose;
  _models = app.models;//require('../models/models')(mongoose);
  _mediaBundleModel = _models.MediaBundleModel;
  self.path = 'mediaStreams';
}

MediaStreamsController.prototype.get = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;

  _mediaBundleModel.find(function (err, users) {

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

MediaStreamsController.prototype.incidentIdGet = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  res.setHeader('Content-Type', 'application/json');

  var incidentId = req.params.incidentId;
  _mediaBundleModel.findOne({'incidentId': incidentId}, function (err, user) {
    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
    } else if (typeof user === 'undefined' || user === null) {
      errStr = util.format('user with incidentId:%s could not be found.', incidentId);
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};

    } else {
      jsonResult = user;
    }
    res.send(statusCode, jsonResult);

    return next();
  });

};

MediaStreamsController.prototype.post = function (req, res, next) {

  var updates = req.body;
  var userUpdates = new _mediaBundleModel(updates);
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

MediaStreamsController.prototype.delete = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  var email = req.params.email;
  _mediaBundleModel.findOne({'email': email}, function (err, user) {
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

MediaStreamsController.prototype.put = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  var updates = req.body;
  var email = updates.email;
  var condition = {'email': email};
  delete updates._id;
  _mediaBundleModel.update(condition/*condition*/, updates/*field updates*/, {
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

module.exports = MediaStreamsController;

/*MediaStreamsController.prototype.enroll = function (req, res) {
 var errStr = undefined;

 // Structure required by Stormpath API
 var account = {};
 account.givenName = account.surname = account.username = account.email
 = account.password = undefined;

 if (undefined == req.param('firstName')) {
 errStr = "Undefined First Name";
 _logger.debug(errStr);
 res.status(400);
 res.json({error: errStr});
 return;
 } else if (undefined == req.param('lastName')) {
 errStr = "Undefined Last Name";
 _logger.debug(errStr);
 res.status(400);
 res.json({error: errStr});
 return;
 } else if (undefined == req.param('email')) {
 errStr = "Undefined Email";
 _logger.debug(errStr);
 res.status(400);
 res.json({error: errStr});
 return;
 } else if (undefined == req.param('password')) {
 errStr = "Undefined Password";
 _logger.debug(errStr);
 res.status(400);
 res.json({error: errStr});
 return;
 }
 if (!validator.isEmail(req.param('email'))) {
 res.status(400);
 res.json({error: 'Invalid email format'})
 return;
 }
 _mediaBundleModel.find({'email': req.param('email')}, function dupeEmail(err, results) {
 if (err) {
 _logger.debug("Error from dupeEmail check");
 console.dir(err);
 res.status(400);
 res.json(err);
 return;
 }
 if (results.length > 0) {
 res.status(400);
 res.json({error: 'Account with that email already exists.  Please choose another email.'});
 return;
 } else {
 account.givenName = req.param('firstName');
 account.surname = req.param('lastName');
 account.username = req.param('email');
 account.email = req.param('email');
 account.password = req.param('password');

 _logger.debug("Calling stormPath createAccount API");
 _stormpath.getApplication().createAccount(account, function (err, acc) {
 if (err) {
 _logger.debug("Stormpath error: " + err.developerMessage);
 res.status(400);
 res.json({error: err.userMessage});
 } else {
 acc.createApiKey(function (err, apiKey) {
 if (err) {
 _logger.debug("Stormpath error: " + err.developerMessage);
 res.status(400);
 res.json({error: err.userMessage});
 } else {
 _logger.debug(apiKey);
 _logger.debug("Successfully created new SP account for "
 + "firstName=" + acc.givenName
 + ", lastName=" + acc.surname
 + ", email=" + acc.email);
 var newUser = new _mediaBundleModel(
 {
 active: true,
 email: acc.email,
 firstName: acc.givenName,
 lastName: acc.surname,
 spApiKeyId: apiKey.id,
 spApiKeySecret: apiKey.secret
 });
 newUser.save(function (err, user) {
 if (err) {
 _logger.error("Mongoose error creating new account for " + user.email);
 _logger.error(err);
 res.status(400);
 res.json({error: err});
 } else {
 _logger.debug("Successfully added User object for " + user.email);
 res.status(201);
 res.json(user);
 }
 });
 }
 });
 }
 });
 }
 });
 };*/
