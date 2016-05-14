/**
 * Resource collection.
 * @constructor
 * @param {Array} index - Array of resources.
 * @param {Object} schema - Collection schema.
 */
 function Collection(index, schema) {
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
   this.idMap = {};
 }

 module.exports = Collection;
