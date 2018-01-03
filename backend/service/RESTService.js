'use strict';

/**
 * REST service.
 * @module service/RESTService
 */

const CatalogService = require('../dao/service/CatalogService.js');
const RESTResponse = require('./RESTResponse.js');
const ResourceIdentifier = require('./ResourceIdentifier.js');
var resourceIdentifier;

module.exports = {
  /**
   * Initializes the service.
   * @param {Object} [config] - Backend configuration object.
   * @param {Object[]} [config.catalog] - An Array of collection
   * configuration objects.
   */
  init: function(config) {
    if (config) {
      resourceIdentifier = new ResourceIdentifier(config);
    }
  },
  /**
   * Handle GET request.
   * @param {string} url - Resource locator.
   * @return {Promise} A resource.
   */
  handleGet: function(url) {
    let request = parseRequest(url);
    let resource = getRequestedResource(request);
    return resource.get(request)
      .then(returnGetResponse);

    function returnGetResponse(result) { // eslint-disable-line require-jsdoc
      return new RESTResponse(url, "GET", result);
    }
  },
  /**
   * Handle POST request.
   * @param {string} url - Resource locator.
   * @param {Onject} data - Resource data.
   * @return {Promise} Created resource.
   */
  handlePost: function(url, data) {
    var request = parseRequest(url, data);
    let resource = getRequestedResource(request);
    return resource.post(request)
      .then(returnResponse);

    function returnResponse(result) { // eslint-disable-line require-jsdoc
      return new RESTResponse(url, "POST", result);
    }
  },
  /**
   * Handle PUT request.
   * @param {string} url - Resource locator.
   * @param {Object} data - Resource data.
   * @return {Promise} Updated resource.
   */
  handlePut: function(url, data) {
    let request = parseRequest(url, data);
    let resource = getRequestedResource(request);
    return resource.put(request)
      .then(returnResponse);

    function returnResponse(result) { // eslint-disable-line require-jsdoc
      return new RESTResponse(url, "PUT", result);
    }
  },
  /**
   * Handle PATCH request.
   * @param {string} url - Resource locator.
   * @param {Object} data - Resource data.
   * @return {Promise} Updated resource.
   */
  handlePatch: function(url, data) {
    let request = parseRequest(url, data);
    let resource = getRequestedResource(request);
    return resource.patch(request)
      .then(returnResponse);

    function returnResponse(result) { // eslint-disable-line require-jsdoc
      return new RESTResponse(url, "PATCH", result);
    }
  },
  /**
   * Handle DELETE request.
   * @param {string} url - Resource locator.
   * @return {Promise} The number of deleted resources.
   */
  handleDelete: function(url) {
    let request = parseRequest(url);
    let resource = getRequestedResource(request);
    return resource.delete(request)
      .then(returnResponse);

    function returnResponse(result) { // eslint-disable-line require-jsdoc
      return new RESTResponse(url, "DELETE", result);
    }
  }
};

function getRequestedResource(request) { // eslint-disable-line require-jsdoc
  let resource = resourceIdentifier.getRequestedResource(request);

  // Deprecated, all resources should be declared
  // in the backend configuration
  if (!resource) {
    throw new Error('Resource ' + request.uri + ' not found');
  }

  return resource;
}

function parseRequest(request, data) { // eslint-disable-line require-jsdoc
  var parts = decodeURI(request).split("?");
  var uri = parts[0];
  var resource = parseResource(uri);
  var query = null;
  if (parts.length > 1 && resource.collection === 'i18n') {
    let schema = {
      properties: {
        locale: {
          type: 'string'
        }
      }
    };
    query = parseQuery(parts[1], schema);
  } else if (parts.length > 1) {
    var schema = CatalogService.getCollection(resource.collection)
      .schema;
    query = parseQuery(parts[1], schema);
  }
  return {
    uri: parts[0],
    query: query,
    resource: resource,
    body: data
  };
}

function parseResource(uri) { // eslint-disable-line require-jsdoc
  var result = {};
  var parts = uri.split("/");
  if (/^\//.test(uri)) {
    parts.splice(0, 1);
  }
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
