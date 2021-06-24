const ytxr = require('./ytxr-lib')
const getRSSFeed = ytxr.getRSSFeed
const InvalidURLError = ytxr.InvalidURLError
const UnsupportedURLError = ytxr.UnsupportedURLError

describe('ytxr.getRSSFeed ', () => {
    test('only works on YouTube domains (m.youtube.com, youtube.com, youtu.be and www.youtube.com)', () => {
        const validURLs = ['https://m.youtube.com', 'https://www.youtube.com', 'https://youtube.com', 'https://youtu.be']
        const invalidURL = 'https://youtube.invalid'
        expect(() => getRSSFeed(invalidURL)).toThrowError(InvalidURLError)
    
        for (const url of validURLs) {
            expect(() => getRSSFeed(url)).not.toThrowError(InvalidURLError)
        }
    })
    
    test('works for playlist URLs', () => {
        const playlistURL = 'https://www.youtube.com/playlist?list=PLaSAJFZNxXNG2HpJxD62eIHnYbyn1lsp_'
        const expectedURL = 'https://www.youtube.com/feeds/videos.xml?playlist_id=PLaSAJFZNxXNG2HpJxD62eIHnYbyn1lsp_'
        expect(getRSSFeed(playlistURL)).toBe(expectedURL)
    })
    
    test('works for user URLs', () => {
        const userURL = 'https://m.youtube.com/user/LinusTechTips'
        const expectedURL = 'https://www.youtube.com/feeds/videos.xml?user=LinusTechTips'
        expect(getRSSFeed(userURL)).toBe(expectedURL)
    })
    
    test('works for channel URLs', () => {
        const userURL = 'https://www.youtube.com/channel/UCxFWzKZa74SyAqpJyVlG5Ew'
        const expectedURL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxFWzKZa74SyAqpJyVlG5Ew'
        expect(getRSSFeed(userURL)).toBe(expectedURL)
    })

    test('throws error for unsupported domains', () => {
        const unsupportedURL = 'https://youtube.com/c/alispitteldev'
        expect(() => getRSSFeed(unsupportedURL)).toThrowError(UnsupportedURLError)
    })
})
