import axios from "axios";
const host = process.env.NEXT_PUBLIC_B_PORT;
const key = process.env.NEXT_PUBLIC_S_KEY;

export const getDoc = async (city) => {
  try {
    const newdata = await axios({
      url: `${host}/api/docdirectory/getall?city=${city}`,
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
export const SearchDoc = async (searchkey, limit) => {
  // http://localhost:5000/api/docdirectory/search/:key/
  try {
    let url = `${host}/api/search?key=${searchkey}`;
    const newdata = await axios.post(
      url,
      { limit: limit, search: true },
      { headers: { "Content-Type": "application/json" } }
    );

    return newdata.data;
  } catch (error) {
    return error.message;
  }
};

// get all doctors for sitemap.xml it return id of all doc in docdirectory
//http://localhost:5000/api/docdirectory/getallDoctors
export const getallDoctors = async () => {
  try {
    const allIds = await axios({
      url: `${host}/api/docdirectory/getallDoctors`,
      method: "get",
    });
    return allIds;
  } catch (error) {
    return error.message;
  }
};
