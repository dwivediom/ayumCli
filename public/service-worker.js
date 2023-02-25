self.addEventListener("push", (event) => {
  console.log("Push notification received");

  const data = event.data.json();
  // if ('Notification' in window) {
  //   Notification.requestPermission().then(permission => {
  //     if (permission === 'granted') {
  //       const notification = new Notification('New message received', {
  //         body:  data.body,
  //         icon: '/icons/icon-192x192.png',
  //       });
  //     }
  //   });
  // }
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    actions: [
      {
        action: "view",
        title: "View",
      },
    ],
  });
});
