// firebaseToken.js
import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseApp } from './firebase.config';

const VAPIDKEY =process.env.NEXT_PUBLIC_B_VAPIDKEY

// Update token to your backend running at localhost:5000
const sendTokenToServer = async (userId, token) => {
  try {
    await fetch('https://server.ayum.in/api/notification/update-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "deviceId":userId, "token": token }),
    });
  } catch (error) {
    console.error('Error updating FCM token on the server:', error);
  }
};

const useFcmToken = (userId) => {
  const [token, setToken] = useState('');
  const [permissionStatus, setPermissionStatus] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp);

      const retrieveToken = async () => {
        try {
          const permission = await Notification.requestPermission();
          setPermissionStatus(permission);
          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: VAPIDKEY,
            });
            if (currentToken) {
              setToken(currentToken);
              // Update the token on the backend with the provided userId
              await sendTokenToServer(userId, currentToken);
              console.log(" token is set ," ,  currentToken )
            }
          }
        } catch (error) {
          console.error('Error retrieving FCM token:', error);
        }
      };

      retrieveToken();

      // Listen for foreground push messages
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground push notification:', payload);
        if (payload?.data?.action === 'REFRESH_TOKEN') {
          console.log('Received REFRESH_TOKEN action, refreshing token...');
          retrieveToken(); // Re-fetch token on silent push
        }
      });
      return () => unsubscribe();
    }
  }, [userId]);

  return { fcmToken: token, permissionStatus };
};

export default useFcmToken;

// Function to manually refresh the token (e.g. triggered by UI or message)
export async function refreshFcmToken(userId) {
  try {
    const messaging = getMessaging(firebaseApp);
    const currentToken = await getToken(messaging, { vapidKey: VAPIDKEY });
    if (currentToken) {
      console.log('New FCM Token:', currentToken);
      // Update token on the server
      await sendTokenToServer(userId, currentToken);
      return currentToken;
    } else {
      console.warn('No FCM token available. Request permission to generate one.');
    }
  } catch (error) {
    console.error('Error refreshing FCM token:', error);
  }
}

// Optional: A function to subscribe for notifications (if needed)
export const notificationRequest = async () => {
  console.log("Entering notificationRequest");
  if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
    console.log("Notification capabilities available");
    const messaging = getMessaging(firebaseApp);
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground push notification received:', payload);
    });
    return () => unsubscribe();
  }
};




//**
// * Requests notification permission robustly.
// * If running on the server (window is undefined), it will simply return.
// * If the permission is "default" or "denied", it will try to request permission.
// * @returns {Promise<string>} The final permission state ("granted", "denied", or "default")
// */
export async function requestNotificationPermission() {
 // Check if we're running in the browser
 if (typeof window === 'undefined' || !("Notification" in window)) {
   console.error("Notifications are not supported or we're running on the server.");
   return "unsupported";
 }

 let permission = Notification.permission;
 console.log("Current notification permission:", permission);

 // Already granted
 if (permission === "granted") {
   console.log("Notification permission is already granted.");
   return permission;
 }

 // If permission is default, request it.
 if (permission === "default") {
   try {
     permission = await Notification.requestPermission();
     console.log("Notification permission after request:", permission);
     return permission;
   } catch (error) {
     console.error("Error requesting notification permission:", error);
     return permission;
   }
 }

 // If permission is denied, you might try to request again (browsers often won't re-prompt)
 if (permission === "denied") {
   console.warn("Notification permission is denied. Attempting to request again.");
   try {
     permission = await Notification.requestPermission();
     console.log("Notification permission after re-request:", permission);
     return permission;
   } catch (error) {
     console.error("Error re-requesting notification permission:", error);
     return permission;
   }
 }

 return permission;
}
export const ensureFcmToken = async () => {
  try {
    // First check if we have permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Check if we already have a token in localStorage
    let storedToken = localStorage.getItem('fcmToken');
    if (storedToken) {
      console.log('Using existing FCM token from localStorage');
      return storedToken;
    }

    // If no token, generate new one
    const messaging = getMessaging(firebaseApp);
    const newToken = await getToken(messaging, { vapidKey: VAPIDKEY });
    
    if (newToken) {
      console.log('Generated new FCM token');
      localStorage.setItem('fcmToken', newToken);
      return newToken;
    }

    console.warn('Failed to generate FCM token');
    return null;
  } catch (error) {
    console.error('Error in ensureFcmToken:', error);
    return null;
  }
};
