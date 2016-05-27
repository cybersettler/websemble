function AppController( view, model ){

  // Controller constructor is called when an instance
  // of the html element is created

  // Controllers are stateless, the model is used to
  // store state data instead.

  // This class extends component/view/AbstractController
  // so we need to call the super contructor
  this.super( view );

  // Fires when an instance was inserted into the document
  this.onAttached = function(){
    // TODO: this is a stub
  };

  // Fires when an instance was inserted into the document,
  // after onAttached is called
  this.updateView = function(){
    // TODO: this is a stub
  };

  // Fires when an instance was removed from the document
  this.onAttributeChanged = function( attr, oldVal, newVal ){
    // TODO: this is a stub
    this.updateView();
  };

  // Fires when an attribute was added, removed, or updated
  this.onDetached = function(){
    // TODO: this is a stub
  };

}

module.exports = AppController;
