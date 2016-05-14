/**
 * Factory of DAO instances.
 * @module dao/DaoFactory
 */

 const DAOImplementation = require("./DAOImplementation.js");
 const catalog = {};
 const PersistenceService = require('./PersistenceService.js');

 module.exports = {
   /**
    * Returns a DAOInstance of the collection.
    * @param {string} collectionName - Collection name.
    * @return {DAOImplementation} DAO implementation.
    */
   getDAOInstance: function(collectionName) {
     if (!catalog[collectionName]) {
       catalog[collectionName] = new DAOImplementation(collectionName, PersistenceService);
     }
     return catalog[collectionName];
   }
 };
