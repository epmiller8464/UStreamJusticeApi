


module.exports = function (mongoose) {
  'use strict';
  var Model;
//TODO: add validation pre save

  var mediaBundleSchema = new mongoose.Schema({
    liveStreamUrl: {type: String},
    recordedVideoUrl: {type: String},
    incidentId: {type: mongoose.Schema.Types.ObjectId, ref: 'incident'}
  }, {collection: 'mediaBundle'});

  mediaBundleSchema.index({liveStreamUrl: 1}, {unique: true});
  mediaBundleSchema.index({recordedVideoUrl: 1}, {unique: true});
  mediaBundleSchema.index({incidentId: 1}, {unique: true});

  try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("mediaBundle");
  } catch (e) {
    Model = mongoose.model('mediaBundle', mediaBundleSchema);
  }
  return Model;
};