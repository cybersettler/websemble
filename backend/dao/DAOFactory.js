/**
 * Factory of DAO instances.
 * @module dao/DaoFactory
 */

 const DAOImplementation = require("./DAOImplementation.js");
 const catalog = {};
 var PersistanceService = null;

 module.exports = {
   init: function(Service) {
     PersistenceService = Service;
   },
   /**
    * Returns a DAOInstance of the collection.
    * @param {string} collectionName - Collection name.
    * @return {DAOImplementation} DAO implementation.
    */
   getInstance: function(collectionName) {
     if (!catalog[collectionName]) {
       catalog[collectionName] = new DAOImplementation(collectionName, PersistenceService);
     }
     return catalog[collectionName];
   }
 };
