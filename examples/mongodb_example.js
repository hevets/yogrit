var Yogrit = require('../Yogrit');
var path = require('path');


var migration = new Yogrit({ migrationPath: 'migrations', 'files': ['example-orm.js']});
migration.start();


