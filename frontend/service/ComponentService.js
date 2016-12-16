/**
 * Instantiates components.
 * @module frontend/service/ComponentService
 */

/* eslint-env browser */

const appRoot = require('app-root-path');
const path = require("path");
const ClassUtil = require("../../util/ClassUtil.js");
const StringUtil = require("../../util/StringUtil.js");
var afterAppComponentAttached;

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

module.exports = {
  createComponentController: function(elementName, AbstractController) {
    var componentPath = getComponentPath(elementName);
    var ViewController = ClassUtil.extend(
      AbstractController,
      require(componentPath + 'controller.js')
    );

    // Refers to the "importee"
    var localContext = (document._currentScript ||
      document.currentScript).ownerDocument; // #document

    // Sets scope variables
    ViewController.prototype.scope = {
      _localContext: localContext
    };

    var mainTemplate = localContext.querySelector('template.main');
    var shadowTemplate = localContext.querySelector('template.shadow');

    if (mainTemplate) {
      ViewController.prototype.scope._mainTemplate = mainTemplate.content;
    }

    if (shadowTemplate) {
      ViewController.prototype.scope._shadowTemplate = shadowTemplate.content;
    }

    return ViewController;
  },

  createComponent: function() {
    // Creates an object based in the HTML Element prototype
    var elementProto = Object.create(HTMLElement.prototype);

    // Fires when an instance was inserted into the document
    elementProto.attachedCallback = function() {
      var tag = this.tagName.toLowerCase();
      console.log("Element attached", tag);
      var event = new Event(tag + " attached");
      document.dispatchEvent(event);
      this.onAttached();
    };

    // Fires when an instance was removed from the document
    elementProto.detachedCallback = function() {
      this.onDetached();
    };

    // Fires when an attribute was added, removed, or updated
    elementProto.attributeChangedCallback = function(attr, oldVal, newVal) {
      this.onAttributeChanged(attr, oldVal, newVal);
    };

    return elementProto;
  },

  addComponentCallbacks: function(view, controller) {
    // Fires when an instance was inserted into the document
    view.onAttached = function() {
      if (controller.onAttached) {
        controller.onAttached();
      }
      if (controller.updateView) {
        controller.updateView();
      }
    };

    // Fires when an instance was removed from the document
    view.onDetached = function() {
      if (controller.onDetached) {
        controller.onDetached();
      }
    };

    // Fires when an attribute was added, removed, or updated
    view.attributeChangedCallback = function(attr, oldVal, newVal) {
      if (controller.onAttributeChanged) {
        controller.onAttributeChanged(attr, oldVal, newVal);
      }
    };
  },

  registerElement: function(elementName, elementProto) {
    var Constructor = document.registerElement(elementName, {
      prototype: elementProto
    });
    return Constructor;
  },

  getAfterAppComponentAttached: function() {
    if (!afterAppComponentAttached) {
      afterAppComponentAttached = new Promise(function(fulfill) {
        document.attachEventListener("core-app attached", function(e) {
          fulfill(e);
        });
      });
    }

    return afterAppComponentAttached;
  }
};
