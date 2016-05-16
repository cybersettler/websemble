/**
 * Used by the DAOService to persist data.
 * @module dao/service/PersitenceService
 */

// const fs = require('fs');
const path = require("path");
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const Collection = require("../Collection.js");

var basePath = __dirname;
var fs = null;

/**
 * @private {function}
 * @return {Object} Memory filesystem.
 */
function initFileSystem() {
  const store = memFs.create();
  return editor.create(store);
}

/**
 * @private {function}
 * @param {string} collectionName - Collection name.
 * @return {string} Path to collection index file.
 */
function getIndexPath(collectionName) {
  return path.join(basePath, collectionName.toLowerCase(), 'index.json');
}

/**
 * @private {function}
 * @param {string} collectionName - Collection name.
 * @return {string} Path to collection schema file.
 */
function getSchemaPath(collectionName) {
  return path.join(basePath, collectionName.toLowerCase(), 'schema.json');
}

module.exports = {
  /**
   * Initialize service.
   * @param {string} appDataDir - Directory where collection data is kept.
   * @param {Object} [filesystem] - Memory filesystem.
   */
  init: function(appDataDir, filesystem) {
    basePath = appDataDir;
    fs = filesystem || initFileSystem();
  },
  /**
   * Base path of resource collections setter.
   * @param {string} pathToCollections - Path to resource collections.
   */
  setBasePath: function(pathToCollections) {
    basePath = pathToCollections;
  },
  /**
   * Retrieve collection data.
   * @param {string} collectionName - Collection name.
   * @return {Promise} Resource collection.
   */
  readCollection: function(collectionName) {
    var indexPath = getIndexPath(collectionName);
    var schemaPath = getSchemaPath(collectionName);
    if (!fs.exists(indexPath)) {
      throw new Error("File " + indexPath + " does not exist.");
    }
    var index = fs.readJSON(indexPath);
    if (!fs.exists(schemaPath)) {
      throw new Error("File " + schemaPath + " does not exist.");
    }
    var schema = fs.readJSON(schemaPath);
    var result = new Collection(index, schema);
    return Promise.resolve(result);
  },
  /**
   * Update collection.
   * @param {string} collectionName - Collection name.
   * @param {Array} data - Array of resources.
   * @return {Promise} JSON string with array of resources.
   */
  updateCollection: function(collectionName, data) {
    var indexPath = getIndexPath(collectionName);
    var result = fs.writeJSON(indexPath, data);
    return Promise.resolve(result);
  },
  /**
   * Persist data.
   * @return {Promise} Array of resources.
   */
  persist: function() {
    return new Promise(function(resolve) {
      fs.commit(resolve);
    });
  }
};
