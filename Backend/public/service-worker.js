importScripts("/precache-manifest.6907dcd5bd8a7039d68ab2287c21421a.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/*Global workbox*/

if (workbox) {
  console.log('Workbox is loaded');
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
} else {
  console.log("Workbox didn't load");
}

