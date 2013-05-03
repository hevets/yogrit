var db = require('mongoose');

db.connect('mongodb://localhost:27017/yogrit_test');

var data = [
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

var PeopleSchema = module.exports.schema = new db.Schema({
  name: String,
  age: db.Schema.Types.Mixed, 
  gender: String,
  hair: Boolean
}, { collection: "People" });

var PersonModel = module.exports.model = db.model('Person', PeopleSchema);

PersonModel.remove().exec();

for(d in data) {
  var p = new PersonModel(data[d])
  p.save(function() {
    console.log('saved')
  });
};
