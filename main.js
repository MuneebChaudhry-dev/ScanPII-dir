const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { readdir, stat } = require("fs").promises;
const { join } = require("path");
var _ = require("underscore");

/*****************Electron Functions****************************/
const loadMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: "./preload.js",
    },
  });
  mainWindow.loadURL(`file://${__dirname}/dist/test/index.html`);
};
app.whenReady().then(loadMainWindow);
app.on("window-all-closed", () => {
  app.quit();
});
app.on("activate", () => {
  BrowserWindow.getAllWindows().length === 0 ? loadMainWindow() : "";
});

/****Specifying the Directory Path here******************/
var dirPath = path.join(__dirname, "../../../../../home/muneeb/Desktop/doc/");

/**Converting the paths into a tree**********************/
function arrangeIntoTree(paths) {
  var tree = [];

  // This example uses the underscore.js library.
  _.each(paths, function (path) {
    var pathParts = path.split("/");
    pathParts.shift(); // Remove first blank element from the parts array.

    var currentLevel = tree; // initialize currentLevel to root

    _.each(pathParts, function (part) {
      // check to see if the path already exists.
      var existingPath = _.findWhere(currentLevel, {
        name: part,
      });

      if (existingPath) {
        // The path to this item was already in the tree, so don't add it again.
        // Set the current level to this path's children
        currentLevel = existingPath.children;
      } else {
        var newPart = {
          name: part,
          children: [],
        };

        currentLevel.push(newPart);
        currentLevel = newPart.children;
      }
    });
  });
  // console.log(JSON.stringify(tree));
  function addUniqueID(arr, idstr = "") {
    arr.forEach((obj, i) => {
      obj.id = `${idstr}${obj.name}${i}`;
      if (obj.children) {
        addUniqueID(obj.children);
      }
    });
  }
  // console.log(JSON.stringify(tree, null, 2));
  addUniqueID(tree);
  console.log(JSON.stringify(tree, null, 2));
  // console.log(JSON.stringify(newobj, null, 2));
  return JSON.stringify(tree);
}
/***********Listing the Paths and  Returning in Tree************/
const dirs = async (path = dirPath) =>
  (await stat(path)).isDirectory()
    ? Promise.all((await readdir(path)).map((p) => dirs(join(path, p)))).then(
        (x) => [].concat(path, ...x)
      )
    : [path];

ipcMain.on("fetch", async (e, arg) => {
  dirs(dirPath).then((p) => {
    const dirTree = arrangeIntoTree(p);
    // console.log(dirTree);
    e.reply("publish", dirTree);
  });
});
