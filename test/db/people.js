var db = { people: [] };

(function setupdb() {
  db.people.push({name: 'Brian Tucker', age: Math.round(Math.random() * 90), gender: 'm'}); 
  db.people.push({name: 'Luke Jonny', age: String(Math.round(Math.random() * 90)), gender: 'm'}); 
  db.people.push({name: 'Sally Mcgavin', age: Math.round(Math.random() * 90), gender: 'm'}); 
  db.people.push({name: 'Derrek Woodstock', age: Math.round(Math.random() * 90), gender: 'm'}); 
  db.people.push({name: 'Gerald Dumont', age: Math.round(Math.random() * 90), gender: 'm'}); 
  db.people.push({name: 'Fran Cheesecake', age: Math.round(Math.random() * 90), gender: 'm'}); 
  db.people.push({name: 'Jane Bricky', age: Math.round(Math.random() * 90), gender: 'm'}); 
  db.people.push({name: 'Danny Mopal', age: Math.round(Math.random() * 90), gender: 'm'}); 
  db.people.push({name: 'Ugene Cylon', age: Math.round(Math.random() * 90), gender: 'm'});
})(db);

exports = db;
