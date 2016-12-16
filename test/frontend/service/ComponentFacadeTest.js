const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const appRoot = require("app-root-path");
const path = require("path");
require('node-browser-environment')();
const Facade = reqlib('/frontend/service/ComponentFacade.js');

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
  var afterAppCreated;
  before(function() {
    afterAppCreated = Facade.createAppComponent();
//    document.components["core-app"].prototype.createdCallback();
  });
  describe('#createAppComponent', function() {
    it("generates core-app component", function(done) {
      assert.isDefined(afterAppCreated);
      done();
    /*  afterAppCreated.then(function(app) {
        assert.isDefined(app);
        done();
      }).catch(done); */
    });
  });
});
