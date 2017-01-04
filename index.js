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
    App: require('./App.js')
  }
};
