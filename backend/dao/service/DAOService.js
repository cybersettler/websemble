/**
 * Service for the DAO instances.
 * @module dao/service/DAOService
 */

const Matcher = require("./Matcher.js");
const JsonUtil = require('app-root-path').resolve("/util/JsonUtil.js");
const tv4 = require('tv4');
const shortid = require('shortid');

module.exports = {

  /**
   * Find query.
   * @param {Array} collection - Collection index.
   * @param {Object} condition - Filter.
   * @return {Array} List of resource that match the condition.
   */
  findInCollection: function(collection, condition) {
    var result = [];
    var matcher = new Matcher(condition);
    collection.forEach(function(item) {
      if (matcher.match(item)) {
        result.push(item);
      }
    });
    return result;
  },

  /**
   * Generate id map.
   * @param {Array} collection - Collection index array.
   * @return {Object} Map.
   */
  generateIdMap: function(collection) {
    var result = {};
    collection.forEach(addResource);
    /**
     * @private
     * @param {Object} item - Resourcce item.
     * @param {number} i - Item position.
     */
    function addResource(item, i) {
      result[item.id] = i;
    }
    return result;
  },

  /**
   * @private {function}
   * @param {Object} schema - Collection map.
   * @param {Object} data - Resource data.
   * @return {Object} Validation data.
   */
  validateItem: function(schema, data) {
    return tv4.validateMultiple(data, schema);
  },

  /**
   * @private {function}
   * @param {Object} collection - Collection map.
   * @param {Object} data - Resource data.
   * @return {number} The index of the added resource in the collection.
   */
  addResource: function(collection, data) {
    data.id = shortid.generate();
    var index = collection.length;
    collection.push(data);
    return index;
  },

  /**
   * @private {function}
   * @param {Object} collection - Collection map.
   * @param {number} index - Resource index in collection.
   * @param {Object} data - Resource data.
   */
  updateInCollection: function(collection, index, data) {
    if (!index) {
      throw new Error("Resource with id " + data.id + " not found");
    }
    collection[index] = data;
  },

  /**
   * @private {function}
   * @param {Object} collection - Collection map.
   * @param {string} index - Resource index in collection array.
   * @param {Object} data - Resource data.
   * @return {number} The array index of the updated resource in the collection.
   */
  updatePartiallyInCollection: function(collection, index, data) {
    if (!index) {
      throw new Error("Resource with id " + data.id + " not found");
    }
    var copy = JsonUtil.clone(data);

    Object.getOwnPropertyNames(copy).forEach(function(prop) {
      collection[index][prop] = copy[prop];
    });

    return copy;
  }
};
