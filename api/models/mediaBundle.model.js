


module.exports = function (mongoose) {
  'use strict';
  var Model;
//TODO: add validation pre save

  var streamSchema = new mongoose.Schema({

    liveStreamUrl: {type: String},
    recordedVideoUrl: {type: String},
    incidentId: {type: mongoose.Schema.Types.ObjectId, ref: 'incident'}
  }, {collection: 'stream'});

  streamSchema.index({liveStreamUrl: 1}, {unique: true});
  streamSchema.index({recordedVideoUrl: 1}, {unique: true});
  streamSchema.index({incidentId: 1}, {unique: true});

  try {
    // Throws an error if "Name" hasn't been registered
    Model = mongoose.model("stream");
  } catch (e) {
    Model = mongoose.model('stream', streamSchema);
  }
  return Model;
};