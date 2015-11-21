var assert = require('assert');
var u = require('util');
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


  incidentSchema.virtual('incidentId').get(function () {
    return this.id;
  });

  incidentSchema.methods.toSnapshot = function (virtuals) {
    //var snapshot = this.toObject({virtuals: includeVirtuals || true});
    var options = {virtuals: u.isBoolean(virtuals) ? virtuals : true};
    //console.log(options);
    var snapshot = this.toObject(options);
    if (options.virtuals)
      assert.equal(snapshot.incidentId, this._id);
    delete snapshot.id;
    delete snapshot._id;
    assert.equal(snapshot.id, undefined);
    return snapshot;
  };

  incidentSchema.methods.toDiffSnapshot = function (snapshot) {
    var self = this.toSnapshot(false);
    var diffs = [];

    for (var field in self) {
      var curr = self[field],// ? self[field].toString() : '',
          snField = snapshot[field];// ? snapshot[field].toString() : '';
      //if ((curr && snField) && curr.toString() !== snField.toString()) {

      if ((curr && snField) && curr.toString() !== snField.toString()) {
        diffs[field] = snField;//snapshot[field];
        //console.log(field, curr, snField);
      } else if (!snField) {
        diffs[field] = snField;//snapshot[field];
        //console.log(field, curr, snField);
      }
    }
    //console.log(snapshot._id);
    //console.log(diffs.length);
    //console.log(this.inspect());
    return diffs;
  };

//TODO: add validate methods
  try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("incident");
  } catch (e) {
    Model = mongoose.model('incident', incidentSchema);
  }
  return Model;
};