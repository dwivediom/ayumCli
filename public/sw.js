if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>c(e,n),o={module:{uri:n},exports:t,require:r};s[n]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-e13f827e"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Ayumcover.jpg",revision:"a2ab49188c4fed818128fcda7b1298a4"},{url:"/Ayumcover.png",revision:"f565fc0069f20b7a401b46da4789f3bf"},{url:"/_next/static/5Gl0RUTL0QJAf-pPqy_nX/_buildManifest.js",revision:"1d3b88c185ddf8fda1534581c40ae089"},{url:"/_next/static/5Gl0RUTL0QJAf-pPqy_nX/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/195-59db560ad4f81d2e.js",revision:"59db560ad4f81d2e"},{url:"/_next/static/chunks/253.59435284a3769b1b.js",revision:"59435284a3769b1b"},{url:"/_next/static/chunks/29107295-b311528f60919837.js",revision:"b311528f60919837"},{url:"/_next/static/chunks/447.0276c0f32452fb92.js",revision:"0276c0f32452fb92"},{url:"/_next/static/chunks/566-0276b18cbe9eae4c.js",revision:"0276b18cbe9eae4c"},{url:"/_next/static/chunks/651.427a8789c006c198.js",revision:"427a8789c006c198"},{url:"/_next/static/chunks/669-b6268a3ea8cb08c6.js",revision:"b6268a3ea8cb08c6"},{url:"/_next/static/chunks/679-0c939d2deab8a5fe.js",revision:"0c939d2deab8a5fe"},{url:"/_next/static/chunks/74.2c331448d52a4285.js",revision:"2c331448d52a4285"},{url:"/_next/static/chunks/741.ca56dcdd613aef8a.js",revision:"ca56dcdd613aef8a"},{url:"/_next/static/chunks/818-e971826efdc3e494.js",revision:"e971826efdc3e494"},{url:"/_next/static/chunks/824.c7e5a50eefcb648d.js",revision:"c7e5a50eefcb648d"},{url:"/_next/static/chunks/877.0aab3195feb2c50a.js",revision:"0aab3195feb2c50a"},{url:"/_next/static/chunks/919.6fb841aa0afc1ade.js",revision:"6fb841aa0afc1ade"},{url:"/_next/static/chunks/958.59e0b88ade267083.js",revision:"59e0b88ade267083"},{url:"/_next/static/chunks/framework-7751730b10fa0f74.js",revision:"7751730b10fa0f74"},{url:"/_next/static/chunks/main-727fb4ba232f3085.js",revision:"727fb4ba232f3085"},{url:"/_next/static/chunks/pages/404-3891ceb4f85187e1.js",revision:"3891ceb4f85187e1"},{url:"/_next/static/chunks/pages/About-a455dd91393d616e.js",revision:"a455dd91393d616e"},{url:"/_next/static/chunks/pages/Category/Category-54d9e908eac4c039.js",revision:"54d9e908eac4c039"},{url:"/_next/static/chunks/pages/ChatSection-e5726933dd964087.js",revision:"e5726933dd964087"},{url:"/_next/static/chunks/pages/Contact-83ef8b2f8fabaa7d.js",revision:"83ef8b2f8fabaa7d"},{url:"/_next/static/chunks/pages/DoctorDirectory-051d8d9b2db1fd0e.js",revision:"051d8d9b2db1fd0e"},{url:"/_next/static/chunks/pages/Other/BloodBank-1fa3e59da3abe936.js",revision:"1fa3e59da3abe936"},{url:"/_next/static/chunks/pages/Other/BloodRequest-6fd6350aa46b246a.js",revision:"6fd6350aa46b246a"},{url:"/_next/static/chunks/pages/Other/Bloodrecieve-9c435321aab99189.js",revision:"9c435321aab99189"},{url:"/_next/static/chunks/pages/Other/Campaign-69698f7cb2562fca.js",revision:"69698f7cb2562fca"},{url:"/_next/static/chunks/pages/Other/MyRequests-981374c329380443.js",revision:"981374c329380443"},{url:"/_next/static/chunks/pages/Other/Nashmukti-a207974ee8d3126f.js",revision:"a207974ee8d3126f"},{url:"/_next/static/chunks/pages/PrivacyPolicy-f80b2a5ccf520a30.js",revision:"f80b2a5ccf520a30"},{url:"/_next/static/chunks/pages/Search/Search-8a3081668a2852cf.js",revision:"8a3081668a2852cf"},{url:"/_next/static/chunks/pages/User/BookAppointmentPage-57146d320ca5a065.js",revision:"57146d320ca5a065"},{url:"/_next/static/chunks/pages/User/SelectClinic-249d4ba57069410c.js",revision:"249d4ba57069410c"},{url:"/_next/static/chunks/pages/User/UserRegistrationPage-c4b791387a1c658f.js",revision:"c4b791387a1c658f"},{url:"/_next/static/chunks/pages/User/userAppo-84a91c79617a230f.js",revision:"84a91c79617a230f"},{url:"/_next/static/chunks/pages/_app-0d6cf9d410954162.js",revision:"0d6cf9d410954162"},{url:"/_next/static/chunks/pages/_error-2368f2bbbb3169cf.js",revision:"2368f2bbbb3169cf"},{url:"/_next/static/chunks/pages/doctor-d0ec876c3a5b2176.js",revision:"d0ec876c3a5b2176"},{url:"/_next/static/chunks/pages/doctors-fcb6e27a23595cf2.js",revision:"fcb6e27a23595cf2"},{url:"/_next/static/chunks/pages/index-6d429f87f7660a41.js",revision:"6d429f87f7660a41"},{url:"/_next/static/chunks/pages/refundpolicy-1b726230de4dfe98.js",revision:"1b726230de4dfe98"},{url:"/_next/static/chunks/pages/termsconditions-c7ec7ff65519e414.js",revision:"c7ec7ff65519e414"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-5e7f42e04051530e.js",revision:"5e7f42e04051530e"},{url:"/_next/static/css/0431fe25379e410c.css",revision:"0431fe25379e410c"},{url:"/_next/static/css/1d9e57172a477836.css",revision:"1d9e57172a477836"},{url:"/_next/static/css/259627730d90d41f.css",revision:"259627730d90d41f"},{url:"/_next/static/css/2a52c695a9fad7de.css",revision:"2a52c695a9fad7de"},{url:"/_next/static/css/2f3387e5d9f5fa63.css",revision:"2f3387e5d9f5fa63"},{url:"/_next/static/css/5d32ec242283c756.css",revision:"5d32ec242283c756"},{url:"/_next/static/css/847334e524685820.css",revision:"847334e524685820"},{url:"/_next/static/css/d22ec6acdf379831.css",revision:"d22ec6acdf379831"},{url:"/_next/static/css/d6941e15843cf22e.css",revision:"d6941e15843cf22e"},{url:"/_next/static/css/d71cd74150671e19.css",revision:"d71cd74150671e19"},{url:"/_next/static/css/e7e56f50358d5025.css",revision:"e7e56f50358d5025"},{url:"/_next/static/css/ef637b3b68028457.css",revision:"ef637b3b68028457"},{url:"/_next/static/css/efda2962a4af9cec.css",revision:"efda2962a4af9cec"},{url:"/_next/static/css/f17158b39eff2b09.css",revision:"f17158b39eff2b09"},{url:"/_next/static/css/f6e9aadcda7ff909.css",revision:"f6e9aadcda7ff909"},{url:"/_next/static/css/f74a7ac5e71430a9.css",revision:"f74a7ac5e71430a9"},{url:"/assetlinks.json",revision:"f6f7ee1548c66e1bc745852b6f7af644"},{url:"/ayum.ico",revision:"6119f735c2085a8a008992a6a0e2d208"},{url:"/ayumTranparent.png",revision:"dc22c74d18c49e5321788708be634e4c"},{url:"/ayumtranparent1.svg",revision:"cd974e90c85cec284f802be958b63e7c"},{url:"/barkha.jpg",revision:"3d7bd7a37b90dd6d110d2760b785ce17"},{url:"/bl.jpeg",revision:"c75e5c9829c3ea0224377e549122b72c"},{url:"/bloodheadback.jpg",revision:"29d6815cb95cc9554c2957e4b04bd78c"},{url:"/bloodheadback.png",revision:"1a5572eae60224ae4c1ffdae7ea7d74a"},{url:"/bloodlogo2.png",revision:"d2a32ffccb1b4d0182e894fda185c61f"},{url:"/bookico.jpg",revision:"bb33208541077365653ff43c90635d4a"},{url:"/cardback.svg",revision:"d2f96e10994f43a3a61499d69199563e"},{url:"/close.svg",revision:"3bbe74fbc7285ce49c9825ec683c18fa"},{url:"/contact2.jpg",revision:"58e1f92478408553e4cc78dda83d06d3"},{url:"/dcard.jpg",revision:"83d7309d5008eb00df4c7567146ab892"},{url:"/deafaultpro.jpg",revision:"aa2371488cfea4e07068a0f6fe574dad"},{url:"/demo.svg",revision:"dd74cd8b50cb3eae65dc54d20284a464"},{url:"/dhreendra.jpeg",revision:"29140452dc2a819324d9da9afaf8895f"},{url:"/favicon.ico",revision:"80c61bb06b68a8ed68604edb7ec32ed1"},{url:"/firebase-messaging-sw.js",revision:"a84c390ead7da5bdc1aecb66bd48cf17"},{url:"/footericon.png",revision:"5e55f30753a0645a828fc50f71e9ebe5"},{url:"/google.svg",revision:"4854ffe77b500199e36ed1b3318e9a19"},{url:"/heart.gif",revision:"8ca76735790d0848bf7a4478553b6c0b"},{url:"/heart.svg",revision:"a4d2f05244c77b45b62adc0c532f8daa"},{url:"/icons/icon-192x192.png",revision:"3698ab871feaedfee11c0ab5acc221c2"},{url:"/icons/icon-256x256.png",revision:"64686bc4a0dcc5a73abdcb95abb372ef"},{url:"/icons/icon-384x384.png",revision:"983ac855ab6757751903d1846e9698b0"},{url:"/icons/icon-512x512.png",revision:"3221274b86d907e319b1806420dab299"},{url:"/icons/icon-96x96.png",revision:"aee5b87b5f162670d5669c9bd700c776"},{url:"/icons/icon-99x99.png",revision:"a61d96318cc084577a33a7dcd735fe81"},{url:"/leftside.gif",revision:"86791ab5aeeebe29bd215c1116cfe5c3"},{url:"/loader.svg",revision:"c0fcad3ee28678feece53dbccc8af60d"},{url:"/loader4.svg",revision:"c0fcad3ee28678feece53dbccc8af60d"},{url:"/locales/en/index.js",revision:"0fbe73c9328a775c7edab0152b94fc78"},{url:"/locales/en/labtest.js",revision:"ce97cf4f6b48a73cb6996399f7319187"},{url:"/locales/en/reviewoption.js",revision:"0295fb325998a232435cf51e0d88dfde"},{url:"/locales/en/search.js",revision:"6ecb5ff74433105a4d6d5922d1355a70"},{url:"/locales/hi/index.js",revision:"fcd8dce5c39447dae71faded2e24bb50"},{url:"/locales/hi/labtest.js",revision:"75a05df3266ec397b232669f4c053709"},{url:"/locales/hi/reviewoption.js",revision:"c46b3508ff373ac5ab39c53fadcca92a"},{url:"/locales/hi/search.js",revision:"b2a08ceb80d26ae0eaf1e992aa9bfc8e"},{url:"/manifest.json",revision:"f9308c875c3f350ac97e9b4a03c87d77"},{url:"/mapthumb.jpeg",revision:"b6424295deb653e9b0136cbb4e85a015"},{url:"/nashamukt.jpg",revision:"d5f42d81a67345154ce993e924ccbc0b"},{url:"/notfound.png",revision:"729b3d7628d044c05ef602f7aca293f7"},{url:"/offline.png",revision:"cf545f006045e2c66f40d47e0877572e"},{url:"/robots.txt",revision:"a5f8fc0ed28cfca9262ad084d67ac21d"},{url:"/screenshot.JPEG",revision:"3843b87afc12bd0c05a61c843458e5a9"},{url:"/searchill.png",revision:"bb5b244c60ac2718675309cdfe431b04"},{url:"/service-worker.js",revision:"6bf6ccb608553c6958311332a0babb35"},{url:"/sitemap.xml",revision:"aeda322960e30174bb1b0ee8c04916dd"},{url:"/strip-test-icon.svg",revision:"8bcef3323a5c79fc98d49fdc6f94629c"},{url:"/success.gif",revision:"2e6588591cea4f98ebb650ec01800b02"},{url:"/success.svg",revision:"f13e7bc80289f376cb3f0306e9a87e11"},{url:"/threedot.png",revision:"f486195be916fa612156caff76e2f061"},{url:"/utils/Utils.js",revision:"b81b568237a711c889dd2dbe524738c4"},{url:"/whatsapplogo.svg",revision:"c0c827f0a5a1f11bfdd8fc60a4087d5c"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
