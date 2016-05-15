const ComponentService = require("./ComponentService.js");
const ComponentFactory = require("../factory/ComponentFactory.js");
const Service = require("./ComponentService.js");
const AbstractAppController = require("../component/core/AbstractController.js");

/**
 * App component controller instance wrapper.
 * @constructor
 */
function AppComponent() {
  this.afterElementAttached = new Promise(function(resolve) {
    var elementName = 'core-app';
    var elementProto = ComponentService.createComponent(elementName);
    var ViewController = ComponentService.createComponentController(elementName, AbstractAppController);

    // Fires when an instance of the element is created
    elementProto.createdCallback = function() {
      console.log("Element created: core-app");
      var model = {};
      var controller = ComponentFactory.getInstance(ViewController, this, model);
      ComponentService.addComponentCallbacks(this, controller);
      resolve(controller);
    };

    Service.registerElement("core-app", elementProto);
  });

  this.dispatch = function(params, target) {
    return this.afterElementAttached.then(function(app) {
      return app.dispatch(params, target);
    });
  };

  this.registerView = function(params) {
    return this.afterElementAttached.then(function(app) {
      return app.registerView(params);
    });
  };

  this.unregisterView = function(params) {
    return this.afterElementAttached.then(function(app) {
      return app.unregisterView(params);
    });
  };

  this.registerElement = function(params) {
    return this.afterElementAttached.then(function(app) {
      return app.registerElement(params);
    });
  };
}

module.exports = AppComponent;
