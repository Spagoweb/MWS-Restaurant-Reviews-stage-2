self.importScripts('lib/idb.js');

var cacheID = "mws-restaruant-stage2";
let dbReady = false;

const dbPromise = idb.open("mws-restaurant", 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore("restaurants", { keyPath: "id" });
    case 2:
      upgradeDB.createObjectStore("pending", {
        keyPath: "id",
        autoIncrement: true
    });
  }
});

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheID).then(cache => {
      return cache
        .addAll([
          "/",
          "/index.html",
          "/restaurant.html",
          "/css/styles.css",
          "/js/dbhelper.js",
          "/js/main.js",
          "/js/restaurant_info.js",
          "/img/picture-not-available.webp",
          "/js/register.js",
          "/sw.js",
          "/lib/idb.js",
          "/js/lazyload.min.js"
        ])
        .catch(error => {
          console.log("Caches open failed: " + error);
        });
    })
  );
});

self.addEventListener("fetch", event => {
  let cacheRequest = event.request;
  let cacheUrlObj = new URL(event.request.url);
/*
  if (event.request.url.indexOf("restaurant.html") > -1) {
    const cacheURL = "restaurant.html";
    cacheRequest = new Request(cacheURL);
  }
*/

  // Requests going to the API get handled separately from those
  // going to other destinations
  const checkURL = new URL(event.request.url);
  if (checkURL.port === "1337") {
    const parts = checkURL.pathname.split("/");
    const id = parts[parts.length - 1] === "restaurants" ? "-1" : parts[parts.length - 1];
    handleAJAXEvent(event, id);
  } else {
    handleNonAJAXEvent(event, cacheRequest);
  }
});


const handleAJAXEvent = (event, id) => {
  // Check the IndexedDB to see if the JSON for the API
  // has already been stored there. If so, return that.
  // If not, request it from the API, store it, and then
  // return it back.
  event.respondWith(
    dbPromise
      .then(db => {
        return db
          .transaction("restaurants")
          .objectStore("restaurants")
          .get(id);
      })
      .then(data => {
        return (
          (data && data.data) ||
          fetch(event.request)
            .then(fetchResponse => fetchResponse.json())
            .then(json => {
              return dbPromise.then(db => {
                const tx = db.transaction("restaurants", "readwrite");
                tx.objectStore("restaurants").put({
                  id: id,
                  data: json
                });
                return json;
              });
            })
        );
      })
      .then(finalResponse => {
        return new Response(JSON.stringify(finalResponse));
      })
      .catch(error => {
        return new Response("Error fetching data", { status: 500 });
      })
  );
};


const handleNonAJAXEvent = (event, cacheRequest) => {
  // Check if the HTML request has previously been cached.
  // If so, return the response from the cache. If not,
  // fetch the request, cache it, and then return it.

  event.respondWith(
    caches.match(cacheRequest).then(response => {
      return (
        response ||
        fetch(event.request)
          .then(fetchResponse => {
            return caches.open(cacheID).then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
          .catch(error => {
            if (event.request.url.indexOf(".webp") > -1) {
              return caches.match("/img/picture-not-available.webp");
            }
            return new Response("Application is not connected to the internet", {
              status: 404,
              statusText: "Application is not connected to the internet"
            });
          })
      );
    })
  );
};
