/**
 * Searches for matches for a condition in a collection
 * of resources.
 * @constructor
 * @param {Object} condition - Filter.
 */
function Matcher(condition) {
  this.queryFields = Object.getOwnPropertyNames(condition);
  this.match = function(item) {
    var result = true;
    this.queryFields.some(checkFieldMatch);
    function checkFieldMatch(key) {
      if (typeof item[key] === "undefined" ||
      condition[key] != item[key]) { // eslint-disable-line eqeqeq
        result = false;
        return true;
      }
    }
    return result;
  };
}

module.exports = Matcher;
