var db = require('mongoose');

db.connect('mongodb://localhost:27017/yogrit_test');

var PeopleSchema = module.exports.schema = new db.Schema({
  name: String,
  age: db.Schema.Types.Mixed, 
  gender: String  
}, { collection: "People"});

var PersonModel = module.exports.model = db.model('Person', PeopleSchema);

var data = module.exports.data = [
    {name: 'Brian Tucker', age: Math.round(Math.random() * 90), gender: 'm'}, 
    {name: 'Luke Jonny', age: String(Math.round(Math.random() * 90)), gender: 'm'}, 
    {name: 'Sally Mcgavin', age: Math.round(Math.random() * 90), gender: 'm'}, 
    {name: 'Derrek Woodstock', age: Math.round(Math.random() * 90), gender: 'm'}, 
    {name: 'Gerald Dumont', age: Math.round(Math.random() * 90), gender: 'm'}, 
    {name: 'Fran Cheesecake', age: Math.round(Math.random() * 90), gender: 'm'}, 
    {name: 'Jane Bricky', age: Math.round(Math.random() * 90), gender: 'm'}, 
    {name: 'Danny Mopal', age: Math.round(Math.random() * 90), gender: 'm'}, 
    {name: 'Ugene Cylon', age: Math.round(Math.random() * 90), gender: 'm'}
  ];

module.exports.remove = function() {
  PersonModel.remove().exec();
};
