const information = document.querySelector('#info')
information.innerText = `Cette application utilise Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), et Electron (v${versions.electron()})`

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
});
  
func()