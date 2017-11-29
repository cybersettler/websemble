const Handlebars = require("handlebars");

function TemplateEngine() {
    this.hb = Handlebars;
}

TemplateEngine.prototype.render = function(template, data) {
    var doRender = this.hb.compile(template);
    return doRender(data);
};

TemplateEngine.prototype.compile = function(template) {
    return this.hb.compile(template);
};

TemplateEngine.prototype.registerHelper = function(name, f) {
    this.hb.registerHelper(name, f);
};

var instance;

module.exports = {
    getInstance: function() {
        if (!instance) {
            instance = new TemplateEngine();
        }
        return instance;
    }
};