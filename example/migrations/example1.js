/**
 * Require anything you might need for the migration
 */

// var mongoose = require('mongoose');

module.exports = {
  
  /**
   * save: run the save step in the udpate
   */

  save: false, 

  /**
   * bucket: the collection you'll want to be running the update against
   */

  bucket: function(next) {
    console.log('bucket phase')

    next(['file', 'another', 'andanother']);
  },
  
  /**
   * qualify: test against (one) document from the collection
   */

  qualify: function(model, next) {
    console.log('qualify phase')

    next();
  },
  
  /**
   * mutate: The actual migration to run against (one) document
   */

  mutate: function(model, next) {
    console.log('mutate phase')

    next();
  },
  
  /**
   * verify: test against the modified model to see if your changes worked
   */

  verify: function(model, next) {
    console.log('verify phase')

    next();
  },

  /**
   * save: save the model with changes to the db
   */

  save: function(model, next) {
    console.log('save phase')

    next();
  }

};
