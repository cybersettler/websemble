/**
 * Element parent binding meant to be used in a child component.
 * @module frontend/service/UpBinding
 */

 /* eslint-env browser */

const BindingMethodNameService = require('./BindingMethodNameService.js');

/**
 * Instantiates a parent binding.
 * @constructor
 * @param {strin} attributeName - Element attribute name.
 * @param {string} value - Attribute value.
 * @param {Promise} getParentView - Element owner of the attribute.
 */
function UpBinding(attributeName, value, getParentView) {
  this.getParentView = getParentView;
  this.attributeName = attributeName;
  var methodNames = BindingMethodNameService
                      .getBindingMethodNames(attributeName);
  this.value = value;
  this.getterName = methodNames.getterName;
  this.setterName = methodNames.setterName;
  this.creatorName = methodNames.creatorName;
  this.updaterName = methodNames.updaterName;
  this.removerName = methodNames.removerName;
  this.onName = methodNames.onName;
}

/**
 * Getter function.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.getter = function() {
  var eventType = this.getterName;
  var value = this.value;
  return this.getParentView.then(function(view) {
    return new Promise(function(fulfill) {
      var event = new CustomEvent(eventType, {
        detail: {
          ref: value
        }
      });

      view.addEventListener('viewResponse', processGet, false);
      view.dispatchEvent(event);

      function processGet(e) { // eslint-disable-line require-jsdoc
        view.removeEventListener('viewResponse', processGet, false);
        fulfill(e.detail);
      }
    });
  });
};

/**
 * Setter function.
 * @param {Object|string|number|boolean} data - Data to be set.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.setter = function(data) {
  var eventType = this.setterName;
  var value = this.value;
  return this.getParentView.then(function(view) {
    return new Promise(function(fulfill) {
      var event = new CustomEvent(eventType, {
        detail: {
          ref: value,
          data: data
        }
      });

      view.addEventListener('viewResponse', processSet, false);
      view.dispatchEvent(event);

      function processSet(e) { // eslint-disable-line require-jsdoc
        view.removeEventListener('viewResponse', processSet, false);
        fulfill(e.detail);
      }
    });
  });
};

/**
 * Event trigger function.
 * @param {Object|string|number|boolean} data - Data to be comunicated.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.on = function(data) {
  var eventType = this.onName;
  var value = this.value;
  return this.getParentView.then(function(view) {
    return new Promise(function(fulfill) {
      var event = new CustomEvent(eventType, {
        detail: {
          ref: value,
          data: data
        }
      });

      view.addEventListener('viewResponse', processOn, false);
      view.dispatchEvent(event);

      function processOn(e) { // eslint-disable-line require-jsdoc
        view.removeEventListener('viewResponse', processOn, false);
        fulfill(e.detail);
      }
    });
  });
};

/**
 * Creator function.
 * @param {Object|string|number|boolean} data - Data to be posted.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.creator = function(data) {
  var eventType = this.creatorName;
  var value = this.value;
  return this.getParentView.then(function(view) {
    return new Promise(function(fulfill) {
      var event = new CustomEvent(eventType, {
        detail: {
          ref: value,
          data: data
        }
      });

      view.addEventListener('viewResponse', processCreate, false);
      view.dispatchEvent(event);

      function processCreate(e) { // eslint-disable-line require-jsdoc
        view.removeEventListener('viewResponse', processCreate, false);
        fulfill(e.detail);
      }
    });
  });
};

/**
 * Updater function.
 * @param {Object|string|number|boolean} data - Data to be updated.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.updater = function(data) {
  var eventType = this.updaterName;
  var value = this.value;

  return this.getParentView.then(function(view) {
    return new Promise(function(fulfill) {
      var event = new CustomEvent(eventType, {
        detail: {
          ref: value,
          data: data
        }
      });

      view.addEventListener('viewResponse', processUpdate, false);
      view.dispatchEvent(event);

      function processUpdate(e) { // eslint-disable-line require-jsdoc
        view.removeEventListener('viewResponse', processUpdate, false);
        fulfill(e.detail);
      }
    });
  });
};

/**
 * Remover function.
 * @param {Object|string|number|boolean} data - Data to be removed.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.remover = function(data) {
  var eventType = this.removerName;
  var value = this.value;

  return this.getParentView.then(function(view) {
    return new Promise(function(fulfill) {
      var event = new CustomEvent(eventType, {
        detail: {
          ref: value,
          data: data
        }
      });

      view.addEventListener('viewResponse', processRemove, false);
      view.dispatchEvent(event);

      function processRemove(e) { // eslint-disable-line require-jsdoc
        view.removeEventListener('viewResponse', processRemove, false);
        fulfill(e.detail);
      }
    });
  });
};

module.exports = UpBinding;
