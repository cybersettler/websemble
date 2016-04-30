const ComponentService = require( "./ComponentService.js" );
const ComponentFactory = require("../factory/ComponentFactory.js");
const AbstractViewController = require( "../component/view/AbstractController.js" );

var ViewComponentService = {
  createComponent: function( elementName, app ){

    var elementProto = ComponentService.createComponent( elementName );
    var ViewController = ComponentService.createComponentController( elementName, AbstractViewController );

    // Fires when an instance of the element is created
    elementProto.createdCallback = function() {

      console.log( "Element created", elementName );

      var model = {};
      var controller = ComponentFactory.getInstance( ViewController, this, model );
      ComponentService.addComponentCallbacks( this, controller );

      // Fires when an instance was inserted into the document
      addOnAttachedCallback( this, controller, app );

      // Fires when an instance was removed from the document
      addOnDetachedCallback( this, controller, app );

    };

    return elementProto;

  }
};

function addOnAttachedCallback( view, controller, app ){

  view.onAttached = function(){
    app.registerView({ elementName: view.tagName.toLowerCase(), viewController: controller });
    controller.dispatch = function( params ){
        return app.dispatch( params );
    };
    controller.onAttached();
  };

}

function addOnDetachedCallback( view, controller, app ){

  view.onDetached = function(){
    app.unregisterView({ elementName: view.tagName.toLowerCase() });
    if( controller.onDetached ){
      controller.onDetached();
    }
  };

}

module.exports = ViewComponentService;
