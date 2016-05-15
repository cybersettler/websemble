/**
 * String utils.
 * @module util/StringUtil
 */

module.exports = {
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  camelCase: function(string) {
    var pascaled = this.pascalCase(string);
    return pascaled.charAt(0).toLowerCase() + pascaled.slice(1);
  },
  pascalCase: function(string) {
    var util = this;
    return /([A-Za-z]+)/g.exec(string).reduce(parse);
    function parse(prev, current, index) {
      if (index === 1) {
        return util.capitalize(current);
      }
      if (index > 1) {
        return prev + util.capitalize(current);
      }
    }
  }
};