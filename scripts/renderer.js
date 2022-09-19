const setButton = document.querySelector('#btn')
const linkInput = document.querySelector('#link')
const response = document.querySelector('#response')
setButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let nodeimg = document.createElement('li')
    let link = linkInput.value
    let responseText = await window.electron.SendLinkScrap("scraplinksushiscan", link)
    responseText.forEach(image => {
        let imagenode = new Image(400, 400);
        imagenode.src = image;
        nodeimg.appendChild(imagenode);
        response.appendChild(nodeimg)
    })
});
