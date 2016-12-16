/**
 * Instantiates UI components.
 * @module frontend/service/UIComponentService
 */

const ComponentService = require("./ComponentService.js");
const ComponentFactory = require("../factory/ComponentFactory.js");
const AbstractUIController = require("../component/ui/AbstractController.js");

function addOnAttachedCallback(view, controller, afterAppCreated) { // eslint-disable-line require-jsdoc
  view.onAttached = function() {
    var parentViewName = controller.getParentView().tagName.toLowerCase();
    controller.dispatch = function(params) {
      return afterAppCreated.then(function(app) {
        var event = {
          target: parentViewName,
          source: view,
          name: params
        };
        return app.dispatch(event);
      });
    };
    controller.getParentViewScope = function() {
      return this.scope.afterParentViewAttached.then(function() {
        return afterAppCreated.then(function(app) {
          return app.getViewScope(parentViewName);
        });
      });
    };
    controller.onAttached();
  };
}

module.exports = {
  createComponent: function(elementName, afterAppCreated) {
    var elementProto = ComponentService.createComponent(elementName);
    var ViewController = ComponentService.createComponentController(elementName,
      AbstractUIController);

    // Fires when an instance of the element is created
    elementProto.createdCallback = function() {
      console.log("Element created", elementName);

      var model = {};
      var controller = ComponentFactory.getInstance(ViewController,
        this, model);
      ComponentService.addComponentCallbacks(this, controller);

      // Fires when an instance was inserted into the document
      addOnAttachedCallback(this, controller, afterAppCreated);
    };

    return elementProto;
  }
};
