'use strict';

var _ = require('lodash');
var util = require('util');
var validator = require('validator');
var _mongoose = null;
var _models = null;
var _IncidentModel = null;
var _stormpath = null;
var _logger = null;

module.exports = IncidentController;

//function IncidentController(app, stormpath, mongoose) {
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
  var resultStatus = 200;
  var resultJSON = null;
  //console.log('IncidentIdGet');
  res.setHeader('Content-Type', 'application/json');

  var _id = req.params['id'];
  _IncidentModel.findOne({'_id': _id}, function (err, incident) {
    if (err) {
      errStr = err.message;
      res.status(400);
      resultJSON = {message: "error", error: errStr};
    } else if (typeof incident === 'undefined' || incident === null) {
      errStr = util.format('Incident with _id:%s could not be found.', _id);
      res.status(400);
      resultJSON = {message: "error", error: errStr};

    } else {
      res.status(200);
      resultJSON = incident;
      //res.send(Incident);
    }
    //console.log(resultJSON);
    res.send(resultJSON);

    return next();
  });

};

IncidentController.prototype.post = function (req, res, next) {

  var incident = req.body;
  //console.debug(util.inspect(Incident));
  var newIncident = new _IncidentModel(incident);
  res.setHeader('Content-Type', 'application/json');
///TODO: validate incoming object meets min requirements.
  newIncident.save(function (err, incident) {
    if (err) {
      //_logger.error("Mongoose error creating new account for " + Incident._id);
      //_logger.error(err);
      res.status(400);
      //res.json({message: "error", error: err.message});
      res.send({message: "error", error: err.message});

    } else {
      //_logger.debug("Successfully added incident object for " + Incident._id);
      res.status(201);
      //res.json(Incident);
      //
      res.send(incident);
    }
    return next();
  });
};

IncidentController.prototype.delete = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  //console.log(util.inspect(_Incident));
  //var newIncident = new _IncidentModel(Incident);
  var _id = req.params['id'];

  _IncidentModel.findOne({'_id': _id}, function (err, incident) {
    if (err) {
      errStr = err.message;
      //res.status(400);
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
      res.send(statusCode, jsonResult);
      return next();

    } else if (typeof incident === 'undefined' || incident === null) {

      errStr = util.format('Incident with _id:%s could not be found.', _id);
      //res.status(400);
      statusCode = 400;

      jsonResult = {message: "error", error: errStr};
      res.send(statusCode, jsonResult);

      return next();

    } else {
      //res.status(200);
      statusCode = 200;
      //jsonResult = Incident;
      //res.send(Incident);
      //var newIncident = new _IncidentModel({
      Incident.remove(function (err, incident) {
        if (err) {
          errStr = err.message;
          //res.status(400);
          statusCode = 400;
          jsonResult = {message: "error", error: errStr};
        } else {
          //_logger.debug("Successfully added incident object for " + Incident._id);
          statusCode = 200;
          //res.json(Incident);
          //
          jsonResult = Incident;
        }
        res.send(statusCode, jsonResult);

        return next();
      });
    }
  });


  //var newIncident = new _IncidentModel({
  //  active: Incident.active,
  //  _id: Incident._id,
  //  firstName: Incident.firstName,
  //  lastName: Incident.lastName,
  //  sp_api_key_id: Incident.sp_api_key_id,
  //  sp_api_key_secret: Incident.sp_api_key_secret,
  //  created: Incident.created,
  //  lastLogin: Incident.lastLogin,
  //  picture: Incident.picture
  //});

};

IncidentController.prototype.put = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  var _incident = req.body;
  var _id = _incident._id;
  //console.log(util.inspect(_Incident));
  //var newIncident = new _IncidentModel(Incident);

  _incidentModel.findOne({'_id': _id}, function (err, incident) {
    if (err) {
      errStr = err.message;
      //res.status(400);
      statusCode = 400;
      jsonResult = {message: "error", error: errStr};
      res.send(statusCode, jsonResult);
      return next();

    } else if (typeof incident === 'undefined' || incident === null) {

      errStr = util.format('Incident with id:%s could not be found.', _id);
      //res.status(400);
      statusCode = 400;

      jsonResult = {message: "error", error: errStr};
      res.send(statusCode, jsonResult);

      return next();

    } else {
      //res.status(200);
      statusCode = 200;
      //jsonResult = Incident;
      //res.send(Incident);
      //var newIncident = new _IncidentModel({
      incident.active = _incident.active;
      incident._id = _incident._id;
      incident.firstName = _incident.firstName;
      incident.lastName = _incident.lastName;
      incident.sp_api_key_id = _incident.sp_api_key_id;
      incident.sp_api_key_secret = _incident.sp_api_key_secret;
      incident.created = _incident.created;
      incident.lastLogin = _incident.lastLogin;
      incident.picture = _incident.picture;
      incident.save(function (err, incident) {
        if (err) {
          errStr = err.message;
          //res.status(400);
          statusCode = 400;
          jsonResult = {message: "error", error: errStr};
        } else {
          //_logger.debug("Successfully added incident object for " + incident._id);
          statusCode = 200;
          //res.json(Incident);
          //
          jsonResult = Incident;
        }
        res.send(statusCode, jsonResult);

        return next();
      });
    }
  });


  //var newIncident = new _IncidentModel({
  //  active: incident.active,
  //  _id: incident._id,
  //  firstName: incident.firstName,
  //  lastName: incident.lastName,
  //  sp_api_key_id: incident.sp_api_key_id,
  //  sp_api_key_secret: incident.sp_api_key_secret,
  //  created: incident.created,
  //  lastLogin: incident.lastLogin,
  //  picture: incident.picture
  //});

};

//module.exports = IncidentController;
