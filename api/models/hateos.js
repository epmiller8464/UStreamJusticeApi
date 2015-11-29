var inherits = require('inherits');

var ErrorResponse = {
  "message": "Invalid Token",
  "status": 401,
  "error": "Unauthorized"
};
module.exports = ErrorResponse;

function Link(href, rel, method, name) {
  "use strict";
  var self = this;
  self.href = href;
  self.rel = rel;
  self.method = method;
  self.name = name;
}
module.exports = Link;

function Curies(href, name, templated) {
  "use strict";
  var self = this;
  self.href = href;
  self.name = name;
  self.templated = templated;
}
module.exports = Curies;


//function UStreamJustice(){"use strict";}
function Hypermedia() {
}

Hypermedia.prototype._links = function links(selfUrl, nextUrl) {
  "use strict";
  var self = this;
  self.next = nextUrl;
  self.self = selfUrl;
};

module.exports = Hypermedia;




