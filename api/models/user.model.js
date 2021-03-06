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
    email: {
      type: String, trim: true, lowercase: true, required: true, minLength: 1, match: /.+\@.+\..+/
    },
    username: {type: String, trim: true, lowercase: true, required: true},
    firstName: {type: String, trim: true, required: true, minLength: 1},
    lastName: {type: String, trim: true, required: true, minLength: 1},
    age: {type: String},
    //gender: {type: String},
    phone: {type: String, trim: true, required: true, minLength: 10, match: /[(]?\d{3}[)]?[-.\s]?\b\d{3}[-.]?\d{4}\b/},
    //TODO:use local api keys
    sp_api_key_id: {type: String},
    //TODO:use local api keys
    sp_api_key_secret: {type: String},
    createDate: {type: Number, default: Date.now(), required: true},
    lastLogin: {type: Number, default: Date.now()},
    picture: {type: String, trim: true},
    contacts: [{firstName: String, lastName: String, phone: String, email: String}]
  }, {collection: 'user'});
  userSchema.index({email: 1}, {unique: true});
  userSchema.index({username: 1}, {unique: true});
  try {
    // Throws an error if "Name" hasn't been registered
    Model = mongoose.model("user");
  } catch (e) {
    Model = mongoose.model('user', userSchema);
  }

  function validate() {

  }

  return Model;
};
