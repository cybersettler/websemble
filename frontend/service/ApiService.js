/**
 * API service module.
 * @module frontend/service/ApiService
 */

const UpBinding = require('./UpBinding.js');
const DownBinding = require('./DownBinding.js');
const ApiPattern = /^(?:get|set|on|create|update|remove)(\w+)/;
const BackendPattern = /^\//;
const BindingMethodNameService = require('./BindingMethodNameService.js');
const attributeValueApiPattern = /^->f[(]/;

function addSelector(item) { // eslint-disable-line require-jsdoc
  return '[data-' + item + '^="->f("]';
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
  if (BackendPattern.test(this.view.dataset[prop])) {
    augmentScopeWithBackendBindings(prop, this.scope, this.view);
  } else if (attributeValueApiPattern.test(this.view.dataset[prop])) {
    augmentScopeWithBindingMethods(prop, this.scope, this.view);
  }
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
  scope[binding.creatorName] = function(data) {
    return scope.onAttached.then(function() {
      return binding.creator(data);
    });
  };
  scope[binding.updaterName] = function(data) {
    return scope.onAttached.then(function() {
      return binding.updater(data);
    });
  };
  scope[binding.removerName] = function(data) {
    return scope.onAttached.then(function() {
      return binding.remover(data);
    });
  };
  scope[binding.onName] = function(data) {
    return scope.onAttached.then(function() {
      return binding.on(data);
    });
  };
}

function augmentScopeWithBackendBindings(prop, scope, view) { // eslint-disable-line require-jsdoc
  var url = view.dataset[prop];
  var binding = BindingMethodNameService
                      .getBindingMethodNames(prop);
  scope[binding.getterName] = function(data) {
    return scope.onAttached.then(function() {
      return scope.sendGetRequest(url, data).then(
        function(response) {
          return response.body;
        }
      );
    });
  };
  scope[binding.setterName] = function(data) {
    return scope.onAttached.then(function() {
      return scope.sendPutRequest(url, data);
    });
  };
  scope[binding.creatorName] = function(data) {
    return scope.onAttached.then(function() {
      return scope.sendPostRequest(url, data);
    });
  };
  scope[binding.updaterName] = function(data) {
    return scope.onAttached.then(function() {
      return scope.sendPatchRequest(url, data);
    });
  };
  scope[binding.removerName] = function() {
    return scope.onAttached.then(function() {
      return scope.sendDeleteRequest(url);
    });
  };
}

module.exports = {
  bindApiDownward: function(controller) {
    var api = generateApiMap(controller);
    var query = Object.keys(api).map(addSelector).join(',');
    if (!query) {
      return;
    }
    var matches = controller.getView().querySelectorAll(query);
    for (var i = 0; i < matches.length; i++) {
      bindApiToElement(matches[i], controller, api);
    }
  },
  bindAttribute: function(attributeName, scope, view) {
    if (BackendPattern.test(view.dataset[attributeName])) {
      augmentScopeWithBackendBindings(attributeName,
        scope, view);
    } else {
      augmentScopeWithBindingMethods(attributeName,
        scope, view);
    }
  },
  bindAttributes: function(attributeList, scope, view) {
    attributeList.forEach(augmentScope, {
      scope: scope,
      view: view
    });
  }
};
