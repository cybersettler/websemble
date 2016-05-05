var StringUtil = require("../../util/StringUtil.js");

function AbstractController( view, model ){

  this.view = view;
  this.model = model || {};

}

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
