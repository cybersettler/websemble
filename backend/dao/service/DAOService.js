/**
 * Service for the DAO instances.
 * @module dao/service/DAOService
 */

const JsonUtil = require("../../../util/JsonUtil.js");
const Matcher = require("./Matcher.js");
const tv4 = require('tv4');
const shortid = require('shortid');

module.exports = {

  /**
   * Find query.
   * @param {Array} collection - Collection index.
   * @param {Object} condition - Filter.
   * @return {Array} List of resource that match the condition.
   */
  findResource: function(collection, condition) {
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
   * Validate collection data.
   * @param {Object} schema - Collection map.
   * @param {Object} data - Resource data.
   * @return {Object} Validation data.
   */
  validateResourceData: function(schema, data) {
    return tv4.validateMultiple(data, schema);
  },

  /**
   * Add resource to collection.
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
   * Update resource.
   * @param {Object} collection - Collection map.
   * @param {number} index - Resource index in collection.
   * @param {Object} data - Resource data.
   */
  updateResource: function(collection, index, data) {
    if (typeof index === "undefined") {
      throw new Error("Resource with id " + data.id + " not found");
    }
    collection[index] = data;
  },

  patchResource: function(collection, index, data) {
    if (typeof index === "undefined") {
      throw new Error("Resource with id " + data.id + " not found");
    }

    var copy = JsonUtil.cloneObject(collection[index]);

    Object.getOwnPropertyNames(data).forEach(function(prop) {
      copy[prop] = data[prop];
    });

    return copy;
  }
};
