const APP_PREFIX = 'Budget Tracker-'
const VERSION = 'version_2.0'
const CACHE_NAME = APP_PREFIX + VERSION
const FILES_TO_CACHE = [
    './index.html',
    './js/index.js',
    './css/styles.css'
]


self.addEventListener('fetch', function (e){
    e.respondWith(
        caches.match(e.request).then(function(request){
            // if (request){
            //     return request
            // }else{
            //     return fetch(e.request)
            // }
            return request || fetch(e.request)
        })
    )
})


//occurs before the window object is created
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES_TO_CACHE)
        })
    )


})

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let keepCache = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })

            keepCache.push(CACHE_NAME)

            return Promise.all(
                keyList.map(function (key, i) {
                    if (keepCache.indexOf(key) === -1) {
                        return caches.delete(keyList[i])
                    }
                })
            )
        })
    )
})

