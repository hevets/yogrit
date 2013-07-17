var db = require('../db/people');

module.exports = {
  pre: function(next) {
    console.log('pre');

    next();
  },

  up: function(next) {
    console.log('up');

    next();
  },

  post: function(next) {
    console.log('post');

    next();
  }
};
