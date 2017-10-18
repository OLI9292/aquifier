"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/index.html","eaf97d1489cdb1e01410de496ea28699"],["/static/css/main.c23e6b19.css","83324452ea7ba3bc99819ca6cc04b830"],["/static/media/Brandon_bld.fa11c3ca.otf","fa11c3ca7b2301d6b8da51b04985fb05"],["/static/media/Brandon_reg.1f55925e.otf","1f55925e52b9e71fd57108874184060d"],["/static/media/Checkmark-Green.64b01b11.png","64b01b11a6acb32dc1fd9987adc444df"],["/static/media/Checkmark-LightGray.125e6ece.png","125e6ecea1b54b16afd1c98554c3dcda"],["/static/media/android-logo.2194afb7.png","2194afb7ffb2ad7de5cc1ba901b09490"],["/static/media/apple-logo.194fb681.png","194fb681e5f5deb47a79566d0bdf3df5"],["/static/media/categories.bfe51981.png","bfe51981ec6356221b4a6fe1ac87f9d6"],["/static/media/cephalopod.e6fc3ae4.png","e6fc3ae48f4e9308670ae54f4234ea1f"],["/static/media/decagon.82a778e9.png","82a778e9e1df1c147f6a14b90e8b8433"],["/static/media/dermatoglyph.b7a37dee.png","b7a37dee466b126288dc5584857636b6"],["/static/media/equilateral.07784545.png","0778454566d0f2fde81e96ad2c778f09"],["/static/media/example.874eef9e.png","874eef9e2811cf506ef57d5825051727"],["/static/media/gastropod.211cf8ef.png","211cf8ef4a1000d3a6873771a00b745a"],["/static/media/isometric.9e0d9cd3.png","9e0d9cd3138fcce709d009ced42f7032"],["/static/media/lithograph.1487c7ce.png","1487c7ce3de464157d362e8b2ae95c77"],["/static/media/lithophyte.76a3373f.png","76a3373f1b2607f6102ddbe7aed3d2dd"],["/static/media/logo.c0a15817.png","c0a15817958af5e373471fded5180e00"],["/static/media/monogram.fd4d3ee6.png","fd4d3ee66cc7ed55a9a06c273a895c36"],["/static/media/monolith.461c52c7.png","461c52c70217eb7a87b983f03fd0a83a"],["/static/media/polydactylic.e78ab742.png","e78ab742e1d5583a777bc9d0596ed8b3"],["/static/media/polyhedron.11af3f65.png","11af3f65dbbdb13aa53c41e4313362b7"],["/static/media/protoplasm.72cdcc38.png","72cdcc385a575d75e27376706376e8d1"],["/static/media/pterodactyl.39eb7740.png","39eb7740f13e4f1da79642659b4dabf1"],["/static/media/pteropod.619458bd.png","619458bd38c937a59d71ab2d2dd6dd4f"],["/static/media/quadrilateral.57f39880.png","57f39880dc65d56dd4f2d3f1247cbcde"],["/static/media/quadruped.bfaca547.png","bfaca5475ffa8a5c4f936ababd5f556c"],["/static/media/results.18f59166.png","18f59166be5dc545dac5e6ba12a12617"],["/static/media/telegraph.afe557e7.png","afe557e732d284876b076c0702d1f68b"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(a){return new Response(a,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,a,t,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),c.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return a.every(function(a){return!a.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],n=new URL(a,self.location),c=createCacheKey(n,hashParamName,t,/\.\w{8}\./);return[n.toString(),c]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var n=new Request(t,{credentials:"same-origin"});return fetch(n).then(function(a){if(!a.ok)throw new Error("Request for "+t+" returned a response with status "+a.status);return cleanResponse(a).then(function(a){return e.put(t,a)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!a.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var a,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(a=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,"index.html"),a=urlsToCacheKeys.has(t));!a&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(t=new URL("/index.html",self.location).toString(),a=urlsToCacheKeys.has(t)),a&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(a){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,a),fetch(e.request)}))}});