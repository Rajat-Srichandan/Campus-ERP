/* Offline cache for low-bandwidth / offline use (vanilla JS, no build step) */
// NOTE: bump CACHE on every SW logic change so old clients (campushub-v3)
// pick up the fix on normal reload via skipWaiting + clients.claim.
const CACHE = "campushub-v5";
const CORE = ["./index.html","./student-dashboard.html","./requests.html","./complaints.html","./mess.html","./certificates.html","./ops-dashboard.html","./style.css","./script.js","./campus-hub.js"];
const FALLBACK = "./student-dashboard.html";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isHtmlRequest(req, url) {
  if (req.mode === "navigate") return true;
  if (req.destination === "document") return true;
  if (req.headers.get("accept") && req.headers.get("accept").includes("text/html")) return true;
  return url.pathname.endsWith(".html") || url.pathname.endsWith("/") || url.pathname.split("/").pop().indexOf(".") === -1;
}

function isCssRequest(req, url) {
  if (req.destination === "style") return true;
  return url.pathname.endsWith(".css");
}

function isJsRequest(req, url) {
  if (req.destination === "script") return true;
  return url.pathname.endsWith(".js");
}

// Dev bypass: on localhost (or explicit ?dev=1 / ?nocache) let the request
// go straight to the network. The dev server sends `Cache-Control: no-store`
// for .html/.js/.css, so normal reload is always fresh without Ctrl+Shift+R.
// Prod (non-localhost, no dev flag) keeps the cached offline behavior below.
function isDevBypass(url) {
  try {
    if (url.searchParams.has("dev") || url.searchParams.has("nocache")) return true;
  } catch (err) {}
  try {
    if (self.location.search && self.location.search.indexOf("dev=1") !== -1) return true;
  } catch (err) {}
  var host = self.location.hostname || "";
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1" || host === "";
}

// Allow pages to trigger instant activation: reg.waiting.postMessage("SKIP_WAITING")
self.addEventListener("message", function (e) {
  if (e && e.data === "SKIP_WAITING") self.skipWaiting();
});

function putIfOk(cacheName, req, res) {
  if (!res || res.status !== 200) return res;
  // Only cache same-origin basic responses (avoid opaque API errors filling cache)
  if (res.type !== "basic" && res.type !== "default") return res;
  const copy = res.clone();
  caches.open(cacheName).then(c => c.put(req, copy)).catch(() => {});
  return res;
}

// Network-first: always tries network so normal reload picks up new HTML/CSS.
// Falls back to cache, then to FALLBACK page (navigations only) when offline.
function networkFirst(req, useFallbackPage) {
  return fetch(req).then(res => putIfOk(CACHE, req, res)).catch(() =>
    caches.match(req).then(hit => {
      if (hit) return hit;
      if (useFallbackPage) return caches.match(FALLBACK);
      return caches.match(FALLBACK).then(fb => {
        // For CSS/JS never serve HTML; rethrow so page still renders from network error
        if (req.destination === "style" || req.destination === "script") throw new Error("offline");
        return fb;
      });
    })
  );
}

// Stale-while-revalidate: instant offline render + background refresh for JS/img/etc.
function staleWhileRevalidate(req) {
  return caches.match(req).then(hit => {
    const network = fetch(req)
      .then(res => putIfOk(CACHE, req, res))
      .catch(() => hit);
    return hit || network;
  });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Don't cache cross-origin API calls (backend on :5000) or POST sync traffic.
  // Let the app's localStorage offline queue handle those.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/api/") !== -1) return;

  // Dev: bypass SW cache entirely (see isDevBypass). No respondWith here
  // means the browser goes to the network, which sends no-store in dev.
  if (isDevBypass(url)) return;

  if (isHtmlRequest(req, url)) {
    e.respondWith(networkFirst(req, true));
    return;
  }
  if (isCssRequest(req, url)) {
    e.respondWith(networkFirst(req, false));
    return;
  }
  // JS uses network-first (not stale-while-revalidate) so a normal reload
  // always shows the latest script; cache is only a fallback when offline.
  if (isJsRequest(req, url)) {
    e.respondWith(networkFirst(req, false));
    return;
  }
  e.respondWith(
    staleWhileRevalidate(req).catch(() => caches.match(req).then(hit => hit || caches.match(FALLBACK)))
  );
});

// Web Push: show the notice; payload {title,message,url,icon} with fallbacks.
self.addEventListener("push", function (e) {
  var data = {};
  try {
    if (e.data) data = e.data.json() || {};
  } catch (err) {
    try { data = { message: e.data.text() }; } catch (e2) {}
  }
  var title = data.title || "Campus Hub";
  var message = data.message || data.body || "New notice";
  var url = data.url || "./student-dashboard.html";
  var options = { body: message, tag: "campus-hub", data: { url: url } };
  if (data.icon) options.icon = data.icon;
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "./student-dashboard.html";
  e.waitUntil(clients.openWindow(url));
});
