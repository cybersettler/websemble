const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const appRoot = require("app-root-path");
const path = require("path");
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fs = editor.create(store);
const RESTService = reqlib('/backend/service/RESTService.js');
const CatalogService = reqlib('/backend/dao/service/CatalogService.js');
const mockdataSource = path.join(
  appRoot.toString(), "test", "mockdata"
);

var sampleProduct;

var config = {
  persistence: {
    catalog: [{
      basePath: path.join('test', 'mockdata', 'products'),
      collectionName: 'products',
      schema: 'schema.json'
    }]
  },
  resources: {
    products: 'database'
  }
};

/* global describe, before, beforeEach, afterEach, it */
describe('RESTService', function() {
  var initialData;
  var collection;

  before(function(done) {
    initialData = fs.readJSON(
      path.join(mockdataSource, "products", "index.json"));
    sampleProduct = fs.readJSON(
      path.join(mockdataSource, "products", "tnt.json"));
    RESTService.init(config);
    collection = CatalogService.getCollection("products");
    done();
  });

  beforeEach("Setup", function(done) {
    collection.insert(initialData).then(function() {
      done();
    });
  });

  afterEach("Teardown", function(done) {
    // Removing all documents with the 'match-all' query
    collection.remove({}, {multi: true})
      .then(
        function() {
          done();
        }, function(err) {
          throw new Error(err.message);
        });
  });

  describe("#handleGet(url)", function() {
    it("returns a resource list", function(done) {
      var url = "/products";
      RESTService.handleGet(url)
        .then(function(result) {
          assert.isDefined(result);
          assert(Array.isArray(result.body), "Result body should be an array");
          assert.equal(2, result.body.length);
          done();
        }).catch(done);
    });
    it("returns collection schema", function(done) {
      var url = "/products/schema";
      RESTService.handleGet(url)
        .then(function(result) {
          assert.isDefined(result);
          assert.equal("Product", result.body.title);
          done();
        }).catch(done);
    });
    it("returns a resource by id", function(done) {
      var url = "/products/";
      var name = '';
      RESTService.handleGet(url)
        .then(function(result) {
          url += result.body[1]._id;
          name = result.body[1].name;
          return RESTService.handleGet(url);
        })
        .then(function(result) {
          assert.isDefined(result);
          assert.equal(name, result.body.name);
          done();
        }).catch(done);
    });
    it("returns a resource list by query", function(done) {
      var url = "/products/?price=12.50";
      RESTService.handleGet(url)
        .then(function(result) {
          assert.isDefined(result);
          assert(Array.isArray(result.body), "Result body should be an array");
          assert.equal(1, result.body.length);
          assert.equal("An ice sculpture", result.body[0].name);
          done();
        }).catch(done);
    });
  });
  describe("#handlePost(url)", function() {
    it("returns a resource", function(done) {
      RESTService.handlePost("/products", sampleProduct)
        .then(
          function(result) {
            assert.isDefined(result);
            assert.isDefined(result.body._id);
            assert.equal("TNT", result.body.name);
            done();
          }
        )
        .catch(done);
    });
  });
  describe("#handlePut(url)", function() {
    it("returns number of affected resources", function(done) {
      var url = "/products/?name=An ice sculpture";
      RESTService.handleGet(url)
        .then(function(result) {
          url = '/products/' + result.body[0]._id;
          return RESTService.handleGet(url);
        })
        .then(function(result) {
          assert.isDefined(result);
          assert.equal("An ice sculpture", result.body.name);
          var product = result.body;
          product.name = "Updated ice sculpture";
          return RESTService.handlePut(url, product);
        })
        .then(function(result) {
          assert.isDefined(result);
          assert.equal(1, result.body);
          done();
        })
        .catch(done);
    });
  });
  describe("#handlePatch(url)", function() {
    it("returns number of affected resources", function(done) {
      var url = "/products/?price=25.50";
      RESTService.handleGet(url)
        .then(function(result) {
          assert.equal("A blue mouse", result.body[0].name);
          url = '/products/' + result.body[0]._id;
          var update = {name: "Updated blue mouse"};
          return RESTService.handlePatch(url, update);
        })
        .then(function(result) {
          assert.equal(1, result.body);
          done();
        })
        .catch(done);
    });
  });
  describe("#handleDelete(url)", function() {
    it("returns number of affected resources", function(done) {
      var url = "/products/?price=25.50";
      RESTService.handleGet(url)
        .then(function(result) {
          assert.equal("A blue mouse", result.body[0].name);
          var toDelete = '/products/' + result.body[0]._id;
          return RESTService.handleDelete(toDelete);
        })
        .then(function(result) {
          assert.isDefined(result);
          assert.equal(1, result.body);
          return RESTService.handleGet(url);
        })
        .then(function(result) {
          assert.equal(0, result.body.length);
          done();
        })
        .catch(done);
    });
  });
});
