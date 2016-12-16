/**
 * Instantiates App component.
 * @module frontend/service/AppComponentService
 */

const ComponentService = require("./ComponentService.js");
const ComponentFactory = require("../factory/ComponentFactory.js");
const Service = require("./ComponentService.js");
const AbstractAppController = require(
  "../component/core/AbstractController.js");

module.exports = {
  createComponent: function() {
    return new Promise(function(resolve) {
      var elementName = 'core-app';
      var elementProto = ComponentService.createComponent(elementName);
      var ViewController = ComponentService.createComponentController(
        elementName, AbstractAppController);

      // Fires when an instance of the element is created
      elementProto.createdCallback = function() {
        console.log("Element created: core-app");
        var model = {};
        var controller = ComponentFactory.getInstance(ViewController,
          this, model);
        ComponentService.addComponentCallbacks(this, controller);
        resolve(controller);
      };

      Service.registerElement("core-app", elementProto);
    });
  }
};
