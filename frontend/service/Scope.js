/**
 * Web component scope.
 * @module frontend/service/Scope
 */

 const ApiService = require('./ApiService.js');
 const functionalNotationPattern = /^->f[(](.*)[)]/;
 const TemplateEngineService = require('./TemplateEngineService.js');
 var BackendService;

/* eslint-env browser */

/**
 * The scope holds context information and utilities to be
 * used by web component controllers.
 * @constructor
 * @param { Object } state - The context state.
 */
 function Scope(state) {
   this._state = state;
   this.onAttached = state.onAttached;
   this.onDetached = state.onDetached;
   this.onAttributeChanged = state.onAttributeChanged;
   this.onAppReady = state.onAppReady;
   this.resolveAppReady = state.resolveAppReady;
   this.templateEngine = TemplateEngineService.getInstance();
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
   return this.onAttached.then(function() {
     while (e && !isViewComponent(e)) {
       if (e.parentNode) {
         e = e.parentNode;
       } else {
         e = e.host;
       }
     }
     return e ? e : document.querySelector('core-app');
   });
 };

/**
 * Sends a GET request to the backend.
 * @param {string} url - A REST resource location.
 * @param {Object} filter - Filter object.
 * @return {Promise} A promise.
 */
 Scope.prototype.sendGetRequest = function(url, filter) {
   return getBackendService().get(url, filter);
 };

/**
 * Sends a post request to the backend.
 * @param {string} url - A REST resource location.
 * @param {Object} data - State to be tansfered.
 * @return {Promise} A promise.
 */
 Scope.prototype.sendPostRequest = function(url, data) {
   return getBackendService().post(url, data);
 };

/**
 * Sends a put request to the backend.
 * @param {string} url - A REST resource location.
 * @param {Object} data - State to be tansfered.
 * @return {Promise} A promise.
 */
 Scope.prototype.sendPutRequest = function(url, data) {
   return getBackendService().put(url, data);
 };

/**
 * Sends a patch request to the backend.
 * @param {string} url - A REST resource location.
 * @param {Object} data - State to be tansfered.
 * @return {Promise} A promise.
 */
 Scope.prototype.sendPatchRequest = function(url, data) {
   return getBackendService().patch(url, data);
 };

/**
 * Sends a delete request to the backend.
 * @param {string} url - A REST resource location.
 * @return {Promise} A promise.
 */
 Scope.prototype.sendDeleteRequest = function(url) {
   return getBackendService().delete(url);
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
 * Sets the current view to the corresponding URL.
 * @param { string } url - The url of the view.
 */
 Scope.prototype.navigateTo = function(url) {
   var data = getNavigationDataFromUrl(url);
   var event = new CustomEvent('setView', {detail: data});
   document.querySelector('core-app').dispatchEvent(event);
 };

/**
 * Binds a data attribute from the element to a
 * parent element API.
 * @param {string} attributeName - Name of the attribute excluding the 'data-'
 * part.
 */
 Scope.prototype.bindAttribute = function(attributeName) {
   ApiService.bindAttribute(attributeName, this, this._state.view);
 };

/**
 * Binds a list of data attributes from the element to a
 * parent element API.
 * @param {string[]} attributeList - An array of the attributes
 * excluding the 'data-' part.
 */
 Scope.prototype.bindAttributes = function(attributeList) {
   ApiService.bindAttributes(attributeList, this, this._state.view);
 };

/**
 * Returns the arguments specified in a functional
 * notation expression.
 * @param {string} exp - Functional notation expression
 * @return {Array|Object} Arguments
 */
 Scope.prototype.getFunctionalNotationArguments = function(exp) {
   var match = functionalNotationPattern.exec(exp);
   if (!match || match.length < 2) {
     return;
   }

   if (match[1].indexOf(',') === -1) {
     return match[1];
   }

   return match[1].split(',');
 };

 function isViewComponent(el) { // eslint-disable-line require-jsdoc
   return el.tagName && /^view-/.test(el.tagName.toLowerCase());
 }

 function getNavigationDataFromUrl(url) { // eslint-disable-line require-jsdoc
   "use strict";
   var pattern = /view\/(\w+)\/?(.*)?\/?([?].*)?$/;
   if (!pattern.test(url)) {
     throw new Error("URL pattern not supported: " + url);
   }
   var match = pattern.exec(url);
   var result = {
     elementName: 'view-' + match[1].toLowerCase()
   };
   if (match[2]) {
     result.path = match[2];
   }
   if (match[3]) {
     setParams(match[3].replace('?', ''));
   }
   return result;
   function setParams(params) { // eslint-disable-line require-jsdoc
     var it = new URLSearchParams(params).entries();
     result.params = {};
     var next = it.next();
     while (!next.done) {
       var key = next.value[0];
       result.params[key] = next.value[1];
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

 function getBackendService() { // eslint-disable-line require-jsdoc
   if (!BackendService) {
     BackendService = require("./BackendService.js");
   }
   return BackendService;
 }

 module.exports = Scope;
