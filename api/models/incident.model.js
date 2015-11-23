var assert = require('assert');
var u = require('util');
var enums = require('./enums.model');
module.exports = function (mongoose) {
  'use strict';
  var IncidentSnapshotModel = require('./incidentSnapshot.model')(mongoose);
  var Model;
  /*
   *@TODO: add validation pre save
   *@TODO:use api key index unique key
   */

  var incidentSchema = new mongoose.Schema({
        state: {
          type: String, required: true, uppercase: true,
          enum: Object.keys(enums.IncidentStates),
          default: enums.IncidentStates.NEW
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
        sourceIdentity: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
        sourceType: {
          type: String,
          enum: Object.keys(enums.SourceTypes),
          default: enums.SourceTypes.VICTIM,
          required: true,
          uppercase: true
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


  incidentSchema.static('getDiff', function (original, modified) {

    var diffs = {};
    if (original instanceof mongoose.Model && modified instanceof Object) {
      var options = {minimize: false};
      Object.defineProperty(diffs, 'incidentId', {value: original._id.toString(), enumerable: true});
      var l = original.toObject(options),
          r = modified;
      //lKeys = Object.keys(l),
      //var rKeys = Object.keys(modified);
      delete l._id;
      delete r._id;
      for (var field in l) {
        if (field in r) {
          var lv = l[field],
              rv = r[field];
          //assert(field in r);
          lv = lv ? lv.toString() : '';
          rv = rv ? rv.toString() : '';
          //console.log('%s: l === v: %s\n%s : %s\n%s : %s', field, lv.valueOf() === rv.valueOf(), lv, rv, typeof lv, typeof rv);
          if (lv !== rv) {
            if (rv === '' && l[field] instanceof Object) {
              rv = null;
            }
            diffs[field] = rv;
          }
        }
      }
    }
    //console.log(diffs.length);
    return diffs;
  });

  incidentSchema.post('save', function (doc) {
    var raw = doc.toObject();
    Object.defineProperty(raw, 'incidentId', {value: raw._id.toString(), enumerable: true});
    var snapshot = new IncidentSnapshotModel(raw);

    //var s = snapshot.save();
    var s = snapshot.save(function (err, saved) {
      console.log('incident snapshot capture %s\n', err ? 'FAILED' : 'SUCCEEDED');
      //console.log(saved);
    });
  });

  incidentSchema.pre('update', function (next) {
    var raw = this._update.$set;
    Object.defineProperty(raw, 'incidentId', {value: this._conditions._id.toString(), enumerable: true});
    var snapshot = new IncidentSnapshotModel(raw);
    snapshot.save(function (err, saved) {
      console.log('update incident snapshot capture %s\n',err ? 'FAILED':'SUCCEEDED');
      //console.log(saved);
    });
    //console.log(this._update.$set);
    next();
  });

//TODO: add validate methods
  try {
    // Throws an error if "Name" hasn't been registered
    Model = mongoose.model("incident");
  } catch (e) {
    Model = mongoose.model('incident', incidentSchema);
  }
  return Model;
};