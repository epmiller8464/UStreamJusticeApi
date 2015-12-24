var assert = require('assert');
var u = require('util');
var enums = require('./enums.model');
module.exports = function (mongoose) {
  'use strict';
  var IncidentSnapshotModel = require('./incidentSnapshot.model')(mongoose);
  var IncidentLocationModel = require('./incidentLocation.model')(mongoose);
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
        initialLoc: {
          type: {type: String, required: true, default: 'Point'},
          coordinates: [Number]
        },
        locations:{
          type: {type: String, required: true, default: 'MultiPoint'},
          coordinates: []
        },
        categoryType: {type: String, trim: true, uppercase: true},
        //incidentDate: {type: Date, default: Date.now},
        /*
         * @precise time in milliseconds
         * */
        incidentDate: {type: Number, required: true, default: Date.now()},
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
        details: {type: String, trim: true},
        //incidentHistory: {type: []},
        streamId: {type: mongoose.Schema.Types.ObjectId, ref: 'stream'},
        //snapshots: [IncidentSnapshotModel.schema]
        snapshots: {type: [mongoose.Schema.Types.ObjectId], ref: 'incidentSnapshot'}
      },
      {collection: 'incident'}
  );

  incidentSchema.index({state: 1});
  incidentSchema.index({categoryType: 'text'});
  incidentSchema.index({tags: 'text'});
  incidentSchema.index({details: 'text'});
  incidentSchema.index({sourceIdentity: 1}, {sparse: true});
  incidentSchema.index({incidentTarget: 1}, {sparse: true});
  incidentSchema.index({initialLoc: '2dsphere'});
  incidentSchema.index({locations: '2dsphere'});
  //incidentSchema.virtual('incidentLocation')
  //    .get(function () {
  //  return this.__incidentLocation;
  //}).set(function (loc) {
  //  this.__incidentLocation = loc;
  //});
  //function setInitialLocation(val) {
  //  var _initialLoc = val;
  //  if (val) {
  //    if (val.loc) {
  //      //var location = new IncidentLocationModel(val);
  //      _initialLoc = new IncidentLocationModel(val);
  //      _initialLoc.incidentId = this._id;
  //      this.incidentLocation = _initialLoc;
  //    }
  //  }
  //  return _initialLoc;
  //}

  incidentSchema.static('getDiff', function (original, modified) {
    var _ogRaw = original instanceof mongoose.Model ?
        original.toObject() :
        original instanceof Object ? original : undefined;

    var _modRaw = modified instanceof Object ? modified : undefined;
    var diffs = undefined;
    if (_ogRaw && _modRaw) {
      var l = _ogRaw,//original.toObject(options),
          r = _modRaw,
          _id = original._id.toString();
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

            if (!diffs) {
              diffs = {};
              Object.defineProperty(diffs, 'incidentId', {value: _id, enumerable: true});
            }

            diffs[field] = rv;
          }
        }
      }
    }
    //console.log(diffs.length);
    return diffs;
  });


  //incidentSchema.pre('findOneAndUpdate', function (next) {
  //  var raw = this._update.$set;
  //  //var _doc = this._doc.toObject();
  //  Object.defineProperty(raw, 'incidentId', {value: this._conditions._id.toString(), enumerable: true});
  //  var snapshot = new IncidentSnapshotModel(raw);
  //  snapshot.save(function (err, saved) {
  //    console.log('pre -> findOneAndUpdate: incident snapshot capture %s\n', err ? 'FAILED' : 'SUCCEEDED');
  //    //console.log(saved);
  //  });
  //  //console.log(this._update.$set);
  //  next();
  //});

  //incidentSchema.pre('update', function (next) {
  //  var raw = this._update.$set;
  //
  //  Object.defineProperty(raw, 'incidentId', {value: this._conditions._id.toString(), enumerable: true});
  //  var snapshot = new IncidentSnapshotModel(raw);
  //  snapshot.save(function (err, saved) {
  //    console.log('pre -> update: incident snapshot capture %s\n', err ? 'FAILED' : 'SUCCEEDED');
  //    //console.log(saved);
  //  });
  //  //console.log(this._update.$set);
  //  next();
  //});

  incidentSchema.pre('save', function (next) {

    var raw = this.toObject();
    //Object.defineProperty(raw, 'incidentId', {value: raw._id.toString(), enumerable: true});
    var snapshot = new IncidentSnapshotModel(raw);
    this.snapshots.push(snapshot._id);
    //if (this.incidentLocation) {
    //  if (this.incidentLocation.loc) {
    //    var location = this.incidentLocation;// new IncidentLocationModel(this.initialLoc);
    //    //this.initialLoc.incidentId = this._id;
    //    location.save(function (err, loc) {
    //
    //      if (err) {
    //        throw new Error(err.message);
    //      }
    //      console.log('SUCCESS: saved incident location.');
    //      console.log('initialLoc: %s', u.inspect(loc.toObject()));
    //    });
    //  }
    //}

    next();
  });
  incidentSchema.post('save', function (doc) {
    var raw = doc.toObject();
    Object.defineProperty(raw, 'incidentId', {value: raw._id.toString(), enumerable: true});
    var snapshot = new IncidentSnapshotModel(raw);
    //snapshot.incidentId = doc._id;
    //var s = snapshot.save();

    snapshot.save(function (err, saved) {
      console.log('post -> post: incident snapshot capture %s\n', err ? 'FAILED' : 'SUCCEEDED');

    });

    //if (this.incidentLocation) {
    //  if (this.incidentLocation.loc) {
    //    var location = this.incidentLocation;// new IncidentLocationModel(this.initialLoc);
    //    //this.initialLoc.incidentId = this._id;
    //    location.save(function (err, loc) {
    //
    //      if (err) {
    //        throw new Error(err.message);
    //      }
    //      console.log('SUCCESS: saved incident location.');
    //      console.log('initialLoc: %s', u.inspect(loc.toObject()));
    //    });
    //  }
    //}

  });

  incidentSchema.post('findOneAndUpdate', function (doc) {
    var raw = this._update.$set;
    var _doc = doc.toObject();
    var diffs = Model.getDiff(_doc, raw);
    //console.log(diffs);
    if (diffs) {
      Object.defineProperty(raw, 'incidentId', {value: doc._id.toString(), enumerable: true});
      var snapshot = new IncidentSnapshotModel(raw);
      //doc.snapshots.push(snapshot);
      //var s = snapshot.save();
      var s = snapshot.save(function (err, saved) {
        console.log('post -> findOneAndUpdate: snapshot capture %s\n', err ? 'FAILED' : 'SUCCEEDED');

      }).then(function () {
        doc.snapshots.push(snapshot._id);
        Model.update({_id: doc._id}, {$set: {snapshots: doc.snapshots}}, {
          //Model.update({_id: doc._id}, {$set: {snapshots: [snapshot._id]}}, {
          //overwrite: true,
          runValidators: false
        }, function (err, d) {
          console.log(err);
          console.log('test:%s', d);
        });
      });
    } else {
      console.log('no diffs found??');
    }
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