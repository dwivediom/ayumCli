import React, { useEffect } from "react";

function NotifactionComp() {
  useEffect(() => {
    // Check if the Web Push API is supported
    if (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      // Request permission for notifications
      Notification.requestPermission();
    }
  }, []);

  const handleNotificationClick = () => {
    // Do something when the notification is clicked
    console.log("Notification clicked");
  };

  const handleShowNotification = () => {
    // Show a notification
    const options = {
      body: "This is the notification body",
      icon: "/path/to/icon.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
      actions: [
        { action: "explore", title: "Explore" },
        { action: "close", title: "Close" },
      ],
    };

    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("Notification Title", options).then(() => {
        console.log("Notification shown");
      });
    });
  };

  return (
    <div>
      <button onClick={handleShowNotification}>Show Notification</button>
    </div>
  );
}

export default NotifactionComp;
