/**
 * Element parent binding meant to be used in a child component.
 * @module frontend/service/BindingMethodNameService
 */

 /* eslint-env browser */

const StringUtil = require('../../util/StringUtil.js');
const customMethodPattern = /^{\w+}$/;

module.exports = {
  getBindingMethodNames: function(attributeName, value) {
    var root = customMethodPattern.test(value) ?
        customMethodPattern.exec(value)[1] : attributeName;
    var name = StringUtil.capitalize(root);
    return {
      getterName: 'get' + name,
      setterName: 'set' + name,
      creatorName: 'create' + name,
      updaterName: 'update' + name,
      removerName: 'remove' + name,
      onName: 'on' + name
    };
  }
};
