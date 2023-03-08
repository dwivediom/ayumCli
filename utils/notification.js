export const webpushfunc = async () => {
  if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      // Request permission for notifications
      Notification.requestPermission();
    }
       var  data ={endpoint:"" , keys:"" }; 
    if ('serviceWorker' in navigator) {
      const registration = await    navigator.serviceWorker.register('/service-worker.js')
      console.log("registration", registration)
      if(registration){ 
         const  subscription= await   registration.pushManager.getSubscription()
           
         console.log("subscription" ,subscription)
       if(subscription) {
          
         const { keys } = subscription.toJSON();
            localStorage.setItem("endpoint" ,subscription.endpoint )
            localStorage.setItem("auth", keys.auth), 
            localStorage.setItem("p256dh",keys.p256dh)
           console.log("keys",keys);
           data.endpoint = subscription.endpoint
           data.keys=keys
          }
         
         if(subscription==null){ 
         const createsubcirbtion = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BHlZrVcFbtwwcskZb_GsoI_24awXaocN8t4u97h8V0P5-qJICH2OABCDzoXLy4cHDMVe4WToZ333-lco3awQk8U'
          });
           console.log("createsubcirbtion",createsubcirbtion)
           const { keys } = createsubcirbtion.toJSON();
           localStorage.setItem("endpoint" ,createsubcirbtion.endpoint )
           localStorage.setItem("auth", keys.auth), 
            localStorage.setItem("p256dh",keys.p256dh)
           console.log("keys",keys);
         }
      }
    }
    console.log("data", data )
    return data 
  }