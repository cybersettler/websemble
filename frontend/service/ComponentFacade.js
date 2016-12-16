/**
 * Instantiates App, View and UI components.
 * @module frontend/service/ComponentFacade
 */

 /* eslint-env browser */

const Service = require("./ComponentService.js");
const ViewComponentService = require("./ViewComponentService.js");
const UIComponentService = require("./UIComponentService.js");
const AppComponentService = require("./AppComponentService.js");
var afterAppCreated;

function createComponent(elementName, ComponentTypeService) { // eslint-disable-line require-jsdoc
  var elementProto = ComponentTypeService.createComponent(elementName,
    afterAppCreated);
  var Constructor = Service.registerElement(elementName, elementProto);
  afterAppCreated.then(function(app) {
    app.registerElement({
      elementName: elementName, elementConstructor: Constructor});
  });
}

module.exports = {
  createAppComponent: function() {
    if (afterAppCreated) {
      return;
    }
    afterAppCreated = AppComponentService.createComponent();
    return afterAppCreated;
  },
  createViewComponent: function(elementName) {
    createComponent(elementName, ViewComponentService);
  },
  createUIComponent: function(elementName) {
    createComponent(elementName, UIComponentService);
  }
};
