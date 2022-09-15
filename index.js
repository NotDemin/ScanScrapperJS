const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  win.loadFile('views/index.html');
};

ipcMain.handle('scraplink', (event, link) => {
  if(link.substring(0,8).match("https://") || link.substring(0,8).match("sushisca")){
    if(link.match(`https://sushiscan.su/${link.substring(21)}`)) return "lien valide"
    if(link.match(`sushiscan.su/${link.substring(13)}`)) return "lien valide"
  }
  return "lien non valide"
})


app.whenReady().then(() => {
    createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});