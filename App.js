const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const appRoot = require('app-root-path');
const RESTService = require('./backend/service/RESTService.js');
const RESTResponse = require('./backend/service/RESTResponse');

/**
 * Entry point of the Electron application.
 */
function App() {
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

  // This method will be called when Electron has done everything
  // initialization and ready for creating browser windows.
  app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      model: {data: 'some data'}
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + appRoot + '/index.html');

    // Open the devtools.
    mainWindow.openDevTools();

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
      RESTService.get(args.url).then(
        function(result) {
          e.sender.send('response', result);
        },
        function(err) {
          var response = new RESTResponse(args.url, "GET", err);
          response.status = "500";
          e.sender.send('response', response);
        });
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  });
}

module.exports = App;
