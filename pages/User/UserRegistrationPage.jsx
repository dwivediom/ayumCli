import React, { useContext, useState } from "react";
import { useRouter } from "next/router";

import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

import { useSelector } from "react-redux";
import { loginInitate, registerinitate } from "../../routers/UserRegistration";
import styles from "../../styles/Home.module.css";
import { AccountContext } from "../../context/AccountProvider";
const UserRegistrationPage = () => {
  const { setauthstatus } = useContext(AccountContext);
  const router = useRouter();

  const [otpmsg, setotpmsg] = useState(null);
  const [data, setdata] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    sub: "",
    picture: "",
    email_verified: "",
  });
  const onLoginSucess = async (res) => {
    const decodedjwt = jwt_decode(res.credential);
    localStorage.setItem("userjwt", res.credential);
    console.log(decodedjwt);
    setdata(decodedjwt);

    console.log("data ", data);
    const logindata = await loginInitate(decodedjwt);
    console.log("logindata ", logindata);
    if (logindata.data) {
      localStorage.setItem("usertoken", logindata.data.token);
      localStorage.setItem("labuser", JSON.stringify(decodedjwt));
      console.log("Labsuser aur Usertoken set kro");
    }

    if (logindata.error) {
      const registerData = await registerinitate(decodedjwt);
      if (registerData.data) {
        localStorage.setItem("labuser", JSON.stringify(decodedjwt));
        localStorage.setItem("usertoken", registerData.data.token);
      }
      console.log("registerdata ", registerData);
    }

    if (localStorage.usertoken) {
      setauthstatus(true);
      router.push("/");
    } else {
      router.push("/");
    }
  };
  const onLoginError = (res) => {
    console.log(res.message);
  };

  const handlechange = (e) => {
    const newdata = { ...data };
    setotpmsg(null);
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
  };

  return (
    <>
      <div className={`${styles.authbox}`}>
        <div className={`${styles.authdiv}`}>
          <div className="text-md text-cyan-600">
            {" "}
            Login using{" "}
            <span className="text-orange-500 text-lg font-bold">Google</span>
            with <span className="text-lg font-bold">Ayum</span>
          </div>

          <GoogleLogin onSuccess={onLoginSucess} onError={onLoginError} />
        </div>
      </div>
    </>
  );
};

export default UserRegistrationPage;
