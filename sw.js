self.addEventListener('install', function(event){
    console.log('Service worker installed event!');
    const cacheName = 'static-shell-v1';
    const resourcesToCache = [
        '/',
        'index.html',
        'styles/style.css',
        'scripts/app.js',
        'assets/airplane.png'
    ];

    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll(resourcesToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request) || 
            fetch(event.request)
    );
});