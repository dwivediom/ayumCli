const host = process.env.NEXT_PUBLIC_B_PORT_CHAT;
import axios from "axios";
export const notify = async (data) => {
  // try {
  //   let url = `${host}/webpush/notify`;
  //   const notifydata = await axios.post(url, {
  //     auth: data.auth,
  //     endpoint: data.endpoint,
  //     p256dh: data.p256dh,
  //     sender: data.sender,
  //     message: data.message,
  //   });
  //   console.log("notifydata", notifydata);
  // } catch (error) {
  //   console.log(error.message);
  // }
};


// sending notifucation using firebase 

export const sendnotification  = async (notificationdata) => { 
  try {
    const  {title , body , click_action,icon , to}= notificationdata
    const url = 'https://fcm.googleapis.com/fcm/send';
    const data = {
      notification: {
        title:  title, 
        body: body,
        click_action:click_action ,
        icon: icon,
      },
      to: to,
    };
    const headers = {
      Authorization: 'key=AAAAMK6uEzM:APA91bHmZTCfD5av6WmYlkvO6tPYm7xcSV5BkwKwltiZlKSRaJqsucjfNMiZE-D5Xz-7Hv3z5MlhrHHkbAxfX7OPRntlvgtXGLkzNXQMXwTTLcs3Xq6QxbMYGDakZz9BG52IIvASCFJU',
    };

    const response = await axios.post(url, data, { headers });
    console.log('Push notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}



