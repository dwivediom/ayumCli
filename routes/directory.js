import axios from "axios";

const key = process.env.NEXT_PUBLIC_S_KEY;
const host = process.env.NEXT_PUBLIC_B_PORT;


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
    let city = localStorage.getItem("city");
    const newdata = await axios({
      url: `${host}/api/docdirectory/showmore?city=${city}`,
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


// * This API call retrieves doctors based on their spci and city. 
//  * The results are paginated, and a limit is set for the number of results per page.
//  * 
//  * Example API call: 
//  * // http://localhost:5000/api/docdirectory/get-x-in-city?specialist=dentist&city=Rewa&limit=10&page=1
//  * 

export const getDoctorsInCity = async (specialist, city, limit = 10, page = 1) => {
  try {
    const response = await axios({
      url: `${host}/api/docdirectory/get-x-in-city`,
      method: 'get',
      params: {
        specialist,
        city,
        limit,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error.message);
    return error.message;
  }
};