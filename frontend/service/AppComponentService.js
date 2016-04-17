const ComponentService = require( "./ComponentService.js" );
const ComponentFactory = require("../factory/ComponentFactory.js");
const AbstractAppController = require( "../component/core/AbstractController.js" );

var AppComponentService = {

  createComponent: function( app ){

    var elementName = 'core-app';
    var elementProto = ComponentService.createComponent( elementName );
    var ViewController = ComponentService.createComponentController( elementName, AbstractAppController );

    // Fires when an instance of the element is created
    elementProto.createdCallback = function() {

      console.log( "Element created", elementName );

      var model = {};
      var controller = ComponentFactory.getInstance( this, ViewController, model );
      app.afterElementAttached.resolve( controller );
      ComponentService.addComponentCallbacks( this, controller );

    };

    return elementProto;

  }

}

module.exports = AppComponentService;
