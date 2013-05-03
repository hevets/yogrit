var async = require('async');
var test = require('tap').assert;

module.exports = {
  
  query: function(next) {
    require('./../db').remove();
    var Person = require('./../db').model;
    var data = require('./../db').data;

    async.each(data, function(data, cb) {
      var person = new Person(data);
      person.save(cb);
    }, function(err) {
      if(err) return next(err)

      Person.find().exec(function(err, docs) {
        next(null, docs)
      });  
    });
  },

  pre: function(model, next) {
    console.log('pre', model)
    next();
  },

  mutate: function(model, next) {
    console.log('mutate', model)
    next();
  },

  post: function(model, next) {
    console.log('post', model)
    next();
  },

  save: function(model, next) {
    console.log('save', model)
    next();
  }

};
