/**
 * Created by ghostmac on 11/13/15.
 */


var should = require('should');
var assert = require('assert');
var util = require('util');
var helper = require('../helpers/TestHelper');
var count = 5;
var users = helper.getRandomUsers(count);

describe('Mongoose.User', function () {
  "use strict";
  it('add user', function () {
    users.forEach(function (user, index, array) {
      //console.log(user);
      user.save(function (err, u) {
        should.not.exist(err);
        assert.notEqual(u, undefined);
        assert.notEqual(u, null);
      });
    });
  });
});

var locs = helper.getRandomLocations(count);

describe('Mongoose.IncidentLocation', function () {
  "use strict";
  it('Add new incidentLocation', function () {
    locs.forEach(function (loc, index, array) {
      loc.save(function (err, location) {
        should.not.exist(err);
        assert.notEqual(location, undefined);
        assert.notEqual(location, null);
      });
    });
  });
});

var incidents = helper.getRandomIncidents(count);
describe('Mongoose.Incident', function () {
  "use strict";
  it('Add new incident', function () {

    incidents.forEach(function (incident, index, array) {
      //console.log(incident);
      incident.save(function (err, i) {
        should.not.exist(err);
        assert.notEqual(i, undefined);
        assert.notEqual(i, null);
      });
    });
  });
});

var mediaBundles = helper.getRandonMediaBundles(incidents);
describe('Mongoose.MediaBundle', function () {
  "use strict";
  it('Add new mediaBundle', function () {

    mediaBundles.forEach(function (mb, index, array) {
      //console.log(incident);
      mb.save(function (err, _mb) {
        should.not.exist(err);
        assert.notEqual(_mb, undefined);
        assert.notEqual(_mb, null);
      });
    });
  });
});
var crypto = require('crypto'),
    fs = require('fs'),
    key = 'mysecret key';
describe('Crypto', function () {
  "use strict";
  it('hash', function () {
// generate a hash from file stream

// open file stream
    var fstream = fs.createReadStream('./test/data/test_users.json');
    var hash = crypto.createHash('sha512', key);

    hash.update('test');
    var value = hash.digest('hex');

    // print result
    console.log(value);
    hash.setEncoding('hex');

// once the stream is done, we read the values
    fstream.on('end', function () {
      hash.end();
      // print result
      console.log(hash.read());
    });

// pipe file to hash generator
    fstream.pipe(hash);
//    var crypto = require('crypto'),
    var algorithm = 'aes-256-ctr',
        password = 'd6F3Efeq';

    function encrypt(text) {
      var cipher = crypto.createCipher(algorithm, password);
      var crypted = cipher.update(text, 'utf8', 'hex');
      crypted += cipher.final('hex');
      return crypted;
    }

    function decrypt(text) {
      var decipher = crypto.createDecipher(algorithm, password);
      var dec = decipher.update(text, 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    }

    var hw = encrypt("hello world");
    console.log(hw);
// outputs hello world
    console.log(decrypt(hw));
  });
});