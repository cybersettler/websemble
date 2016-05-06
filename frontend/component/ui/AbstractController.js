/**
 * ui API.
 * @namespace UI
 */

var StringUtil = require("../../util/StringUtil.js");

/**
 * Abstract controller extended by ui controllers.
 * @constructor
 * @memberof UI
 * @implements { WebComponentInterface }
 * @param { Array } args - The arguments.
 */
function AbstractController( args ){

  /** @member { HTMLElement } */
  this.view = args[0];

  /** @member { Object } */
  this.model = args[1] || {};

}

/**
 * Returns the view to which this component belongs.
 * @returns { HTMLElement } The HTML element.
 */
AbstractController.prototype.getParentView = function(){
  var e = this.view;
  while( e && !isViewComponent( e ) ){
    e = e.parentNode;
  }
  return e;
};

AbstractController.prototype.onAttached = function(){

  var parentView = this.getParentView();

  this.scope.parentView = parentView;
  this.scope.parentViewName = parentView.tagName.toLowerCase();

  if( this.view.hasAttribute( "data-model" ) ){
    var controller = this;
    this.fetchModel().then(
      function( model ){
        controller.model[ controller.view.dataset.model ] = model;
        controller.updateView();
      }
    );
  }else if( this.updateView ) {
    this.updateView();
  }

};

/**
 * Returns the model of this component. Called
 * when model data attribute is defined.
 * @returns { Promise } A promise.
 */
AbstractController.prototype.fetchModel = function(){

  var params = {
    action: "get" + StringUtil.capitalize( this.view.dataset.model )
  };
  return this.dispatch( params, this.scope.parentViewName );

};

function isViewComponent( el ){
  return /^view/.test( el.tagName.toLowerCase() );
}

module.exports = AbstractController;
