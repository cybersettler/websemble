/**
 * Used to extend parent classes.
 * @module util/ClassUtil
 */

module.exports = {
  extend: function(Parent, Child) {
    // subclass extends superclass
    Child.prototype = Object.create(Parent.prototype);

    Child.prototype.super = function(...args) {
      Parent.call(this, args); // call super constructor.
    };

    Child.prototype.constructor = Child;

    return Child;
  }
};
