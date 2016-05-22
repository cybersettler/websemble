const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const appRoot = require("app-root-path");
const path = require("path");
const PersistenceService = reqlib('/backend/dao/service/PersistenceService.js');
const DAOImplementation = reqlib('/backend/dao/DAOImplementation.js');

var sampleProduct = {
    "name": "TNT",
    "price": 42.99,
    "tags": ["explosive"],
    "dimensions": {
        "length": 0.25,
        "width": 0.25,
        "height": 0.5
    },
    "warehouseLocation": {
        "latitude": -78.75,
        "longitude": 20.4
    }
};

var invalidSampleProduct = {
  "name": "Panacea"
};

describe('DAOImplementation', function() {
  var basePath = path.join(appRoot.toString(), "test", "mockdata");
  PersistenceService.init(basePath);
  var implementation = new DAOImplementation("product",PersistenceService);
  describe("#getCollection()",function(){
    it("returns a collection",function(done){
      implementation.getCollection().then(function(collection){
        assert.isDefined(collection, "Collection must be defined");
        assert(Array.isArray(collection.index),
        'Collection index must be an array.');
        assert.equal(2, collection.index.length);
        assert.isDefined(collection.schema,
          "Collection schema must be defined");
        assert.isDefined(collection.idMap,
          "Collection id Map must be defined");
        done();
      }).catch(done);
    });
  });
  describe("#findAll()",function(){
    it("returns an array",function(done){
      implementation.findAll().then(function(result){
        assert(Array.isArray(result), "Result is an array");
        assert.equal(2, result.length);
        done();
      }).catch(done);
    });
  });
  describe("#findWhere()",function(){
    it("returns an array",function(done){
      var filter = {name: "An ice sculpture", price: "12.50"};
      implementation.findWhere(filter).then(function(result) {
        assert(Array.isArray(result), "Result is an array");
        assert.equal(1, result.length);
        assert.equal("An ice sculpture", result[0].name);
        done();
      }).catch(done);
    });
  });
  describe("#findById()",function(){
    it("returns a resource",function(done){
      implementation.findById(3).then(function(result) {
        assert.isDefined(result);
        assert.equal("A blue mouse",result.name);
        done();
      }).catch(done);
    });
  });
  describe("#create()",function(){
    it("returns created resource", function(done) {
      implementation.create(sampleProduct).then(function(result) {
        assert.isDefined(result);
        assert.isDefined(result.id);
        assert.equal("TNT", result.name);
        assert.equal(42.99, result.price);
        done();
      }).catch(done);
    });
    it("should not be possible to create resources from invalid data",
    function(done) {
      implementation.create(invalidSampleProduct).then(
        function(result) {
          assert.isUndefined(result);
          done();
        }, function(err) {
          assert.isDefined(err);
          done();
        }).catch(done);
    });
  });
  describe("#update()",function() {
    it("returns the updated record", function(done) {
      implementation.findById(3).then(function(result) {
        assert.isDefined(result);
        assert.equal("A blue mouse",result.name);
        result.name = "A blue mouse updated";
        return implementation.update(3,result);
      }).then(function(result) {
        assert.isDefined(result);
        assert.equal("A blue mouse updated",result.name);
        done();
      }).catch(done);
    });
    it("should not be possible to updated resource with invalid data",
    function(done) {
      implementation.findById(3).then(function(result) {
        assert.isDefined(result);
        assert.equal("A blue mouse",result.name);
        delete result.price;
        return implementation.update(3,result);
      }).then(function(result) {
        assert.isUndefined(result);
        done();
      }).catch(function(err) {
        assert.isDefined(err);
        done();
      });
    });
  });
  describe("#updatePartially()",function(){
    it("returns the updated record", function(done) {
      var patch = {name: "An ice sculpture updated"};
      implementation.updatePartially(2,patch).then(function(result) {
        assert.isDefined(result);
        assert.equal("An ice sculpture updated",result.name);
        assert.equal(12.50,result.price);
        done();
      }).catch(done);
    });
  });
  describe("#delete()",function(){
    it("returns number of deleted resources",function(done){
      implementation.create({name: "Rubber duck", price: 0.99}).then(
        function(result) {
          assert.isDefined(result);
          assert.isDefined(result.id);
          assert.equal("Rubber duck", result.name);
          assert.equal(0.99, result.price);
          return implementation.delete(result.id);
        }).then(function(result) {
          assert.equal(1,result);
          done();
        }).catch(done);
    });
  });
});
