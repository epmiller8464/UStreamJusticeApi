/**
 * Created by ghostmac on 11/13/15.
 */

var mongoose = require('mongoose');
var c = require('chance')();
var should = require('should');
var assert = require('assert');
var util = require('util');
var app = require('../../app');
var models = app.models;
var helper = require('../helpers/TestHelper');
var count = 1;
var users = helper.getRandomUsers(count);


describe('Mongoose.User', function () {
  "use strict";
  it('add user', function (done) {
    var user = users[0];
    //users.forEach(function (user, index, array) {
    //console.log(user);
    user.save(function (err, u) {
      //console.log(err);
      should.not.exist(err);
      //(err).should.be.undefined();
      //should.not.be.undefined(u);
      assert.notEqual(u, undefined);
      //assert.notEqual(u, null);
      //});
      done();
    });
  });

  it('update user bad email', function (done) {
    //[1,2,3].should.containEql(4);
    var user = users[0];
    //users.forEach(function (user, index, array) {
    var condition = {'_id': user._id};
    var updates = {
      lastLogin: Date.now(),
      email: 'asfa@g',
      lastName: ''
    };

    models.UserModel.update(condition/*condition*/, updates/*field updates*/, {
      //upsert: true,
      runValidators: true
      //context: 'query'
    }/*etc*/, function (err, raw) {
      /*TODO:fix this update bug with validation*/
      should.exist(err);

      assert.notEqual(raw, undefined);
      assert.notEqual(raw, null);
      models.UserModel.findOne({'_id': user._id}, function (err, updatedUser) {
        updates.email.should.not.eql(updatedUser.email);
        user.email.should.eql(updatedUser.email);
        user.lastName.should.eql(updatedUser.lastName);
        done();
      });
    });
  });

  it('update user GOOD', function (done) {
    //[1,2,3].should.containEql(4);
    var user = users[0];
    //users.forEach(function (user, index, array) {
    var condition = {'_id': user._id};
    var updates = {
      verified: true,
      phone: c.phone(),
      sp_api_key_id: c.hash(),
      sp_api_key_secret: c.hash(),
      lastLogin: Date.now(),
      email: c.email(),
      picture: c.url({domain: 'https://www.cdn.ustreamjustice.com', extensions: ['jpeg']})
    };

    models.UserModel.update(condition/*condition*/, updates/*field updates*/, {
      //upsert: true,
      runValidators: true
      //context: 'query'
    }/*etc*/, function (err, raw) {
      /*TODO:fix this update bug with validation*/
      should.not.exist(err);

      assert.notEqual(raw, undefined);
      assert.notEqual(raw, null);
      models.UserModel.findOne({'_id': user._id}, function (err, updatedUser) {
        should.not.exist(err);
        assert.notEqual(updatedUser, undefined);
        assert.notEqual(updatedUser, null);
        //user.lastLogin.should.be.lessThan(updatedUser.lastLogin);
        updates.email.should.eql(updatedUser.email);
        //console.log('existing: ', user.email);
        //console.log('updated: ', updatedUser.email);
        done();
      });
    });
  });
});

var locs = helper.getRandomLocations(count);

