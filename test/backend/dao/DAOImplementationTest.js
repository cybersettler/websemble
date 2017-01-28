const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const appRoot = require("app-root-path");
const path = require("path");
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fs = editor.create(store);
const DAOImplementation = reqlib('/backend/dao/DAOImplementation.js');
const mockdataSource = path.join(
  appRoot.toString(), "test", "mockdata"
);

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
  var config = {
    collectionName: 'products',
    schema: path.join('test', 'mockdata', 'products', 'schema.json')
  };
  var initialData = fs.readJSON(
    path.join(mockdataSource,"products","index.json"));
  var implementation = new DAOImplementation(config);
  beforeEach("Setup", function(done) {
    implementation.insert(initialData).then(function() {
      done();
    });
  });
  afterEach("Teardown", function(done) {
    // Removing all documents with the 'match-all' query
    implementation.remove({}, { multi: true }).then(function() {
      done();
    }, function(err) {
      throw new Error(err.message);
    });
  });
  describe("#find()",function(){
    it("returns all records with match-all query",function(done){
      implementation.find().then(function(result){
        assert(Array.isArray(result), "Result is an array");
        assert.equal(2, result.length);
        done();
      }).catch(done);
    });
    it("returns an array with the found elements using query",function(done){
      var filter = {name: "An ice sculpture", price: 12.50};
      implementation.find(filter).then(function(result) {
        assert(Array.isArray(result), "Result is an array");
        assert.equal(1, result.length);
        assert.equal("An ice sculpture", result[0].name);
        done();
      }).catch(done);
    });
  });
  describe("#findOne(query)",function() {
    it("returns the found resource",function(done){
      implementation.findOne({price: 25.50}).then(function(result) {
        assert.isDefined(result);
        assert.equal("A blue mouse",result.name);
        done();
      }).catch(done);
    });
  });
  describe("#insert(data)",function() {
    it("returns created resource", function(done) {
      implementation.insert(sampleProduct).then(function(result) {
        assert.isDefined(result);
        assert.isDefined(result._id);
        assert.equal("TNT", result.name);
        assert.equal(42.99, result.price);
        done();
      }).catch(done);
    });
    it("should not be possible to create resources from invalid data",
    function(done) {
      implementation.insert(invalidSampleProduct).then(
        function(result) {
          assert.isUndefined(result);
          done();
        }, function(err) {
          assert.isDefined(err);
          assert.equal('422', err.message);
          done();
        }).catch(done);
    });
  });
  describe("#update(query, data)",function() {
    it("returns number of updated records", function(done) {
      implementation.find().then(function(result) {
        assert.isDefined(result);
        assert.equal(2, result.length);
        var selected = result[1];
        selected.name += " updated";
        return implementation.update({ _id: selected._id}, selected);
      }).then(function(result) {
        assert.isDefined(result);
        assert.equal(1, result);
        done();
      }).catch(done);
    });
    it("should not be possible to updated resource with invalid data",
    function(done) {
      implementation.find().then(function(result) {
        assert.isDefined(result);
        assert.equal(2, result.length);
        var selected = result[1];
        return implementation.update({_id: selected._id}, {name:"foo"});
      }).then(function(result) {
        assert.isUndefined(result);
        done();
      }, function(err) {
        assert.isDefined(err);
        assert.equal('422', err.message);
        done();
      }).catch(done);
    });
  });
  describe("#patch(query, patch)",function() {
    it("returns number of updated record", function(done) {
      var query = {name: "An ice sculpture"};
      implementation.findOne(query)
      .then(function(result) {
        assert.equal(query.name, result.name);
        var patch = {name: "An ice sculpture updated"};
        query = {_id: result._id};
        return implementation.patch(query, patch);
      })
      .then(function(result) {
        assert.isDefined(result);
        assert.equal(1, result);
        return implementation.findOne(query);
      })
      .then(function(result) {
        assert.equal("An ice sculpture updated", result.name);
        assert.equal(12.50,result.price);
        done();
      })
      .catch(done);
    });
    it("it should not be possible to patch invalid data", function(done) {
      implementation.find()
      .then(function(result) {
        var query = {
          _id: result[0]._id
        };
        var patch = {price: "foo"};
        return implementation.patch(query, patch);
      })
      .then(function(result) {
        assert.isUndefined(result);
        done();
      }, function(err) {
        assert.isDefined(err);
        assert.equal('422', err.message);
        done();
      })
      .catch(done);
    });
  });
  describe("#delete()",function() {
    it("returns number of deleted resources", function(done) {
      implementation.insert({name: "Rubber duck", price: 0.99}).then(
        function(result) {
          assert.isDefined(result);
          assert.isDefined(result._id);
          assert.equal("Rubber duck", result.name);
          assert.equal(0.99, result.price);
          return implementation.remove({_id: result._id});
        }).then(function(result) {
          assert.equal(1, result);
          done();
        }).catch(done);
    });
  });
});
