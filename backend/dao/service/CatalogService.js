/**
 * Factory of DAO instances.
 * @module dao/DaoFactory
 */

const DAOImplementation = require("../DAOImplementation.js");
const catalog = {};

function initCatalogEndPoint(expressApp) { // eslint-disable-line require-jsdoc
  expressApp.get('/catalog/:collection', function(req, res) {
    getDao(req.params.collection)
      .find({})
      .then(function(result) {
        res.send(result);
      }, function(error) {
        throw new Error(error);
      });
  });

  expressApp.get('/catalog/:collection/:id', function(req, res) {
    let collectionName = req.params.collection;
    let id = req.params.id;
    getDao(collectionName)
      .findOne({_id: id})
      .then(function(result) {
        res.send(result);
      }, function(error) {
        throw new Error(error);
      });
  });
}

function getDao(collectionName) { // eslint-disable-line require-jsdoc
  if (!catalog[collectionName]) {
    throw new Error('Collection ' + collectionName + ' does not exist.');
  }
  return catalog[collectionName];
}

function addCollection(collectionConfig) { // eslint-disable-line require-jsdoc
  var collection = collectionConfig.collectionName;
  catalog[collection] = new DAOImplementation(collectionConfig);
}

module.exports = {
  init: function(config, expressApp) {
    console.log("initializing catalog", config);
    if (config) {
      config.catalog.forEach(addCollection);
      initCatalogEndPoint(expressApp);
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
    return catalog[collectionName].collection;
  },
  getSchema: function(collectionName) {
    if (!catalog[collectionName]) {
      throw new Error('Collection ' + collectionName + ' does not exist.');
    }
    return catalog[collectionName].schema;
  },
  getDao: getDao
};
