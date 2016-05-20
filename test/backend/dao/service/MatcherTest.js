const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const appRoot = require("app-root-path");
const path = require("path");
const PersistenceService = reqlib('/backend/dao/service/PersistenceService.js');
const Matcher = reqlib('/backend/dao/service/Matcher.js');

describe("Matcher",function(){
  var basePath = path.join(appRoot.toString(), "test", "mockdata");
  PersistenceService.init(basePath);
  var readCollection = PersistenceService.readCollection('product');
  describe("#match(condition)",function(){
    it("is able to query with a single field", function(done) {
      readCollection.then(function(result) {
        var condition = {name: "An ice sculpture"};
        var found = findOne(condition, result);
        assert.equal(2,found.id);
        condition = {name: "A blue mouse"};
        found = findOne(condition,result);
        assert.equal(3,found.id);
        done();
      },done).catch(done);
    });
    it("is able to query with multiple fields", function(done) {
      readCollection.then(function(result) {
        var condition = {name: "An ice sculpture",price:"12.50"};
        var found = findOne(condition, result);
        assert.equal(2,found.id);
        condition = {name: "A blue mouse"};
        found = findOne(condition,result);
        assert.equal(3,found.id);
        done();
      },done).catch(done);
    });
    xit("is able to query with contains operator",function(){});
    xit("is able to query with gt operator",function(){});
    xit("is able to query with gte operator",function(){});
    xit("is able to query with lt operator",function(){});
    xit("is able to query with lte operator",function(){});
    xit("is able to query with and operator",function(){});
    xit("is able to query with or operator",function(){});
    xit("is able to query with not operator",function(){});
  });
});

function findOne(condition,collection){
  var matcher = new Matcher(condition);
  var found = null;
  collection.index.some(find);
  function find(item) {
    var match = matcher.match(item);
    if (match) {
      found = item;
    }
    return match;
  }
  return found;
}
