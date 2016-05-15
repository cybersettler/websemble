const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const StringUtil = reqlib('/util/StringUtil.js');

describe('StringUtil', function() {
  describe('#capitalize(string)', function () {
    it('should return first letter capitalized', function () {
      var string = "quixote";
      var capitalized = StringUtil.capitalize(string);
      assert.strictEqual("Quixote", capitalized);
      assert.notStrictEqual(string, capitalized);
    });
  });
  describe('#camelCase(string)', function(){
    it("should return space separated words as camelCase", function(){
      var string = "three blind mice";
      assert.strictEqual("threeBlindMice", StringUtil.camelCase(string));
    });
    it("should return underscore separated words as camelCase", function(){
      var string = "three_blind_mice";
      assert.strictEqual("threeBlindMice", StringUtil.camelCase(string));
    });
    it("should return minus separated words as camelCase", function(){
      var string = "three-blind-mice";
      assert.strictEqual("threeBlindMice", StringUtil.camelCase(string));
    });
    it("should return dash separated words as camelCase", function(){
      var string = "three–blind–mice";
      assert.strictEqual("threeBlindMice", StringUtil.camelCase(string));
    });
  });
  describe('#pascalCase(string)', function(){
    it("should return space separated words as PascalCase", function(){
      var string = "don quixote";
      assert.strictEqual("DonQuixote", StringUtil.pascalCase(string));
    });
  });
});
