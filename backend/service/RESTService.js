/**
 * REST service.
 * @module service/RESTService
 */

const CatalogService = require('../dao/service/CatalogService.js');
const RESTResponse = require('./RESTResponse.js');

module.exports = {
  /**
   * Initializes the service.
   * @param {Object} [config] - Backend configuration object.
   * @param {Object[]} [config.catalog] - An Array of collection
   * configuration objects.
   */
  init: function(config) {
    CatalogService.init(config);
  },
  /**
   * Handle GET request.
   * @param {string} url - Resource locator.
   * @return {Promise} A resource.
   */
  handleGet: function(url) {
    var request = parseRequest(url);
    var collection = CatalogService.getCollection(request.resource.collection);
    if (request.resource.documentId &&
       request.resource.documentId === "schema") {
      return collection.getSchema().then(function(result) {
        return new RESTResponse(url, "GET", result);
      });
    } else if (request.resource.documentId) {
      var query = {
        _id: request.resource.documentId
      };
      return collection.findOne(query).then(
        function(result) {
          return new RESTResponse(url, "GET", result);
        });
    }

    return collection.find(request.query).then(
      function(result) {
        return new RESTResponse(url, "GET", result);
      });
  },
  /**
   * Handle POST request.
   * @param {string} url - Resource locator.
   * @param {Onject} data - Resource data.
   * @return {Promise} Created resource.
   */
  handlePost: function(url, data) {
    var request = parseRequest(url);
    var collection = CatalogService.getCollection(request.resource.collection);
    return collection.insert(data).then(function(result) {
      return new RESTResponse(url, "POST", result);
    });
  },
  /**
   * Handle PUT request.
   * @param {string} url - Resource locator.
   * @param {Object} data - Resource data.
   * @return {Promise} Updated resource.
   */
  handlePut: function(url, data) {
    var request = parseRequest(url);
    var collection = CatalogService.getCollection(request.resource.collection);
    var query = {
      _id: request.resource.documentId
    };
    return collection.update(query, data).then(
      function(result) {
        return new RESTResponse(url, "PUT", result);
      });
  },
  /**
   * Handle PATCH request.
   * @param {string} url - Resource locator.
   * @param {Object} data - Resource data.
   * @return {Promise} Updated resource.
   */
  handlePatch: function(url, data) {
    var request = parseRequest(url);
    var collection = CatalogService.getCollection(request.resource.collection);
    var query = {
      _id: request.resource.documentId
    };
    return collection.patch(query, data).then(
      function(result) {
        return new RESTResponse(url, "PATCH", result);
      });
  },
  /**
   * Handle DELETE request.
   * @param {string} url - Resource locator.
   * @return {Promise} The number of deleted resources.
   */
  handleDelete: function(url) {
    var request = parseRequest(url);
    var collection = CatalogService.getCollection(request.resource.collection);
    var query = {
      _id: request.resource.documentId
    };
    return collection.remove(query).then(
      function(result) {
        return new RESTResponse(url, "DELETE", result);
      });
  }
};

function parseRequest(request) { // eslint-disable-line require-jsdoc
  var parts = decodeURI(request).split("?");
  var uri = parts[0];
  var resource = parseResource(uri);
  var query = null;
  if (parts.length > 1) {
    var schema = CatalogService.getCollection(resource.collection)
      .schema;
    query = parseQuery(parts[1], schema);
  }
  return {
    uri: parts[0],
    query: query,
    resource: resource
  };
}

function parseResource(uri) { // eslint-disable-line require-jsdoc
  var result = {};
  var parts = uri.split("/");
  result.collection = parts[0];
  if (parts.length > 1) {
    result.documentId = parts[parts.length - 1];
  }
  if (parts.length > 2) {
    result.location = /^(.*)\/\w\/$/.exec(uri)[1];
  }
  return result;
}

function parseQuery(queryString, schema) { // eslint-disable-line require-jsdoc
  var data = decodeURIComponent(queryString).split("&");
  var result = {};
  data.forEach(setAttribute);
  function setAttribute(item) { // eslint-disable-line require-jsdoc
    var parts = item.split("=");
    var key = parts[0].trim();
    var value = parts[1].trim();
    if (schema.properties[key].type === "number") {
      value = Number(value);
    }
    result[key] = value;
  }
  return result;
}
