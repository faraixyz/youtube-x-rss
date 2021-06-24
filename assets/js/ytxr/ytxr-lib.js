URL = URL || require('url').URL

const InvalidURLError = Error('URLs must be on one of these domains: m.youtube.com, youtube.com, youtu.be or www.youtube.com')
InvalidURLError.name = 'InvalidURLError'
const UnsupportedURLError = Error('That URL is not supported yet')
UnsupportedURLError.name = 'UnsupportedURLError'

/**
 * Generates the RSS feed for a given URL
 * @param {string | URL | Location} url - A URL for a YouTube channel or playlist
 * @returns {string} - The RSS feed URL
 * @throws {InvalidURLError, UnsupportedURLError}
 */
function getRSSFeed (url) {
    const BASE_YT_RSS_FEED_URL = 'https://www.youtube.com/feeds/videos.xml?'
    const VALID_HOST_NAMES = ['m.youtube.com', 'www.youtube.com', 'youtube.com', 'youtu.be']
    const urlObj = new URL(url)

    if (VALID_HOST_NAMES.indexOf(urlObj.hostname) === -1) {
        throw InvalidURLError
    }

    if (urlObj.searchParams.get('list')) {
        return BASE_YT_RSS_FEED_URL + 'playlist_id=' + urlObj.searchParams.get('list')
    }

    const splitPath = urlObj.pathname.split('/')
    const type = splitPath[1]
    const id = splitPath[2]
    switch (type) {
        case 'user':
            return BASE_YT_RSS_FEED_URL + 'user=' + id;
        case 'channel':
            return BASE_YT_RSS_FEED_URL + 'channel_id=' + id;
        default:
            throw UnsupportedURLError
    }
}

module.exports = {
    InvalidURLError,
    UnsupportedURLError,
    getRSSFeed
}
