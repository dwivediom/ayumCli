if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>c(e,n),o={module:{uri:n},exports:t,require:r};s[n]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-e13f827e"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/RV9Gy7rDbCyOfHo2j9OR8/_buildManifest.js",revision:"15b5f5a5a8e6487d968d49b471ebdeaa"},{url:"/_next/static/RV9Gy7rDbCyOfHo2j9OR8/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/139.eeda84c5d33a7cbf.js",revision:"eeda84c5d33a7cbf"},{url:"/_next/static/chunks/243-98c35c0c4249a47d.js",revision:"98c35c0c4249a47d"},{url:"/_next/static/chunks/447.aac39c362ad5c79a.js",revision:"aac39c362ad5c79a"},{url:"/_next/static/chunks/464-902456c0cfaf6715.js",revision:"902456c0cfaf6715"},{url:"/_next/static/chunks/489.83b885b87885459d.js",revision:"83b885b87885459d"},{url:"/_next/static/chunks/651.427a8789c006c198.js",revision:"427a8789c006c198"},{url:"/_next/static/chunks/669-86ea23eb9ac9c9a3.js",revision:"86ea23eb9ac9c9a3"},{url:"/_next/static/chunks/74.2c331448d52a4285.js",revision:"2c331448d52a4285"},{url:"/_next/static/chunks/741.ca56dcdd613aef8a.js",revision:"ca56dcdd613aef8a"},{url:"/_next/static/chunks/818-e971826efdc3e494.js",revision:"e971826efdc3e494"},{url:"/_next/static/chunks/824.57f6c195b6227027.js",revision:"57f6c195b6227027"},{url:"/_next/static/chunks/877.1bec4e52f458e2ac.js",revision:"1bec4e52f458e2ac"},{url:"/_next/static/chunks/919.6fb841aa0afc1ade.js",revision:"6fb841aa0afc1ade"},{url:"/_next/static/chunks/95-fa200ae027d6ce66.js",revision:"fa200ae027d6ce66"},{url:"/_next/static/chunks/958.59e0b88ade267083.js",revision:"59e0b88ade267083"},{url:"/_next/static/chunks/framework-7751730b10fa0f74.js",revision:"7751730b10fa0f74"},{url:"/_next/static/chunks/main-727fb4ba232f3085.js",revision:"727fb4ba232f3085"},{url:"/_next/static/chunks/pages/About-a4ddee38fa7c23fe.js",revision:"a4ddee38fa7c23fe"},{url:"/_next/static/chunks/pages/Category/Category-a5d072c6f2b1f55e.js",revision:"a5d072c6f2b1f55e"},{url:"/_next/static/chunks/pages/ChatSection-61c73d9c00ea294d.js",revision:"61c73d9c00ea294d"},{url:"/_next/static/chunks/pages/Contact-05f0e23662791591.js",revision:"05f0e23662791591"},{url:"/_next/static/chunks/pages/DoctorDirectory-6c8d099cc365f750.js",revision:"6c8d099cc365f750"},{url:"/_next/static/chunks/pages/Other/BloodBank-cd4ce8916caaf371.js",revision:"cd4ce8916caaf371"},{url:"/_next/static/chunks/pages/Other/BloodRequest-520290d14d96c8f5.js",revision:"520290d14d96c8f5"},{url:"/_next/static/chunks/pages/Other/Bloodrecieve-9c435321aab99189.js",revision:"9c435321aab99189"},{url:"/_next/static/chunks/pages/Other/Campaign-bad1de3d937bb78b.js",revision:"bad1de3d937bb78b"},{url:"/_next/static/chunks/pages/Other/MyRequests-376419b5b731e9f0.js",revision:"376419b5b731e9f0"},{url:"/_next/static/chunks/pages/Other/Nashmukti-a207974ee8d3126f.js",revision:"a207974ee8d3126f"},{url:"/_next/static/chunks/pages/PrivacyPolicy-749100a88b1fda0b.js",revision:"749100a88b1fda0b"},{url:"/_next/static/chunks/pages/Search/Search-9cc97ac61c714b0f.js",revision:"9cc97ac61c714b0f"},{url:"/_next/static/chunks/pages/User/BookAppointmentPage-57146d320ca5a065.js",revision:"57146d320ca5a065"},{url:"/_next/static/chunks/pages/User/SelectClinic-cabba3c818f31268.js",revision:"cabba3c818f31268"},{url:"/_next/static/chunks/pages/User/UserRegistrationPage-e1a6e1486bbd57c3.js",revision:"e1a6e1486bbd57c3"},{url:"/_next/static/chunks/pages/User/userAppo-84a91c79617a230f.js",revision:"84a91c79617a230f"},{url:"/_next/static/chunks/pages/_app-cceefece310eeaad.js",revision:"cceefece310eeaad"},{url:"/_next/static/chunks/pages/_error-2368f2bbbb3169cf.js",revision:"2368f2bbbb3169cf"},{url:"/_next/static/chunks/pages/index-08f6e80bc0376589.js",revision:"08f6e80bc0376589"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-e1504adcf35f0857.js",revision:"e1504adcf35f0857"},{url:"/_next/static/css/05c4029efcdfd87f.css",revision:"05c4029efcdfd87f"},{url:"/_next/static/css/2e0534c6fff91d4e.css",revision:"2e0534c6fff91d4e"},{url:"/_next/static/css/2f3387e5d9f5fa63.css",revision:"2f3387e5d9f5fa63"},{url:"/_next/static/css/453cf6c92d7b1ca0.css",revision:"453cf6c92d7b1ca0"},{url:"/_next/static/css/4dfe16668015e2a9.css",revision:"4dfe16668015e2a9"},{url:"/_next/static/css/5d32ec242283c756.css",revision:"5d32ec242283c756"},{url:"/_next/static/css/6bb79145dcc36ea0.css",revision:"6bb79145dcc36ea0"},{url:"/_next/static/css/6cf6ac02f642dd47.css",revision:"6cf6ac02f642dd47"},{url:"/_next/static/css/801265d0326b9f1f.css",revision:"801265d0326b9f1f"},{url:"/_next/static/css/85edbf12bf91003f.css",revision:"85edbf12bf91003f"},{url:"/_next/static/css/89cb8551de5cb0e8.css",revision:"89cb8551de5cb0e8"},{url:"/_next/static/css/a4474509d0afa0f5.css",revision:"a4474509d0afa0f5"},{url:"/_next/static/css/c5b601b0100beebc.css",revision:"c5b601b0100beebc"},{url:"/_next/static/css/d22ec6acdf379831.css",revision:"d22ec6acdf379831"},{url:"/_next/static/css/ebb6896354f39a08.css",revision:"ebb6896354f39a08"},{url:"/_next/static/css/efda2962a4af9cec.css",revision:"efda2962a4af9cec"},{url:"/_next/static/css/f6b603a56d25ec5f.css",revision:"f6b603a56d25ec5f"},{url:"/_next/static/media/ayumTranparent.0882c648.png",revision:"0882c648"},{url:"/assetlinks.json",revision:"f6f7ee1548c66e1bc745852b6f7af644"},{url:"/ayum.ico",revision:"6119f735c2085a8a008992a6a0e2d208"},{url:"/ayumTranparent.png",revision:"dc22c74d18c49e5321788708be634e4c"},{url:"/barkha.jpg",revision:"3d7bd7a37b90dd6d110d2760b785ce17"},{url:"/bl.jpeg",revision:"c75e5c9829c3ea0224377e549122b72c"},{url:"/bloodheadback.jpg",revision:"29d6815cb95cc9554c2957e4b04bd78c"},{url:"/bloodheadback.png",revision:"1a5572eae60224ae4c1ffdae7ea7d74a"},{url:"/bloodlogo2.png",revision:"d2a32ffccb1b4d0182e894fda185c61f"},{url:"/bookico.jpg",revision:"bb33208541077365653ff43c90635d4a"},{url:"/cardback.svg",revision:"d2f96e10994f43a3a61499d69199563e"},{url:"/close.svg",revision:"3bbe74fbc7285ce49c9825ec683c18fa"},{url:"/contact2.jpg",revision:"58e1f92478408553e4cc78dda83d06d3"},{url:"/dcard.jpg",revision:"83d7309d5008eb00df4c7567146ab892"},{url:"/deafaultpro.jpg",revision:"aa2371488cfea4e07068a0f6fe574dad"},{url:"/demo.svg",revision:"dd74cd8b50cb3eae65dc54d20284a464"},{url:"/dhreendra.jpeg",revision:"29140452dc2a819324d9da9afaf8895f"},{url:"/favicon.ico",revision:"80c61bb06b68a8ed68604edb7ec32ed1"},{url:"/firebase-messaging-sw.js",revision:"a84c390ead7da5bdc1aecb66bd48cf17"},{url:"/footericon.png",revision:"5e55f30753a0645a828fc50f71e9ebe5"},{url:"/google.svg",revision:"4854ffe77b500199e36ed1b3318e9a19"},{url:"/heart.gif",revision:"8ca76735790d0848bf7a4478553b6c0b"},{url:"/heart.svg",revision:"de22c12057ab79ddfe867342d12df56f"},{url:"/icons/icon-192x192.png",revision:"3698ab871feaedfee11c0ab5acc221c2"},{url:"/icons/icon-256x256.png",revision:"64686bc4a0dcc5a73abdcb95abb372ef"},{url:"/icons/icon-384x384.png",revision:"983ac855ab6757751903d1846e9698b0"},{url:"/icons/icon-512x512.png",revision:"3221274b86d907e319b1806420dab299"},{url:"/icons/icon-96x96.png",revision:"aee5b87b5f162670d5669c9bd700c776"},{url:"/icons/icon-99x99.png",revision:"a61d96318cc084577a33a7dcd735fe81"},{url:"/leftside.gif",revision:"86791ab5aeeebe29bd215c1116cfe5c3"},{url:"/loader.svg",revision:"0a004d383b790c48c8e596a4ee951e98"},{url:"/loader4.svg",revision:"0a004d383b790c48c8e596a4ee951e98"},{url:"/locales/en/index.js",revision:"0fbe73c9328a775c7edab0152b94fc78"},{url:"/locales/en/labtest.js",revision:"ce97cf4f6b48a73cb6996399f7319187"},{url:"/locales/en/search.js",revision:"cfd2d2bd7a21825ef92d1a5315542b80"},{url:"/locales/hi/index.js",revision:"fcd8dce5c39447dae71faded2e24bb50"},{url:"/locales/hi/labtest.js",revision:"75a05df3266ec397b232669f4c053709"},{url:"/locales/hi/search.js",revision:"eaac34202fb572fcde769d90fdb70457"},{url:"/manifest.json",revision:"f9308c875c3f350ac97e9b4a03c87d77"},{url:"/mapthumb.jpeg",revision:"b6424295deb653e9b0136cbb4e85a015"},{url:"/nashamukt.jpg",revision:"d5f42d81a67345154ce993e924ccbc0b"},{url:"/notfound.png",revision:"729b3d7628d044c05ef602f7aca293f7"},{url:"/offline.png",revision:"cf545f006045e2c66f40d47e0877572e"},{url:"/screenshot.JPEG",revision:"3843b87afc12bd0c05a61c843458e5a9"},{url:"/searchill.png",revision:"bb5b244c60ac2718675309cdfe431b04"},{url:"/service-worker.js",revision:"6bf6ccb608553c6958311332a0babb35"},{url:"/sitemap.xml",revision:"19647c70e0d6eb6c4e2378c6728846e1"},{url:"/strip-test-icon.svg",revision:"8bcef3323a5c79fc98d49fdc6f94629c"},{url:"/success.gif",revision:"2e6588591cea4f98ebb650ec01800b02"},{url:"/success.svg",revision:"1750a3df19ce205aeec0c8e1baea3efe"},{url:"/threedot.png",revision:"f486195be916fa612156caff76e2f061"},{url:"/utils/Utils.js",revision:"977ac3de7e1b9ff498d30b26897213a8"},{url:"/whatsapplogo.svg",revision:"c0c827f0a5a1f11bfdd8fc60a4087d5c"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
