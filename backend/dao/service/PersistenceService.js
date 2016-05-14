/**
 * Used by the DAOService to persist data.
 * @module dao/service/PersitenceService
 */

// const fs = require('fs');
const path = require("path");
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fs = editor.create(store);
const Collection = require("../Collection.js");

var basePath = __dirname;

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
    var index = fs.readJSON(indexPath);
    var schema = fs.readJSON(schemaPath);
    var result = new Collection(index, schema);
    return Promise.resolve(result);
  },
  /**
   * Update collection.
   * @param {string} collectionName - Collection name.
   * @param {Array} data - Array of resources.
   * @return {Promise} Array of resources.
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
