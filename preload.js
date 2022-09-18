const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'electron',
    {
        SendLinkScrap: (channel, link) => ipcRenderer.invoke("scraplinksushiscan", link)
    }
  )