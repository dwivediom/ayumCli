const host = process.env.NEXT_PUBLIC_B_PORT_CHAT;
import axios from "axios";
export const notify = async (data) => {
  try {
    let url = `${host}/webpush/notify`;
    const notifydata = await axios.post(url, {
      auth: data.auth,
      endpoint: data.endpoint,
      p256dh: data.p256dh,
      sender: data.sender,
    });
    console.log("notifydata", notifydata);
  } catch (error) {
    console.log(error.message);
  }
};