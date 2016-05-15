const assert = require('chai').assert;
const reqlib = require('app-root-path').require;
const JsonUtil = reqlib('/util/JsonUtil.js');

// example from http://json.org/example.html
var original = {
  menu: {
    header: "SVG Viewer",
    items: [
      {id: "Open"},
      {id: "OpenNew", label: "Open New"},
      null,
      {id: "ZoomIn", label: "Zoom In"},
      {id: "ZoomOut", label: "Zoom Out"},
      {id: "OriginalView", label: "Original View"},
      null,
      {id: "Quality"},
      {id: "Pause"},
      {id: "Mute"},
      null,
      {id: "Find", label: "Find..."},
      {id: "FindAgain", label: "Find Again"},
      {id: "Copy"},
      {id: "CopyAgain", label: "Copy Again"},
      {id: "CopySVG", label: "Copy SVG"},
      {id: "ViewSVG", label: "View SVG"},
      {id: "ViewSource", label: "View Source"},
      {id: "SaveAs", label: "Save As"},
      null,
      {id: "Help"},
      {id: "About", label: "About Adobe CVG Viewer..."}
    ]
  }};

describe('JSONUtil', function() {
  describe('#cloneObject(original)',function() {
    var clone = JsonUtil.cloneObject(original);
    it("Cloned object has the same properties as original", function() {
      assert.equal(original.menu.header, clone.menu.header);
      assert.equal(original.menu.items.length, clone.menu.items.length);
      assert.equal(original.menu.items[0].id, clone.menu.items[0].id);
      assert.isNull(original.menu.items[2]);
    });
    it('Cloned object is not equal to original', function() {
      clone.menu.header += " clone";
      assert.notEqual(original.menu.header, clone.menu.header);
    });
  });
});
