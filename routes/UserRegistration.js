import { async } from "@firebase/util";
import axios from "axios";
import { useRouter } from "next/router";
const loginUrl = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/login`;
const registerUrl = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/register`;

export const loginInitate = async (data) => {
  try {
    const logindata = await axios.post(loginUrl, {
      email: data.email,
      password: ` key${data.sub}`,
    });
    return logindata;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

export const registerinitate = async (data) => {
  try {
    const registerData = await axios.post(registerUrl, {
      ...data,
      password: ` key${data.sub}`,
    });
    return registerData;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};
