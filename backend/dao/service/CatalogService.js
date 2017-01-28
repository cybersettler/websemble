/**
 * Factory of DAO instances.
 * @module dao/DaoFactory
 */

 const DAOImplementation = require("../DAOImplementation.js");
 const catalog = {};

 module.exports = {
   init: function(config) {
     if (config) {
       config.catalog.forEach(addCollection);
     } else {
       catalog.default = new DAOImplementation({
         collectionName: 'default',
         schema: ''
       });
     }
     function addCollection(collectionConfig) { // eslint-disable-line require-jsdoc
       var collection = collectionConfig.collectionName;
       catalog[collection] = new DAOImplementation(collectionConfig);
     }
   },
   /**
    * Returns a DAOInstance of the collection.
    * @param {string} collectionName - Collection name.
    * @return {DAOImplementation} DAO implementation.
    */
   getCollection: function(collectionName) {
     if (!catalog[collectionName]) {
       throw new Error('Collection ' + collectionName + ' does not exist.');
     }
     return catalog[collectionName];
   }
 };
