import { getdoctor } from "../../pages/api/DoctorApi/DocApi";
import axios from "axios";
import {
  GET_DOCTOR_FAIL,
  GET_DOCTOR_REQUEST,
  GET_DOCTOR_SUCCESS,
} from "../constants/docConstants";

export const getallDoctorAction = () => async (dispatch) => {
  try {
    dispatch({ type: GET_DOCTOR_REQUEST });
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/profile`,
      {
        headers: {
          "x-auth-token": localStorage.usertoken,
        },
      }
    );
    console.log(data);
    dispatch({ type: GET_DOCTOR_SUCCESS, payload: data });
    console.log("data success");
  } catch (error) {
    dispatch({
      type: GET_DOCTOR_FAIL,
      payload:
        error.data && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//create profile

import {
  POST_DOCTOR_PROFILE,
  POST_DOCTOR_PROFILE_FAIL,
  POST_DOCTOR_PROFILE_SUCCESS,
} from "../constants/docConstants";
import setAuthToken from "../../utils/setauthtoken";
const createDocProfile = `${process.env.NEXT_PUBLIC_B_PORT}/api/profile/createprofile`;
export const createDocProfileAction = (data) => async (dispatch) => {
  try {
    dispatch({ type: POST_DOCTOR_PROFILE });
    if (localStorage.doctoken) {
      //  setAuthToken(localStorage.token)
      var token = localStorage.doctoken;
    }
    console.log(data);
    const newdata = await axios({
      url: createDocProfile,
      method: "post",
      data: {
        clinic: data.clinic,
        website: data.website,
        location: data.location,
        timing: data.timing,
        bio: data.bio,
        status: data.status,
        specialist: data.specialist,
        fees: data.fees,
        youtube: data.youtube,
        facebook: data.facebook,
        twitter: data.twitter,
        instagram: data.instagram,
      },

      headers: {
        "x-auth-token": token,
      },
    });
    console.log("data sucess doc profile", newdata);
    dispatch({ type: POST_DOCTOR_PROFILE_SUCCESS, payload: newdata.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: POST_DOCTOR_PROFILE_FAIL,
      payload:
        error.data && error.response.data.error
          ? error.response.data.error
          : error.message,
    });
  }
};
