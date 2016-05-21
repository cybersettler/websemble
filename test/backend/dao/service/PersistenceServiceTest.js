/**
 * Example collection taken from http://json-schema.org/example1.html
 */

const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const appRoot = require("app-root-path");
const path = require("path");
const PersistenceService = reqlib('/backend/dao/service/PersistenceService.js');

describe('PersistenceService', function() {
  var basePath = path.join(appRoot.toString(), "test", "mockdata");
  PersistenceService.init(basePath);
  var readCollection = PersistenceService.readCollection('product');
  describe("#readCollection()",function(){
    it("Collection has index", function(done){
      readCollection.then(
        function(result){
          assert.equal(2,result.index.length);
          assert.equal(2,result.index[0].id);
          done();
      }).catch(done);
    });
    it("Collection has schema", function(done){
      readCollection.then(function(result) {
          assert.equal("Product",result.schema.title);
          done();
        }).catch(done);
    });
  });
  describe("#updateCollection()",function(){
    it("is possible to update a collection", function(done) {
      readCollection.then(function(result) {
        result.index[0].name = "updated resource";
        return PersistenceService.updateCollection("product",result.index);
      }).then(function(result) {
        var updated = JSON.parse(result);
        assert.equal("updated resource", updated[0].name);
        done();
      }).catch(done);
    });
  });
});
