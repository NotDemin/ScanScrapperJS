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

  const options = {
    headers: {
        'User-Agent': 'some app v1.3 (example@gmail.com)',
    }
  };

  https.get(link, options, (res) => {
    let rawHtml = '';
    res.on('data', (chunk) => { rawHtml += chunk; });
    res.on('end', () => {
        try {
            console.log(rawHtml);
        } 
        catch (e) {
            console.error(e.message);
        }
    });
  });
}

//HTMLScrapSushi('https://sushiscan.su/dandadan-chapitre-63/')

function downloadImage(url, filepath) {    
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
          if(res.statusCode === 200){
              res.pipe(fs.createWriteStream(filepath))
                  .on('error', reject)
                  .once('close', () => resolve(filepath));
          } 
          else{
              // Consume response data to free up memory
              res.resume();
              reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
              return "Ton manga n'existe pas"
          }
      });
    });
}

ipcMain.handle('scraplink', (event, link) => {
  console.log(link)
  if(link.substring(0,8).match("https://") || link.substring(0,8).match("sushisca")){
      return "Manga Valide"
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