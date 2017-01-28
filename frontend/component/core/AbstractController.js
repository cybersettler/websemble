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
  const actionMap = {
    get: "doGet",
    post: "doPost",
    put: "doPut",
    patch: "doPatch",
    delete: "doDelete"
  };

  var controller = this;

  this.getView = function() {
    return args[0];
  };

  this.getScope = function() {
    return args[1];
  };

  var menu = {};
  var views = {};
  var components = {};

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
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    return this;
  };

  /**
   * Sets the app menu.
   * @param { Object } appMenu - The app menu, an instance of electron.remote.Menu.
   * @return { Object } This.
   */
  this.setMenu = function(appMenu) {
    menu = appMenu;
    Menu.setApplicationMenu(menu);
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
    views[params.elementName] = params.viewController;
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
    components[params.elementName] = params.elementConstructor;
    return this;
  };

  /**
   * Returns the constructor of the specified HTML element.
   * @param { Object } params - Element data.
   * @param { string } params.elementName - Element tag name.
   * @return { function } The HTML element constructor.
   */
  this.getElement = function(params) {
    return components[params.elementName];
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
    delete views[params.elementName];
    return this;
  };

  /**
   * Dispatches an event.
   * @param { Object } event - Event data.
   * @param { string } event.type - HTTP action GET, POST, PUT, PATCH or DELETE.
   * @param { string } event.target - Event target.
   * @param { string } event.source - Event source.
   * @return { Promise } A promise.
   */
  this.dispatch = function(event) {
    if (event.target === "app") {
      var action = actionMap[event.type];
      return this[action](event);
    }

    var viewController = this.getViewController(event.target);
    return viewController[event.type](event);
  };

  /**
   * Returns a controller of a component.
   * @param { string } tag - HTML element tag name.
   * @return { Object } Component controller.
   */
  this.getViewController = function(tag) {
    return views[tag];
  };

  /**
   * Returns the scope of a component.
   * @param { string } tag - HTML element tag name.
   * @return { Object } Component scope.
   */
  this.getViewScope = function(tag) {
    return this.getViewController(tag).getScope();
  };

  /**
   * Removes all the views from the app container.
   * @return { Object } this.
   */
  this.clearViews = function() {
    var view = this.getView();
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
    this.addView({elementName: params.elementName});
    return this;
  };

  /**
   * Adds the specified view to the app container.
   * @param { Object } params - View data.
   * @return { HTMLElement } The added HTML element.
   */
  this.addView = function(params) {
    var element = this.getElementInstance(params);
    this.getView().appendChild(element);
    return element;
  };

  /**
   * Remove the speciefied view from the app container.
   * @param { Object } params - View data.
   * @return { HTMLElement } The removed HTML element.
   */
  this.removeView = function(params) {
    var element = this.view.querySelector(params.elementName.toLowerCase());
    this.getView().removeChild(element);
    return element;
  };

  args[0].addEventListener('setView', function(e) {
    controller.setView(e.detail);
  });
}

module.exports = AbstractController;
