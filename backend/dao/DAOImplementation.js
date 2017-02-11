const Datastore = require('nedb');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fs = editor.create(store);
const appRoot = require("app-root-path");
const path = require("path");
const tv4 = require("tv4");

/**
 * DAO implementation.
 * @constructor
 * @implements {DAOInterface}
 * @param {Object} config - Configuration.
 * @param {string} config.collectionName - Collection name.
 * @param {Object} config.schema - Collection schema.
 * @param {string} [config.filename] - Path to the
 * file where the data is persisted. If left blank,
 * the datastore is automatically considered in-memory
 * only. It cannot end with a ~ which is used in the
 * temporary files NeDB uses to perform crash-safe writes.
 * @param {boolean} [config.inMemoryOnly] - Defaults
 * to false, as the name implies.
 * @param {boolean} [config.timestampData] - Defaults to
 * false. Timestamp the insertion and last update of all documents,
 * with the fields createdAt and updatedAt. User-specified
 * values override automatic generation, usually useful
 * for testing.
 * @param {boolean} [config.autoload] - Defaults to false.
 * If used, the database will automatically be loaded from
 * the datafile upon creation (you don't need to call
 * loadDatabase. Any command issued before load is finished
 * is buffered and will be executed when load is done.
 * @param {Object} [config.onload] - If you use autoloading,
 * this is the handler called after the loadDatabase.
 * It takes one error argument. If you use autoloading without
 * specifying this handler, and an error happens during load,
 * an error will be thrown.
 * @param {Object} [config.afterSerialization] - Hook you can use
 * to transform data after it was serialized and before it is
 * written to disk. Can be used for example to encrypt data
 * before writing database to disk. This function takes a
 * string as parameter (one line of an NeDB data file) and
 * outputs the transformed string, which must absolutely not
 * contain a \n character (or data will be lost).
 * @param {Object} [config.beforeDeserialization] - Inverse of
 * afterSerialization. Make sure to include both and not just
 * one or you risk data loss. For the same reason, make sure
 * both functions are inverses of one another. Some failsafe
 * mechanisms are in place to prevent data loss if you misuse
 * the serialization hooks: NeDB checks that never one is
 * declared without the other, and checks that they are reverse
 * of one another by testing on random strings of various lengths.
 * In addition, if too much data is detected as corrupt, NeDB will
 * refuse to start as it could mean you're not using the
 * deserialization hook corresponding to the serialization hook
 * used before (see below).
 * @param {number} [config.corruptAlertThreshold] -
 * between 0 and 1,
 * defaults to 10%. NeDB will refuse to start if more than this
 * percentage of the datafile is corrupt. 0 means you don't tolerate
 * any corruption, 1 means you don't care.
 * @param {Object} [config.compareStrings] - function
 * compareStrings(a, b)
 * compares strings a and b and return -1, 0 or 1. If specified,
 * it overrides default string comparison which is not well adapted
 * to non-US characters in particular accented letters. Native
 * localCompare will most of the time be the right choice.
 */
function DAOImplementation(config) {
  this.collection = new Datastore(config);
  if (config.schema) {
    this.schema = fs.readJSON(path.join(appRoot.toString(),
    'backend/persistence/catalog/', config.schema));
  } else {
    this.schema = {};
  }
}

DAOImplementation.prototype.find = function(query, options) {
  options = options || {};
  query = query || {};
  var search = this.collection.find(query);
  if (options.sort) {
    search.sort(options.sort);
  }
  if (options.skip) {
    search.skip(options.skip);
  }
  if (options.limit) {
    search.limit(options.limit);
  }
  return new Promise(function(fulfill, reject) {
    search.exec(function(err, docs) {
      if (err) {
        reject(err);
      } else {
        fulfill(docs);
      }
    });
  });
};

DAOImplementation.prototype.findOne = function(query) {
  var collection = this.collection;
  return new Promise(function(fulfill, reject) {
    collection.findOne(query, function(err, doc) {
      if (err) {
        reject(err);
      } else {
        fulfill(doc);
      }
    });
  });
};

DAOImplementation.prototype.insert = function(data) {
  var collection = this.collection;
  var schema = this.schema;
  var isValid = true;

  if (Array.isArray(data)) {
    data.some(function(item) {
      isValid = tv4.validate(item, schema);
      return !isValid;
    });
  } else {
    isValid = tv4.validate(data, schema);
  }

  return new Promise(function(fulfill, reject) {
    if (!isValid) {
      reject(new Error("422"));
    }
    collection.insert(data, function(err, doc) {
      if (err) {
        reject(err);
      } else {
        fulfill(doc);
      }
    });
  });
};

DAOImplementation.prototype.update = function(query, update, options) {
  query = query || {};
  options = options || {};
  var collection = this.collection;
  var schema = this.schema;
  return new Promise(function(fulfill, reject) {
    if (!tv4.validate(update, schema)) {
      reject(new Error("422"));
    }
    collection.update(query, update, options,
      function(err, numAffected) { // callback params: err, numAffected, affectedDocuments
        if (err) {
          reject(err);
        } else {
          fulfill(numAffected);
        }
      });
  });
};

DAOImplementation.prototype.patch = function(query, change) {
  var dao = this;
  // update['$set'] = change; // we could use set to make a patch
  return this.findOne(query).then(function(result) {
    var update = Object.keys(change).reduce(function(doc, prop) {
      doc[prop] = change[prop];
      return doc;
    }, result);
    return dao.update(query, update);
  });
};

DAOImplementation.prototype.remove = function(query, options) {
  query = query || {};
  options = options || {};
  var collection = this.collection;
  return new Promise(function(fulfill, reject) {
    collection.remove(query, options,
      function(err, numAffected) {
        if (err) {
          reject(err);
        } else {
          fulfill(numAffected);
        }
      });
  });
};

DAOImplementation.prototype.getSchema = function() {
  return Promise.resolve(this.schema);
};

module.exports = DAOImplementation;
