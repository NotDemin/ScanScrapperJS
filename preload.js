const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'electron',
    {
        invoke: (channel, link) => ipcRenderer.invoke("scraplink", link)
    }
  )