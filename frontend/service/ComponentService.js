/**
 * Instantiates components.
 * @module frontend/service/ComponentService
 */

/* eslint-env browser */

const appRoot = require('app-root-path');
const path = require('path');
const ClassUtil = require('../../util/ClassUtil.js');
const StringUtil = require('../../util/StringUtil.js');
const Scope = require('./Scope.js');
const ComponentAbstractController = require(
  '../component/ui/AbstractController.js');
const AppAbstractController = require(
  '../component/core/AbstractController.js');
const ViewAbstractController = require(
    '../component/view/AbstractController.js');
var afterAppCreated;
var afterAppAttached;
var onAppReady;

module.exports = {
  createComponent: function(elementName) { // eslint-disable-line require-jsdoc
    if (isAppComponent(elementName) && afterAppCreated) {
      throw new Error("App component already created!");
    }
    // Creates an object based in the HTML Element prototype
    var elementProto = Object.create(HTMLElement.prototype);
    var componentPath = getComponentPath(elementName);

    var AbstractController = ComponentAbstractController;
    if (isAppComponent(elementName)) {
      AbstractController = AppAbstractController;
    } else if (isViewComponent(elementName)) {
      AbstractController = ViewAbstractController;
    }

    // Fires when an instance was inserted into the document
    var onAttached = new Promise(function(fulfill) {
      elementProto.attachedCallback = function() {
        var tag = this.tagName.toLowerCase();
        console.log("Element attached", tag);
        var event = new Event(tag + "_attached");
        document.dispatchEvent(event);
        fulfill(this);
      };
    });

    if (isAppComponent(elementName)) {
      afterAppAttached = onAttached;
    }

    // Fires when an instance was removed from the document
    var onDetached = new Promise(function(fulfill) {
      elementProto.detachedCallback = function() {
        fulfill();
      };
    });

    var localContext = (document._currentScript ||
      document.currentScript).ownerDocument; // #document,

    var scopeState = {
      localContext: localContext,
      onAttached: onAttached,
      onDetached: onDetached,
      afterAppAttached: afterAppAttached,
      onAppReady: onAppReady
    };

    if (isAppComponent(elementName)) {
      onAppReady = new Promise(function(fulfill) {
        scopeState.resolveAppReady = function() {
          fulfill(this);
        };
      });
    }

    // Fires when an attribute was added, removed, or updated
    scopeState.onAttributeChanged = {
      then: function(fulfill) {
        scopeState._onAttributeChange = fulfill;
        return Promise.resolve();
      }
    };

    elementProto.attributeChangedCallback = function(attr, oldVal, newVal) {
      if (scopeState._onAttributeChange) {
        scopeState._onAttributeChange({
          attribute: attr,
          oldValue: oldVal,
          newValue: newVal
        });
      }
    };

    var ViewController = ClassUtil.extend(
      AbstractController,
      require(componentPath + 'Controller.js')
    );

    if (isAppComponent(elementName)) {
      afterAppCreated = new Promise(function(fulfill) {
        elementProto.createdCallback = function() {
          console.log("Element created", elementName);
          scopeState.view = this;
          var scope = new Scope(scopeState);
          var controller = new ViewController(this, scope);
          fulfill(controller);
        };
      });
    } else {
      // Fires when an instance of the element is created
      elementProto.createdCallback = function() {
        console.log("Element created", elementName);
        scopeState.view = this;
        scopeState.afterAppCreated = afterAppCreated;
        var scope = new Scope(scopeState);
        var controller = new ViewController(this, scope);
        var tagname = this.tagName.toLowerCase();
        if (/^view-/.test(tagname)) {
          afterAppCreated.then(function(app) {
            app.registerView({
              elementName: tagname,
              viewController: controller
            });
          });
        }
      };
    }

    var Constructor = document.registerElement(elementName, {
      prototype: elementProto
    });

    if (!isAppComponent()) {
      afterAppCreated.then(function(app) {
        app.registerElement({
          elementName: elementName, elementConstructor: Constructor});
      });
    }
    return Constructor;
  }
};

function getFrontEndPath() { // eslint-disable-line require-jsdoc
  if (window && window.FRONTEND_PATH) {
    return window.FRONTEND_PATH;
  }
  return path.join(appRoot.toString(), 'frontend');
}

function getComponentPath(componentTag) { // eslint-disable-line require-jsdoc
  var match = /^(\w+)[-](.*)/.exec(componentTag);
  var componentName = StringUtil.camelCase(
    match[2]).replace(/^(.)/,
    function(m, p) {
      return p.toUpperCase();
    });

  var namespace = match[1];
  var frontendPath = getFrontEndPath();
  return path.join(frontendPath, 'component', namespace, componentName, "/");
}

function isAppComponent(elementName) { // eslint-disable-line require-jsdoc
  return /^core-/.test(elementName);
}

function isViewComponent(elementName) { // eslint-disable-line require-jsdoc
  return /^view-/.test(elementName);
}
