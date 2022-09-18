const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  })
  win.loadFile('views/index.html');
};

function HTMLScrapSushi(link){

  return new Promise((resolve, reject) => {

    const options = {
      headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
      }
    };

    https.get(link, options, res => {
      let rawHtml = '';
      res.on('data', (chunk) => { rawHtml += chunk; });
      res.on('end', () => {
          try {
              //console.log("sa a marcher");
              resolve(rawHtml)
          } 
          catch (e) {
              reject(e.message)
          }
      });
    });
  })
}

ipcMain.handle('scraplink', async (event, link) => {
  if(link.substring(0,8).match("https://") || link.substring(0,8).match("sushisca")){
      let HTML = await HTMLScrapSushi(link)
      //console.log(HTML)
      if(HTML.includes(`<img src="https://sushiscan.su/wp-content/themes/sushiscan/assets/images/404.png" />`)) return "Manga non valide"
      return "Manga valide"
  }
  return "Manga non valide"
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