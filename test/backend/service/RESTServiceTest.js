const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const appRoot = require("app-root-path");
const path = require("path");
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fs = editor.create(store);
const RESTService = reqlib('/backend/service/RESTService.js');
const mockdataSource = path.join(
  appRoot.toString(), "test", "mockdata"
);
const tempFolder = path.join(
  appRoot.toString(), "test", "tmp"
);
var sampleProduct = fs.readJSON(path.join(mockdataSource,"product","tnt.json"));

describe('RESTService', function(){
  var productDAO = null;
  beforeEach("Setup", function(done) {
    var indexSource = path.join(
      mockdataSource, "product", "index.json"
    );
    var schemaSource = path.join(
      mockdataSource, "product", "schema.json"
    );
    var indexDest = path.join(
      tempFolder, "product", "index.json"
    );
    var schemaDest = path.join(
      tempFolder, "product", "schema.json"
    );

    fs.copy(indexSource, indexDest);
    fs.copy(schemaSource, schemaDest);

    fs.commit(function() {
      RESTService.init({appDataDir: tempFolder});
      done();
    });
  });
  afterEach("Teardown", function(done) {
    fs.delete(tempFolder);
    fs.commit(done);
  });
  describe("#handleGet(url)", function() {
    it("returns a resource list", function(done) {
      var url = "product/";
      RESTService.handleGet(url).then(function(result){
        assert.isDefined(result);
        assert(Array.isArray(result.body), "Result body should be an array");
        assert.equal(2,result.body.length);
        done();
      }).catch(done);
    });
    it("returns collection schema", function(done) {
      var url = "product/schema";
      RESTService.handleGet(url).then(function(result){
        assert.isDefined(result);
        assert.equal("Product",result.body.title);
        done();
      }).catch(done);
    });
    it("returns a resource by id", function(done) {
      var url = "product/2";
      RESTService.handleGet(url).then(function(result){
        assert.isDefined(result);
        assert.equal("An ice sculpture",result.body.name);
        done();
      }).catch(done);
    });
    it("returns a resource list by query", function(done) {
      var url = "product/?price=12.50";
      RESTService.handleGet(url).then(function(result){
        assert.isDefined(result);
        assert(Array.isArray(result.body), "Result body should be an array");
        assert.equal(1,result.body.length);
        assert.equal("An ice sculpture",result.body[0].name);
        done();
      }).catch(done);
    });
  });
  describe("#handlePost(url)", function() {
    it("returns a resource", function(done) {
      RESTService.handlePost("product/", sampleProduct).then(
        function(result) {
          assert.isDefined(result);
          assert.isDefined(result.body.id);
          assert.equal("TNT",result.body.name);
          done();
        }
      ).catch(done);
    });
  });
  describe("#handlePut(url)", function() {
    it("returns a resource", function(done) {
      var url = "product/2";
      RESTService.handleGet(url).then(function(result){
        assert.isDefined(result);
        assert.equal("An ice sculpture",result.body.name);
        var product = result.body;
        product.name = "Updated ice sculpture";
        return RESTService.handlePut("product/2", product);
      }).then(function(result){
        assert.isDefined(result);
        assert.equal("Updated ice sculpture",result.body.name);
        done();
      }).catch(done);
    });
  });
  describe("#handlePatch(url)", function() {
    it("returns a resource", function(done) {
      var update = {name: "Updated blue mouse"};
      RESTService.handlePatch("product/3", update).then(function(result) {
        assert.isDefined(result);
        assert.equal("Updated blue mouse",result.body.name);
        done();
      }).catch(done);
    });
  });
  describe("#handleDelete(url)", function() {
    it("returns a resource", function(done) {
      RESTService.handleDelete("product/3").then(function(result) {
        assert.isDefined(result);
        assert.equal(1,result.body);
        done();
      }).catch(done);
    });
  });
});