describe('Mongoose.IncidentLocation', function () {
  "use strict";
  locs.forEach(function (loc, index, array) {
    it('Add new incidentLocation', function () {
      loc.save(function (err, location) {
        should.not.exist(err);
        assert.notEqual(location, undefined);
        assert.notEqual(location, null);
      });
    });
  });
});
//
var incidents = helper.getRandomIncidents(count);
describe('Mongoose.Incident', function () {
  "use strict";
  incidents.forEach(function (incident, index, array) {
    it('Add new incident', function (done) {
      //console.log(incident);
      //var sn = incident.toObject();
      //var snapshot = models.IncidentSnapshotModel(sn);
      incident.save(function (err, i) {
        should.not.exist(err);
        assert.notEqual(i, undefined);
        assert.notEqual(i, null);
        assert.equal(incident, i);
        //var snapshot = new models.IncidentSnapshotModel(i.toSnapshot());
        //snapshot.save(function (err, saved) {
        //  should.not.exist(err);
        //  assert.notEqual(saved, undefined);
        //  assert.notEqual(saved, null);
        done();
        //});
      });
    });

    var n = c.integer({min: 20000, max: 100000});
    do {
      //console.log(n);
      it('update an existing incident', function (done) {
        //incident.incidentTarget = undefined;
        var condition = {'_id': incident._id};
        //var sn = incident.toSnapshot(null);
        //sn = incident.toSnapshot(undefined);
        //sn = incident.toSnapshot();
        var badUpdates = {
          description: 'test update',
          state: models.IncidentStates.LIVE,
          tags: incident.tags.concat('911'),
          incidentTarget: undefined,
          sourceIdentity: undefined,
          //make sure no change fields arent sent
          sourceType: incident.sourceType,
          loc: helper.getRandomLocations(1)[0]
        };

        //models.IncidentModel.findOneAndUpdate(condition, {$set: badUpdates}, {runValidators: true}, function (err, rawUpdate) {
        //  should.exist(err);
        //  //assert.notEqual(rawUpdate, undefined);
        //  //assert.notEqual(rawUpdate, null);
        //  //console.log(err);
        //  //console.log(rawUpdate);
        //  //done();
        //});
        var updates = {
          //description: 'test update',
          description: c.sentence(),
          state: models.IncidentStates.LIVE,
          tags: incident.tags.concat('911' + n),
          //incidentTarget: undefined,
          //make sure no change fields arent sent
          sourceType: incident.sourceType,
          loc: helper.getRandomLocations(n)[c.integer({min: 0, max: n+1})]
        };

        models.IncidentModel.findOneAndUpdate(condition, {$set: updates}, {runValidators: true}, function (err, rawUpdate) {
          should.not.exist(err);
          assert.notEqual(rawUpdate, undefined);
          assert.notEqual(rawUpdate, null);
          //console.log(rawUpdate);
          //models.IncidentModel.populate(rawUpdate, {path: 'snapshots'}, function (err, data) {
          //  console.log(data);
          done();
          //});
        });
      });
      n--;
    } while (n >= 0);

    //it('delete an existing incident', function (done) {
    //
    //  models.IncidentModel.findByIdAndRemove(incident._id, function (err, doc) {
    //    should.not.exist(err);
    //    assert.notEqual(doc, undefined);
    //    assert.notEqual(doc, null);
    //    //console.log(err,doc);
    //    done();
    //  });
    //});
  });
});
//
//var mediaBundles = helper.getRandonMediaBundles(incidents);
//describe('Mongoose.MediaBundle', function () {
//  "use strict";
//  it('Add new mediaBundle', function () {
//
//    mediaBundles.forEach(function (mb, index, array) {
//      //console.log(incident);
//      mb.save(function (err, _mb) {
//        should.not.exist(err);
//        assert.notEqual(_mb, undefined);
//        assert.notEqual(_mb, null);
//      });
//    });
//  });
//});
//
//var crypto = require('crypto'),
//    fs = require('fs'),
//    key = 'mysecret key';
//describe('Crypto', function () {
//  "use strict";
//  it('hash', function () {
//// generate a hash from file stream
//
//// open file stream
//    var fstream = fs.createReadStream('./test/data/test_users.json');
//    var hash = crypto.createHash('sha512', key);
//
//    hash.update('test');
//    var value = hash.digest('hex');
//
//    // print result
//    console.log(value);
//    hash.setEncoding('hex');
//
//// once the stream is done, we read the values
//    fstream.on('end', function () {
//      hash.end();
//      // print result
//      console.log(hash.read());
//    });
//
//// pipe file to hash generator
//    fstream.pipe(hash);
////    var crypto = require('crypto'),
//    var algorithm = 'aes-256-ctr',
//        password = 'd6F3Efeq';
//
//    function encrypt(text) {
//      var cipher = crypto.createCipher(algorithm, password);
//      var crypted = cipher.update(text, 'utf8', 'hex');
//      crypted += cipher.final('hex');
//      return crypted;
//    }
//
//    function decrypt(text) {
//      var decipher = crypto.createDecipher(algorithm, password);
//      var dec = decipher.update(text, 'hex', 'utf8');
//      dec += decipher.final('utf8');
//      return dec;
//    }
//
//    var hw = encrypt("hello world");
//    console.log(hw);
//// outputs hello world
//    console.log(decrypt(hw));
//  });
//});