var db = require('../db/people');

module.exports = {
  pre: function(model, next) {
    console.log('pre');
    next();
  },

  up: function(model, next) {
    console.log('up');
    next();
  },

  post: function(model, next) {
    console.log('post');
    next();
  }
};
