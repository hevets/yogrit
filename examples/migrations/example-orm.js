var c = 2;
var arr = ['a', 'b', 'c'];

module.exports = {
  
  query: function(next) {
    console.log('query');
    next(null, arr[c--]);
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
