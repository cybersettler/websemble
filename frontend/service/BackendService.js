/**
 * Backend service module.
 * @module frontend/service/BackendService
 */

const ipc = require("electron").ipcRenderer;

var requests = {};

ipc.on("response", function(e, response) {
  console.log("response received", e);
  var request = requests[response.requestRef];
  if (request) {
    console.log("original request", request);
    request.fulfill(response);
    delete requests[response.requestRef];
  }
});

module.exports = {
  navigate: function(ref) {
    console.log("Navigate", ref);
    return new Promise(function(fulfill, reject) {
      requests[ref] = {fulfill: fulfill, reject: reject};
      ipc.send("navigate", {ref: ref});
    });
  },
  get: function(ref) {
    return new Promise(function(fulfill, reject) {
      requests[ref] = {fulfill: fulfill, reject: reject};
      ipc.send("get", {ref: ref});
    });
  },
  post: function(ref, data) {
    ipc.send("post", {ref: ref, data: data});
  },
  put: function(ref, data) {
    ipc.send("put", {ref: ref, data: data});
  },
  patch: function(ref, data) {
    ipc.send("patch", {ref: ref, data: data});
  },
  delete: function(ref) {
    ipc.send("delete", {ref: ref});
  }
};
