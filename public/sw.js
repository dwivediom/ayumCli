if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>c(e,n),f={module:{uri:n},exports:t,require:r};s[n]=Promise.all(a.map((e=>f[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-e13f827e"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/MnzJinh7EQino9WZc-axP/_buildManifest.js",revision:"c7f6f00093fb32cb887f5df1bcd9d8f6"},{url:"/_next/static/MnzJinh7EQino9WZc-axP/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/139.cd6ddd86ee2f33c4.js",revision:"cd6ddd86ee2f33c4"},{url:"/_next/static/chunks/174.43b30ef142b64d76.js",revision:"43b30ef142b64d76"},{url:"/_next/static/chunks/196-0ea14f3c87d810aa.js",revision:"0ea14f3c87d810aa"},{url:"/_next/static/chunks/228-da289e96a4e16ca9.js",revision:"da289e96a4e16ca9"},{url:"/_next/static/chunks/261-808b0d126e8cd729.js",revision:"808b0d126e8cd729"},{url:"/_next/static/chunks/447.9ffa7902ebe3ed10.js",revision:"9ffa7902ebe3ed10"},{url:"/_next/static/chunks/489.edc5c6be1ce8b446.js",revision:"edc5c6be1ce8b446"},{url:"/_next/static/chunks/63-30c8e6c7beaf231a.js",revision:"30c8e6c7beaf231a"},{url:"/_next/static/chunks/651.315acd74c359d21f.js",revision:"315acd74c359d21f"},{url:"/_next/static/chunks/74.0a046ff02daa6e57.js",revision:"0a046ff02daa6e57"},{url:"/_next/static/chunks/741.540fab4294b5281b.js",revision:"540fab4294b5281b"},{url:"/_next/static/chunks/877.09a2b78486d1b67f.js",revision:"09a2b78486d1b67f"},{url:"/_next/static/chunks/919.9422d38095b9f1d9.js",revision:"9422d38095b9f1d9"},{url:"/_next/static/chunks/958.a9913a555317eaeb.js",revision:"a9913a555317eaeb"},{url:"/_next/static/chunks/framework-7751730b10fa0f74.js",revision:"7751730b10fa0f74"},{url:"/_next/static/chunks/main-8b3e5b4712f674a9.js",revision:"8b3e5b4712f674a9"},{url:"/_next/static/chunks/pages/About-92501c40b99a0308.js",revision:"92501c40b99a0308"},{url:"/_next/static/chunks/pages/Category/Category-9f997fda59ec3465.js",revision:"9f997fda59ec3465"},{url:"/_next/static/chunks/pages/Chatpage-1d22b211e4db7d08.js",revision:"1d22b211e4db7d08"},{url:"/_next/static/chunks/pages/Contact-05f0e23662791591.js",revision:"05f0e23662791591"},{url:"/_next/static/chunks/pages/DoctorDirectory-48d1df004073e573.js",revision:"48d1df004073e573"},{url:"/_next/static/chunks/pages/New-9fb1aa20094e7ffa.js",revision:"9fb1aa20094e7ffa"},{url:"/_next/static/chunks/pages/Other/BloodBank-e429f31627a8ec64.js",revision:"e429f31627a8ec64"},{url:"/_next/static/chunks/pages/Other/Campaign-95f19644756191b1.js",revision:"95f19644756191b1"},{url:"/_next/static/chunks/pages/Other/Nashmukti-7b7f78232e5822e0.js",revision:"7b7f78232e5822e0"},{url:"/_next/static/chunks/pages/PrivacyPolicy-c331df1db427f2b4.js",revision:"c331df1db427f2b4"},{url:"/_next/static/chunks/pages/Search/Search-f5f541b43c0a232c.js",revision:"f5f541b43c0a232c"},{url:"/_next/static/chunks/pages/User/BookAppointmentPage-1dd482528de7caae.js",revision:"1dd482528de7caae"},{url:"/_next/static/chunks/pages/User/SelectClinic-03c3a763f1bf9a58.js",revision:"03c3a763f1bf9a58"},{url:"/_next/static/chunks/pages/User/UserRegistrationPage-f47c3c9645dd99fa.js",revision:"f47c3c9645dd99fa"},{url:"/_next/static/chunks/pages/User/userAppo-135aa5b3108a5a5c.js",revision:"135aa5b3108a5a5c"},{url:"/_next/static/chunks/pages/_app-70cb9f3c1cc5f3fa.js",revision:"70cb9f3c1cc5f3fa"},{url:"/_next/static/chunks/pages/_error-2368f2bbbb3169cf.js",revision:"2368f2bbbb3169cf"},{url:"/_next/static/chunks/pages/index-e8126fe597d286ae.js",revision:"e8126fe597d286ae"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-ed0ea8f2dcc3acbb.js",revision:"ed0ea8f2dcc3acbb"},{url:"/_next/static/css/06e9167781bdcae2.css",revision:"06e9167781bdcae2"},{url:"/_next/static/css/11f01844dc66b8ee.css",revision:"11f01844dc66b8ee"},{url:"/_next/static/css/1df552f6971a9a09.css",revision:"1df552f6971a9a09"},{url:"/_next/static/css/2d5a8f3f294199c2.css",revision:"2d5a8f3f294199c2"},{url:"/_next/static/css/4a0b2e0700ef81e1.css",revision:"4a0b2e0700ef81e1"},{url:"/_next/static/css/5b6236f759bdbbb6.css",revision:"5b6236f759bdbbb6"},{url:"/_next/static/css/61531622b545518a.css",revision:"61531622b545518a"},{url:"/_next/static/css/6d96ac1b3f77a907.css",revision:"6d96ac1b3f77a907"},{url:"/_next/static/css/819d82c890ff8c50.css",revision:"819d82c890ff8c50"},{url:"/_next/static/css/9008fe733d52fcdb.css",revision:"9008fe733d52fcdb"},{url:"/_next/static/css/983bd181fd3801a3.css",revision:"983bd181fd3801a3"},{url:"/_next/static/css/aea469f8eb69145a.css",revision:"aea469f8eb69145a"},{url:"/_next/static/css/d7b40d6492507046.css",revision:"d7b40d6492507046"},{url:"/_next/static/css/e20ece7c6920cff9.css",revision:"e20ece7c6920cff9"},{url:"/_next/static/css/f158bc29d949197c.css",revision:"f158bc29d949197c"},{url:"/_next/static/css/f61d1b755579f8ef.css",revision:"f61d1b755579f8ef"},{url:"/assetlinks.json",revision:"f6f7ee1548c66e1bc745852b6f7af644"},{url:"/ayum.ico",revision:"6119f735c2085a8a008992a6a0e2d208"},{url:"/ayumTranparent.png",revision:"80610e3c93350751cea84db83194f926"},{url:"/back3.png",revision:"084c64c63b896850efdfe75aa652a108"},{url:"/barkha.jpg",revision:"3d7bd7a37b90dd6d110d2760b785ce17"},{url:"/bl.jpeg",revision:"c75e5c9829c3ea0224377e549122b72c"},{url:"/bloodheadback.jpg",revision:"29d6815cb95cc9554c2957e4b04bd78c"},{url:"/bloodheadback.png",revision:"1a5572eae60224ae4c1ffdae7ea7d74a"},{url:"/bloodlogo.jpg",revision:"653cbb9713a6ca153453bdcdfad88c5f"},{url:"/bookico.jpg",revision:"bb33208541077365653ff43c90635d4a"},{url:"/cardback.svg",revision:"a395989c563bd07fcaa28f16dc832a1e"},{url:"/contact2.jpg",revision:"58e1f92478408553e4cc78dda83d06d3"},{url:"/dcard.jpg",revision:"83d7309d5008eb00df4c7567146ab892"},{url:"/deafaultpro.jpg",revision:"aa2371488cfea4e07068a0f6fe574dad"},{url:"/dhreendra.jpeg",revision:"29140452dc2a819324d9da9afaf8895f"},{url:"/favicon.ico",revision:"80c61bb06b68a8ed68604edb7ec32ed1"},{url:"/footericon.png",revision:"5e55f30753a0645a828fc50f71e9ebe5"},{url:"/google.svg",revision:"4854ffe77b500199e36ed1b3318e9a19"},{url:"/heart.gif",revision:"8ca76735790d0848bf7a4478553b6c0b"},{url:"/icons/icon-192x192.png",revision:"3698ab871feaedfee11c0ab5acc221c2"},{url:"/icons/icon-256x256.png",revision:"64686bc4a0dcc5a73abdcb95abb372ef"},{url:"/icons/icon-384x384.png",revision:"983ac855ab6757751903d1846e9698b0"},{url:"/icons/icon-512x512.png",revision:"3221274b86d907e319b1806420dab299"},{url:"/icons/icon-96x96.png",revision:"aee5b87b5f162670d5669c9bd700c776"},{url:"/icons/icon-99x99.png",revision:"a61d96318cc084577a33a7dcd735fe81"},{url:"/loader.svg",revision:"1ad10ce3d935204f10340dc9b0854f08"},{url:"/loader4.gif",revision:"ebffd4d5a550a231f010cbe5cbf2edec"},{url:"/manifest.json",revision:"f9308c875c3f350ac97e9b4a03c87d77"},{url:"/mapthumb.jpeg",revision:"ac5d753b075bf7fee8b0bce72694763c"},{url:"/nashamukt.jpg",revision:"d5f42d81a67345154ce993e924ccbc0b"},{url:"/notfound.png",revision:"729b3d7628d044c05ef602f7aca293f7"},{url:"/offline.png",revision:"cf545f006045e2c66f40d47e0877572e"},{url:"/screenshot.JPEG",revision:"3843b87afc12bd0c05a61c843458e5a9"},{url:"/searchill.png",revision:"bb5b244c60ac2718675309cdfe431b04"},{url:"/service-worker.js",revision:"645f1400e4d1b24db9b8f752829e609d"},{url:"/sitemap.xml",revision:"19647c70e0d6eb6c4e2378c6728846e1"},{url:"/success.svg",revision:"1750a3df19ce205aeec0c8e1baea3efe"},{url:"/threedot.png",revision:"f486195be916fa612156caff76e2f061"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
