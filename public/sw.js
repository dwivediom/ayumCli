if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>c(e,n),f={module:{uri:n},exports:t,require:r};s[n]=Promise.all(a.map((e=>f[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-e13f827e"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Ayumcover.jpg",revision:"a2ab49188c4fed818128fcda7b1298a4"},{url:"/Ayumcover.png",revision:"f565fc0069f20b7a401b46da4789f3bf"},{url:"/_next/static/5En9ATJoJife-w-rWiyyF/_buildManifest.js",revision:"b1e31f54f1212ef72984c584ce7869aa"},{url:"/_next/static/5En9ATJoJife-w-rWiyyF/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/253.439afda5ed766b00.js",revision:"439afda5ed766b00"},{url:"/_next/static/chunks/29107295-b311528f60919837.js",revision:"b311528f60919837"},{url:"/_next/static/chunks/296-8e035e02e6f6b9a7.js",revision:"8e035e02e6f6b9a7"},{url:"/_next/static/chunks/403-7f6a33310ab10854.js",revision:"7f6a33310ab10854"},{url:"/_next/static/chunks/447.0276c0f32452fb92.js",revision:"0276c0f32452fb92"},{url:"/_next/static/chunks/450.a3345886c5d89142.js",revision:"a3345886c5d89142"},{url:"/_next/static/chunks/478-17e0a25611d62c60.js",revision:"17e0a25611d62c60"},{url:"/_next/static/chunks/579-6ee9ab81c2782629.js",revision:"6ee9ab81c2782629"},{url:"/_next/static/chunks/651.427a8789c006c198.js",revision:"427a8789c006c198"},{url:"/_next/static/chunks/655-0d232474934b5a36.js",revision:"0d232474934b5a36"},{url:"/_next/static/chunks/74.2c331448d52a4285.js",revision:"2c331448d52a4285"},{url:"/_next/static/chunks/741.ca56dcdd613aef8a.js",revision:"ca56dcdd613aef8a"},{url:"/_next/static/chunks/818-e971826efdc3e494.js",revision:"e971826efdc3e494"},{url:"/_next/static/chunks/824.a1a424c9c4bf0f42.js",revision:"a1a424c9c4bf0f42"},{url:"/_next/static/chunks/858-80dbc652c59485c9.js",revision:"80dbc652c59485c9"},{url:"/_next/static/chunks/877.a3d668acf7735155.js",revision:"a3d668acf7735155"},{url:"/_next/static/chunks/919.b7eedd181aea6ad6.js",revision:"b7eedd181aea6ad6"},{url:"/_next/static/chunks/framework-7751730b10fa0f74.js",revision:"7751730b10fa0f74"},{url:"/_next/static/chunks/main-727fb4ba232f3085.js",revision:"727fb4ba232f3085"},{url:"/_next/static/chunks/pages/404-3891ceb4f85187e1.js",revision:"3891ceb4f85187e1"},{url:"/_next/static/chunks/pages/About-79307ae6e7743687.js",revision:"79307ae6e7743687"},{url:"/_next/static/chunks/pages/Category/Category-54d9e908eac4c039.js",revision:"54d9e908eac4c039"},{url:"/_next/static/chunks/pages/ChatSection-ef8d9405d48bc685.js",revision:"ef8d9405d48bc685"},{url:"/_next/static/chunks/pages/Contact-83ef8b2f8fabaa7d.js",revision:"83ef8b2f8fabaa7d"},{url:"/_next/static/chunks/pages/DoctorDirectory-cac10a28f87c213f.js",revision:"cac10a28f87c213f"},{url:"/_next/static/chunks/pages/Other/BloodBank-5a1f7703676734b6.js",revision:"5a1f7703676734b6"},{url:"/_next/static/chunks/pages/Other/BloodRequest-b98edf4f49491538.js",revision:"b98edf4f49491538"},{url:"/_next/static/chunks/pages/Other/Bloodrecieve-32aa422a6dd9d26f.js",revision:"32aa422a6dd9d26f"},{url:"/_next/static/chunks/pages/Other/Campaign-69698f7cb2562fca.js",revision:"69698f7cb2562fca"},{url:"/_next/static/chunks/pages/Other/MyRequests-981374c329380443.js",revision:"981374c329380443"},{url:"/_next/static/chunks/pages/Other/Nashmukti-03d9f69bc450279c.js",revision:"03d9f69bc450279c"},{url:"/_next/static/chunks/pages/PrivacyPolicy-f80b2a5ccf520a30.js",revision:"f80b2a5ccf520a30"},{url:"/_next/static/chunks/pages/Search/Search-16012352e1193e38.js",revision:"16012352e1193e38"},{url:"/_next/static/chunks/pages/User/BookAppointmentPage-be8976b0591c132a.js",revision:"be8976b0591c132a"},{url:"/_next/static/chunks/pages/User/SelectClinic-9d92aaf0ceede17a.js",revision:"9d92aaf0ceede17a"},{url:"/_next/static/chunks/pages/User/UserRegistrationPage-88f983380c6f3500.js",revision:"88f983380c6f3500"},{url:"/_next/static/chunks/pages/User/userAppo-84a91c79617a230f.js",revision:"84a91c79617a230f"},{url:"/_next/static/chunks/pages/_app-cf6fa406d3642cb8.js",revision:"cf6fa406d3642cb8"},{url:"/_next/static/chunks/pages/_error-2368f2bbbb3169cf.js",revision:"2368f2bbbb3169cf"},{url:"/_next/static/chunks/pages/checkout-aef118dbcf0e5014.js",revision:"aef118dbcf0e5014"},{url:"/_next/static/chunks/pages/city/%5Bslug%5D-75fe8c276dce059d.js",revision:"75fe8c276dce059d"},{url:"/_next/static/chunks/pages/city/slug3-12996ef7d178fcf2.js",revision:"12996ef7d178fcf2"},{url:"/_next/static/chunks/pages/clinics-2ca53ba1f3c3c3e9.js",revision:"2ca53ba1f3c3c3e9"},{url:"/_next/static/chunks/pages/doctor-e471d243a5ed9d14.js",revision:"e471d243a5ed9d14"},{url:"/_next/static/chunks/pages/doctors-76cfce9ad91afaf2.js",revision:"76cfce9ad91afaf2"},{url:"/_next/static/chunks/pages/index-877b18b6df9d6a21.js",revision:"877b18b6df9d6a21"},{url:"/_next/static/chunks/pages/refundpolicy-a687dc46dac716a2.js",revision:"a687dc46dac716a2"},{url:"/_next/static/chunks/pages/termsconditions-c7ec7ff65519e414.js",revision:"c7ec7ff65519e414"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-02b4a8790aefa7aa.js",revision:"02b4a8790aefa7aa"},{url:"/_next/static/css/089e04fe3961d2ec.css",revision:"089e04fe3961d2ec"},{url:"/_next/static/css/0be61875c8773185.css",revision:"0be61875c8773185"},{url:"/_next/static/css/21bf2696ee6eb4ad.css",revision:"21bf2696ee6eb4ad"},{url:"/_next/static/css/228b3b2860d4efea.css",revision:"228b3b2860d4efea"},{url:"/_next/static/css/25455a82711f1fd1.css",revision:"25455a82711f1fd1"},{url:"/_next/static/css/2f3387e5d9f5fa63.css",revision:"2f3387e5d9f5fa63"},{url:"/_next/static/css/306d86d219fe91de.css",revision:"306d86d219fe91de"},{url:"/_next/static/css/36404a2de8508914.css",revision:"36404a2de8508914"},{url:"/_next/static/css/7087c74253b49093.css",revision:"7087c74253b49093"},{url:"/_next/static/css/75d6dfaa26f6a758.css",revision:"75d6dfaa26f6a758"},{url:"/_next/static/css/847334e524685820.css",revision:"847334e524685820"},{url:"/_next/static/css/8ce42e48b7e018c0.css",revision:"8ce42e48b7e018c0"},{url:"/_next/static/css/a96f0156798ed3a7.css",revision:"a96f0156798ed3a7"},{url:"/_next/static/css/a9ffc2c569a4ad3f.css",revision:"a9ffc2c569a4ad3f"},{url:"/_next/static/css/b54b1a1892f9cfcc.css",revision:"b54b1a1892f9cfcc"},{url:"/_next/static/css/b7cb7bc97dd4084c.css",revision:"b7cb7bc97dd4084c"},{url:"/_next/static/css/b7ebf35967ede2c3.css",revision:"b7ebf35967ede2c3"},{url:"/_next/static/css/e7e56f50358d5025.css",revision:"e7e56f50358d5025"},{url:"/_next/static/css/ef637b3b68028457.css",revision:"ef637b3b68028457"},{url:"/_next/static/css/f74a7ac5e71430a9.css",revision:"f74a7ac5e71430a9"},{url:"/_next/static/media/InterVariable-Italic.ef0ecaff.woff2",revision:"ef0ecaff"},{url:"/_next/static/media/InterVariable.ff710c09.woff2",revision:"ff710c09"},{url:"/_next/static/media/primeicons.19e14e48.svg",revision:"19e14e48"},{url:"/_next/static/media/primeicons.310a7310.ttf",revision:"310a7310"},{url:"/_next/static/media/primeicons.7f772274.woff",revision:"7f772274"},{url:"/_next/static/media/primeicons.8ca441e1.eot",revision:"8ca441e1"},{url:"/_next/static/media/primeicons.e1a53edb.woff2",revision:"e1a53edb"},{url:"/assetlinks.json",revision:"f6f7ee1548c66e1bc745852b6f7af644"},{url:"/ayum.ico",revision:"6119f735c2085a8a008992a6a0e2d208"},{url:"/ayumTranparent.png",revision:"dc22c74d18c49e5321788708be634e4c"},{url:"/ayumlogo.png",revision:"98b58fdb2d4aca5bd35d4075cc975ac2"},{url:"/ayumlogormbg.png",revision:"ab6acc98f17d97759fd20bb755dc9d88"},{url:"/ayumtranparent1.svg",revision:"cd974e90c85cec284f802be958b63e7c"},{url:"/barkha.jpg",revision:"3d7bd7a37b90dd6d110d2760b785ce17"},{url:"/bl.jpeg",revision:"c75e5c9829c3ea0224377e549122b72c"},{url:"/bloodheadback.jpg",revision:"29d6815cb95cc9554c2957e4b04bd78c"},{url:"/bloodheadback.png",revision:"1a5572eae60224ae4c1ffdae7ea7d74a"},{url:"/bloodlogo2.png",revision:"d2a32ffccb1b4d0182e894fda185c61f"},{url:"/bookico.jpg",revision:"bb33208541077365653ff43c90635d4a"},{url:"/cardback.svg",revision:"d2f96e10994f43a3a61499d69199563e"},{url:"/close.svg",revision:"3bbe74fbc7285ce49c9825ec683c18fa"},{url:"/contact2.jpg",revision:"58e1f92478408553e4cc78dda83d06d3"},{url:"/dcard.jpg",revision:"83d7309d5008eb00df4c7567146ab892"},{url:"/deafaultpro.jpg",revision:"aa2371488cfea4e07068a0f6fe574dad"},{url:"/demo.svg",revision:"dd74cd8b50cb3eae65dc54d20284a464"},{url:"/dhreendra.jpeg",revision:"29140452dc2a819324d9da9afaf8895f"},{url:"/favicon.ico",revision:"80c61bb06b68a8ed68604edb7ec32ed1"},{url:"/firebase-messaging-sw.js",revision:"a84c390ead7da5bdc1aecb66bd48cf17"},{url:"/footericon.png",revision:"5e55f30753a0645a828fc50f71e9ebe5"},{url:"/google.svg",revision:"4854ffe77b500199e36ed1b3318e9a19"},{url:"/heart.gif",revision:"8ca76735790d0848bf7a4478553b6c0b"},{url:"/heart.svg",revision:"a4d2f05244c77b45b62adc0c532f8daa"},{url:"/icons/icon-192x192.png",revision:"3698ab871feaedfee11c0ab5acc221c2"},{url:"/icons/icon-256x256.png",revision:"64686bc4a0dcc5a73abdcb95abb372ef"},{url:"/icons/icon-384x384.png",revision:"983ac855ab6757751903d1846e9698b0"},{url:"/icons/icon-512x512.png",revision:"3221274b86d907e319b1806420dab299"},{url:"/icons/icon-96x96.png",revision:"aee5b87b5f162670d5669c9bd700c776"},{url:"/icons/icon-99x99.png",revision:"a61d96318cc084577a33a7dcd735fe81"},{url:"/leftside.gif",revision:"86791ab5aeeebe29bd215c1116cfe5c3"},{url:"/loader.svg",revision:"c0fcad3ee28678feece53dbccc8af60d"},{url:"/loader4.svg",revision:"c0fcad3ee28678feece53dbccc8af60d"},{url:"/locales/en/index.js",revision:"0fbe73c9328a775c7edab0152b94fc78"},{url:"/locales/en/labtest.js",revision:"ce97cf4f6b48a73cb6996399f7319187"},{url:"/locales/en/reviewoption.js",revision:"0295fb325998a232435cf51e0d88dfde"},{url:"/locales/en/search.js",revision:"f2b1466f90e5ae9477926c70ef3340ec"},{url:"/locales/hi/index.js",revision:"fcd8dce5c39447dae71faded2e24bb50"},{url:"/locales/hi/labtest.js",revision:"75a05df3266ec397b232669f4c053709"},{url:"/locales/hi/reviewoption.js",revision:"c46b3508ff373ac5ab39c53fadcca92a"},{url:"/locales/hi/search.js",revision:"904bfde57f818ea0979ad72f86cdaf98"},{url:"/manifest.json",revision:"f9308c875c3f350ac97e9b4a03c87d77"},{url:"/mapthumb.jpeg",revision:"b6424295deb653e9b0136cbb4e85a015"},{url:"/nashamukt.jpg",revision:"d5f42d81a67345154ce993e924ccbc0b"},{url:"/notfound.png",revision:"729b3d7628d044c05ef602f7aca293f7"},{url:"/offline.png",revision:"cf545f006045e2c66f40d47e0877572e"},{url:"/robots.txt",revision:"a5f8fc0ed28cfca9262ad084d67ac21d"},{url:"/screenshot.JPEG",revision:"3843b87afc12bd0c05a61c843458e5a9"},{url:"/searchill.png",revision:"bb5b244c60ac2718675309cdfe431b04"},{url:"/service-worker.js",revision:"6bf6ccb608553c6958311332a0babb35"},{url:"/sitemap.xml",revision:"4bad52fc4958d99377ca28f42d010f38"},{url:"/strip-test-icon.svg",revision:"8bcef3323a5c79fc98d49fdc6f94629c"},{url:"/success.gif",revision:"2e6588591cea4f98ebb650ec01800b02"},{url:"/success.svg",revision:"f13e7bc80289f376cb3f0306e9a87e11"},{url:"/threedot.png",revision:"f486195be916fa612156caff76e2f061"},{url:"/utils/Utils.js",revision:"153aecc491454bc82ba7611ef2346dac"},{url:"/whatsapplogo.svg",revision:"c0c827f0a5a1f11bfdd8fc60a4087d5c"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
