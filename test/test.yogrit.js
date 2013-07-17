var test = require('tap').test;
var db = require('./db/people');

// Yogrit lib
var Yogrit = require('../lib/yogrit');


test("\nyogrit constructor sets up defaults", function(t) {
  var y = new Yogrit();

  t.equal(y.params.files.length, 2, 'two files loaded into files array');
  t.equal(y.params.folderName, 'migrations', 'default folder name is migrations');
  t.equal(y.params.rootdir, __dirname, 'rootdir is relative where the update file is run from');
  t.equal(y.updateQ.length, 0, 'updateQ should be empty on initialize');
  t.equal(y.failedUpdateQ.length, 0, 'failedUpdateQ should be empty on initialize');

  t.end();
});

test("\nyogrit options are parsed properly on constuctor", function(t) {
  var y = new Yogrit({folderName: 'updates', files: ['update1.js', 'update2.js']})

  t.equal(y.params.folderName, 'updates', 'folderName should be updates');
  t.equal(y.params.files[0], 'update1.js', 'should equal update1.js');
  t.equal(y.params.files[1], 'update2.js', 'should equal update2.js');

  t.end();
});

test("\nyogrit migrate with specific file (test.migration.native.js)", function(t) {
  var y = new Yogrit({ files: ['test.migration.native.js']});
  
  y.migrate();

  t.end();
});

