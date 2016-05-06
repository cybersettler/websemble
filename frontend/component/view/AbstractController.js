/**
 * View API
 * @namespace View
 */

/**
 * Abstract controller exteded by view controllers.
 * @constructor
 * @memberof View
 * @implements { WebComponentInterface }
 * @param { Array } args - The arguments.
 */
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
