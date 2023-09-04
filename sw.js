// the cache version gets updated every time there is a new deployment
const CACHE_VERSION = '4.2.078';
const CURRENT_CACHE = `main-${CACHE_VERSION}`;

// prettier-ignore
// these are the routes we are going to cache for offline support
const cacheFiles = [
  '/',
  '',
  'audio/phft4.mp3',
  'models/TutorialStepObject.js',
  'models/ModeObject.js',
  'models/PieceObject.js',
  'models/ScoreObject.js',
  'models/ThemeObject.js',
  'models/LevelsObject.js',
  'fonts/Bangers-Regular.ttf',
  'images/icon_share.svg',
  'images/icon_bullhorn.svg',
  'images/icon_eye.svg',
  'images/icon_zen.svg',
  'images/icon_download.svg',
  'images/icon_settings.svg',
  'images/icon_play.svg',
  'images/icon_coffee.svg',
  'images/icon_trophy.svg',
  'images/icon_info.svg',
  'images/Square.svg',
  'images/Triangle.svg',
  'images/Infinity.svg',
  'images/Hexagon.svg',
  'images/Circle.svg',
  'images/CatSquare.svg',
  'images/CatTriangle.svg',
  'images/CatHexagon.svg',
  'images/CatCircle.svg',
  'helpers/vue.min.js',
  'helpers/getDailyChallenge.js',
  'helpers/console-enhancer.js',
  'helpers/howler.js',
  'images/pieces.png',
  'styles/likeme.css',
  'styles/likeme-darkmode.css',
  'styles/cats-likeme.css',
  'styles/cats-likeme-darkmode.css',
  'styles/altpattern1.css',
  'scripts/likeme.js',
  'index.html',
];

// on activation we clean up the previously registered service workers
self.addEventListener('activate', (evt) =>
  evt.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CURRENT_CACHE) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  ),
);

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

// fetch cache first, but use network if cache fails
self.addEventListener('fetch', (event) => {
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
});
