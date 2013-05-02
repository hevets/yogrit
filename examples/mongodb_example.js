var Yogrit = require('../Yogrit');
var path = require('path');


var migration = new Yogrit({ migrationPath: 'migrations', 'files': ['mongo_migration.js']});
migration.start();


