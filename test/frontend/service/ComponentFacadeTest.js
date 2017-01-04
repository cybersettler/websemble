const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const appRoot = require("app-root-path");
const path = require("path");
require('node-browser-environment')();
const Facade = reqlib('/frontend/service/ComponentService.js');

window.FRONTEND_PATH = path.join(appRoot.toString(), "test", "mockapp", "frontend");
document.components = {};
// Polyfill web component custom element
document.registerElement = function(elementName, config){
  document.components[elementName] = config;
  function mockConstructor(){
    console.log("mock contructor called",elementName);
  }
  return mockConstructor;
};
document._currentScript = document.createElement("script");

describe('ComponentFacade', function(){
  describe('#createComponent', function() {
    it("generates core-app component", function(done) {
      AppElementConstructor = Facade.createComponent('core-app');
      assert.isDefined(AppElementConstructor);
      done();
    });
  });
});
