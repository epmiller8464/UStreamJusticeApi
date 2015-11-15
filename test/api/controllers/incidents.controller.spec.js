var should = require('should');
var request = require('supertest');
var assert = require('assert');
var util = require('util');
var server = require('../../../app');
var chance = require('chance')();
var helper = require('../../helpers/TestHelper');
var config = require('../../../config/environment');
var controllerName = "incidents";
var PATH = util.format('/%s/%s/%s', config.api.basePATH, config.api.version, controllerName);
console.log(PATH);

var count = 5;
var data = helper.getRandomIncidents(count);
count.should.eql(data.length);

var testDescription = util.format('POST/%s', controllerName);

describe(testDescription, function () {
  data.forEach(function (incident, index, array) {
    it('should add a new incident', function (done) {

      request(server)
          .post(PATH)
          .type('application/json')
          .send(incident)
          .end(function (err, res) {
            assert.equal(res.statusCode, 201);
            var result = res.body;
            should.notEqual(result, undefined);
            result.should.have.property('_id');
            //result.email.should.eql(incident.email);
            done();
          });
    });

    it('should return statusCode === 400; an error inserting duplicate incidents', function (done) {

      request(server)
          .post(PATH)
          .type('application/json')
          .send(incident)
          .end(function (err, res) {
            assert.equal(res.statusCode, 400);
            var result = res.body;
            should.notEqual(result, undefined);
            result.should.have.property('error');
            done();
          });
    });
  });
});


testDescription = util.format('GET/%s', controllerName);

describe(testDescription, function () {

  it('should return all incidents', function (done) {
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

  data.forEach(function createUser(incident, index, array) {
    it('should return an incident matching the id param', function (done) {
      "use strict";
      //console.log(mockUser);
      request(server)
          .get(PATH + '/' + incident._id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            assert.equal(res.statusCode, 200);

            should.not.exist(err);
            var result = res.body;
            //console.log(result);
            should.notEqual(result, undefined);
            result._id.toString().should.eql(incident._id.toString());
            done();
          });
    });
  });


  it('should return an error, incident does not exist', function (done) {
    "use strict";
    //console.log(mockUser);
    request(server)
        .get(PATH + '/1234')
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



testDescription = util.format('PUT/%s', controllerName);
//
//describe(testDescription, function () {
//  //console.log(array[index]);
//  data.forEach(function(incident, index, array) {
//
//    it('should update an existing incident', function (done) {
//      var newImgUrl = incident.picture = chance.url({domain: 'https://www.cdn.ustreamjustice.com', extensions: ['jpeg']});
//
//      request(server)
//          .put(PATH)
//          .type('application/json')
//          .send(incident)
//          .end(function (err, res) {
//            assert.equal(res.statusCode, 200);
//            var result = res.body;
//            //console.log(res.statusCode);
//            //console.log(result);
//            should.notEqual(result, undefined);
//            result.should.have.property('_id');
//            //result._id.toString().should.eql(incident._id.toString());
//            result.picture.should.eql(newImgUrl);
//            done();
//          });
//    });
//  });
//});
//
//describe('DELETE /incidents', function () {
//  //console.log(array[index]);
//  incidents.forEach(function createUser(incident, index, array) {
//
//    it('should update an existing incident', function (done) {
//      request(server)
//          .delete(PATH + '/' + incident.email)
//          .end(function (err, res) {
//            assert.equal(res.statusCode, 200);
//            var result = res.body;
//            should.notEqual(result, undefined);
//
//            done();
//          });
//    });
//  });
//});
