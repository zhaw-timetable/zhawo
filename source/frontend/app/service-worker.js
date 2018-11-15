// these options encourage the ServiceWorkers to get in there fast
// and not allow any straggling "old" SWs to hang around
workbox.skipWaiting();
workbox.clientsClaim();

const bgSyncPlugin = new workbox.backgroundSync.Plugin('zhwoQueue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

workbox.routing.registerRoute(
  new RegExp('/api'),
  workbox.strategies.staleWhileRevalidate()
);

// workbox.routing.registerRoute(
//   new RegExp('/api/'),
//   workbox.strategies.networkOnly({
//     plugins: [bgSyncPlugin]
//   }),
//   'POST'
// );

workbox.precaching.precacheAndRoute(self.__precacheManifest);
