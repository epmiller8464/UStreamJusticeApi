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
var hal = require('../../../lib/hal');

var PATH = util.format('/%s/%s/%s', config.api.basePATH, config.api.version, controllerName);


describe('link relations', function () {
  it('load all incidents incidents', function (done) {
    "use strict";

    var data = helper.getRandomIncidents(5);
    var incident = data[0];
    var obj = incident.toObject();
    var limit = 10,
        offset = 0;
    var selfUrl = util.format('/incidents?limit=%s&offset=%s', limit, offset);
    var resource = new hal.Resource(obj, selfUrl);
    var next = util.format('/incidents?limit=%s&offset=%s', limit, limit);

    resource.link('next', {href: next, method: "POST", rel: "incidents"});
    console.log(resource.toJSON());
    done();
  });
});