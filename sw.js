const CACHE_VERSION = '4.2.320';
const CURRENT_CACHE = `main-${CACHE_VERSION}`;

// prettier-ignore
// these are the routes we are going to cache for offline support
const cacheFiles = [
  './',
  'audio/levelup.mp3',
  'audio/phft4.mp3',
  'audio/phts.mp3',
  'audio/sadsound.mp3',
  'audio/themesong.m4a',
  'audio/triumph.mp3',
  'fonts/Abel-Regular.ttf',
  'fonts/Bangers-Regular.ttf',
  'helpers/console-enhancer.js',
  'helpers/howler-min.js',
  'helpers/seedrandom.js',
  'helpers/vue.min.js',
  'images/burst.svg',
  'images/icon_download.svg',
  'images/icon_eye.svg',
  'images/icon_gem.svg',
  'images/icon_info.svg',
  'images/icon_inner_spinner.svg',
  'images/icon_play.svg',
  'images/icon_rank0.svg',
  'images/icon_rank1.svg',
  'images/icon_rank2.svg',
  'images/icon_rank3.svg',
  'images/icon_rank4.svg',
  'images/icon_rank5.svg',
  'images/icon_rank6.svg',
  'images/icon_rank0_sm.svg',
  'images/icon_rank1_sm.svg',
  'images/icon_rank2_sm.svg',
  'images/icon_rank3_sm.svg',
  'images/icon_rank4_sm.svg',
  'images/icon_rank5_sm.svg',
  'images/icon_rank6_sm.svg',
  'images/icon_rank0_hc.svg',
  'images/icon_rank1_hc.svg',
  'images/icon_rank2_hc.svg',
  'images/icon_rank3_hc.svg',
  'images/icon_rank4_hc.svg',
  'images/icon_rank5_hc.svg',
  'images/icon_rank6_hc.svg',
  'images/icon_rank0_hc_sm.svg',
  'images/icon_rank1_hc_sm.svg',
  'images/icon_rank2_hc_sm.svg',
  'images/icon_rank3_hc_sm.svg',
  'images/icon_rank4_hc_sm.svg',
  'images/icon_rank5_hc_sm.svg',
  'images/icon_rank6_hc_sm.svg',
  'images/icon_share.svg',
  'images/icon_zen.svg',
  'images/CatCircle.svg',
  'images/CatHexagon.svg',
  'images/CatSquare.svg',
  'images/CatTriangle.svg',
  'images/Circle.svg',
  'images/Dots.svg',
  'images/Hexagon.svg',
  'images/Square.svg',
  'images/Triangle.svg',
  'models/models.js',
  'models/models-min.js',
  'scripts/likeme.js',
  'scripts/likeme-min.js',
  'styles/altpattern1.css',
  'styles/cats-likeme-darkmode.css',
  'styles/cats-likeme.css',
  'styles/likeme-darkmode.css',
  'styles/likeme.css',
  'index.html',
];

// on activation we clean up the previously registered service workers
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CURRENT_CACHE) {
            return caches.delete(cacheName);
          }
          // Return a resolved promise to ensure all caches are checked
          return Promise.resolve();
        }),
      );
    }),
  );
  evt.waitUntil(clients.claim());
});

// on install we download the routes we want to cache for offline
self.addEventListener('install', (evt) =>
  evt.waitUntil(
    caches.open(CURRENT_CACHE).then((cache) => {
      return cache.addAll(cacheFiles);
    }),
  ),
);

// update app if new service worker version has been loaded but is waiting
self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.txt')) {
    // Bypass the service worker and always fetch from the network
    event.respondWith(fetch(event.request));
  } else {
    // Check the file extension of the request
    let fileExtension = event.request.url.split('.').pop();
    if (fileExtension === 'js' || fileExtension === 'css' || fileExtension === 'html') {
      // Network first for .js, .css, and .html files
      event.respondWith(
        caches.open(CURRENT_CACHE).then((cache) => {
          // Go to the network first
          return fetch(event.request)
            .then((fetchedResponse) => {
              // Add the network response to the cache for later visits
              cache.put(event.request.url, fetchedResponse.clone());

              // Return the network response
              return fetchedResponse;
            })
            .catch((error) => {
              // If the network request fails, fallback to the cache
              return cache.match(event.request.url).then((cachedResponse) => {
                // Return a cached response if we have one, or an error otherwise
                return cachedResponse || new Response('Network error', { status: 500 });
              });
            });
        }),
      );
    } else {
      // Cache first for everything else
      event.respondWith(
        caches.open(CURRENT_CACHE).then((cache) => {
          // Go to the cache first
          return cache.match(event.request.url).then((cachedResponse) => {
            // Return a cached response if we have one
            if (cachedResponse) {
              return cachedResponse;
            }

            // Otherwise, hit the network
            return fetch(event.request).then((fetchedResponse) => {
              // Add the network response to the cache for later visits
              cache.put(event.request.url, fetchedResponse.clone());

              // Return the network response
              return fetchedResponse;
            });
          });
        }),
      );
    }
  }
});
