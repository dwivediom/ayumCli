import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { loginInitate, registerinitate } from "../../routes/UserRegistration";
import styles from "../../styles/Home.module.css";
import { AccountContext } from "../../context/AccountProvider";
import { webpushfunc } from "../../utils/notification";
import { updateuser } from "../../routes/user";
import { adduser } from "../../routes/user";
import { useEffect } from "react";
import English from "../../public/locales/en/index";
import Hindi from "../../public/locales/hi/index";
// import { setCookie } from "../utils/Utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { setCookie } from "../../public/utils/Utils";
const UserRegistrationPage = () => {
  const { setauthstatus, setsignout, setthankmodal, setscrollbox, lang } =
    useContext(AccountContext);
  const router = useRouter();

  const [expired, setexpired] = useState(false);

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
    console.log("decoded jwt ", decodedjwt);
    if (logindata.data) {
      localStorage.setItem("usertoken", logindata.data.token);
      setCookie("usertoken", logindata.data.token, 7);
      localStorage.setItem("labuser", JSON.stringify(decodedjwt));
      localStorage.setItem("authStatus", true);
      console.log("Labsuser aur Usertoken set kro");
      if (decodedjwt) {
        const logined = await adduser(decodedjwt);
        console.log(logined, "Logine hai ");
        if (logined.msg === "useradded") {
          setsignout(false);
          localStorage.setItem("thankmodal", true);
          // setauthstatus(true);
          setthankmodal(true);

          await updateuser(res.credential, {
            endpoint: localStorage.endpoint,
            auth: localStorage.auth,
            p256dh: localStorage.p256dh,
            picture: decodedjwt.picture,
            name: decodedjwt.name,
            FCMtoken: localStorage.fcmToken,
          });
          router.push("/");
          // const data = await webpushfunc();
        }
        router.push("/");
      }
    }

    if (logindata.error) {
      const registerData = await registerinitate(decodedjwt);
      if (registerData.data) {
        localStorage.setItem("labuser", JSON.stringify(decodedjwt));
        localStorage.setItem("usertoken", registerData.data.token);
        setCookie("usertoken", registerData.data.token, 7);

        if (decodedjwt) {
          const logined = await adduser(decodedjwt);
          if (logined === "useradded") {
            setsignout(false);
            setauthstatus(true);
            router.push("/");
            const data = await webpushfunc();

            await updateuser(res.credential, {
              endpoint: localStorage.endpoint,
              auth: localStorage.keys.auth,
              p256dh: localStorage.keys.p256dh,
              FCMtoken: localStorage.fcmToken,
            });
          }

          router.push("/");
        }
      }
      console.log("registerdata ", registerData);
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

  useEffect(() => {
    console.log(router.query);
    if (router.query?.session == "expired") {
      setexpired(true);
    }
    setscrollbox(false);
  }, []);
  return (
    <>
      <div className={`${styles.authbox}`}>
        <div className={`${styles.authdiv}`}>
          <div className="w-[75%]">
            <h1 className="text-lg text-center  font-bold">
              {lang == "en" ? English.loginwelcome : Hindi.loginwelcome} <br />{" "}
              <span className="text-sm ">
                {lang == "en" ? English.logintagline : Hindi.logintagline}
              </span>{" "}
            </h1>
          </div>
          <div className="text-md text-cyan-600">
            {" "}
            Login with <span className="text-lg font-bold">Ayum</span> using
            <span className="text-orange-500 text-lg font-bold"> Google </span>
          </div>

          <GoogleLogin
            onSuccess={(res) => onLoginSucess(res)}
            onError={(res) => onLoginError(res)}
          />
        </div>

        <Dialog
          open={expired}
          onClose={() => setexpired(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* Session Expired! Please Login Again. */}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span className="text-red-600"> Session Expired!</span> Please
              Login Again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setexpired(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default UserRegistrationPage;
