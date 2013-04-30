var Mongrate = require('../Mongrate');
var path = require('path');

var migration = new Mongrate({ migrationPath: 'migrations', 'files': ['example1.js']});
migration.start();
