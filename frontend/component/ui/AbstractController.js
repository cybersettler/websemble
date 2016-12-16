/**
 * ui API.
 * @namespace UI
 */

 /* global document */

/**
 * Abstract controller extended by ui controllers.
 * @constructor
 * @memberof UI
 * @implements { WebComponentInterface }
 * @param { Array } args - The arguments.
 */
function AbstractController(args) {
  /** @member { HTMLElement } */
  this.view = args[0];

  /** @member { Object } */
  this.model = args[1] || {};
}

/**
 * Returns the view to which this component belongs.
 * @return { HTMLElement } The HTML element.
 */
AbstractController.prototype.getParentView = function() {
  var e = this.view;
  while (e && !isViewComponent(e)) {
    e = e.parentNode;
  }
  return e;
};

AbstractController.prototype.onAttached = function() {
  var parentView = this.getParentView();
  var parentViewName = parentView.tagName.toLowerCase();
  this.scope.parentView = parentView;

  this.scope.afterParentViewAttached = new Promise(function(resolve) {
    document.addEventListener(parentViewName + " attached", function(e) {
      console.log("parent view attached", e);
      resolve(e);
    });
  });

  if (this.view.hasAttribute("data-model")) {
    var controller = this;
    this.fetchModel().then(
      function(model) {
        controller.model = model;
        controller.updateView();
      }
    );
  } else if (this.updateView) {
    this.updateView();
  }
};

/**
 * Returns the model of this component. Called
 * when model data attribute is defined.
 * @return { Promise } A promise.
 */
AbstractController.prototype.fetchModel = function() {
  var parentScope = this.getParentViewScope();
  return this.view.dataset.model.split('.').reduce(function(scope, property) {
    if (scope.then) {
      return scope.then(function(result) {
        return result[property];
      });
    }
    return Promise.resolve(scope[property]);
  }, parentScope);
};

function isViewComponent(el) { // eslint-disable-line require-jsdoc
  return /^view/.test(el.tagName.toLowerCase());
}

module.exports = AbstractController;
