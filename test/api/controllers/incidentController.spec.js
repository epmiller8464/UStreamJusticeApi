var should = require('should');
var request = require('supertest');
var assert = require('assert');
var util = require('util');
var server = require('../../../app');
var chance = require('chance')();
var helper = require('../../helpers/TestHelper');
var config = require('../../../config/environment');
var controllerName = "incidents";
var PATH = util.format('/%s/%s/%s', config.api.basePATH, config.api.version,controllerName);
console.log(PATH);

var count = 5;
var incidents = helper.getRandomIncidents(count);
count.should.eql(incidents.length);
//
describe('POST /incident', function () {
  incidents.forEach(function(incident, index, array) {
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
            //result.email.should.eql(user.email);
            done();
          });
    });
  });
});