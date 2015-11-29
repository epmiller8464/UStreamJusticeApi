'use strict';
var util = require('util');
var UserController = require('./controllers/users.controller.js');
var IncidentController = require('./controllers/incidents.controller.js');
//var stormpath = require('stormpath-sdk-express');

module.exports.addAPIRouter = function (config, app, mongoose) {

  //var router = express.Router();
  var models = require('./models/models')(mongoose);
  app.models = models;

  //var spConfig = {
  //  //appHref: config.sp.STORMPATH_APP_HREF,
  //  //apiKeyId: config.sp.STORMPATH_API_KEY_ID,
  //  //apiKeySecret: config.sp.STORMPATH_API_KEY_SECRET,
  //  writeAccessTokenResponse: true,
  //  //writeAccessTokenResponse: false,
  //  //endOnError: false,
  //  allowedOrigins: ['http://localhost:3000',
  //    'https://localhost:3000',
  //    'http://localhost']
  //};
  //var spMiddleware = stormpath.createMiddleware(spConfig);

  var uc = new UserController(app, mongoose);
  var ic = new IncidentController(app, mongoose);


  var PATH = util.format('/%s/%s', config.api.basePATH, config.api.version);
  app.use(function (req, res, next) {
    //res.contentType('application/json');
    //console.log('use xxx')
    next();
  });

  app.get(PATH, function (req, res, next) {
    //res.contentType('application/json');
    var gets = app.router.routes.GET;
    var json = {};
    //console.log(app.router.routes.GET);
    gets.forEach(function (r, i, arr) {
      //console.log(req.href());
      console.log(r);
      json[r.spec.path] = app.url + r.spec.path;
    });

    res.json({_links: json});
    next();
  });

  var directPath = util.format('%s/%s', PATH, uc.path);
  app.get(directPath, uc.get);
  app.get(directPath + '/:email', uc.userIdGet);
  app.post(directPath, uc.post);
  app.put(directPath, uc.put);
  app.del(directPath + '/:email', uc.delete);

  directPath = util.format('%s/%s', PATH, ic.path);

  app.get(directPath, ic.get);
  app.get(directPath + '/:id', ic.incidentIdGet);
  app.post(directPath, ic.post);
  app.put(directPath, ic.put);
  app.del(directPath + '/:id', ic.delete);


  //console.log(app.url);

  //app.use('/api/v1.0', router);
};
