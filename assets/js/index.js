import * as YTXR from './ytxr/ytxr-lib.js';

const rssForm = document.forms['rssForm']
const urlInput = rssForm.url
const outputArea = document.querySelector('.feed-output')
const outputURLArea = document.getElementById('feed-output__area')
const outputLink = document.getElementById('feed-output__link')
const outputCopy = document.querySelector('button[data-copy]')
const outputShare = document.querySelector('button[data-share]')
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
        outputCopy.focus()
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
        outputStatus.innerHTML = '&nbsp;'
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