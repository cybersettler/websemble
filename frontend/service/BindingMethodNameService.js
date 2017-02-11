/**
 * Element parent binding meant to be used in a child component.
 * @module frontend/service/BindingMethodNameService
 */

 /* eslint-env browser */

const StringUtil = require('../../util/StringUtil.js');

module.exports = {
  getBindingMethodNames: function(attributeName) {
    var name = StringUtil.capitalize(attributeName);
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
