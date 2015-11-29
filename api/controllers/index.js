/**
 * Created by ghostmac on 11/6/15.
 */

'use strict';
var _ = require('lodash');
var util = require('util');
var _mongoose = null;
function RootController(app, mongoose) {

  var self = this;
  _mongoose = mongoose;
  self.path = '';
}

module.exports = RootController;
