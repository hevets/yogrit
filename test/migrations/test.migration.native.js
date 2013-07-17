var db = require('../db/people');
var async = require('async');

module.exports = {
  pre: function(next) {

    next(null, db.people.length);
  },

  up: function(next) {
    var updateCount = 0;

    async.each(db.people, function(person, cb) {
      person.name = 'Peter Piper';
      updateCount++;

      cb();
    }, function(err) {
      next(err, updateCount);
    });
  },

  post: function(next) {
    next(null, db.people);
  }
};
