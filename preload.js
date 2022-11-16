const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", { ipcRenderer }); //exposing ipcRenderer to the window in renderer process
