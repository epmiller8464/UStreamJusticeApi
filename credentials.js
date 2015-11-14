var config = require('config');
var credentials = {
  mongo: {
    connectionString: config.get('connString'),
    user: '',
    pwd: ''
  }
};
module.exports = credentials;