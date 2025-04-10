import axios from "axios";
import { use } from "react";
import RecentChat from "../components/usersSection/RecentChat";
const host = process.env.NEXT_PUBLIC_B_PORT_CHAT;
export const adduser = async (userData) => {
  console.log(userData, "User Ka Data");
  try {
    const url = `${host}/user/add`;
    const logined = await axios.post(url, {
      data: userData,
    });
    return { msg: "useradded", user: logined };
  } catch (error) {
    console.log("error in adduser forntend ", error.message);
  }
};
export const getuser = async () => {
  try {
    let url = `${host}/user/data`;
    const userdata = await axios.get(url);
    return userdata;
  } catch (err) {
    console.log(err.messange);
  }
};

export const setConversation = async (senderId, reciverId) => {
  try {
    let url = `${host}/conversation/set`;
    let conversationdata = await axios.post(url, {
      data: {
        SenderId: senderId,
        ReciverId: reciverId,
      },
    });
    return conversationdata;
  } catch (error) {
    console.log(error.message);
  }
};

export const getuserId = async (senderId, reciverId) => {
  try {
    console.log("getconverstaion", senderId, reciverId);
    let url = `${host}/conversation/get`;
    const data = await axios.post(url, {
      data: {
        SenderId: senderId,
        ReciverId: reciverId,
      },
    });
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

export const getRecentChat = async (data) => {
  try {
    let url = `${host}/user/recentchat`;
    let userdata = await axios.post(url, { jwt: data });
    console.log("reacent chat data ", userdata);
    return userdata;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateuser = async (jwt, data) => {
  try {
    console.log(jwt, data);

    let url = `${host}/user/update`;

    let userData = await axios.post(url, {
      jwt: jwt,
      name: data.name,
      picture: data.picture,
      endpoint: data.endpoint,
      auth: data.auth,
      p256dh: data.p256dh,
      FCMtoken: data.FCMtoken,
    });
    console.log(" updated userd", userData);
    return userData;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

export const updateNavbar = () => {};
