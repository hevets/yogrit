
module.exports = {
  
  query: function(next) {
    console.log('query')
    next();
  },

  pre: function(next) {
    console.log('pre')
    next();
  },

  mutate: function(next) {
    console.log('mutate')
    next();
  },

  post: function(next) {
    console.log('post')
    next();
  },

  save: function(next) {
    console.log('save')
    next();
  }

};
