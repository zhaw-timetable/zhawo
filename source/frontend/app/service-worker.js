// these options encourage the ServiceWorkers to get in there fast
// and not allow any straggling "old" SWs to hang around
workbox.skipWaiting();
workbox.clientsClaim();

const bgSyncPlugin = new workbox.backgroundSync.Plugin('zhawoQueue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

// Caches all /api request
workbox.routing.registerRoute(
  new RegExp('/api'),
  workbox.strategies.staleWhileRevalidate()
);

workbox.precaching.precacheAndRoute(self.__precacheManifest);
