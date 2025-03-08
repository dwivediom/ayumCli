


export const webpushfunc = async () => {
  // Request notification permission if supported.
  if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
    Notification.requestPermission();
  }

  // This object will hold our subscription data.
  let data = { endpoint: "", keys: "" };

  if ('serviceWorker' in navigator) {
    // Unregister any existing service workers that are NOT our desired service worker.
    const registrations = await navigator.serviceWorker.getRegistrations();
    // const desiredSW = window.location.origin + '/service-worker.js';
    const desiredSW = window.location.origin + '/sw.js';
    
    for (const reg of registrations) {
      if (reg.active && reg.active.scriptURL !== desiredSW) {
        console.log("Unregistering unwanted service worker:", reg.active.scriptURL);
        await reg.unregister();
      }
    }

    // Now register our desired service worker.
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log("Registration of service-worker.js:", registration);

    if (registration) {
      // Try to get an existing push subscription.
      let subscription = await registration.pushManager.getSubscription();
      console.log("Existing subscription:", subscription);

      if (subscription) {
        const { keys } = subscription.toJSON();
        localStorage.setItem("endpoint", subscription.endpoint);
        localStorage.setItem("auth", keys.auth);
        localStorage.setItem("p256dh", keys.p256dh);
        console.log("Existing subscription keys:", keys);
        data.endpoint = subscription.endpoint;
        data.keys = keys;
      } else {
        // If no subscription exists, subscribe for push notifications.
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BHlZrVcFbtwwcskZb_GsoI_24awXaocN8t4u97h8V0P5-qJICH2OABCDzoXLy4cHDMVe4WToZ333-lco3awQk8U'
        });
        console.log("New subscription created:", newSubscription);
        const { keys } = newSubscription.toJSON();
        localStorage.setItem("endpoint", newSubscription.endpoint);
        localStorage.setItem("auth", keys.auth);
        localStorage.setItem("p256dh", keys.p256dh);
        console.log("New subscription keys:", keys);
        data.endpoint = newSubscription.endpoint;
        data.keys = keys;
      }
    }
  }

  console.log("Final subscription data:", data);
  return data;
};



