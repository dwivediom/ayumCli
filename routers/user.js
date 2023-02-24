import axios from "axios";
import { use } from "react";
const host = process.env.NEXT_PUBLIC_B_PORT_CHAT;
export const adduser = async (userData) => {
  try {
    const url = `${host}/user/add`;
    await axios.post(url, {
      data: userData,
    });
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
    await axios.post(url, {
      data: {
        SenderId: senderId,
        ReciverId: reciverId,
      },
    });
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
    let url = `${host}/user/userdata`;
    let userdata = await axios.post(url, { jwt: data });
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
    });
    console.log("userd", userData);
    return userData;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
