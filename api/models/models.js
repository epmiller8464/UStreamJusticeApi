"use strict";

module.exports = function (mongoose) {
  var Schema = mongoose.Schema;
  var models = {};

  models.UserModel = require('./user.model')(mongoose);
  models.IncidentLocationModel = require('./incidentLocation.model')(mongoose);
  models.IncidentModel = require('./incident.model')(mongoose);
  models.MediaBundleModel = require('./mediaBundle.model')(mongoose);
  return models;
};
