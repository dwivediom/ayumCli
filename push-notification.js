import { useEffect, useState } from 'react';
import { getMessaging, getToken , onMessage } from 'firebase/messaging';
import { firebaseApp } from './firebase.config';

const useFcmToken = () => {
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState('');

  useEffect(() => {
    const retrieveToken = async () => {
      try {
         console.log("eintring1")
        if ('serviceWorker' in navigator) {
            console.log("eintring2")
          const messaging = getMessaging(firebaseApp);
          

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          // Check if permission is granted before retrieving the token
          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey:
                'BAlM_XtojF6EnFWmFBqOacUJMs9StAIfA0oabx3j-O9hPg1vz1zJauZ4u4PlHcW4pKQjQhHSZ7gX7zwWjbUH2Yg',
            });
            if (currentToken) {
              setToken(currentToken);
            } else {
              console.log(
                'No registration token available. Request permission to generate one.'
              );
            }
          }
        }
      } catch (error) {
        console.log('An error occurred while retrieving token:', error);
      }
    };

    retrieveToken();
  }, []);
 
  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;





export const  notificationRequest=async () =>{ 
  console.log("entring1")
  if ( 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
    
  console.log("entring2")
    const messaging = getMessaging(firebaseApp);
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground push notification received:', payload);
      // Handle the received push notification while the app is in the foreground
      // You can display a notification or update the UI based on the payload
    });
    return () => {
      unsubscribe(); // Unsubscribe from the onMessage event
    };
  }
}