/**
 * Core API.
 * @namespace Core
 */

 /* global document, Event */

/**
 * Abstract controller extended by core-app controller.
 * @constructor
 * @memberof Core
 * @implements { WebComponentInterface }
 * @param{ Array } args - The arguments.
 */
function AbstractController(args) {
  const electron = require('electron');
  const remote = electron.remote;
  const Menu = remote.Menu;
  const BackendService = require("../../service/BackendService.js");
  const actionMap = {
    get: "doGet",
    post: "doPost",
    put: "doPut",
    patch: "doPatch",
    delete: "doDelete"
  };

  /** @member { HTMLElement } */
  this.view = args[0];

  /** @member { Object } */
  this.model = args[1];

  /** @member { Object } */
  this.menu = {};

  /**
   * A map with view tag name as key and view controller as value.
   * @member { Object }
   */
  this.scope.views = {};

  /* @inner { Object } scope.components - A map with component tag name as key and HTML element contructor as value. */
  this.scope.components = {};

  /**
   * Instantiates an Electron remote Menu.
   * @return {Object} Electron Menu instance.
   */
  this.getMenuInstance = function() {
    return new Menu();
  };

  /**
   * Sets the app menu form a template.
   * @param{ Array } template - Generally, the template is just an array of options for constructing a MenuItem.
   * @return { Object } This.
   */
  this.setMenuFromTemplate = function(template) {
    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    this.menu = menu;
    return this;
  };

  /**
   * Sets the app menu.
   * @param { Object } menu - The app menu, an instance of electron.remote.Menu.
   * @return { Object } This.
   */
  this.setMenu = function(menu) {
    Menu.setApplicationMenu(menu);
    this.menu = menu;
    return this;
  };

  /**
   * Stores a reference of a view.
   * @param { Object } params - View data.
   * @param { string } params.elementName - View tag name.
   * @param { Object } params.viewController - View controller.
   * @return { Object } This.
   */
  this.registerView = function(params) {
    this.scope.views[params.elementName] = params.viewController;
    var event = new Event(params.elementName + " registered");
    document.dispatchEvent(event);
    return this;
  };

  /**
   * Stores a reference to a HTML element constructor.
   * @param { Object } params - Element data.
   * @param { string } params.elementName - Element tag name.
   * @param { function } params.elementConstructor - HTML element constructor.
   * @return { Object } This.
   */
  this.registerElement = function(params) {
    this.scope.components[params.elementName] = params.elementConstructor;
    return this;
  };

  /**
   * Returns the constructor of the specified HTML element.
   * @param { Object } params - Element data.
   * @param { string } params.elementName - Element tag name.
   * @return { function } The HTML element constructor.
   */
  this.getElement = function(params) {
    return this.scope.components[params.elementName];
  };

  /**
   * Returns an instance of the specified HTML element.
   * @param { Object } params - Element data.
   * @param { string } params.elementName - Element tag name.
   * @return { HTMLElement } The HTML element constructor.
   */
  this.getElementInstance = function(params) {
    var Element = this.getElement(params);
    return new Element();
  };

  /**
   * Destroys the reference to a view.
   * @param { Object } params - View data.
   * @param { string } params.elementName - View tag name.
   * @return { Object } this.
   */
  this.unregisterView = function(params) {
    delete this.scope.views[params.elementName];
    return this;
  };

  /**
   * Dispatches an event.
   * @param { Object } event - Event data.
   * @param { string } event.name - HTTP action GET, POST, PUT, PATCH or DELETE.
   * @param { string } event.target - Event target.
   * @param { string } event.source - Event source.
   * @return { Promise } A promise.
   */
  this.dispatch = function(event) {
    if (event.target === "app") {
      var action = actionMap[event.name];
      return this[action](event);
    }

    var viewController = this.getViewController(event.target);
    return viewController[event.name](event);
  };

  /**
   * Returns a controller of a component.
   * @param { string } tag - HTML element tag name.
   * @return { Object } Component controller.
   */
  this.getViewController = function(tag) {
    return this.scope.views[tag];
  };

  /**
   * Returns the scope of a component.
   * @param { string } tag - HTML element tag name.
   * @return { Object } Component scope.
   */
  this.getViewScope = function(tag) {
    return this.getViewController(tag).scope;
  };

  /**
   * Makes a get request to the backend.
   * @param { Object } params - Get request data.
   * @return { Promise } The response.
   */
  this.doGet = function(params) {
    return BackendService.get(params);
  };

  /**
   * Makes a post request to the backend.
   * @param { Object } params - Post data.
   * @return { Promise } The response.
   */
  this.doPost = function(params) {
    return BackendService.post(params.ref, params.data);
  };

  /**
   * Makes a put request to the backend.
   * @param { Object } params - Put data.
   * @return { Promise } The response.
   */
  this.doPut = function(params) {
    return BackendService.put(params.ref, params.data);
  };

  /**
   * Makes a patch request to the backend.
   * @param { Object } params - Post data.
   * @return { Promise } The response.
   */
  this.doPatch = function(params) {
    return BackendService.patch(params.ref, params.data);
  };

  /**
   * Makes a delete request to the backend.
   * @param { Object } params - Delete data.
   * @return { Promise } The response.
   */
  this.doDelete = function(params) {
    return BackendService.delete(params.ref);
  };

  /**
   * Removes all the views from the app container.
   * @return { Object } this.
   */
  this.clearViews = function() {
    var view = this.view;
    while (view.firstChild) {
      view.removeChild(view.lastChild);
    }
    return this;
  };

  /**
   * Clears all the views from the app container and
   * adds the specified view.
   * @param { Object } params - View data.
   * @return { Object } this.
   */
  this.setView = function(params) {
    this.clearViews();
    this.addView({elementName: params.view});
    return this;
  };

  /**
   * Adds the specified view to the app container.
   * @param { Object } params - View data.
   * @return { HTMLElement } The added HTML element.
   */
  this.addView = function(params) {
    var element = this.getElementInstance(params);
    this.view.appendChild(element);
    return element;
  };

  /**
   * Remove the speciefied view from the app container.
   * @param { Object } params - View data.
   * @return { HTMLElement } The removed HTML element.
   */
  this.removeView = function(params) {
    var element = this.view.querySelector(params.elementName.toLowerCase());
    this.view.removeChild(element);
    return element;
  };
}

module.exports = AbstractController;
