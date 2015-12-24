/**
 * Created by ghostmac on 11/10/15.
 */
var util = require('util');
var c = require('chance')();
var models = require('../../app').models;
var IncidentLocation = models.IncidentLocationModel;
var User = models.UserModel;
var Incident = models.IncidentModel;
var StreamModel = models.StreamModel;

var TestDataHelper = {

  getRandomUsers: function (count) {
    "use strict";
    var users = [];
    for (var i = 0; i < count; i++) {
      var email = c.email();
      users.push(new User({
        active: true,
        verified: false,
        email: email,
        //email: c.last(),
        firstName: c.first(),
        lastName: c.last(),
        age: c.age().toString(),
        username: email,
        phone: c.phone(),
        sp_api_key_id: c.hash(),
        sp_api_key_secret: c.hash(),
        lastLogin: Date.now(),
        createDate: Date.now(),
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
    //var locations = TestDataHelper.getRandomLocations(count);
    //var streams = TestDataHelper.getRandonMediaBundles(count);
    for (var i = 0; i < count; i++) {
      var t = targets[i];
      //var l = locations[i];

      var locations = [];
      for (var l = 0; l <  50; l++) {
        var rc = c.coordinates().split(',');
        var xlat = Number(rc[0]),
            xlon = Number(rc[1]);
        //locations.push({coordinates: [xlon, xlat], type: 'Point'});
        locations.push([xlon, xlat]);
      }
      //console.log(locations);
      var lat = locations[0][0],
          lon = locations[0][1];
      var incident = new Incident({
        initialLoc: {coordinates: [lon, lat]},
        locations: {coordinates: locations},
        //locations: locations,

        sourceIdentity: t._id,
        incidentTarget: t._id,
        categoryType: "Traffic Stop",
        incidentDate: Date.now(),
        hammertime: Date.now(),
        lastModified: Date.now(),
        sourceType: 'VICTIM',
        tags: ['Racial Profiling', 'Black Male', 'Police', 'Dont Shoot'],
        details: c.paragraph()
      });
      var stream = new StreamModel({
        liveStreamUrl: c.url({
          domain: 'https://www.api.ustreamjustice.com',
          path: util.format('v1/streams/live/%s', incident._id)
        }),
        recordedVideoUrl: c.url({
          domain: 'https://www.api.ustreamjustice.com',
          path: util.format('v1/streams/recorded/%s', incident._id)
        }),
        incidentId: incident._id
      });
      incident.streamId = stream._id;
      incidents.push(incident);
    }
    return incidents;
  },
  getRandonMediaBundles: function (incidents) {
    "use strict";
    var bundles = [],
        count = incidents.length;
    for (var i = 0; i < count; i++) {
      var incident = incidents[i];
      bundles.push(new StreamModel({
        liveStreamUrl: c.url({
          domain: 'https://www.api.ustreamjustice.com',
          path: util.format('v1/streams/live/%s', incident._id)
        }),
        recordedVideoUrl: c.url({
          domain: 'https://www.api.ustreamjustice.com',
          path: util.format('v1/streams/recorded/%s', incident._id)
        }),
        incidentId: incident._id
      }));
    }
    return bundles;
  }
};


module.exports = TestDataHelper;