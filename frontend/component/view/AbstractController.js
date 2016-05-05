function AbstractController( view, model ){
  this.view = view;
  this.model = model;
}

AbstractController.prototype.onAttached = function(){

  if( this.updateView ) {
    this.updateView();
  }

};

module.exports = AbstractController;
