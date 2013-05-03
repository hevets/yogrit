var Yogrit = require('../Yogrit');
var path = require('path');


var migration = new Yogrit({ migrationPath: 'migrations', 'files': ['example-native.js', 'example-orm.js']});
migration.start();


