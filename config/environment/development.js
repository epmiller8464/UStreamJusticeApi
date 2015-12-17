'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost:27017/usj',
    user: '',
    pwd: ''
  },

  sp: {
    STORMPATH_API_KEY_ID: '2XWKBCBT8JXO4PE4OFM6RLZIQ',
    STORMPATH_API_KEY_SECRET: 'TimVflOwd7zkVH6wOLdRg0p7cVU+MhQRgSu3mI3nJkc',
    STORMPATH_APP_HREF: 'https://api.stormpath.com/v1/applications/6TuQV4SKxQNGE2YegGEeoj'
  },

  test: {
    apiServer: 'localhost',
    apiServerPort: '9000',
    apiServerURI: 'http://localhost:9000/api/v1'
  },
  ip: '192.168.0.6',
  api: {
    basePATH: 'api',
    version: 'v1'
  },
  seedDB: true
};
