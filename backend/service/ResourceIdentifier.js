const reqlib = require('app-root-path').require;
const MessageBundleResource = require('../resource/MessageBundleResource.js');
const DatabaseResource = require('../resource/DatabaseResource');
const StringUtil = require('../../util/StringUtil.js');
const CatalogService = require('../dao/service/CatalogService.js');

class ResourceIdentifier {
  constructor(config) {
    CatalogService.init(config.persistence);
    let resources = config.resources || {};
    this.resources = Object.keys(resources)
      .reduce(instantiateResource, {});
    function instantiateResource(result, resourceName) { // eslint-disable-line require-jsdoc
      let itemConfig = resources[resourceName];
      if (resourceName === 'i18n' &&
        typeof resources[resourceName] === 'string') {
        itemConfig = {
          type: 'messageBundle',
          directory: resources[resourceName],
          path: '/i18n'
        };
      }
      if (itemConfig.type === 'messageBundle') {
        result[resourceName] = new MessageBundleResource(
          resourceName, itemConfig);
      }
      if (itemConfig.type === 'interface') {
        let resourceFileName = StringUtil.capitalize(resourceName) +
          'Resource.js';
        let InterfaceResource = reqlib('/backend/resource/' + resourceFileName);
        result[resourceName] = new InterfaceResource(resourceName, itemConfig);
      }
      if (itemConfig.type === 'database') {
        result[resourceName] = new DatabaseResource(resourceName, itemConfig);
      }
      return result;
    }
  }

  getRequestedResource(request) {
    let found = Object.keys(this.resources)
      .find(matchesUri, {
        request: request,
        resources: this.resources
      });

    return this.resources[found];
  }
}

function matchesUri(resourceName) { // eslint-disable-line require-jsdoc
  let resource = this.resources[resourceName];
  return resource.matchesUri(this.request.uri);
}

module.exports = ResourceIdentifier;
