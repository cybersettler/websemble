const AbstractResource = require('./AbstractResource.js');
const CatalogService = require('../dao/service/CatalogService.js');

class DatabaseResource extends AbstractResource {
  constructor(name, config) {
    config.path = config.path || '/' + name;
    super(name, config);
    let collectionName = config.collection || name;
    this.collection = CatalogService.getCollection(collectionName);
  }

  get(request) {
    let result;
    if (request.resource.documentId &&
      request.resource.documentId === "schema") {
      result = this.collection.getSchema();
    } else if (request.resource.documentId) {
      let query = {
        _id: request.resource.documentId
      };
      result = this.collection.findOne(query);
    } else {
      result = this.collection.find(request.query);
    }
    return result;
  }

  post(request) {
    return this.collection.insert(request.body);
  }

  put(request) {
    let query = {
      _id: request.resource.documentId
    };
    return this.collection.update(query, request.body);
  }

  patch(request) {
    let query = {
      _id: request.resource.documentId
    };
    return this.collection.patch(query, request.body);
  }

  delete(request) {
    let query = {
      _id: request.resource.documentId
    };
    return this.collection.remove(query);
  }
}

module.exports = DatabaseResource;
