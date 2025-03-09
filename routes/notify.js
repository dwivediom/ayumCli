const chat_host = process.env.NEXT_PUBLIC_B_PORT_CHAT;
const host = process.env.NEXT_PUBLIC_B_PORT; // e.g. "http://localhost:5000"

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



// api/notificationApi.js


/**
 * Registers or updates a device token anonymously.
 * @param {string} deviceId - The unique identifier for the device.
 * @param {string} token - The FCM token.
 * @returns {Promise<object>} Response from the server.
 */
export async function registerDeviceToken(deviceId, token) {

  
  try {
    if(deviceId && token) {
    console.log("deviceid " , deviceId , token)
    const response = await axios.post(`${host}/api/notification/register`, 
      { deviceId, token },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
    }

  } catch (error) {
    console.error("Error in registerDeviceToken:", error);
    throw error;
  }
}
/**
 * Links an existing device token record to a user.
 * @param {string} deviceId - The unique identifier for the device.
 * @param {string} userId - The user's ID.
 * @returns {Promise<object>} Response from the server.
 */
export async function linkUser(deviceId, userId) {
  try {
    const res = await fetch(`${host}/api/notification/link-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, userId }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in linkUser:", error);
    throw error;
  }
}

/**
 * Retrieves device tokens filtered by userId or deviceId.
 * @param {object} filter - An object containing userId and/or deviceId.
 * @returns {Promise<object>} Response from the server containing tokens.
 */
export async function getTokens(filter = {}) {
  try {
    // Construct query parameters
    const query = new URLSearchParams(filter).toString();
    const res = await fetch(`${host}/api/notification/tokens?${query}`, {
      method: 'GET',
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getTokens:", error);
    throw error;
  }
}

/**
 * Sends a visible notification to devices based on a filter.
 * @param {object} filter - Object containing filter criteria (e.g. { userId: '123' }).
 * @param {object} notification - Notification details: { title, body, data }.
 * @returns {Promise<object>} Response from the server.
 */
export async function sendNotification(filter, notification) {
  try {
    const res = await fetch(`${host}/api/notification/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter, notification }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in sendNotification:", error);
    throw error;
  }
}

/**
 * Sends a silent push to all devices to trigger an FCM token refresh.
 * @returns {Promise<object>} Response from the server.
 */
export async function refreshAllTokens() {
  try {
    const res = await fetch(`${host}/api/notification/refresh-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in refreshAllTokens:", error);
    throw error;
  }
}
