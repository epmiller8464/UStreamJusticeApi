//TODO: add validation pre save
module.exports = function (mongoose) {
  'use strict';
  var Model;
  /*
   *@TODO: add validation pre save
   */

  var incidentHistorySchema = new mongoose.Schema({
        incidentState: {
          type: String, required: true,
          enum: ['New', 'Live', 'Complete', 'Closed', 'Cancelled'],
          default: 'New'
        },
        loc: {type: mongoose.Schema.Types.ObjectId, ref: 'incidentLocation'},
        //locations: {type: [{lat: Number, long: Number}]},
        categoryType: {type: String, trim: true, uppercase: true},
        incidentDate: {type: Date, default: Date.now},
        /*
         * @precise time in milliseconds
         * */
        hammertime: {type: Number, required: true, default: Date.now()},
        endHammertime: {type: Number},
        lastModified: {type: Number, required: true, default: Date.now()},
        tags: {type: [String], index: true}, // field level
        description: {type: String, trim: true},
        //incidentHistory: {type: []},
        //mediaBundleSchema: {type: mongoose.Schema.Types.ObjectId, ref: 'mediaBundle'}
      },
      {collection: 'incident'}
  );

  incidentHistorySchema.index({state: 1});
  incidentSchema.index({categoryType: 'text'});
  incidentHistorySchema.index({tags: 'text'});
  incidentHistorySchema.index({description: 'text'});
  incidentHistorySchema.index({sourceIdentity: 1}, {sparse: true});
  incidentHistorySchema.index({incidentTarget: 1}, {sparse: true});
//TODO: add validate methods
  try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("incidentHistory");
  } catch (e) {
    Model = mongoose.model('incidentHistory', incidentHistorySchema);
  }
  return Model;
};