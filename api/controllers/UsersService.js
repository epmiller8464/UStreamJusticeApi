'use strict';

exports.usersUserIdGet = function() {

  var examples = {};
  
  examples['application/json'] = {
  "data" : {
    "picture" : "aeiou",
    "lastName" : "aeiou",
    "phoneNumber" : "aeiou",
    "email" : "aeiou",
    "userStatus" : "aeiou",
    "firstName" : "aeiou"
  }
};
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}
