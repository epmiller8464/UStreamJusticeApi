/**
 * Created by ghostmac on 11/14/15.
 */

module.exports = function (mongoose) {
  'use strict';
  var Model;
  //TODO: add validation pre save
  var incidentLocationSchema = new mongoose.Schema({
    loc: {
      type: {type: String, required: true, enum: ['Point', 'LineString', 'Polygon'], default: 'Point'},
      coordinates: [Number]
    },
    incidentId: {type: mongoose.Schema.Types.ObjectId, ref: 'incident'},
    captureTime: {type: Number, required: true, default: Date.now()}
  }, {collection: 'incidentLocation'});
  incidentLocationSchema.index({loc: '2dsphere'});
  incidentLocationSchema.index({incidentId: 1});

  try {
    // Throws an error if "Name" hasn't been registered
    Model = mongoose.model("incidentLocation");
  } catch (e) {
    Model = mongoose.model('incidentLocation', incidentLocationSchema);
  }
  return Model;
};
