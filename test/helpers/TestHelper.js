/**
 * Created by ghostmac on 11/10/15.
 */
var util = require('util');
var c = require('chance')();
var models = require('../../app').models;
var IncidentLocation = models.IncidentLocationModel;
var User = models.UserModel;
var Incident = models.IncidentModel;
var MediaBundle = models.MediaBundleModel;

var TestDataHelper = {

  getRandomUsers: function (count) {
    "use strict";
    var users = [];
    for (var i = 0; i < count; i++) {

      users.push(new User({
        active: true,
        verified: false,
        email: c.email(),
        firstName: c.first(),
        lastName: c.last(),
        gender: c.gender().toString()[0],
        phone: c.phone(),
        sp_api_key_id: c.hash(),
        sp_api_key_secret: c.hash(),
        lastLogin: Date.now(),
        created: Date(),
        picture: c.url({domain: 'https://www.cdn.ustreamjustice.com', extensions: ['jpeg']})
      }));
    }
    return users;
  },
  getRandomLocations: function (count) {
    "use strict";
    var incidentData = [];
    for (var i = 0; i < count; i++) {
      var rc = c.coordinates().split(',');
      var lat = Number(rc[0]),
          lon = Number(rc[1]);
      incidentData.push(new IncidentLocation({
        loc: {
          type: 'Point',
          coordinates: [lon, lat]
        }
      }));
    }
    return incidentData;
  },
  getRandomIncidents: function (count) {
    "use strict";
    var incidents = [];
    var targets = TestDataHelper.getRandomUsers(count);
    var locations = TestDataHelper.getRandomLocations(count);
    for (var i = 0; i < count; i++) {
      var t = targets[i];
      var l = locations[i];
      //console.log('location: %s', l);
      //console.log('user: %s', t);
      incidents.push(new Incident({
        location: l._id,
        sourceIdentity: t._id,
        incidentTarget: t._id,
        categoryType: "Traffic Stop",
        incidentDate: Date(),
        hammertime: Date.now(),
        lastModified: Date.now(),
        sourceType: 'VICTIM',
        tags: ['Racial Profiling', 'Black Male', 'Police', 'Dont Shoot'],
        description: c.paragraph()
      }));
    }
    return incidents;
  },
  getRandonMediaBundles: function (incidents) {
    "use strict";
    var bundles = [],
    count = incidents.length;
    for (var i = 0; i < count; i++) {
      var incident = incidents[i];
      bundles.push(new MediaBundle({
        liveStreamUrl: c.url({domain: 'https://www.api.ustreamjustice.com', path: util.format('v1/streams/live/%s',incident._id)}),
        recordedVideoUrl: c.url({domain: 'https://www.api.ustreamjustice.com', path: util.format('v1/streams/recorded/%s',incident._id)}),
        incidentId: incident._id
      }));
    }
    return bundles;
  }
};


module.exports = TestDataHelper;