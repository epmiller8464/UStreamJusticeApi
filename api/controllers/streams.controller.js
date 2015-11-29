'use strict';

//var _ = require('lodash');
//var validator = require('validator');
//var _stormpath = null;
//var _logger = null;
var inherits = require('inherits');
var util = require('util');
var _mongoose = null;
var _models = null;
var _StreamsModel = null;
var hal = require('../../lib/hal');
var RootController = require('./index');

function StreamsController(app, mongoose) {
  var self = this;
  StreamsController.super_.call(self);
  _mongoose = mongoose;
  _models = app.models;//require('../models/models')(mongoose);
  _StreamsModel = _models.StreamModel;
  self.path = 'streams';
  //self.resource = new hal.Resource(self.path,self.path);
  //self.links = new hal.Resource(self.path, app.url);
  //console.log(self.links.self);
  //return self;
}

inherits(StreamsController, RootController);


StreamsController.prototype.get = function (req, res, next) {
  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  var offset = req.params.offset ? parseInt(req.params.offset) : 0;
  var limit = req.params.limit ? parseInt(req.params.limit) : 10;
  //_StreamsModel.find(function (err, incidents) {
  _StreamsModel.find(null, null, {skip: offset, limit: limit}, function (err, streams) {

        if (err) {
          statusCode = 400;
          jsonResult = formatErrorResponse(req, err.message);
        }
        else {
          //console.log(streams);
          var streamsLite = streams.map(function (i) {
            return i.toObject();
          });
          //console.log(x);
          jsonResult = formatResponse(req, streamsLite);
        }

        res.send(statusCode, jsonResult);
        return next();
      }
  )
  ;

};

StreamsController.prototype.incidentIdGet = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  res.setHeader('Content-Type', 'application/json');

  var incidentId = req.params.incidentId;
  _StreamsModel.findOne({'incidentId': incidentId}, function (err, stream) {
    if (err) {
      errStr = err.message;
      statusCode = 400;
      jsonResult = formatErrorResponse(req, errStr);
    } else if (typeof stream === 'undefined' || stream === null) {
      errStr = util.format('Incident with _id:%s could not be found.', incidentId);
      statusCode = 400;
      jsonResult = formatErrorResponse(req, errStr);
    } else {
      //jsonResult = stream;
      jsonResult = formatResponse(req, stream.toObject());

    }
    //console.log(jsonResult);
    res.send(statusCode, jsonResult.toJSON());

    return next();
  });

};

StreamsController.prototype.post = function (req, res, next) {

  var errStr = null;
  var statusCode = 201;
  var jsonResult = null;
  var incidentId = req.body.incidentId;
  //console.debug(util.inspect(Incident));
  var newStream = new _StreamsModel({
    liveStreamUrl: util.format('%s/%s', req.href(), incidentId),
    recordedVideoUrl: util.format('%s/%s', req.href(), incidentId),
    incidentId: incidentId
  });
  res.setHeader('Content-Type', 'application/json');
///TODO: create stream data here.
  newStream.save(function (err, stream) {
    if (err) {
      statusCode = 400;
      jsonResult = formatErrorResponse(req, err.message);
    }
    else {

      jsonResult = formatResponse(req, stream.toObject());
    }


    res.send(statusCode, jsonResult);

    return next();
  });
};

StreamsController.prototype.delete = function (req, res, next) {

  var errStr = null;
  var statusCode = 204;
  var jsonResult = null;
  var _id = req.params.id;

  _StreamsModel.findByIdAndRemove(_id, function (err, incident) {
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

StreamsController.prototype.put = function (req, res, next) {

  var errStr = null;
  var statusCode = 200;
  var jsonResult = null;
  var _updates = req.body;
  var _id = _updates._id;
  var condition = {'_id': _id};
  delete _updates._id;

  _StreamsModel.findOneAndUpdate(condition, {$set: _updates}, {runValidators: true}, function (err, rawUpdate) {

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
    jsonResult = new hal.Resource({streams: data}, selfUrl);
  } else {
    jsonResult = new hal.Resource(data, selfUrl);
  }

  if (next)
    jsonResult.link(next);

  return jsonResult;
}

function nextResponse(req, data) {

  var offset = req.params.offset ? parseInt(req.params.offset) : 0;
  var limit = req.params.limit ? parseInt(req.params.limit) : 10;
  var _limit = util.format('?limit=%s', limit);
  var _offset = util.format('&offset=%s', offset += data.length);
  var _query = util.format('%s%s', _limit, _offset);
  var _nextUrl = util.format('%s%s', req.path(), _query);
  var next = new hal.Link('next', {href: _nextUrl});
  return next;
}

module.exports = StreamsController;
