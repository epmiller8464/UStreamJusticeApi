//TODO: add validation pre save
module.exports = function (mongoose) {
  'use strict';
  var Model;
  /*
   *@TODO: add validation pre save
   */

  var incidentSnapshotSchema = new mongoose.Schema({
        state: {type: String},
        loc: {type: mongoose.Schema.Types.ObjectId, ref: 'incidentLocation'},
        categoryType: {type: String, trim: true, uppercase: true},
        incidentDate: {type: Date},
        hammertime: {type: Number},
        endHammertime: {type: Number},
        lastModified: {type: Number},
        sourceIdentity: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        sourceType: {type: String},
        incidentTarget: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        tags: {type: [String], index: true}, // field level
        description: {type: String, trim: true},
        mediaBundleSchema: {type: mongoose.Schema.Types.ObjectId, ref: 'mediaBundle'},
        snapshotTime: {type: Number},
        incidentId: {type: mongoose.Schema.Types.ObjectId, ref: 'incident', required: true}
      },
      {collection: 'incidentSnapshot'}
  );

  incidentSnapshotSchema.index({state: 1});
  incidentSnapshotSchema.index({categoryType: 'text'});
  incidentSnapshotSchema.index({tags: 'text'});
  incidentSnapshotSchema.index({description: 'text'});
  incidentSnapshotSchema.index({sourceIdentity: 1}, {sparse: true});
  incidentSnapshotSchema.index({incidentTarget: 1}, {sparse: true});

//TODO: add validate methods
  try {
    // Throws an error if "Name" hasn't been registered
    Model = mongoose.model("incidentSnapshot");
  } catch (e) {
    Model = mongoose.model('incidentSnapshot', incidentSnapshotSchema);
  }
  return Model;
};