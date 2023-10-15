// self.addEventListener("push", (event) => {
//   console.log("Push notification received");

//   const data = event.data.json();

//   const options = {
//     body: data.body,
//     icon: "icons/icon-192x192.png",
//     actions: [
//       {
//         action: "view",
//         title: "View",
//       },
//     ],
//   };

//   event.waitUntil(self.registration.showNotification(data.title, options));
// });

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   if (event.action === "view") {
//     clients.openWindow("/");
//   } else {
//     clients.openWindow("/");
//   }
// });

// self.addEventListener("pushsubscriptionchange", (event) => {
//   event.waitUntil(
//     self.registration.pushManager
//       .subscribe(event.oldSubscription.options)
//       .then((subscription) => {
//         console.log("Subscription renewed");

//         // Send subscription details to server
//       })
//   );
// });
