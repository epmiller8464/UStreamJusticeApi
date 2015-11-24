var should = require('should');
var request = require('supertest');
var assert = require('assert');
var util = require('util');
var server = require('../../../app');
var models = server.models;
var c = require('chance')();
var helper = require('../../helpers/TestHelper');
var config = require('../../../config/environment');
var controllerName = "incidents";
var PATH = util.format('/%s/%s/%s', config.api.basePATH, config.api.version, controllerName);
//console.log(PATH);

var count = 1;
var data = helper.getRandomIncidents(count);
count.should.eql(data.length);

var testDescription = util.format('POST/%s', controllerName);
describe(testDescription, function () {
  data.forEach(function (incident, index, array) {
    it('should add a new incident', function (done) {
      //console.log(incident);
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
      //console.log(incident);

      request(server)
          .post(PATH)
          .type('application/json')
          .send(incident)
          .end(function (err, res) {
            assert.equal(res.statusCode, 400);
            //console.log(err);
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
describe(testDescription, function () {
  data.forEach(function (incident, index, array) {
    var n = c.integer({min: 0, max: 1000});
    do {
      it('should update an existing incident', function (done) {
        var updates = {
          //description: 'test update',
          description: c.sentence(),
          state: models.IncidentStates.LIVE,
          tags: incident.tags.concat('911' + n),
          //incidentTarget: undefined,
          //make sure no change fields arent sent
          sourceType: incident.sourceType,
          loc: helper.getRandomLocations(n)[c.integer({min: 0, max: n + 1})],
          _id: incident._id
        };

        request(server)
            .put(PATH)
            .type('application/json')
            .send(updates)
            .end(function (err, res) {
              assert.equal(res.statusCode, 200);
              var result = res.body;
              //console.log(res.statusCode);
              //console.log(result);
              should.notEqual(result, undefined);
              //result.should.have.property('ok');
              done();
            });
      });
      n--;
    } while (n >= 0);
  });
});

testDescription = util.format('DELETE/%s', controllerName);

//describe(testDescription, function () {
//  //console.log(array[index]);
//  data.forEach(function (incident, index, array) {
//
//    it('should delete an existing incident', function (done) {
//      request(server)
//          .delete(PATH + '/' + incident._id)
//          .end(function (err, res) {
//            assert.equal(res.statusCode, 204);
//            var result = res.body;
//            should.notEqual(result, undefined);
//            done();
//          });
//    });
//    it('should fail deleting a fake incident', function (done) {
//      request(server)
//          .delete(PATH + '/fake')
//          .end(function (err, res) {
//            assert.equal(res.statusCode, 404);
//            var result = res.body;
//            should.notEqual(result, undefined);
//            done();
//          });
//    });
//  });
//});
