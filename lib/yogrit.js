/**
 * Module deps
 */
var fs = require('fs');
var util = require('util');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

/**
 * 3rd party deps
 */
var async = require('async');
var _ = require('underscore');

/**
 * Yogrit: Update Yogrit that is test driven
 *
 * Usage: 
 * var Yogrit = new Yogrit({files: ['update.file.1.js', 'update.file.2.js'], autorun: true });
 * 
 */
function Yogrit(opts) {
  EventEmitter.call(this);

  // create a object to store class params
  this.params = {};

  // TODO: this might cause issues when running with the binary file
  if(require.main)
    this.params.rootdir = path.dirname(require.main.filename)
  // this.params.rootdir = process.env.PWD; // sets the path to be relative to the file running this process

  // parse the default options being passed in  
  this.parseOptions(opts);

  this.updateQ = [];
  this.failedUpdateQ = [];

  this.on('migration:complete', process.exit);
};

// Yogrit.prototype.__proto__ = EventEmitter.prototype;
util.inherits(Yogrit, EventEmitter);

/**
 * Parse options passed to the Yogrit, either by constructor or by .migrate() method
 *
 * @param {object} opts [The options object]
 * @param {opts.files} opts.files [Required: List of update files to be used]
 */
Yogrit.prototype.parseOptions = function(opts) {
  var self = this;

  opts = (opts) ? opts : {};
  this.params.folderName = (opts.folderName) ? opts.folderName : 'migrations';
  this.params.files = this.getMigrationFiles(opts.files);
};

/**
 * Takes the _files array sets up the files to be used for this
 * @param  {[Array]}   files    [List of files from constructor]
 * @return {[Array]}            [List of file paths relative to the _dir]
 */
Yogrit.prototype.getMigrationFiles = function(files) {
  if(files && _.isArray(files)) return files;
  return fs.readdirSync(path.join(this.params.rootdir, this.params.folderName));
};

/**
 * Setup will prime the Yogrit with its tasks
 * @param  {Array} list [Files to be used in the update]
 * @return {[void]}
 */
Yogrit.prototype.migrate = function(opts) {
  if(opts && typeof opts === 'object')
    this.parseOptions(opts);

  this.validateParams();
  this.build();
  this.startRunner();
};

/**
 * Checks to see if required parameters are avail
 */
Yogrit.prototype.validateParams = function() {
  if(!this.params.files)
    throw new Error("No files to migrate, tried to look in: " + path.join(this.params.rootdirm, this.params.folderName));

  return;
};

/**
 * Checks to see if files has proper methods declared
 * 
 * @return {Boolean} True if methods are present
 */
Yogrit.prototype.validateFile = function(filePath) {
  var file = require(filePath);

  return file.pre && file.up && file.post;
};

/**
 * Loops through the params.files and adds to updateQ
 * 
 * @param  {Array}  list             List of files to be used by the Yogrit
 * @return {void}
 */
Yogrit.prototype.build = function() {
  var self = this;

  _.each(self.params.files, function(file) {
    var filePath = path.join(self.params.rootdir, self.params.folderName, file);

    if(!fs.existsSync(filePath)) throw Error('Update File ' + file + ' does not exist');
    if(!self.validateFile(filePath)) throw Error('Methods missing, required methods file.pre, file.up, file.post');

    var r = require(filePath);
    r.id = file;

    self.updateQ.push(r);
  });

  return;
};

Yogrit.prototype.startRunner = function() {
  var self = this;
  
  async.eachSeries(this.updateQ, function(file, callback) {
    if(typeof file.query !== 'function') self.migration(file, callback);
    else self.migrationSeries(file, callback);
  }, function(err) {
    // TODO: clean this section up, it doesn't feel right
    if(err) {
      console.log(err);
      return self.emit('migration:complete');
    } 

    return self.emit('migration:complete');
  });
};

Yogrit.prototype.migration = function(file, callback) {
  var self = this;

  async.series({
    pre: function(next) {
      return file.pre(next);
    },
    up: function(next) {
      return file.up(next);
    },
    post: function(next) {
      return file.post(next);
    }
  }, function(err, results) {
    if(err) throw new Error(err);
    
    console.log('\n\033[0;33mMigration Results\033[m\n');
    console.log('Pre Results: ', (results.pre) ? results.pre : 'No values');
    console.log('Up Results:   ', (results.up) ? results.up : 'No values');
    console.log('Post Results: ', (results.post) ? results.post : 'No values');
    console.log('\n' + file.id + ' \033[32m [ complete ]\033[m\n');

    callback();
  });
};

Yogrit.prototype.migrationSeries = function(file, callback) {
  var self = this;

  async.whilst(
    function() {
      return true;
    },
    function(next) {
      self.migrationEach(file, next);
    },
    function(err) {
      if(err) return callback(err);

      callback();
    }
  );
};

Yogrit.prototype.migrationEach = function(file, callback) {
  file.query(function(err, collection) {
    if(!collection) return callback('\n' + file.id + ' \033[32m [ complete ]\033[m\n');
    if(!_.isArray(collection)) collection = [collection];
    if(!collection.length) return callback('\n' + file.id + ' \033[32m [ complete ]\033[m\n');

    async.each(collection, function(model, cb) {
      async.series({
        _stats: function(next) {
          next(null, model);
        }, 
        pre: function(next) {
          return file.pre(model, next);
        },
        up: function(next) {
          return file.mutate(model, next);
        },
        post: function(next) {
          return file.post(model, next);
        },
        save: function(next) {
          return file.save(model, next);
        }
      }, function(err, results) {
        if(err) return cb(err);

        return cb();
      });
    }, function(err) {
      if(err) return callback(err);

      return callback();
    });
  });
};

module.exports = Yogrit;
