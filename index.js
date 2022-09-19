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

  if(link.substring(0,8).match("sushisca")){
    link = `https://${link}`
  }

  return new Promise((resolve, reject) => {

    const options = {
      headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
      }
    };

    https.get(link, options, res => {
      let rawHtml = '';
      if(res.statusCode == "404"){
        rawHtml = false
        resolve(rawHtml)
      }
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

ipcMain.handle('scraplinksushiscan', async (event, link) => {
  if(link === "") return "Met un lien stp"
  if(!link.includes('sushiscan.su')) return "T'essaye d'acceder au mauvais site"
  if(link.substring(0,8).match("https://") || link.substring(0,8).match("sushisca")){
      let HTML = await HTMLScrapSushi(link)
      //console.log(HTML)
      if(HTML === false) return "Manga non valide (404)"
      let linkChap1
      if(link.slice(-1) !== "/"){
        linkChap1 = `${link}-chapitre-1`
      }
      else if(link.slice(-1) === "/"){
        link = link.slice(0, -1)
        linkChap1 = `${link}-chapitre-1`
      }
      return linkChap1
  }
  return "Lien non valide"
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