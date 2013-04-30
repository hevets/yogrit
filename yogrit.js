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
 * Mgrate: Update Mgrate that is test driven
 * Usage: 
 * var Mgrate = new Mgrate({files: ['update.file.1.js', 'update.file.2.js'], autorun: true, dryrun: true, });
 * */
function Mgrate(opts) {
  Evenmitter.call(this);

  if(opts && typeof opts === 'object')
    this._parseOptions(opts);
  
  this._dir = process.env.PWD; // sets the path to be relative to the file running this process
  this._state = false;
  this._updateQ = [];

  if(this._autoRun)
    this.start();
};

// Mgrate.prototype.__proto__ = EventEmitter.prototype;
il.inherits(Mgrate, EventEmitter);/**
 * Parse options passed to the Mgrate, either by constructor or by .start() method
  * @param {object} opts [The options object]
 * @param {opts.files} opts.files [Required: List of update files to be used]
 */
Mgrate.prototype._parseOptions = function(opts) {
  if(_.isEmpty(opts)) throw new Error(" Missing Parameters ex. { files: ['array', 'of', 'files'] } "); 
  if(!opts.files ) throw new Error(" Missing files declaration in options hash ex. { files: ['array', 'of', 'files'] } ");
  if(!opts.migrationPath) throw new Error("Missing migration path");

  this._files = opts.files;
  this._dryrun = (opts.dryrun) ? opts.dryrun : false;
  this._autorun = (opts.autorun) ? opts.autorun : false;
  this._migrationPath = opts.migrationPath; 
};

/**
 * Setup will prime the Mgrate with its tasks
 * @param  {Array} li [Files to be used in the update]
 * @return {[void]}
 */
Mgrate.prototype.start = function(opts) {
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
 * @param  {Array}  list             List of files to be used by the Mgrate
 * @return {void */
Mgrate.prototype._build = function() {
  var self = this;

  _.each(self._files, function(item) {
    var filePath = path.join(self._dir, self._migrationPath, item);

    if(!fs.existsSync(filePath)) throw Error('Update File ' + item + ' does not exist');
    if(!self._validateUpdateFile(filePath)) throw Error('Update file is missing methods, required methods (test, pre, post, update)');

    self._updateQ.push(require(filePath));
  });

  return;
};

/**
 * Checks to see if required parameters are avail
 */
Mgrate.prototype._validateParameters = function() {
  if(!this._files && !this._migrationPath)
    throw new Error("Your missing parameters to start migration. \n Please ensure you've provided a migrationPath and files list");

  return;
};

/**
 * Loops through each file in the _updateQ and ensures the proper methods are declared
 * 
 * @return {Boolean} True if all files are declared properly
 */
Mgrate.prototype._validateUpdateFile = function(updateFile) {
  var file = require(updateFile);
  return true;
  return file.preTest && file.postTest && file.update && file.getDocuments && file.save;
};

/**
 * Loops through the updateQ and starts the update process
 */
Mgrate.prototype._loadUpdates = function() {
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

/**
 * _runUpdate: 
 */Mgrate.prototype._runUpdate = function(file, callback) {
  console.log(require.main.filename)
  var documents = file.getDocuments(function(documents) {
    console.log(documents);
  });
};

// Mgrate.prototype._startUpdate = function() {
   var self = this;
  // maybe have something in here called raw to do a one off update quick and dirty ?
  // _.each(self._updateQ, function(file) {
  //   async.series([
  //     function updateFile(next) {
  //       file.update(next);
  //     }
  //   ], function(err, results) {
  //     if(err) process.exit(1);

  //     process.exit(1); // ran successfully
  //   });

    // need a collection
    // loop through that collection test a model to see if it needs an udpate (pre)
    // if model needs update then run update
    // on postUpdate run test 
    // save after successful test
//   });
// };

// Mgrate.prototype._updateFile = function(file) {
   async.series({
//     collection: function(next) {
//       file.update(next);
//     }
//   }, function(err, results) {
//     if(err) process.exit(1); // there was an error

//     process.exit(1); // end successfully
//   });
// };

// var Mgrate = new Mgrate({ files: ['0.14.0-updateStudentCount.js'] });
// mgrate.start()exports = module.exports = Mgrate;
