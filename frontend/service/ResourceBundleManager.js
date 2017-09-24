const i18next = require('i18next');
const Handlebars = require('handlebars');

/**
 * Manage resource boundles for tranlations.
 * @constructor
 * @param { Object } scope - Context scope.
 */
function ResourceBundleManager(scope) {
  this.scope = scope;
}

/**
 * Load resource boundle.
 * @param { string } locale - locale
 * @param { string } namespace - namespace
 * @return { Promise } A promise.
 */
ResourceBundleManager.prototype.loadResource = function(locale, namespace) {
  namespace = namespace || 'translation';
  var resourceUrl = 'i18n/' + namespace + '?locale=' + locale;
  var config = {
    lng: locale,
    resources: {}
  };
  config.resources[locale] = {};
  return this.scope.sendGetRequest(resourceUrl).then(function(result) {
    config.resources[locale][namespace] = result.body;
    i18next.init(config, (err, t) => {
      if (err) {
        throw new Error(err);
      }
      Handlebars.registerHelper('i18n', function(key, opt) {
        return t(key, opt);
      });
    });
  });
};

module.exports = ResourceBundleManager;
