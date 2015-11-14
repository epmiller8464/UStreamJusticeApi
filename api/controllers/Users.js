//'use strict';
//
//var url = require('url');
//var UsersService = require('./UsersService');
//var User = require('../user/User');
//var mockUser = require('../mocks/User');
//function Users() {
//  var self = this;
//};
//
//
//Users.prototype.get = function (req, res, next) {
//  //var userId = req.swagger.params['user-id'].value;
//
//
//  var result = mockUser;
//
//  if (typeof result !== 'undefined') {
//    res.setHeader('Content-Type', 'application/json');
//    res.send(result);
//  }
//  else
//    res.send({message: "error"});
//
//  return next();
//};
//
//Users.prototype.userIdGet = function (req, res, next) {
//  var userId = req.params['user-id'].value;
//
//  if (typeof userId !== 'undefined') {
//    res.setHeader('Content-Type', 'application/json');
//    res.send({userId: userId});
//
//  }
//  else
//    res.send({message: "error"});
//
//  return next();
//};
//
//Users.prototype.post = function (req, res, next) {
//
//  var user = req.body;
//
//  if (typeof user !== 'undefined') {
//    res.setHeader('Content-Type', 'application/json');
//    user.picture = 'tmp.jpeg';
//    res.send(user);
//
//  }
//  else
//    res.send({message: "error", data: user});
//
//  return next();
//};
//
//Users.prototype.put = function (req, res, next) {
//
//  var user = req.body;
//
//  if (typeof user !== 'undefined') {
//    res.setHeader('Content-Type', 'application/json');
//    user.picture = process.pid;
//
//    res.send(user);
//
//  }
//  else
//    res.send({message: "error", data: user});
//
//  return next();
//};
//
//module.exports = Users;