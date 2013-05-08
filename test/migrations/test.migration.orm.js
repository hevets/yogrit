var db = require('../db/people');

module.exports = {
  query: function(next) {
    console.log('query');
    next(); 
  },

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
  },

  save: function(model, next) {
    console.log('save');
    next();
  }
};
