/**
 * Websemble module.
 * @module Websemble
 */

module.exports = {
  /** Frontend facade. */
  frontend: require('./frontend/service/ComponentService.js'),
  /** Backend */
  backend: {
    /** @class */
    App: require('./App.js'),
    resource: {
      AbstractResource: require('./backend/resource/AbstractResource.js'),
      DatabaseResource: require('./backend/resource/DatabaseResource.js'),
      MessageBundleResource: require(
        './backend/resource/MessageBundleResource.js')
    }
  }
};
