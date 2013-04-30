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

  if(opts && typeof opts === 'object')
    this._parseOptions(opts);
  
  // TODO: this might cause issues when running with the binary file
  if(require.main)
    this._dir = path.dirname(require.main.filename)
  // this._dir = process.env.PWD; // sets the path to be relative to the file running this process
  
  this._state = false;
  this._updateQ = [];

  if(this._autoRun)
    this.start();
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
  if(_.isEmpty(opts)) throw new Error(" Missing Parameters ex. { files: ['array', 'of', 'files'] } "); 
  if(!opts.files ) throw new Error(" Missing files declaration in options hash ex. { files: ['array', 'of', 'files'] } ");
  if(!opts.migrationPath) throw new Error("Missing migration path");

  this._files = opts.files;
  this._autorun = (opts.autorun) ? opts.autorun : false;
  this._migrationPath = opts.migrationPath; 

  return;
};

/**
 * Setup will prime the Yogrit with its tasks
 * @param  {Array} list [Files to be used in the update]
 * @return {[void]}
 */
Yogrit.prototype.start = function(opts) {
  if(opts && typeof opts === 'object')
    this._parseOptions(opts);

  this._validateParameters();
  this._build();
  this._loadUpdates();
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

    console.log(filePath)

    if(!fs.existsSync(filePath)) throw Error('Update File ' + item + ' does not exist');
    if(!self._validateUpdateFile(filePath)) throw Error('Update file is missing methods, required methods (test, pre, post, update)');

    self._updateQ.push(require(filePath));
  });

  return;
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
 * Loops through each file in the _updateQ and ensures the proper methods are declared
 * 
 * @return {Boolean} True if all files are declared properly
 */
Yogrit.prototype._validateUpdateFile = function(updateFile) {
  var file = require(updateFile);
  return true;
  return file.preTest && file.postTest && file.update && file.getDocuments && file.save;
};

/**
 * Loops through the updateQ and starts the update process
 */
Yogrit.prototype._loadUpdates = function() {
  var self = this;

  async.each(this._updateQ, function(file, callback) {
    self._runUpdate(file, callback);  
  }, function(err) {
    if(err) {
      console.error('There was an error with the updates: ', err);
      return process.exit(1);
    }

    process.exit()
  });
};

Yogrit.prototype._runUpdate = function(file, callback) { 

  // TODO: create a wrapper object to hold migrate_files
  file.opts = (file.opts) ? file.opts : {};
  file.opts.qualify = (file.opts.qualify) ? file.opts.qualify : true;
  file.opts.verify = (file.opts.verify) ? file.opts.verify : true;
  file.opts.save = (file.opts.save) ? file.opts.save : false;

  file.bucket(function(collection) {
    async.each(collection, function(model, cb) {
      async.series({

        qualify: function(next) {
          if(file.opts.qualify)
            return file.qualify(model, next)

          return next();
        }, 
        
        mutate: function(next) {
          file.mutate(model, next);
        },

        verify: function(next) {
          if(file.opts.verify)
            return file.verify(model, next);

          return next();
        },

        save: function(next) {
          if(file.opts.save)
            return file.save(model, next);
            
          return next();
        }
      }, function(err, results) {
        if(err) return console.error('\033[31m' + err + '\033[m');

        return cb();
      }); // async.end series
    }, function(err) {
      if(err) throw new Error();

      console.info('Done');
    }); // end async.each
      
  });
};

exports = module.exports = Yogrit;
