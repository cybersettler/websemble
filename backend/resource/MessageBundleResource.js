const path = require("path");
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const AbstractResource = require('./AbstractResource.js');

class MessageBundleResource extends AbstractResource {
  constructor(name, config) {
    super(name, config);
    let store = memFs.create();
    this.fs = editor.create(store);
    this.basePath = config.directory;
  }

  get(request) {
    let resource = request.resource.documentId;
    let locale = request.query.locale;
    return this.getResource(locale, resource);
  }

  getResource(locale, bundle) {
    bundle = bundle || 'translation';
    var resourcePath = path.join(this.basePath, locale, bundle + '.json');
    if (this.fs.exists(resourcePath)) {
      return Promise.resolve(this.fs.readJSON(resourcePath));
    }
    throw new Error("File " + resourcePath + " does not exist.");
  }
}

module.exports = MessageBundleResource;
