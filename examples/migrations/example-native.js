var People = require('../db').model;

module.exports = {

  pre: function(next) {
    People.count({age: 36}).exec(function(err, count) {
      next(err, count);
    });
  },

  mutate: function(next) {
    People.update({age: 36}, {$set: { age: 99 }}, {multi: true, upsert: false}).exec(function(err, num) {
      next(err, num);
    });
  },

  post: function(next) {
    People.count({age: 36}).exec(function(err, count) {
      next(err, count);
    });
  }

};
