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

  
  // TODO: this might cause issues when running with the binary file
  if(require.main)
    this._dir = path.dirname(require.main.filename)
  // this._dir = process.env.PWD; // sets the path to be relative to the file running this process

  // parse the default options being passed in  
  this._parseOptions(opts);

  this._updateQ = [];
  this._failedUpdateQ = [];

  if(this._autoRun)
    this.start();

  this.on('migration:complete', process.exit);
};

// Yogrit.prototype.__proto__ = EventEmitter.prototype;
util.inherits(Yogrit, EventEmitter);

/**
 * Parse options passed to the Yogrit, either by constructor or by .start() method
 *
 * @param {object} opts [The options object]
 * @param {opts.files} opts.files [Required: List of update files to be used]
 */
Yogrit.prototype._parseOptions = function(opts) {
  var self = this;

  opts = (opts) ? opts : {};
  this._migrationPath = (opts.migrations) ? opts.migrations : 'migrations';
  this._autorun = (opts.autorun) ? opts.autorun : false;
  return this._gatherMigrationFiles(opts._files, function(files) {
    
    self._files = files;

    return;
  });
};

Yogrit.prototype._gatherMigrationFiles = function(files, callback) {
  if(files && _.isArray(files)) return files;

  console.log('here')
  fs.readdirSync(path.join(this._dir, this._migrationPath), function(err, files) {
    console.log(files)
  });
};

/**
 * Setup will prime the Yogrit with its tasks
 * @param  {Array} list [Files to be used in the update]
 * @return {[void]}
 */
Yogrit.prototype.start = function(opts) {
  if(opts && typeof opts === 'object')
    this._parseOptions(opts);

  this._run();
};

/**
 * Checks to see if required parameters are avail
 */
Yogrit.prototype._validateParameters = function() {
  if(!this._files && !this._migrationPath)
    throw new Error("Your missing parameters to start migration. \n Please ensure you've provided a migrationPath and files list");

  return;
};

/**
 * Loops through the FilesList Array and gets full path
 * Checks the file to see if it exists, adds to _updateQ if it does.
 * 
 * @param  {Array}  list             List of files to be used by the Yogrit
 * @return {void}
 */
Yogrit.prototype._build = function() {
  var self = this;

  _.each(self._files, function(item) {
    var filePath = path.join(self._dir, self._migrationPath, item);

    if(!fs.existsSync(filePath)) throw Error('Update File ' + item + ' does not exist');
    if(!self._validateUpdateFile(filePath)) throw Error('Update file is missing methods, required methods (test, pre, post, update)');

    var r = require(filePath);
    r._yogritId = item;

    self._updateQ.push(r);
  });

  return;
};

/**
 * Loops through each file in the _updateQ and ensures the proper methods are declared
 * 
 * @return {Boolean} True if all files are declared properly
 */
Yogrit.prototype._validateUpdateFile = function(updateFile) {
  var file = require(updateFile);

  return file.pre && file.mutate && file.post;
};

/**
 * Loops through the updateQ and starts the update process
 */
Yogrit.prototype._run = function() {
  var self = this;

  this._validateParameters();
  this._build();

  async.eachSeries(this._updateQ, function(file, callback) {
    if(typeof file.query !== 'function') self._migrate(file, callback);
    else self._migrateEach(file, callback);
  }, function(err) {
    if(err) {
      console.log(err);
      return self.emit('migration:complete');
    } 

    return self.emit('migration:complete');
  });
};

Yogrit.prototype._migrate = function(file, callback) {
  var self = this;

  async.series({
    pre: function(next) {
      return file.pre(next);
    },
    mutate: function(next) {
      return file.mutate(next);
    },
    post: function(next) {
      return file.post(next);
    }
  }, function(err, results) {
    if(err) throw new Error();
    
    console.log('\n\033[0;33mMigration Results\033[m\n');
    console.log('Records to update: ', results.pre);
    console.log('Records updated:   ', results.mutate);
    console.log('Records remaining: ', results.post);
    console.log('\n' + file._yogritId + ' \033[32m [ complete ]\033[m\n');

    callback();
  });
};

Yogrit.prototype._migrateEach = function(file, callback) {
  var self = this;

  async.whilst(
    function() {
      return true;
    },
    function(callback) {
      self._migrateEachSeries(file, callback);
    },
    function(err) {
      if(err) return callback(err);

      callback();
    }
  );
};

Yogrit.prototype._migrateEachSeries = function(file, callback) {

  file.query(function(err, collection) {
    if(!collection) return callback('\n' + file._yogritId + ' \033[32m [ complete ]\033[m\n');
    if(!_.isArray(collection)) collection = [collection];
    if(!collection.length) return callback('\n' + file._yogritId + ' \033[32m [ complete ]\033[m\n');

    async.each(collection, function(model, cb) {
      async.series({
        _stats: function(next) {
          next(null, model);
        }, 
        pre: function(next) {
          return file.pre(model, next);
        },
        mutate: function(next) {
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

        console.log('\033[32mFinished: \033[m', results._stats._id);
        return cb();
      });
    }, function(err) {
      if(err) return callback(err);

      return callback();
    });
  });
};

exports = module.exports = Yogrit;
