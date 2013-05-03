var People = require('../db').model;

module.exports = {

  pre: function(next) {
    People.count({age: 13}).exec(function(err, count) {
      next(err, count);
    });
  },

  mutate: function(next) {
    People.update({age: 13}, {$set: { age: 10 }}, {multi: true, upsert: false}).exec(function(err, num) {
      next(err, num);
    });
  },

  post: function(next) {
    People.count({age: 13}).exec(function(err, count) {
      next(err, count);
    });
  }

};
