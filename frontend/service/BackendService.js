/**
 * Backend service module.
 * @module frontend/service/BackendService
 */

const ipc = require("electron").ipcRenderer;
const shortid = require('shortid');

var requests = {};

ipc.on("response", function(e, response) {
  var request = requests[response.request.token];
  if (request) {
    request.fulfill(response);
    delete requests[response.request.token];
  }
});

module.exports = {
  navigate: function(ref) {
    return new Promise(function(fulfill, reject) {
      var token = shortid.generate();
      requests[token] = {fulfill: fulfill, reject: reject};
      ipc.send("navigate", {ref: ref, token: token});
    });
  },
  get: function(ref) {
    return new Promise(function(fulfill, reject) {
      var token = shortid.generate();
      requests[token] = {fulfill: fulfill, reject: reject};
      ipc.send("get", {ref: ref, token: token});
    });
  },
  post: function(ref, data) {
    return new Promise(function(fulfill, reject) {
      var token = shortid.generate();
      requests[token] = {fulfill: fulfill, reject: reject};
      ipc.send("post", {ref: ref, data: data, token: token});
    });
  },
  put: function(ref, data) {
    return new Promise(function(fulfill, reject) {
      var token = shortid.generate();
      requests[token] = {fulfill: fulfill, reject: reject};
      ipc.send("put", {ref: ref, data: data, token: token});
    });
  },
  patch: function(ref, data) {
    return new Promise(function(fulfill, reject) {
      var token = shortid.generate();
      requests[token] = {fulfill: fulfill, reject: reject};
      ipc.send("patch", {ref: ref, data: data, token: token});
    });
  },
  delete: function(ref) {
    return new Promise(function(fulfill, reject) {
      var token = shortid.generate();
      requests[token] = {fulfill: fulfill, reject: reject};
      ipc.send("delete", {ref: ref, token: token});
    });
  }
};
