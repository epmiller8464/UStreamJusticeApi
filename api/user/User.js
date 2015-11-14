/**
 * Created by ghostmac on 11/6/15.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
      active: Boolean,
      email: {type: String, trim: true, lowercase: true},
      firstName: {type: String, trim: true},
      lastName: {type: String, trim: true},
      sp_api_key_id: {type: String, trim: true},
      sp_api_key_secret: {type: String, trim: true},
      created: {type: Date, default: Date.now},
      lastLogin: {type: Date, default: Date.now},
      picture: {type: String, trim: true}

    },
    {collection: 'user'}
);
userSchema.index({sp_api_key_id : 1}, {unique:true});
userSchema.index({email : 1}, {unique:true});
var User = mongoose.model('User', userSchema);

module.exports = User;