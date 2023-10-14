import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
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