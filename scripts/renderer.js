const setButton = document.querySelector('#btn')
const linkInput = document.querySelector('#link')
const response = document.querySelector('#response')
setButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let link = linkInput.value
    console.log(link)
    let responseText = await window.electron.SendLinkScrap("scraplinksushiscan", link)
    response.innerText = responseText
});
