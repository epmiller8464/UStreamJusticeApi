'use strict';

var _ = require('lodash');
var util = require('util');
var validator = require('validator');
var _mongoose = null;
var _models = null;
var _IncidentModel = null;
var _stormpath = null;
var _logger = null;

function IncidentController(app, mongoose) {
  var self = this;
  _mongoose = mongoose;
  _models = app.models;//require('../models/models')(mongoose);
  _IncidentModel = _models.IncidentModel;
  self.path = 'incidents';
}


IncidentController.prototype.get = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;

  _IncidentModel.find(function (err, incidents) {

    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
    }
    else {
      jsonResult = incidents;
    }
    res.send(statusCode, jsonResult);
    return next();
  });

};

IncidentController.prototype.incidentIdGet = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  res.setHeader('Content-Type', 'application/json');

  var _id = req.params.id;
  _IncidentModel.findOne({'_id': _id}, function (err, incident) {
    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
    } else if (typeof incident === 'undefined' || incident === null) {
      errStr = util.format('Incident with _id:%s could not be found.', _id);
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};

    } else {
      jsonResult = incident;
    }
    //console.log(jsonResult);
    res.send(statusCode, jsonResult);

    return next();
  });

};

IncidentController.prototype.post = function (req, res, next) {

  var errStr = null;
  var statusCode = 201;
  var jsonResult = null;
  var incident = req.body;
  //console.debug(util.inspect(Incident));
  var newIncident = new _IncidentModel(incident);
  res.setHeader('Content-Type', 'application/json');
///TODO: validate incoming object meets min requirements.
  newIncident.save(function (err, incident) {
    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
    } else {
      jsonResult = incident;
    }

    res.send(statusCode, jsonResult);

    return next();
  });
};

IncidentController.prototype.delete = function (req, res, next) {

  var errStr = null;
  var statusCode = 204;
  var jsonResult = null;
  var _id = req.params.id;

  _IncidentModel.findByIdAndRemove(_id, function (err, doc) {
    if (err) {
      errStr = err.message;
      statusCode = 404;
      jsonResult = {message: "error", error: errStr};
    } else {
      jsonResult = doc;
    }
    res.send(statusCode, jsonResult);
    next();
  });
};

IncidentController.prototype.put = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  var _updates = req.body;
  var _id = _updates._id;
  var condition = {'_id': _id};
  delete _updates._id;

  _IncidentModel.findOneAndUpdate(condition, {$set: _updates}, {runValidators: true}, function (err, rawUpdate) {

    if (err) {
      errStr = err.message;
      statusCode = 409;
      jsonResult = {message: "error", error: errStr};
    } else {
      jsonResult = rawUpdate;
    }
    res.send(statusCode, jsonResult);

    return next();
  });
};

module.exports = IncidentController;
