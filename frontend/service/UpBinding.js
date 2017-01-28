/**
 * Element parent binding meant to be used in a child component.
 * @module frontend/service/UpBinding
 */

 /* eslint-env browser */

const StringUtil = require('../../util/StringUtil.js');

/**
 * Instantiates a parent binding.
 * @constructor
 * @param {strin} attributeName - Element attribute name.
 * @param {string} arg - Argument to pass to the event handler.
 * @param {HTMLElement} view - Element owner of the attribute.
 */
function UpBinding(attributeName, arg, view) {
  var name = StringUtil.capitalize(attributeName);
  this.view = view;
  this.attributeName = attributeName;
  this.argument = arg;
  this.getterName = 'get' + name;
  this.setterName = 'set' + name;
  this.onName = 'on' + name;
}

/**
 * Getter function.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.getter = function() {
  var view = this.view;
  var eventType = this.getterName;
  var argument = this.argument;
  return new Promise(function(fulfill) {
    var event = new CustomEvent(eventType, {
      detail: {
        arg: argument
      }
    });
    view.addEventListener('viewResponse', processGet, false);
    view.dispatchEvent(event);
    function processGet(e) { // eslint-disable-line require-jsdoc
      view.removeEventListener('viewResponse', processGet, false);
      fulfill(e.detail);
    }
  });
};

/**
 * Setter function.
 * @param {Object|string|number|boolean} data - Data to be set.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.setter = function(data) {
  var view = this.view;
  var eventType = this.setterName;
  var argument = this.argument;
  return new Promise(function(fulfill) {
    var event = new CustomEvent(eventType, {
      detail: {
        arg: argument,
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
};

/**
 * Event trigger function.
 * @return {Promise} A promise that resolves to the handler's return data.
 */
UpBinding.prototype.on = function() {
  var view = this.view;
  var eventType = this.onName;
  var argument = this.argument;
  return new Promise(function(fulfill) {
    var event = new CustomEvent(eventType, {
      detail: {
        arg: argument
      }
    });
    view.addEventListener('viewResponse', processOn, false);
    view.dispatchEvent(event);
    function processOn(e) { // eslint-disable-line require-jsdoc
      view.removeEventListener('viewResponse', processOn, false);
      fulfill(e.detail);
    }
  });
};

module.exports = UpBinding;
