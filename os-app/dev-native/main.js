const { app, BrowserWindow,  globalShortcut} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

app.on('ready', function () {
  (function createWindow () {
    win = new BrowserWindow({
      width: 761,
      height: 880,

      x: 760,
      y: 0,
      center: false,

      minimizable: false,
      maximizable: false,
      resizable: false,
    })

    // win.webContents.session.clearStorageData();

    win.loadURL('https://ref.rosano.ca/panel/write');

    win.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    });

    // Open the DevTools.
    // win.webContents.openDevTools()
  }());

  globalShortcut.register('Control+Space', () => {
    // if (win === null) {
    //   return createWindow();
    // }
  
    if (win.isFocused()) {
      return win.hide();
    };

    win.show();
  });
});
