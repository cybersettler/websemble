/**
 * Websemble module.
 * @module Websemble
 */

module.exports = {
  /** @class */
  ElectronApp: require('./ElectronApp.js'),
  resource: {
    AbstractResource: require('./backend/resource/AbstractResource.js'),
    DatabaseResource: require('./backend/resource/DatabaseResource.js'),
    MessageBundleResource: require(
      './backend/resource/MessageBundleResource.js')
  }
};
