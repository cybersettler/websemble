/**
* view API.
* @namespace View
*/

const ApiService = require('../../service/ApiService.js');

/* eslint-env browser */

/**
* Abstract controller extended by ui controllers.
* @constructor
* @implements { WebComponentInterface }
* @param { Array } args - The arguments.
*/
function AbstractController(args) {
  /**
  * Returns html element of the component.
  * @return { HTMLElement } The html element.
  */
  this.getView = function() {
    return args[0];
  };

  /**
  * Returns the context object of the component.
  * @return { Scope } The scope object.
  */
  this.getScope = function() {
    return args[1];
  };

  var controller = this;
  var view = args[0];
  var scope = args[1];

  scope.onAttached.then(function() {
    ApiService.addViewApi(controller);
  });

  /**
  * Broadcasts a refresh event that triggers a render of all components
  * inside the view.
  */
  this.refresh = function() {
    var event = new Event('refresh');
    view.dispatchEvent(event);
  };
}

module.exports = AbstractController;
