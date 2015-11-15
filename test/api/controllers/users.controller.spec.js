var should = require('should');
var request = require('supertest');
var assert = require('assert');
var util = require('util');
var server = require('../../../app');
var chance = require('chance')();
var helper = require('../../helpers/TestHelper');
var config = require('../../../config/environment');

var controllerName = "users";
var PATH = util.format('/%s/%s/%s', config.api.basePATH, config.api.version, controllerName);
console.log(PATH);
var count = 1;
var users = helper.getRandomUsers(count);
assert.equal(count, users.length);
count.should.eql(users.length);


describe('POST /users', function () {
  //console.log(array[index]);
  users.forEach(function createUser(user, index, array) {
    it('should add a new user', function (done) {

      request(server)
          .post(PATH)
          .type('application/json')
          .send(user)
          .end(function (err, res) {
            assert.equal(res.statusCode, 201);
            var result = res.body;
            //console.log(res.statusCode);
            //console.log(result);
            should.notEqual(result, undefined);
            result.should.have.property('_id');
            //result._id.toString().should.eql(user._id.toString());
            result.email.should.eql(user.email);
            done();
          });
    });

    it('should return statusCode === 400; an error inserting duplicate users', function (done) {

      request(server)
          .post(PATH)
          .type('application/json')
          .send(user)
          .end(function (err, res) {
            assert.equal(res.statusCode, 400);
            var result = res.body;
            //console.log(res.statusCode);
            //console.log(result);
            should.notEqual(result, undefined);
            result.should.have.property('error');
            done();
          });
    });
  });
});

describe('GET /users', function () {

  it('should return all users', function (done) {
    "use strict";
    //console.log(mockUser);
    request(server)
        .get(PATH)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          assert.equal(res.statusCode, 200);
          should.not.exist(err);
          var result = res.body;
          //console.log(result);
          should.notEqual(result, undefined);
          result.should.be.instanceof(Array);
          done();
        });
  });

  users.forEach(function createUser(user, index, array) {
    it('should return a user matching the email param', function (done) {
      "use strict";
      //console.log(mockUser);
      request(server)
          .get(PATH + '/' + user.email)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            assert.equal(res.statusCode, 200);

            should.not.exist(err);
            var result = res.body;
            //console.log(result);
            should.notEqual(result, undefined);
            result.email.toString().should.eql(user.email.toString());
            done();
          });
    });
  });


  it('should return an error, user doesnt exist', function (done) {
    "use strict";
    //console.log(mockUser);
    request(server)
        .get(PATH + '/fakeemail')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          assert.equal(res.statusCode, 400);
          var result = res.body;
          //console.log(res.statusCode);
          //console.log(result);
          should.notEqual(result, undefined);
          result.should.have.property('error');
          done();

        });
  });

});

describe('PUT /users', function () {
  //console.log(array[index]);
  users.forEach(function createUser(user, index, array) {

    it('should update an existing user', function (done) {
      var newImgUrl = user.picture = chance.url({domain: 'https://www.cdn.ustreamjustice.com', extensions: ['jpeg']});

      request(server)
          .put(PATH)
          .type('application/json')
          .send(user)
          .end(function (err, res) {
            assert.equal(res.statusCode, 200);
            var result = res.body;
            //console.log(res.statusCode);
            //console.log(result);
            should.notEqual(result, undefined);
            result.should.have.property('_id');
            //result._id.toString().should.eql(user._id.toString());
            result.picture.should.eql(newImgUrl);
            done();
          });
    });
  });
});

describe('DELETE /users', function () {
  //console.log(array[index]);
  users.forEach(function createUser(user, index, array) {

    it('should update an existing user', function (done) {
      request(server)
          .delete(PATH + '/' + user.email)
          .end(function (err, res) {
            assert.equal(res.statusCode, 200);
            var result = res.body;
            should.notEqual(result, undefined);

            done();
          });
    });
  });
});
