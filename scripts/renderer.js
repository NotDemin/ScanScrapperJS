let { ipcRenderer } = require("electron")

const setButton = document.querySelector('#btn')
const linkInput = document.querySelector('#link')
const response = document.querySelector('#response')
setButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let link = linkInput.value
    console.log(link)
    let responseText = await ipcRenderer.invoke("scraplink", link)
    response.innerText = responseText
});
