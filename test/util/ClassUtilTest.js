/**
 * ClassUtil and test based on
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 */

const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const ClassUtil = reqlib('/util/ClassUtil.js');

describe('ClassUtil', function() {

  // Shape - superclass
  function Shape() {
    this.x = 0;
    this.y = 0;
  }

  // superclass method
  Shape.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
  };

  // Rectangle - subclass
  function Rectangle() {
    this.super(); // call super constructor.
  }

  describe('Child class Rectangle extends Shape', function () {
    var RectangleShape = ClassUtil.extend(Shape,Rectangle);
    var rectangle = new RectangleShape();
    it("is an instance of Rectangle", function(){
      assert.equal(true, rectangle instanceof Rectangle);
    });
    it("is an instance of Shape", function(){
      assert.equal(true, rectangle instanceof Shape);
    });
    it("has x and y attributes", function(){
      assert.strictEqual(0,rectangle.x);
      assert.strictEqual(0,rectangle.y);
    });
    it("has move method", function(){
      rectangle.move(1, 1);
      assert.strictEqual(1,rectangle.x);
      assert.strictEqual(1,rectangle.y);
      rectangle.move(41, 41);
      assert.strictEqual(42,rectangle.x);
      assert.strictEqual(42,rectangle.y);
    });
  });
});
