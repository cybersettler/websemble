class AbstractResource {
  constructor(name, config) {
    this.type = config.type;
    this.path = config.path;
    this.name = name;
    this.pattern = new RegExp('^' + config.path);
  }

  get() {
    throw new Error('Get method not implemented for ' + this.name);
  }

  post() {
    throw new Error('Post method not implemented for ' + this.name);
  }

  put() {
    throw new Error('Put method not implemented for ' + this.name);
  }

  delete() {
    throw new Error('Delete method not implemented for ' + this.name);
  }

  patch() {
    throw new Error('Patch method not implemented for ' + this.name);
  }

  matchesUri(uri) {
    return this.pattern.test(uri);
  }
}

module.exports = AbstractResource;
