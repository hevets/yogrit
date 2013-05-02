/**
 * Require anything you might need for the migration
 */

var assert = require('assert');
var async = require('async');

module.exports = {
  
  /**
   * opts: can modifiy behavior of migration script
   */

  opts: {
    save: true
  },


  /**
   * bucket: the collection you'll want to be running the update against
   */

  bucket: function(next) {
    console.log('bucket phase')

    require('./../mongo_setup_db').remove();
    var Person = require('./../mongo_setup_db').model;
    var data = require('./../mongo_setup_db').data;

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
  
  /**
   * qualify: test against (one) document from the collection
   */

  qualify: function(model, next) {
    console.log('qualify phase')

    console.log(model._id)
    next();
  },
  
  /**
   * mutate: The actual migration to run against (one) document
   */

  mutate: function(model, next) {
    console.log('mutate phase')

    console.log(model._id)

    next();
  },
  
  /**
   * verify: test against the modified model to see if your changes worked
   */

  verify: function(model, next) {
    console.log('verify phase')

    console.log(model._id)
    
    next();
  },

  /**
   * save: save the model with changes to the db
   */

  save: function(model, next) {
    console.log('save phase')

    console.log(model._id)
    
    next();
  }

};
