/**
 * Websemble module.
 * @module Websemble
 */

module.exports = {
  /** Frontend facade. */
  frontend: require('./frontend/service/ComponentFacade.js'),
  /** Backend */
  backend: {
    /** @class */
    App: require('./App.js')
  }
};
