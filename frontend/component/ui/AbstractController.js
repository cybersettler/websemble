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

  var controller = this;
  var view = args[0];
  var scope = args[1];

  scope.getParentView().then(function(parentView) {
    parentView.addEventListener('refresh', function() {
      if (controller.render) {
        controller.render();
      }
    });
  });

  view.addEventListener('render', function() {
    if (controller.render) {
      controller.render();
    }
  });

  scope.onAttached.then(function() {
    if (controller.render) {
      controller.render();
    }
  });
}

module.exports = AbstractController;
