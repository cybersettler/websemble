/**
 * Utilities to work with json.
 * @module util/JsonUtil
 */

module.exports = {
  /**
   * Returns a copy of the object.
   * @param {Object} data - Must be a serializable object.
   */
  cloneObject: function (data) {
    return JSON.parse(JSON.stringify(data));
  }
};
