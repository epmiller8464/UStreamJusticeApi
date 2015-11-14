"use strict";

module.exports = function (mongoose) {
  var Schema = mongoose.Schema;
  var models = {};

  var userSchema = new mongoose.Schema({
    active: Boolean,
    verified: {type: Boolean, required: true, default: false},
    email: {type: String, trim: true, lowercase: true},
    firstName: {type: String, trim: true},
    lastName: {type: String, trim: true},
    gender: {type: String, enum: ['M', 'F'], required: true},
    //gender: {type: String},
    phone: {type: String, trim: true, required: true},
    //TODO:use local api keys
    sp_api_key_id: {type: String, trim: true},
    //TODO:use local api keys
    sp_api_key_secret: {type: String, trim: true},
    created: {type: Date, default: Date.now},
    lastLogin: {type: Date, default: Date.now},
    picture: {type: String, trim: true},
    contacts: [{firstName: String, lastName: String, phone: String, email: String}]
  }, {collection: 'user'});
  userSchema.index({email: 1}, {unique: true});

  try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("user");
  } catch (e) {
    models.UserModel = mongoose.model('user', userSchema);
  }
  //var categoryTypeSchema = new Schema({});

  var incidentLocationSchema = new mongoose.Schema({
    loc: {
      type: {type: String, required: true, enum: ['Point', 'LineString', 'Polygon'], default: 'Point'},
      coordinates: [Number]
    },
    incidentId: {type: mongoose.Schema.Types.ObjectId, ref: 'incident'}
  }, {collection: 'incidentLocation'});
  incidentLocationSchema.index({loc: '2dsphere'});
  incidentLocationSchema.index({incidentId: 1});

  try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("incidentLocation");
  } catch (e) {
    models.IncidentLocationModel = mongoose.model('incidentLocation', incidentLocationSchema);
  }

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
    models.MediaBundleModel = mongoose.model('mediaBundle', mediaBundleSchema);
  }

//TODO:use api key index unique key
//userSchema.index({spApiKeyId : 1}, {unique:true});

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

  try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("incident");
  } catch (e) {
    models.IncidentModel = mongoose.model('incident', incidentSchema);
  }
  return models;
};
