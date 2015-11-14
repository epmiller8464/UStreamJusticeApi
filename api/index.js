'use strict';
var util = require('util');
var UserController = require('./user/user.controller');
var FeedController = require('./feed/feed.controller');
//var stormpath = require('stormpath-sdk-express');

module.exports.addAPIRouter = function (config, app, mongoose) {

  //var router = express.Router();
  var models = require('./models/models')(mongoose);
  app.models = models;

  var spConfig = {
    //appHref: config.sp.STORMPATH_APP_HREF,
    //apiKeyId: config.sp.STORMPATH_API_KEY_ID,
    //apiKeySecret: config.sp.STORMPATH_API_KEY_SECRET,
    writeAccessTokenResponse: true,
    //writeAccessTokenResponse: false,
    //endOnError: false,
    allowedOrigins: ['http://localhost:3000',
      'https://localhost:3000',
      'http://localhost']
  };
  //var spMiddleware = stormpath.createMiddleware(spConfig);

  var uc = new UserController(app, mongoose);

  app.use(function (req, res, next) {
    //res.contentType('application/json');
    next();
  });

  var PATH = util.format('/%s/%s',config.api.basePATH,config.api.version);

  app.get(PATH + '/users', uc.get);
  app.get(PATH + '/users/:email', uc.userIdGet);
  app.post(PATH + '/users', uc.post);
  app.put(PATH + '/users', uc.put);
  app.del(PATH + '/users/:email', uc.delete);

  //app.use('/api/v1.0', router);
};
