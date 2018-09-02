const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const path = require('path');
const appRoot = require('app-root-path');
const RESTService = require('./backend/service/RESTService.js');
const RESTResponse = require('./backend/service/RESTResponse');
const BackendConfig = path.join(appRoot.toString(), 'backend/config.js');
const fs = require('fs');
const express = require('express');

var instance;

/**
 * Entry point of the Electron application.
 * @param {object} config - Configuration object
 */
function ElectronApp(config) {
  const ipc = electron.ipcMain;

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the javascript object is GCed.
  var mainWindow = null;

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // Inititalize persistence layer
  fs.exists(BackendConfig, function(result) {
    if (result) {
      RESTService.init(require(BackendConfig));
    } else {
      RESTService.init();
    }
  });

  var onReady = new Promise(function(fulfill) {
    app.on('ready', fulfill);
  });

  this.onReady = onReady;

  // This method will be called when Electron has done everything
  // initialization and ready for creating browser windows.
  onReady.then(function() {
    // Create the browser window.
    mainWindow = new BrowserWindow(config);
    instance.mainWindow = mainWindow;
    // Start local server
    const expressApp = express();
    // This is for js modules that do not
    // use file extension in module import statements
    // like i18next
    expressApp.use(function(req, res, next) {
      if (req.path.indexOf('.') === -1) {
        var file = app.getAppPath() + req.path + '.js';
        fs.exists(file, function(exists) {
          if (exists) {
            req.url += '.js';
          }
          next();
        });
      } else {
        next();
      }
    });
    expressApp.use(express.static(app.getAppPath()));
    var port;
    var listener = expressApp.listen(0, () => {
      port = listener.address().port;
      console.log(`Server listening on port ${port}!`, app.getAppPath());
      // and load the index.html of the app.
      mainWindow.loadURL(`http://localhost:${port}/`);
      // Open the devtools.
      mainWindow.openDevTools();
    });

    ipc.on('reloadView', function(e, args) {
      console.log(args.viewId);
      if (args.viewId === 'index') {
        mainWindow.reload();
      }
    });

    ipc.on('toggleDevTools', function(e, args) {
      if (args.viewId === 'index') {
        mainWindow.toggleDevTools();
      }
    });

    ipc.on("get", function(e, args) {
      RESTService.handleGet(args.ref).then(
        function(result) {
          result.request.token = args.token;
          e.sender.send('response', result);
        },
        function(err) {
          var response = new RESTResponse(args.ref, "GET", err);
          response.request.token = args.token;
          response.status = "500";
          e.sender.send('response', response);
        });
    });

    ipc.on("post", function(e, args) {
      RESTService.handlePost(args.ref, args.data).then(
        function(result) {
          result.request.token = args.token;
          e.sender.send('response', result);
        },
        function(err) {
          var response = new RESTResponse(args.ref, "POST", err);
          response.request.token = args.token;
          response.status = "500";
          e.sender.send('response', response);
        });
    });

    ipc.on("put", function(e, args) {
      RESTService.handlePut(args.ref, args.data).then(
        function(result) {
          result.request.token = args.token;
          e.sender.send('response', result);
        },
        function(err) {
          var response = new RESTResponse(args.ref, "PUT", err);
          response.request.token = args.token;
          response.status = "500";
          e.sender.send('response', response);
        });
    });

    ipc.on("patch", function(e, args) {
      RESTService.handlePatch(args.ref, args.data).then(
        function(result) {
          result.request.token = args.token;
          e.sender.send('response', result);
        },
        function(err) {
          var response = new RESTResponse(args.ref, "PATCH", err);
          response.request.token = args.token;
          response.status = "500";
          e.sender.send('response', response);
        });
    });

    ipc.on("delete", function(e, args) {
      RESTService.handleDelete(args.ref).then(
        function(result) {
          result.request.token = args.token;
          e.sender.send('response', result);
        },
        function(err) {
          var response = new RESTResponse(args.ref, "DELETE", err);
          response.request.token = args.token;
          response.status = "500";
          e.sender.send('response', response);
        });
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      console.log(`closing server listening on port ${port}`);
      mainWindow = null;
      listener.close();
    });
  });
}

module.exports = {
  getInstance: function(config) {
    if (!instance && config) {
      instance = new ElectronApp(config);
    } else if (!instance && !config) {
      throw new Error(
        'Configuration missing trying to instantiate Electron App');
    }
    return instance;
  }
};
