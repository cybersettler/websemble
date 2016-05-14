const DAOService = require("./service/DAOService.js");

/**
 * DAO implementation.
 * @constructor
 * @implements {DAOInterface}
 * @param {string} collectionName - Collection name.
 * @param {PersistenceService} PersistenceService - Persistance service.
 */
function DAOImplementation(collectionName, PersistenceService) {
  this.collectionName = collectionName;

  this.getCollection = PersistenceService.readCollection(collectionName)
    .then(function(result) {
      result.idMap = DAOService.generateIdMap(result.index);
      return result;
    });

  this.findAll = function() {
    return this.getCollection.then(function(result) {
      return result.index;
    });
  };

  this.findWhere = function(condition) {
    return this.getCollection.then(function(result) {
      return DAOService.findInCollection(result.index, condition);
    });
  };

  this.findById = function(id) {
    return this.getCollection.then(function(result) {
      var item = result.idMap[id];
      if (!item) {
        return Promise.reject(
          new Error("Item with id " + id + " not found")
        );
      }
      return item;
    });
  };

  this.create = function(data) {
    return this.getCollection.then(function(result) {
      DAOService.validate(result.schema, data);
      var index = DAOService.addResource(result.index, data);
      result.idMap[data.id] = index;
      PersistenceService.updateCollection(collectionName, result.index);
      return result.index[index];
    });
  };

  this.update = function(id, data) {
    return this.getCollection.then(function(result) {
      DAOService.validate(result.schema, data);
      var index = result.idMap[id];
      DAOService.updateInCollection(result.index, index, data);
      PersistenceService.updateCollection(collectionName, result.index);
      return data;
    });
  };

  this.updatePartially = function(id, data) {
    return this.getCollection.then(function(result) {
      DAOService.validate(result.schema, data);
      var index = result.idMap[id];
      DAOService.updatePartiallyInCollection(result.index, index, data);
      PersistenceService.updateCollection(collectionName, result.index);
      return data;
    });
  };

  this.delete = function(id) {
    return this.getCollection.then(function(result) {
      var index = result.idMap[id];
      var deleted = result.index.splice(index, 1);
      result.idMap = DAOService.generateIdMap(result.index);
      PersistenceService.updateCollection(collectionName, result.index);
      return deleted[0];
    });
  };

  this.getSchema = function() {
    return this.getCollection.then(function(result) {
      return result.schema;
    });
  };
}

module.exports = DAOImplementation;
