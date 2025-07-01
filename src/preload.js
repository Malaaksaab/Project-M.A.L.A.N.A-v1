const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Window controls
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  maximizeWindow: () => ipcRenderer.send("maximize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),

  // Permission requests
  requestMicrophone: () => {
    return new Promise((resolve) => {
      ipcRenderer.send("request-microphone");
      ipcRenderer.once("microphone-permission-result", (_, granted) => {
        resolve(granted);
      });
    });
  },

  requestFileSystem: () => {
    return new Promise((resolve) => {
      ipcRenderer.send("request-filesystem");
      ipcRenderer.once("filesystem-permission-result", (_, granted) => {
        resolve(granted);
      });
    });
  },

  requestLocation: () => {
    return new Promise((resolve) => {
      ipcRenderer.send("request-location");
      ipcRenderer.once("location-permission-result", (_, granted) => {
        resolve(granted);
      });
    });
  },
});
