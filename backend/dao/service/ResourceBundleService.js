const path = require("path");
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
// const appRoot = require('app-root-path');
var fs;
var basePath;

module.exports = {
  init: function(config) {
    if (config && config.i18n) {
      const store = memFs.create();
      fs = editor.create(store);
      basePath = config.i18n;
    }
  },
  getResource: function(locale, bundle) {
    bundle = bundle || 'translation';
    var resourcePath = path.join(basePath, locale, bundle + '.json');
    if (fs.exists(resourcePath)) {
      return Promise.resolve(fs.readJSON(resourcePath));
    }
    throw new Error("File " + resourcePath + " does not exist.");
  }
};
