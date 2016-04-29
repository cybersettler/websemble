const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const Storage = require("./backend/util/Storage.js");
const Request = require("./backend/util/UIRequest.js");
const Response = require("./backend/util/UIResponse.js");
const Router = require("./backend/util/UIRouter.js");

function App(){

  // Report crashes to our server.
  // electron.crashReporter.start();

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
      model:{ data:'some data' }
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');


    // Open the devtools.
    mainWindow.openDevTools();

    ipc.on('reloadView',function( e, args ){
      console.log(args.viewId);
      if(args.viewId == 'index' ){
        mainWindow.reload();
      }
    });

    ipc.on('toggleDevTools',function( e, args ){
      if(args.viewId == 'index' ){
        mainWindow.toggleDevTools();
      }
    });

    ipc.on("navigate",function( e,args){
      var request = new Request( e.sender, args );
      var response = new Response( request );
      return Router.handleRequest( request ).done(
        function( result ){
          response.send( result );
        },
        function( err ){
          console.log( "An error ocurred", err );
        }
      );
    });

    ipc.on( "get",function( e, args ){
      Storage.get( request ).done(
        response.send,
        response.returnError
      );
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
