/**
 * Web component scope.
 * @module frontend/service/Scope
 */

/* eslint-env browser */

/**
 * The scope holds context information and utilities to be
 * used by web component controllers.
 * @constructor
 * @param { Object } state - The context state.
 */
function Scope(state) {
  this._state = state;
  this.onViewAttached = state.onAttached;
  this.onViewDetached = state.onDetached;
  this.onAttributeChanged = state.onAttributeChanged;

  if (state.view.hasAttribute("data-model")) {
    this.model = this.getAttributeValueFromParentScope('model.' +
      state.view.dataset.model);
  }

  addShadowRootTemplate(this);
  addMainTemplate(this);
}

/**
 * Returns the main html template of the component.
 * @return { HTMLElement } An html element.
 */
Scope.prototype.getMainTemplate = function() {
  return this._state.localContext.querySelector('template.main');
};

/**
 * Returns the shadow html template of the component.
 * @return { HTMLElement } An html element.
 */
Scope.prototype.getShadowTemplate = function() {
  return this._state.localContext.querySelector('template.shadow');
};

/**
 * Returns the view to which this component belongs.
 * @return { HTMLElement } The HTML element.
 */
Scope.prototype.getParentView = function() {
  var e = this._state.view;
  return this._state.onAttached.then(function() {
    while (e && !isViewComponent(e)) {
      e = e.parentNode;
    }
    return e;
  });
};

/**
 * Returns the scope of the parent element. Not any Dom node
 * qualifies as parent, it can only be either a view component
 * or the app component.
 * @return { Scope } A scope object.
 */
Scope.prototype.getParentScope = function() {
  if (/^view-/.test(this._state.view.tagName.toLowerCase())) {
    return this._state.afterAppCreated.then(function(app) {
      return app.getScope();
    });
  }

  return getParentViewScope(this);
};

/**
 * Invoques a handler from the parent scope to
 * dispatch an event. If the calling scope is
 * a view, then an app handler will be invoqued,
 * otherwise a view handler will be invoqued instead.
 * @param { string | Object } eventData - The event type
 * as string or an event object.
 * @param { string } type - The event type.
 * @param { string } eventData.target - The tag name of the
 * component that will handle the event.
 * @param { HTMLElement } eventData.source - The component
 * html element that triggered the event.
 * @return { Promise } A promise.
 */
Scope.prototype.dispatch = function(eventData) {
  if (/^view-/.test(this._state.view.tagName.toLowerCase())) {
    return this._state.afterAppCreated.then(function(app) {
      return app.dispatch(eventData);
    });
  }

  var scope = this;

  return this.getParentView().then(function(parentView) {
    var parentViewName = parentView.tagName.toLowerCase();
    var event = eventData;
    if (typeof eventData === 'string') {
      event = {
        type: eventData,
        target: parentViewName,
        source: scope._state.view
      };
    }
    return this._state.afterAppCreated.then(function(app) {
      return app.dispatch(event);
    });
  });
};

/**
 * Returns the parent element with tag name or null.
 * @param { string } tagName - The searched elment's tag name
 * @return { HTMLElement } The HTML element.
 */
Scope.prototype.findParentByTagName = function(tagName) {
  var e = this._state.view;
  return this._state.onAttached.then(function() {
    while (e && !isViewComponent(e)) {
      e = e.parentNode;
      if (e.tagName.toLowerCase() === tagName) {
        return e;
      }
    }
    return null;
  });
};

/**
 * Returns a parent scope attribute value specified by
 * the attribute name path. The parent may be the app component
 * or a view component.
 * @param { string } attributeNamePath - A javascript object
 * notation string.
 * @return { * } The attribute value.
 */
Scope.prototype.getAttributeValueFromParentScope = function(attributeNamePath) {
  var state = this._state;
  return this.getParentScope().then(function(parentScope) {
    var path = 'model.' + state.view.dataset[attributeNamePath];
    return path.split('.')
      .reduce(function(scope, property) {
        if (scope.then) {
          return scope.then(function(result) {
            return result[property];
          });
        }
        return Promise.resolve(scope[property]);
      }, parentScope);
  });
};

/**
 * Sets a parent scope attribute value specified by the
 * attribute name path.
 * The parent may be the app component
 * or a view component.
 * @param { string } attribute - Attribute name.
 * @param { value } value - attribute value.
 * @return { Promise } A promise.
 */
Scope.prototype.setAttributeValueToParentScope = function(
  attribute, value) {
  return this.getParentScope().then(function(parentScope) {
    var parts = attribute.split('.');
    var last = parts.length - 1;
    var lastAttributeName = parts[last];
    var current = 0;

    parts.reduce(reduceScope, parentScope).then(
      function(parentObject) { // eslint-disable-line require-jsdoc
        parentObject[lastAttributeName] = value;
      }
    );

    function reduceScope(scope, property) { // eslint-disable-line require-jsdoc
      var result;
      if (scope.then) {
        return scope.then(function(next) {
          result = next;
          if (current < last) {
            result = next[property];
          }
          current += 1;
          return result;
        });
      }
      result = Promise.resolve(scope);
      if (current < last) {
        result = Promise.resolve(scope[property]);
      }
      current += 1;
      return result;
    }
  });
};

/**
 * Sets the current view to the corresponding URL.
 * @param { string } url - The url of the view.
 */
Scope.prototype.navigateTo = function(url) {
  var data = getNavigationDataFromUrl(url);
  this._state.afterAppCreated.then(function(app) {
    app.setView(data);
  });
};

function getParentViewScope(scope) { // eslint-disable-line require-jsdoc
  return scope.getParentView().then(function(parentView) {
    var parentViewName = parentView.tagName.toLowerCase();
    return scope._state.afterAppCreated.then(function(app) {
      return app.getViewScope(parentViewName);
    });
  });
}

function isViewComponent(el) { // eslint-disable-line require-jsdoc
  return /^view-/.test(el.tagName.toLowerCase());
}

function getNavigationDataFromUrl(url) { // eslint-disable-line require-jsdoc
  "use strict";
  var pattern = /view\/(\w+)\/?([?].*)?/;
  if (!pattern.test(url)) {
    throw new Error("URL pattern not supported: " + url);
  }
  var match = pattern.exec(url);
  var result = {
    elementName: 'view-' + match[1].toLowerCase()
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

function addShadowRootTemplate(scope) { // eslint-disable-line require-jsdoc
  var shadowTemplate = scope.getShadowTemplate();
  if (!shadowTemplate) {
    return;
  }

  // Creates the shadow root
  var root;
  if (scope._state.view.attachShadowRoot) {
    root = scope._state.view.attachShadowRoot();
  } else {
    root = scope._state.view.createShadowRoot();
  }

  // Adds a template clone into shadow root
  var clone = document.importNode(shadowTemplate.content, true);
  root.appendChild(clone);
}

function addMainTemplate(scope) { // eslint-disable-line require-jsdoc
  var mainTemplate = scope.getMainTemplate();
  if (!mainTemplate) {
    return;
  }
  var clone = document.importNode(mainTemplate.content, true);
  scope._state.view.appendChild(clone);
}

module.exports = Scope;
