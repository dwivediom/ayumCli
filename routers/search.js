import axios from "axios";
const host = process.env.NEXT_PUBLIC_B_PORT;

export const searchApi = async (data) => {
  try {
    const url = await `${host}/search/chatusers?q=${data}`;
    const searchData = await axios.get(url);
    return searchData;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};
