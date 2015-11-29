'use strict';

var _ = require('lodash');
var util = require('util');
var validator = require('validator');
var _mongoose = null;
var _models = null;
var _IncidentModel = null;
var _stormpath = null;
var _logger = null;
var hal = require('../../lib/hal');

function IncidentController(app, mongoose) {
  var self = this;
  _mongoose = mongoose;
  _models = app.models;//require('../models/models')(mongoose);
  _IncidentModel = _models.IncidentModel;
  self.path = 'incidents';
  //self.resource = new hal.Resource(self.path,self.path);
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
      data[i] = new hal.Resource(resource.toObject(), req.path() + '/' + resource._id);
    }
    //console.log(req.query);
    next = nextResponse(req, data);
  }

  jsonResult = new hal.Resource({incidents: data}, selfUrl);

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

IncidentController.prototype.get = function (req, res, next) {
  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  _IncidentModel.find(function (err, incidents) {

    if (err) {
      statusCode = 400;
      jsonResult = formatErrorResponse(req, err.message);
    }
    else {
      //console.log(incidents);
      jsonResult = formatResponse(req, incidents);
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
      jsonResult = formatErrorResponse(req, errStr);
    } else if (typeof incident === 'undefined' || incident === null) {
      errStr = util.format('Incident with _id:%s could not be found.', _id);
      statusCode = 400;
      jsonResult = formatErrorResponse(req, errStr);
    } else {
      //jsonResult = incident;
      jsonResult = formatResponse(req, incident.toObject());

    }
    //console.log(jsonResult);
    res.send(statusCode, jsonResult.toJSON());

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
      statusCode = 400;
      jsonResult = formatErrorResponse(req, err.message);
    }
    else {

      jsonResult = formatResponse(req, incident.toObject());
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

  _IncidentModel.findByIdAndRemove(_id, function (err, incident) {
    if (err) {
      statusCode = 400;
      jsonResult = formatErrorResponse(req, err.message);
    }
    else {

      jsonResult = formatResponse(req, incident);
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
      statusCode = 400;
      jsonResult = formatErrorResponse(req, err.message);
    }
    else {

      jsonResult = formatResponse(req, rawUpdate);
    }
    res.send(statusCode, jsonResult);

    return next();
  });
};

module.exports = IncidentController;
