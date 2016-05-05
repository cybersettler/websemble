var ComponentFactory = {
  getInstance: function( ViewController, view, model ){
    var controller = new ViewController( view, model );
    addShadowRootTemplate( view, controller );
    addMainTemplate( view, controller );
    return controller;
  }
}

function addShadowRootTemplate( view, controller ){

  if( !controller.scope.shadowTemplate ) return;

  // Creates the shadow root
  var root;
  if( view.attachShadowRoot ){
    root = view.attachShadowRoot();
  }else{
    root = view.createShadowRoot();
  }

  // Adds a template clone into shadow root
  var clone = document.importNode( controller.scope.shadowTemplate, true );
  root.appendChild( clone );

}

function addMainTemplate( view, controller ){

  if( !controller.scope.mainTemplate ) return;
  var clone = document.importNode( controller.scope.mainTemplate, true );
  view.appendChild( clone );

}

module.exports = ComponentFactory;
