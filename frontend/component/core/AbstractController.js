const electron = require('electron');
const remote = electron.remote;
const Menu = remote.Menu;
// FIXME: user interface configuration must be externally set
// const Config = require("../../config/config.js");
const BackendService = require("../../service/BackendService.js");

function AbstractController( args ){

  this.view = args[0];
  var menuConfig = args[1];

  // FIXME: user interface could be given as a constructor parameter
  if( menuConfig ){
    var menu = Menu.buildFromTemplate( menuConfig );
    Menu.setApplicationMenu( menu );
  }

  this.scope.views = {};
  this.scope.components = {};

  this.registerView = function( params ){
    this.scope.views[ params.elementName ] = params.viewController;
  };

  this.registerElement = function( params ){
    this.scope.components[ params.elementName ] = params.elementConstructor;
  };

  this.getElement = function( params ){
    return this.scope.components[ params.elementName ];
  };

  this.getElementInstance = function( params ){
    var Element = this.getElement( params );
    return new Element();
  };

  this.unregisterView = function( params ){
    delete this.scope.views[ params.elementName ];
  };

  this.dispatch = function( data, target ){

    if( !target ){
      return this[ data.action ]( data );
    }

    var viewController = this.getViewController( target );
    return viewController[ data.action ]( data );

  };

  this.getViewController = function( tag ){
    return this.scope.views[ tag ];
  };

  this.getRequest = function( params ){
    return BackendService.get( params );
    // TODO: there could be a hook
  };

  this.postRequest = function( params ){
    return BackendService.post( params.ref, params.data );
    // TODO: implement
  };

  this.putRequest = function( params ){
    return BackendService.put( params.ref, params.data );
    // TODO: implement
  };

  this.patchRequest = function( params ){
    return BackendService.patch( params.ref, params.data );
    // TODO: implement
  };

  this.deleteRequest = function( params ){
    return BackendService.delete( params.ref );
    // TODO: implement
  };

  this.clearViews = function(){
    var view = this.view;
    while ( view.firstChild ) var child = view.removeChild( view.lastChild );
  };

  this.setView = function( params ){
    this.clearViews();
    this.addView({ elementName: params.view });
  };

  this.addView = function( params ){
    var element = this.getElementInstance( params );
    this.view.appendChild( element );
  };

  this.removeView = function( params ){
    var element = this.view.querySelector( params.elementName.toLowerCase() );
    this.view.removeChild( element );
  };

}

module.exports = AbstractController;
