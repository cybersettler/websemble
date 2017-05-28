/**
 * Connection point for a Parent element binding in a child element.
 * @module frontend/service/DownBinding
 */

 /* eslint-env browser */

const viewApiPattern = /^[->f(]/;
const apiParamPattern = /[->f(](\w+)?[)]/;

/**
 * Instantiates a parent binding connection.
 * @constructor
 * @param {HTMLElement} el - Child element.
 * @param {AbstractController} controller - Parent web component controller.
 * @param {Object} api - Object that maps the controller public methods to
 * an attribute name.
 */
function DownBinding(el, controller, api) {
  this.controller = controller;
  this.view = controller.getView();
  this.scope = controller.getScope();
  this.childElement = el;
  this.api = api;
}

/**
 * Adds handlers to the child element.
 */
DownBinding.prototype.bindApi = function() {
  var dataset = this.childElement.dataset;
  Object.keys(dataset).filter(hasApi, this).forEach(bindAttribute, this);
};

function hasApi(attr) { // eslint-disable-line require-jsdoc
  var value = this.childElement.dataset[attr];
  return this.api[attr] && viewApiPattern.test(value);
}

function bindAttribute(attr) { // eslint-disable-line require-jsdoc
  var match = apiParamPattern.exec(this.childElement.dataset[attr]);
  var param = match && match.length > 1 ? match[1] : null;
  this.api[attr].forEach(addListener, {
    controller: this.controller,
    childElement: this.childElement,
    param: param
  });
}

function addListener(eventType) { // eslint-disable-line require-jsdoc
  var controller = this.controller;
  var childView = this.childElement;
  var param = this.param;
  childView.addEventListener(eventType, function(e) {
    var data = controller[eventType](e, param);
    if (data && data.then) {
      data.then(function(result) {
        dispatchResponse(childView, result);
      });
    } else {
      dispatchResponse(childView, data);
    }
  });
}

function dispatchResponse(el, data) { // eslint-disable-line require-jsdoc
  var event = new CustomEvent('viewResponse', {detail: data});
  el.dispatchEvent(event);
}

module.exports = DownBinding;
