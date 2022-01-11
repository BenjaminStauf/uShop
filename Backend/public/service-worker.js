importScripts("/precache-manifest.2268faaa867399215504c92e67d94ee6.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/*Global workbox*/

if (workbox) {
  console.log('Workbox is loaded');
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
} else {
  console.log("Workbox didn't load");
}

