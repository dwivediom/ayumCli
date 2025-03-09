

// eslint-disable-next-line no-undef
// importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// // eslint-disable-next-line no-undef
// importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const VAPIDKEY = "BAlM_XtojF6EnFWmFBqOacUJMs9StAIfA0oabx3j-O9hPg1vz1zJauZ4u4PlHcW4pKQjQhHSZ7gX7zwWjbUH2Yg"

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


// Function to get new token
async function getNewToken() {
  try {
    const token = await messaging.getToken({
      vapidKey: VAPIDKEY
    });
    return token;
  } catch (error) {
    console.error('Error getting new token:', error);
    throw error;
  }
}




// Function to update token in database
async function updateTokenInDB(token, userId) {
  try {
    const response = await fetch('https://server.ayum.in/api/notification/update-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "deviceId":userId,
       "token": token,
        "source": 'service-worker'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update token');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating token in DB:', error);
    throw error;
  }
}

function getDeviceIdFromStorage() {
  deviceId = self.localStorage.getItem('deviceId');
  console.log("device_id" ,deviceId)
  return deviceId ;
}






messaging.onBackgroundMessage(async (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  // Check if this is a silent refresh token message
  if (payload.data && payload.data.action === 'REFRESH_TOKEN') {
    try {
      // Get userId from IndexedDB
      const userId = await getUserIdFromStorage();
      if (!userId) {
        console.error('No userId found in storage');
        return;
      }

      // Get new token
      const newToken = await getNewToken();
      if (newToken) {
        // Update token in database
        await updateTokenInDB(newToken, userId);
        console.log('Token successfully refreshed and updated in background');
      }
    } catch (error) {
      console.error('Error handling token refresh in background:', error);
    }
    return; // Don't show notification for silent push
  }






  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    title: payload.notification.title,
    body: payload.notification.body,
    icon: payload.notification.icon,
    click_action: payload.notification.icon.click_action

  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});