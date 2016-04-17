const Service = require( "./ComponentService.js" );
const ViewComponentService = require( "./ViewComponentService.js" );
const UIComponentService = require( "./UIComponentService.js" );
const App = require("./CompositeApp");

var Facade = {

  createAppComponent: function(){
    window.compositeApp = new App();
  },

  createViewComponent: function( elementName ){
    createComponent( elementName, ViewComponentService );
  },

  createUIComponent: function( elementName ){
    createComponent( elementName, UIComponentService );
  }

};

function createComponent( elementName, ComponentTypeService ){
  var elementProto = ComponentTypeService.createComponent( elementName, window.compositeApp );
  var Constructor = Service.registerElement( elementName, elementProto );
  window.compositeApp.registerElement({ elementName: elementName, elementConstructor: Constructor });
}

module.exports = Facade;
