import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { authentication } from "../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { GoogleLogin  } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import styles from "../../styles/Auth.module.css";
import { useSelector } from "react-redux";
import { async } from "@firebase/util";
import { loginInitate,registerinitate } from "../../routers/UserRegistration";
const UserRegistrationPage = () => {
  const docdata = useSelector((state) => state.setdocDataReducer);
  const router = useRouter();
  const loginUrl = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/login`;
  const registerUrl = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/register`;
  const [uid, setuid] = useState("");
  const [error, seterror] = useState("");
  const [response, setresponce] = useState("");
  const [otp, setotp] = useState("");
  const [viewphone, setviewphone] = useState(true);
  const [viewOtp, setviewOtp] = useState(false);
  const [viewName, setviewName] = useState(false);
  const [otpmsg, setotpmsg] = useState(null);
  const [loader, setloader] = useState(true)
  const [data, setdata] = useState({

    name: "",
    email: "",
    phone: "",
    password: "",
    sub: "",
    picture: "",
    email_verified: ""
  });
  const onLoginSucess = async (res) => {
    const decodedjwt = jwt_decode(res.credential)
    console.log(decodedjwt)
     setdata(decodedjwt)
    
    console.log("data ",data) 
    const logindata = await loginInitate( decodedjwt);
    console.log("logindata " , logindata )
    if(logindata.data){ 
      localStorage.setItem("usertoken", logindata.data.token);
    }
    if(logindata.error){ 
      const registerData = await registerinitate(decodedjwt)
      if(registerData.data){ 
        localStorage.setItem("usertoken", registerData.data.token);
        
      }
      console.log("registerdata " ,registerData)
    }

    if ( localStorage.usertoken) {
      router.push("/");
    } else {
      router.push("/");
    }
  }
  const onLoginError = (res) => {
    console.log(res.message)
  }

  
 

  const handlechange = (e) => {
    const newdata = { ...data };
    setotpmsg(null);
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
  };

  return (
    <>
      <div>
        <div>
          <h2 className="m-auto text-center text-cyan-500 font-bold">
            User Registration{" "}
          </h2>


          <GoogleLogin
            onSuccess={onLoginSucess} onError={onLoginError}

          />



          <form className={`${styles.authcontainer}`}>
            <div className="mb-6">
              {viewName && (
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium "
                  >
                    Your name
                  </label>

                  <input
                    value={data.name}
                    onChange={(e) => handlechange(e)}
                    type="text"
                    id="name"
                    name="name"
                    className="  text-black text-sm  w-full p-2.5 rounded  "
                    placeholder="Your name "
                    required
                  />
                  <button
                    type="submit"
                    onClick={(e) => submit(e)}
                    className={`${styles.bookbtn}`}
                  >
                    Submit
                  </button>
                </div>
              )}
              {viewphone && (
                <div>
                  <label
                    htmlFor="number"
                    className="block mb-2 text-sm font-medium "
                  >
                    Enter Phone Number
                  </label>
                  <input
                    type="number"
                    onChange={(e) => handlechange(e)}
                    id="phone"
                    name="phone"
                    className="  text-black text-sm  w-full p-2.5 rounded  "
                    placeholder="+91 5675453453"
                    required
                  />
                </div>
              )}
            </div>

            {viewphone && (
              <button
                type="submit"
                onClick={(e) => requsetOtp(e)}
                className={`${styles.bookbtn}`}
              >
                {loader ? "Submitting..." : "Submit"}
              </button>
            )}
          </form>

          {viewOtp && (
            <div
              style={{ marginTop: "20px", marginBottom: "40px" }}
              className={`${styles.authcontainer}`}
            >
              <label htmlFor="otp" className="block mb-2 text-sm font-medium ">
                Enter Otp
              </label>
              <input
                type="number"
                inputmode="numeric"
                autocomplete="one-time-code"
                pattern="\d{6}"
                onChange={(e) => varifyOtp(e)}
                id="password"
                className="  text-black text-sm  w-full p-2.5 rounded  "
                required
              />
            </div>
          )}

          {response.status == 200 ? (
            <h5 className="text-green-500">Registration success!</h5>
          ) : (
            <h5 className="text-red-600 text-bold">
              {error && Array.isArray(error)
                ? error.map((data) => {
                  return `${data.msg}!!`;
                })
                : error}
            </h5>
          )}

          {otpmsg && (
            <h3
              style={{
                border: "1px solid red",
                width: "23rem",
                margin: "auto",
                marginTop: "2rem",
                padding: "5px",
                borderRadius: "4px",
              }}
              className="text-red-600 text-bold text-center "
            >
              {" "}
              {otpmsg}{" "}
            </h3>
          )}
        </div>

        <div id="sign-in-button"></div>
      </div>
    </>
  );
};

export default UserRegistrationPage;
