function AbstractController( args ){
  this.view = args[0];
  this.model = args[1];
}

AbstractController.prototype.onAttached = function(){

  if( this.updateView ) {
    this.updateView();
  }

};

module.exports = AbstractController;
