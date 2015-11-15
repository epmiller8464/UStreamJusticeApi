module.exports = function (mongoose) {
  'use strict';
  var Model;
  /*
   *@TODO: add validation pre save
   *@TODO:use api key index unique key
   */

  var incidentSchema = new mongoose.Schema({
        state: {
          type: String, required: true,
          enum: ['New', 'Live', 'Complete', 'Closed', 'Cancelled'],
          default: 'New'
        },
        location: {type: mongoose.Schema.Types.ObjectId, ref: 'incidentLocation'},
        //locations: {type: [{lat: Number, long: Number}]},
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
          enum: ['VICTIM', 'WITNESS'],
          default: 'VICTIM',
          required: true
        },
        incidentTarget: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        tags: {type: [String], index: true}, // field level
        description: {type: String, trim: true},
        //incidentHistory: {type: []},
        mediaBundleSchema: {type: mongoose.Schema.Types.ObjectId, ref: 'mediaBundle'}
      },
      {collection: 'incident'}
  );

  incidentSchema.index({state: 1});
  incidentSchema.index({categoryType: 'text'});
  incidentSchema.index({tags: 'text'});
  incidentSchema.index({description: 'text'});
  incidentSchema.index({sourceIdentity: 1}, {sparse: true});
  incidentSchema.index({incidentTarget: 1}, {sparse: true});
//TODO: add validate methods
  try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("incident");
  } catch (e) {
    Model = mongoose.model('incident', incidentSchema);
  }
  return Model;
};