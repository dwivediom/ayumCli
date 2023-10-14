

// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDSynbYEEylMVxN7X4jxbRQryhfieREV_Y",
    authDomain: "ayum-b51f8.firebaseapp.com",
    projectId: "ayum-b51f8",
    storageBucket: "ayum-b51f8.appspot.com",
    messagingSenderId: "209089073971",
    appId: "1:209089073971:web:e8ef81ad5627698759a446",
    measurementId: "G-1RJPF2S40R"
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});