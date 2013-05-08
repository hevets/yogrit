var test = require('tap').test;
var db = require('./db/people');

// Yogrit lib
var Yogrit = require('../lib/yogrit');


test("yogrit constructor sets up defaults", function(t) {
  var y = new Yogrit();
  t.equal(y.params.files.length, 2, 'two files loaded into files array');
  t.equal(y.params.folderName)
  t.end();
});
