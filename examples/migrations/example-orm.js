var async = require('async');
var test = require('tap').assert;
    var Person = require('./../db').model;

module.exports = {
  
  query: function(next) {
    Person.findOne({ hair : null }).exec(function(err, docs) {
      next(null, docs)
    }); 
  },

  pre: function(model, next) {
    if(!model.hair)
      return next();

    return next('failed migration has hair');
  },

  mutate: function(model, next) {
    model.hair = Boolean(Math.round(Math.random() * 1));

    next();
  },

  post: function(model, next) {
    if(model.hair !== null)
      return next();

    return next("model doesn't have hair");
  },

  save: function(model, next) {
    model.save(function(err, model) {
      if(err) return next(err);

      return next(null);
    })
  }

};
