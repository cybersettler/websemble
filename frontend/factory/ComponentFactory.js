/**
 * Component factory module.
 * @module
 */

 /* eslint-env browser */

function addShadowRootTemplate(view, controller) { // eslint-disable-line require-jsdoc
  if (!controller.scope._shadowTemplate) {
    return;
  }

  // Creates the shadow root
  var root;
  if (view.attachShadowRoot) {
    root = view.attachShadowRoot();
  } else {
    root = view.createShadowRoot();
  }

  // Adds a template clone into shadow root
  var clone = document.importNode(controller.scope._shadowTemplate, true);
  root.appendChild(clone);
}

function addMainTemplate(view, controller) { // eslint-disable-line require-jsdoc
  if (!controller.scope._mainTemplate) {
    return;
  }
  var clone = document.importNode(controller.scope._mainTemplate, true);
  view.appendChild(clone);
}

module.exports = {
  /**
   * Get a component controller instance.
   * @param {function} ViewController - Controller contructor.
   * @param {HTMLElement} view - Component HTMLElement.
   * @param {Object} model - Component model.
   * @return {Object} Controller instance.
   */
  getInstance: function(ViewController, view, model) {
    var controller = new ViewController(view, model);
    addShadowRootTemplate(view, controller);
    addMainTemplate(view, controller);
    return controller;
  }
};
