/**
 * Instantiates UI components.
 * @module frontend/service/UIComponentService
 */

const ComponentService = require("./ComponentService.js");
const ComponentFactory = require("../factory/ComponentFactory.js");
const AbstractUIController = require("../component/ui/AbstractController.js");

function addOnAttachedCallback(view, controller, app) { // eslint-disable-line require-jsdoc
  view.onAttached = function() {
    controller.dispatch = function(params) {
      return app.dispatch(params, controller.scope.parentViewName);
    };
    controller.onAttached();
  };
}

module.exports = {
  createComponent: function(elementName, app) {
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
      addOnAttachedCallback(this, controller, app);
    };

    return elementProto;
  }
};
