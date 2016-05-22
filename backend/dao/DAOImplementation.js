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
    var index = null;
    return this.afterGetCollection.then(function(result) {
      validateResourceData(result.schema, data);
      index = DAOService.addResource(result.index, data);
      result.idMap[data.id] = index;
      return PersistenceService.updateCollection(collectionName, result.index);
    }).then(function(result) {
      var collection = JSON.parse(result);
      return collection[index];
    });
  };

  this.update = function(id, data) {
    var index = null;
    return this.afterGetCollection.then(function(result) {
      validateResourceData(result.schema, data);
      index = result.idMap[id];
      DAOService.updateResource(result.index, index, data);
      return PersistenceService.updateCollection(collectionName, result.index);
    }).then(function(result) {
      var collection = JSON.parse(result);
      return collection[index];
    });
  };

  this.updatePartially = function(id, data) {
    var implementation = this;
    return this.afterGetCollection.then(function(result) {
      var index = result.idMap[id];
      var patched = DAOService.patchResource(result.index, index, data);
      return implementation.update(id, patched);
    });
  };

  this.delete = function(id) {
    return this.afterGetCollection.then(function(result) {
      var index = result.idMap[id];
      result.index.splice(index, 1);
      result.idMap = DAOService.generateIdMap(result.index);
      return PersistenceService.updateCollection(collectionName,
        result.index);
    }).then(function() {
      return 1;
    });
  };

  this.getSchema = function() {
    return this.afterGetCollection.then(function(result) {
      return result.schema;
    });
  };
}

function validateResourceData(schema, data) {
  var validateResult = DAOService.validateResourceData(schema, data);
  if (!validateResult.valid) {
    throw new Error(validateResult.errors[0].message);
  }
}

module.exports = DAOImplementation;
