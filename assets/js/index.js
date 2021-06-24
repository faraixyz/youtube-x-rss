import * as YTXR from './ytxr/ytxr-lib.js';

const rssForm = document.forms['rssForm']
const urlInput = rssForm.url
const outputArea = document.getElementById('output')
const outputURLArea = document.getElementById('output__url')
const outputLink = document.getElementById('output__link')
const outputCopy = document.getElementById('output__copy')
const outputShare = document.getElementById('output__share')
const outputStatus = document.getElementById('output__status')

if ("share" in navigator) {
    outputShare.hidden = false
}

urlInput.addEventListener('change', function() {
    urlInput.setCustomValidity('')
    urlInput.checkValidity()
})

urlInput.addEventListener('invalid', function() {
    urlInput.setCustomValidity(YTXR.InvalidURLError.message)
})

rssForm.addEventListener('submit', function(event) {
    event.preventDefault()
    try {
        const url = urlInput.value;
        const rssFeedURL = YTXR.getRSSFeed(url)
        showFeedURL(rssFeedURL)
        urlInput.setCustomValidity('')
    } catch (error) {
        console.error(error)
        urlInput.setCustomValidity(error.message)
        urlInput.reportValidity()
    }
})

function showFeedURL (url) {
    outputArea.hidden = false
    outputURLArea.value = url
    outputLink.href = url
}

function flashMsg (msg) {
    outputStatus.innerText = msg
    setTimeout(function() {
        outputStatus.innerText = ''
    }, 5000)
}

outputCopy.addEventListener('click', function(e) {
    outputURLArea.select()
    document.execCommand('copy')
    flashMsg('URL Copied')
    outputURLArea.setSelectionRange(0,0)
})

outputShare.addEventListener('click', async function() {
    try {
        await navigator.share({
            url: outputURLArea.value,
        })
        flashMsg('URL shared')
    } catch (e) {
        console.error(e)
        flashMsg('Something went wrong.')
    }
})