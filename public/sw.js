// 아주 단순한 앱 셸 캐싱 서비스워커예요.
// 실제 서비스로 키우면서 캐시 전략(네트워크 우선/캐시 우선 등)을 더 정교하게 다듬어도 좋아요.
const CACHE_NAME = "sosanggongin-cache-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // 외부 API(환율 등) 호출은 캐싱하지 않고 그대로 네트워크로 보내요.
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        }).catch(() => cached)
    )
  );
});
