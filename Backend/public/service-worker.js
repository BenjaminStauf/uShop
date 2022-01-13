importScripts("/precache-manifest.0330743fb56c087dfa65cf36dc380196.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/*Global workbox*/

if (workbox) {
  console.log('Workbox is loaded');
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
} else {
  console.log("Workbox didn't load");
}

