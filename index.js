const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  })
  win.loadFile('views/index.html');
};

function CheckVolume1(link){
  //console.log("Checking for volume 1")
  let linkVol1
  if(link.slice(-1) !== "/"){
    linkVol1 = `${link}-volume-1/`
  }
  else if(link.slice(-1) === "/"){
    link = link.slice(0, -1)
    linkVol1 = `${link}-volume-1/`
  }
  return new Promise((resolve, reject) => {

    const options = {
      headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
      }
    };

    https.get(linkVol1, options, res => {
      let rawHtml = '';
      if(res.statusCode == "404"){
        //console.log("Volume 1 not found")
        resolve(false)
      }
      res.on('data', (chunk) => { rawHtml += chunk; });
      res.on('end', () => {
        try {
          //console.log("Volume 1 found")
          resolve(true)
        } 
        catch (e) {
          reject(e.message)
        }
      });
    });
  })
}

function CheckChapitre1(link){
  //console.log("Checking for chapter 1")
  let linkChap1
  if(link.slice(-1) !== "/"){
    linkChap1 = `${link}-chapitre-1/`
  }
  else if(link.slice(-1) === "/"){
    link = link.slice(0, -1)
    linkChap1 = `${link}-chapitre-1/`
  }
  return new Promise((resolve, reject) => {

    const options = {
      headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
      }
    };

    https.get(linkChap1, options, res => {
      let rawHtml = '';
      if(res.statusCode == "404"){
        //console.log("No chapter 1 found")
        resolve(false)
      }
      res.on('data', (chunk) => { rawHtml += chunk; });
      res.on('end', () => {
        try {
          //console.log("Chapter 1 found")
          resolve(true)
        } 
        catch (e) {
          reject(e.message)
        }
      });
    });
  })
}

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
            resolve(rawHtml)
        } 
        catch (e) {
            reject(e.message)
        }
      });
    });
  })
}

function GenerateLinkVolumeSushi(link){
  if(link.slice(-1) !== "/"){
    linkVol = `${link}-volume-1/`
  }
  else if(link.slice(-1) === "/"){
    link = link.slice(0, -1)
    linkVol = `${link}-volume-1/`
  }
  return linkVol
}

function GenerateLinkChapitreSushi(link){
  if(link.slice(-1) !== "/"){
    linkChap = `${link}-chapitre-1/`
  }
  else if(link.slice(-1) === "/"){
    link = link.slice(0, -1)
    linkChap = `${link}-chapitre-1/`
  }
  return linkChap
}


ipcMain.handle('scraplinksushiscan', async (event, link) => {
  if(link === "") return "Met un lien stp"
  if(!link.includes('sushiscan.su')) return "T'essaye d'acceder au mauvais site"
  if(link.includes('manga/')) link = link.replace('manga/', '')
  if(link.substring(0,8).match("https://") || link.substring(0,8).match("sushisca")){

      let HTML = await HTMLScrapSushi(link)

      if(HTML === false) return "Manga non valide (404)"

      let script
      let linkFirst
      let Vol1 = await CheckVolume1(link)
      let Chap1 = false
      if(Vol1 === false){
        Chap1 = await CheckChapitre1(link)
      }

      if(Vol1 === true){
        linkFirst = GenerateLinkVolumeSushi(link)
        script = await HTMLScrapSushi(linkFirst)
      }
      if(Chap1 === true){
        linkFirst = GenerateLinkChapitreSushi(link)
        script = await HTMLScrapSushi(linkFirst)
      }

      let scriptCropped = script.slice(script.indexOf("ts_reader.run") + "ts_reader.run".length + 1, script.indexOf(`"unlock_token":null}`) + `"unlock_token":null}`.length)
      let Images = JSON.parse(scriptCropped).sources[0].images
      //Images.forEach(image => image = image + '\n')
      return Images
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