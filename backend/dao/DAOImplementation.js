const DataStore = require('nedb');
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
 * @param {Object} config.basePath - Base path to collection data folder.
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
  let basePath = config.basePath || 'backend/persistence/catalog/';
  let isDBloaded = true;
  if (config.filename) {
    config.filename = basePath + config.filename;
  }
  if (config.schema) {
    this.schema = fs.readJSON(path.join(appRoot.toString(),
      basePath, config.schema));
  } else {
    this.schema = {};
  }
  let db = new DataStore(config);
  if (config.filename && !config.autoload) {
    isDBloaded = false;
  }
  this.collection = db;
  this.isDBloaded = isDBloaded;
}

DAOImplementation.prototype.find = function(query, options) {
  return loadDB(this)
    .then(db => find(db, query, options));
};

DAOImplementation.prototype.findOne = function(query) {
  if (typeof query === 'string') {
    query = {_id: query};
  }
  return loadDB(this)
    .then(db => findOne(db, query));
};

DAOImplementation.prototype.insert = function(data) {
  let dao = this;
  return loadDB(this)
    .then(() => insert(dao, data));
};

DAOImplementation.prototype.update = function(query, data, options) {
  let dao = this;
  if (typeof query === 'string') {
    query = {_id: query};
  }
  return loadDB(this)
    .then(() => update(dao, query, data, options));
};

DAOImplementation.prototype.patch = function(query, change) {
  let dao = this;
  // update['$set'] = change; // we could use set to make a patch

  return this.findOne(query)
    .then(function(result) {
      let update = Object.keys(change)
        .reduce(function(doc, prop) {
          doc[prop] = change[prop];
          return doc;
        }, result);
      return dao.update(query, update);
    });
};

DAOImplementation.prototype.remove = function(query, options) {
  let dao = this;
  return loadDB(this)
    .then(() => remove(dao, query, options));
};

DAOImplementation.prototype.getSchema = function() {
  return Promise.resolve(this.schema);
};

function find(db, query, options) { // eslint-disable-line require-jsdoc
  options = options || {};
  query = query || {};
  var search = db.find(query);
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
}

function findOne(db, query) { // eslint-disable-line require-jsdoc
  return new Promise(function(fulfill, reject) {
    db.findOne(query, function(err, doc) {
      if (err) {
        reject(err);
      } else {
        fulfill(doc);
      }
    });
  });
}

function insert(dao, data) { // eslint-disable-line require-jsdoc
  let db = dao.collection;
  let schema = dao.schema;
  let isValid = true;

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
    db.insert(data, function(err, doc) {
      if (err) {
        reject(err);
      } else {
        fulfill(doc);
      }
    });
  });
}

function update(dao, query, data, options) { // eslint-disable-line require-jsdoc
  query = query || {};
  options = options || {};
  let db = dao.collection;
  let schema = dao.schema;
  return new Promise(function(fulfill, reject) {
    if (!tv4.validate(data, schema)) {
      reject(new Error("422"));
    }
    db.update(query, data, options,
      function(err, numAffected) { // callback params: err, numAffected, affectedDocuments
        if (err) {
          reject(err);
        } else {
          fulfill(numAffected);
        }
      });
  });
}

function remove(dao, query, options) { // eslint-disable-line require-jsdoc
  query = query || {};
  options = options || {};
  let db = dao.collection;
  return new Promise(function(fulfill, reject) {
    db.remove(query, options,
      function(err, numAffected) {
        if (err) {
          reject(err);
        } else {
          fulfill(numAffected);
        }
      });
  });
}

function loadDB(dao) { // eslint-disable-line require-jsdoc
  let result;
  let db = dao.collection;
  let isDBloaded = dao.isDBloaded;
  if (isDBloaded) {
    result = Promise.resolve(db);
  } else {
    result = new Promise(function(fulfill, reject) {
      db.loadDatabase(function(err) {
        if (err) {
          reject(err);
        } else {
          dao.isDBloaded = true;
          fulfill(db);
        }
      });
    });
  }
  return result;
}

module.exports = DAOImplementation;
