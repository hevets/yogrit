/**
 * Require anything you might need for the migration
 */

var async = require('async');
var test = require('tap').assert;

module.exports = {
  
  /**
   * opts: can modifiy behavior of migration script
   */

  opts: {
    fast: true,
    save: true
  },


  /**
   * bucket: the collection you'll want to be running the update against
   */

  bucket: function(next) {
    require('./../mongo_setup_db').remove();
    var Person = require('./../mongo_setup_db').model;
    var data = require('./../mongo_setup_db').data;

    async.each(data, function(data, cb) {
      var person = new Person(data);
      person.save(cb);
    }, function(err) {
      if(err) return next(err)

      Person.find().limit(4).exec(function(err, docs) {
        next(null, docs)
      });  
    });
  },
  
  /**
   * qualify: test against (one) document from the collection
   */

  qualify: function(model, next) {
    if(typeof model.age !== 'number')
      return next('Age was not a number', model);
    
    return next();
  },
  
  /**
   * mutate: The actual migration to run against (one) document
   */

  mutate: function(model, next) {
    model.age += 1;
    next();
  },
  
  /**
   * verify: test against the modified model to see if your changes worked
   */

  verify: function(model, next) {

    next();
  },

  /**
   * save: save the model with changes to the db
   */

  save: function(model, next) {
    next();
  }

};
