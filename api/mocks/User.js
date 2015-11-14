/**
 * Created by ghostmac on 11/6/15.
 */


function loadMock() {
  var User = require('../models/models').UserModel;
  //var User = app.models.UserModel;

  var self = this;
  self.mockUser = new User({
    active: true,
    email: "testuser1@example.com",
    firstName: "Test",
    lastName: "User1",
    sp_api_key_id: '6YQB0A8VXM0X8RVDPPLRHBI7J',
    sp_api_key_secret: 'veBw/YFx56Dl0bbiVEpvbjF',
    lastLogin: Date("2015-01-07T17:26:18.996Z"),
    created: Date("2015-01-07T17:26:18.995Z"),
    picture: "",
  });
  return self;
}

module.exports = loadMock;