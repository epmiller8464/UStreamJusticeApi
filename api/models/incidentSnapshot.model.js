//TODO: add validation pre save
module.exports = function (mongoose) {
  'use strict';
  var Model;
  /*
   *@TODO: add validation pre save
   */

  var incidentSnapshotSchema = new mongoose.Schema({
        state: {
          type: String, required: true
        },
        location: {type: mongoose.Schema.Types.ObjectId, ref: 'incidentLocation'},
        categoryType: {type: String, trim: true, uppercase: true},
        incidentDate: {type: Date, default: Date.now},
        /*
         * @precise time in milliseconds
         * */
        hammertime: {type: Number, required: true, default: Date.now()},
        endHammertime: {type: Number},
        lastModified: {type: Number, required: true, default: Date.now()},
        sourceIdentity: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
        sourceType: {
          type: String,
        },
        incidentTarget: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        tags: {type: [String], index: true}, // field level
        description: {type: String, trim: true},
        //incidentHistory: {type: []},
        mediaBundleSchema: {type: mongoose.Schema.Types.ObjectId, ref: 'mediaBundle'},
        snapshotTime: {type: Number, required: true, default: Date.now()}
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
    mongoose.model("incidentSnapshot");
  } catch (e) {
    Model = mongoose.model('incidentSnapshot', incidentSnapshotSchema);
  }
  return Model;
};