importScripts("/precache-manifest.c111b8936c783906803283a40705b44d.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/*Global workbox*/

if (workbox) {
  console.log('Workbox is loaded');
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
} else {
  console.log("Workbox didn't load");
}

