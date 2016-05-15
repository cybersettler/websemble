/**
 * Instantiates App, View and UI components.
 * @module frontend/service/ComponentFacade
 */

/* eslint-env browser */

const Service = require("./ComponentService.js");
const ViewComponentService = require("./ViewComponentService.js");
const UIComponentService = require("./UIComponentService.js");
const App = require("./AppComponent");

function createComponent(elementName, ComponentTypeService) {
  var elementProto = ComponentTypeService.createComponent(elementName, window.appComponent);
  var Constructor = Service.registerElement(elementName, elementProto);
  window.appComponent.registerElement({elementName: elementName, elementConstructor: Constructor});
}

module.exports = {
  createAppComponent: function() {
    window.appComponent = new App();
  },
  createViewComponent: function(elementName) {
    createComponent(elementName, ViewComponentService);
  },
  createUIComponent: function(elementName) {
    createComponent(elementName, UIComponentService);
  }
};
