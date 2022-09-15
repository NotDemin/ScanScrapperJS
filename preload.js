const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  setTitle: (title) => ipcRenderer.send('set-title', title)
  // we can also expose variables, not just functions
})