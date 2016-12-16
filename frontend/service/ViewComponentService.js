/**
 * Instantiates View components.
 * @module frontend/service/ViewComponentService
 */

 /* global URLSearchParams */

const ComponentService = require("./ComponentService.js");
const ComponentFactory = require("../factory/ComponentFactory.js");
const AbstractViewController = require(
  "../component/view/AbstractController.js");

function addOnAttachedCallback(view, controller, afterAppCreated) { // eslint-disable-line require-jsdoc
  view.onAttached = function() {
    controller.dispatch = function(params) {
      return afterAppCreated.then(function(app) {
        return app.dispatch(params);
      });
    };
    controller.onAttached();
  };
}

function addOnDetachedCallback(view, controller, afterAppCreated) { // eslint-disable-line require-jsdoc
  view.onDetached = function() {
    afterAppCreated.then(function(app) {
      app.unregisterView({elementName: view.tagName.toLowerCase()});
      if (controller.onDetached) {
        controller.onDetached();
      }
    });
  };
}

module.exports = {
  createComponent: function(elementName, afterAppCreated) {
    var elementProto = ComponentService.createComponent(elementName);
    var ViewController = ComponentService.createComponentController(
      elementName, AbstractViewController);

    // Fires when an instance of the element is created
    elementProto.createdCallback = function() {
      console.log("Element created", elementName);

      var model = {};
      var controller = ComponentFactory.getInstance(ViewController,
        this, model);

      controller.navigateTo = function(url) {
        var data = getNavigationDataFromUrl(url);
        afterAppCreated.then(function(app) {
          app.setView(data);
        });
      };

      var tagname = this.tagName.toLowerCase();
      afterAppCreated.then(function(app) {
        app.registerView({
          elementName: tagname,
          viewController: controller
        });
      });

      ComponentService.addComponentCallbacks(this, controller);

      // Fires when an instance was inserted into the document
      addOnAttachedCallback(this, controller, afterAppCreated);

      // Fires when an instance was removed from the document
      addOnDetachedCallback(this, controller, afterAppCreated);
    };

    return elementProto;
  }
};

function getNavigationDataFromUrl(url) { // eslint-disable-line require-jsdoc
  "use strict";
  var pattern = /view\/(\w+)\/?([?].*)?/;
  if (!pattern.test(url)) {
    throw new Error("URL pattern not supported: " + url);
  }
  var match = pattern.exec(pattern);
  var result = {
    elementName: 'view-' + match[1]
  };
  if (match[2]) {
    setParams(match[2].replace('?', ''));
  }
  return result;
  function setParams(params) { // eslint-disable-line require-jsdoc
    var it = new URLSearchParams(params).entries();
    result.params = {};
    let next = it.next();
    while (!next.done) {
      let key = next.value[0];
      let value = next.value[1];
      result.params[key] = value;
      next = it.next();
    }
  }
}
