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
  this.afterGetCollection = PersistenceService.readCollection(collectionName)
    .then(function(result) {
      result.idMap = DAOService.generateIdMap(result.index);
      return result;
    });

  this.getCollection = function() {
    return this.afterGetCollection;
  };

  this.findAll = function() {
    return this.afterGetCollection.then(function(result) {
      return result.index;
    });
  };

  this.findWhere = function(condition) {
    return this.afterGetCollection.then(function(result) {
      return DAOService.findResource(result.index, condition);
    });
  };

  this.findById = function(id) {
    return this.afterGetCollection.then(function(result) {
      var itemIndex = result.idMap[id];
      if (typeof itemIndex === "undefined") {
        return Promise.reject(
          new Error("Item with id " + id + " not found")
        );
      }
      return result.index[itemIndex];
    });
  };

  this.create = function(data) {
    return this.afterGetCollection.then(function(result) {
      var validateResult = DAOService.validateResourceData(result.schema, data);
      if (!validateResult.valid) {
        throw new Error(validateResult.errors[0].message);
      }
      console.log("validate result", validateResult);
      var index = DAOService.addResource(result.index, data);
      result.idMap[data.id] = index;
      PersistenceService.updateCollection(collectionName, result.index);
      return result.index[index];
    });
  };

  this.update = function(id, data) {
    return this.afterGetCollection.then(function(result) {
      DAOService.validateResourceData(result.schema, data);
      var index = result.idMap[id];
      DAOService.updateResource(result.index, index, data);
      PersistenceService.updateCollection(collectionName, result.index);
      return data;
    });
  };

  this.updatePartially = function(id, data) {
    return this.afterGetCollection.then(function(result) {
      DAOService.validateResourceData(result.schema, data);
      var index = result.idMap[id];
      DAOService.updateResourcePartially(result.index, index, data);
      PersistenceService.updateCollection(collectionName, result.index);
      return data;
    });
  };

  this.delete = function(id) {
    return this.afterGetCollection.then(function(result) {
      var index = result.idMap[id];
      var deleted = result.index.splice(index, 1);
      result.idMap = DAOService.generateIdMap(result.index);
      PersistenceService.updateCollection(collectionName, result.index);
      return deleted[0];
    });
  };

  this.getSchema = function() {
    return this.afterGetCollection.then(function(result) {
      return result.schema;
    });
  };
}

module.exports = DAOImplementation;
