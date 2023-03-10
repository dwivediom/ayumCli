import axios from "axios";
const host = process.env.NEXT_PUBLIC_B_PORT;
const key = process.env.NEXT_PUBLIC_S_KEY;

export const getDoc = async () => {
  try {
    const newdata = await axios({
      url: `${host}/api/docdirectory/getall`,
      method: "get",
    });

    return newdata;
  } catch (error) {
    return error.message;
  }
};
export const showMore = async () => {
  try {
    const newdata = await axios({
      url: `${host}/api/docdirectory/showmore`,
      method: "get",
    });

    return newdata;
  } catch (error) {
    return error.message;
  }
};
export const SearchDoc = async (searchkey) => {
  // http://localhost:5000/api/docdirectory/search/:key/
  try {
    const newdata = await axios({
      url: `${host}/api/docdirectory/search/${searchkey}/`,
      method: "get",
    });

    return newdata;
  } catch (error) {
    return error.message;
  }
};
