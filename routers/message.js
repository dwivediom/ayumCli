import axios from "axios";
const host = process.env.NEXT_PUBLIC_B_PORT_CHAT;

export const setmessage = async (msg) => {
  let url = `${host}/message/add`;
  let data = await axios.post(url, msg);
};

export const getAllMessages = async (conversationId) => {
  try {
    let url = `${host}/message/get/${conversationId}`;

    const messagedata = await axios.get(url);

    return messagedata;
  } catch (err) {
    console.log(" messnage.js 17", err);
  }
};
export const getOldMessages = async (conversationId) => {
  try {
    let url = `${host}/message/oldmsg/${conversationId}`;

    const messagedata = await axios.get(url);

    return messagedata;
  } catch (err) {
    console.log(" messnage.js 17", err);
  }
};
