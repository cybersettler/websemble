function AbstractController( view ){
  // TODO: this is a stub
}

AbstractController.prototype.onAttached = function(){

  if( this.updateView ) {
    this.updateView();
  }

};

module.exports = AbstractController;
