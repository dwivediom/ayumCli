import axios from "axios";
const host = process.env.NEXT_PUBLIC_B_PORT_CHAT;

export const searchApi = async (data) => {
  try {
    const url = `${host}/search/chatusers?q=${data}`;
    const searchData = await axios.get(url);
    return searchData;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};
