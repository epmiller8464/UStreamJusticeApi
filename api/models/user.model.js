/**
 * Created by ghostmac on 11/14/15.
 */

module.exports = function (mongoose) {
  'use strict';
  var Model;
  //TODO: add validation pre save
  var userSchema = new mongoose.Schema({
    active: {type: Boolean, default: false},
    verified: {type: Boolean, required: true, default: false},
    email: {type: String, trim: true, lowercase: true, required: true},
    firstName: {type: String, trim: true, required: true},
    lastName: {type: String, trim: true, required: true},
    gender: {type: String, enum: ['M', 'F'], required: true},
    //gender: {type: String},
    phone: {type: String, trim: true, required: true},
    //TODO:use local api keys
    sp_api_key_id: {type: String, trim: true},
    //TODO:use local api keys
    sp_api_key_secret: {type: String, trim: true},
    created: {type: Date, default: Date.now, required: true},
    lastLogin: {type: Number, default: Date.now()},
    picture: {type: String, trim: true},
    contacts: [{firstName: String, lastName: String, phone: String, email: String}]
  }, {collection: 'user'});
  userSchema.index({email: 1}, {unique: true});

  try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("user");
  } catch (e) {
    Model = mongoose.model('user', userSchema);
  }
  return Model;
};
