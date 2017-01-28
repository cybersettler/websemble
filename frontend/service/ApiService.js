/**
 * API service module.
 * @module frontend/service/ApiService
 */

const UpBinding = require('./UpBinding.js');
const DownBinding = require('./DownBinding.js');
const ApiPattern = /^get(\w+)|set(\w+)|on(\w+)/;

function addSelector(current, next) { // eslint-disable-line require-jsdoc
  current += '[data-' + next + '] ';
  return current;
}

function generateApiMap(controller) { // eslint-disable-line require-jsdoc
  var result = {};
  Object.keys(controller).forEach(addApi, result);
  return result;
}

function addApi(prop) { // eslint-disable-line require-jsdoc
  var match = ApiPattern.exec(prop);
  var key;
  if (match) {
    key = match[1].toLowerCase();
  } else {
    return;
  }
  if (key === 'view' || key === 'scope') {
    return;
  }
  this[key] = this[key] || [];
  this[key].push(prop);
}

function bindApiToElement(el, controller, api) { // eslint-disable-line require-jsdoc
  var binding = new DownBinding(el, controller, api);
  binding.bindApi();
}

function augmentScope(prop) { // eslint-disable-line require-jsdoc
  augmentScopeWithBindingMethods(prop, this.scope, this.view);
}

function augmentScopeWithBindingMethods(prop, scope, view) { // eslint-disable-line require-jsdoc
  var binding = new UpBinding(prop, view.dataset[prop], view);
  scope[binding.getterName] = function() {
    return scope.onAttached.then(function() {
      return binding.getter();
    });
  };
  scope[binding.setterName] = function(data) {
    return scope.onAttached.then(function() {
      return binding.setter(data);
    });
  };
  scope[binding.onName] = function() {
    return scope.onAttached.then(function() {
      return binding.on();
    });
  };
}

module.exports = {
  bindApiDownward: function(controller) {
    var api = generateApiMap(controller);
    var query = Object.keys(api).reduce(addSelector, '');
    var matches = controller.getView().querySelectorAll(query);
    for (var i = 0; i < matches.length; i++) {
      bindApiToElement(matches[i], controller, api);
    }
  },
  bindAttribute: function(attributeName, scope, view) {
    augmentScopeWithBindingMethods(attributeName,
      scope, view);
  },
  bindAttributes: function(attributeList, scope, view) {
    attributeList.forEach(augmentScope, {
      scope: scope,
      view: view
    });
  }
};
