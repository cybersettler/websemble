/**
 * Searches for matches for a condition in a collection
 * of resources.
 * @constructor
 * @param {Object} condition - Filter.
 */
function Matcher(condition) {
  var matcherInstance = this;
  this.attr = getAttribute(condition);
  var operators = {
    /*
    $elemMatch: function(item) {
      // TODO: implement element match
    } */
  };

  this.operation = getOperator();
  if (this.operation) {
    this.match = operators[this.operation];
  } else {
    this.match = defaultMatcher;
  }

  /**
   * @private {function}
   * @return {*} Operator.
   */
  function getOperator() {
    var matchValue = matcherInstance[matcherInstance.attr];
    if (matchValue instanceof Object) {
      var matchProp = getAttribute(matchValue);
      if (/[$]/.test(matchProp)) {
        return matchProp;
      }
    }
  }

  /**
   * @private {function}
   * @param {Object} condition - Filter.
   * @return {string} Attribute name.
   */
  function getAttribute(condition) {
    return Object.getOwnPropertyNames(condition)[0];
  }

  /**
   * @private {function}
   * @param {Object} item - Query item.
   * @return {boolean} If there is a match.
   */
  function defaultMatcher(item) {
    var matchValue = condition[matcherInstance.attr];
    if (!(matchValue instanceof Object) && !(item[matcherInstance.attr] instanceof Object)) {
      return matchValue === item[matcherInstance.attr];
    }

    if (!(matchValue instanceof Object) && item[matcherInstance.attr] instanceof Array) {
      return item[matcherInstance.attr].some(function(value) {
        return !(value instanceof Object) && matchValue === value;
      });
    }

    return false;
  }
}

module.exports = Matcher;
