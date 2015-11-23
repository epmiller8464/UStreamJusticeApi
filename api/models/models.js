"use strict";

module.exports = function (mongoose) {
  var models = {};

  models.UserModel = require('./user.model')(mongoose);
  models.IncidentLocationModel = require('./incidentLocation.model')(mongoose);
  models.IncidentSnapshotModel = require('./incidentSnapshot.model')(mongoose);
  models.IncidentModel = require('./incident.model')(mongoose);
  models.IncidentStates = require('./enums.model').IncidentStates;
  models.SourceTypes = require('./enums.model').SourceTypes;
  models.MediaBundleModel = require('./mediaBundle.model')(mongoose);
  return models;
};
