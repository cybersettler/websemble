/**
 * ui API.
 * @namespace UI
 */

/**
 * Abstract controller extended by ui controllers.
 * @constructor
 * @implements { WebComponentInterface }
 * @param { Array } args - The arguments.
 */
function AbstractController(args) {
  /**
   * Returns html element of the component.
   * @return { HTMLElement } The html element.
   */
  this.getView = function() {
    return args[0];
  };

  /**
   * Returns the context object of the component.
   * @return { Scope } The scope object.
   */
  this.getScope = function() {
    return args[1];
  };
}

module.exports = AbstractController;
