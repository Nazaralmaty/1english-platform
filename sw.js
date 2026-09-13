/*!
 * 1English · офлайн.
 *
 * Ученик открывает платформу с телефона в дороге и в школе, где связь
 * пропадает на середине урока. Без этого файла пропавшая сеть означает
 * белый экран, хотя все тексты уже лежат в браузере.
 *
 * КАК УСТРОЕНО. Разметка, скрипты и стили берутся из сети, а копия
 * кладётся в кэш: новая версия доезжает до ученика сразу после push, и
 * при этом без сети открывается последняя виденная. Картинки, шрифты и
 * обложки — наоборот, сначала из кэша: они не меняются, а весят.
 *
 * ЧЕГО ЗДЕСЬ НЕТ. Supabase и YouTube не кэшируются никогда: ответ базы,
 * положенный в кэш, — это чужой прогресс на чужом экране и просроченный
 * токен в кармане. Такие запросы просто идут в сеть.
 *
 * ВЕРСИЯ. Меняется при каждой выкатке, иначе старый кэш живёт вечно.
 * Активация сносит все чужие версии и сразу берёт управление: сломанная
 * версия чинится обычным push, а не просьбой «почистите браузер».
 */
var VERSION = '1eng-2026-09-13';

/* Что имеет смысл положить заранее: без этого набора приложение не
   нарисует ни одного экрана. */
var SHELL = [
  './',
  './index.html',
  './manifest.json',
  './app/style.css',
  './app/app.js',
  './app/course.js',
  './app/db.js',
  './assets/logo.png',
  './assets/logo-white.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      /* один недоступный файл не должен ронять установку целиком */
      .then(function (c) { return Promise.all(SHELL.map(function (u) {
        return c.add(u).catch(function () {});
      })); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === VERSION ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function fromCacheFirst(req) {
  return caches.match(req).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
      return res;
    });
  });
}

function fromNetworkFirst(req) {
  return fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) {
      if (hit) return hit;
      /* Запасной index.html отдаётся только вместо страницы. Отдать его
         вместо скрипта, которого нет в кэше, — это HTML в <script>: браузер
         спотыкается на первой же строке разметки, и экран остаётся белым. */
      if (req.mode === 'navigate') return caches.match('./index.html');
      return Response.error();
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  /* чужие адреса — база, видео, всё остальное — идут мимо кэша */
  if (url.origin !== self.location.origin) return;

  var heavy = /\.(png|jpg|jpeg|webp|svg|woff2|mp4|wav|mp3)$/i.test(url.pathname);
  e.respondWith(heavy ? fromCacheFirst(req) : fromNetworkFirst(req));
});
