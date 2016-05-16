/**
 * Resource collection.
 * @constructor
 * @param {Array} index - Array of resources.
 * @param {Object} schema - Collection schema.
 * @param {Object} [idMap] - Map of id to indexes.
 */
function Collection(index, schema, idMap) {
  /**
   * Array of resources.
   * @member {Array}
   */
  this.index = index;
  /**
   * JSON schema.
   * @member {Object}
   */
  this.schema = schema;
  /**
   * Map of ids to indexes.
   * @member {Object}
   */
  this.idMap = idMap;
}

module.exports = Collection;
