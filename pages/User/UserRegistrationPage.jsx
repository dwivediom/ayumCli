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

import { setCookie } from "../../public/utils/Utils";
import { Dialog } from "primereact/dialog";
import Image from "next/image";
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
  const [loading, setloading] = useState(false);
  const onLoginSucess = async (res) => {
    setloading(true);
    const decodedjwt = jwt_decode(res.credential);
    localStorage.setItem("userjwt", res.credential);
    setdata(decodedjwt);
    console.log("data ", data);
    const logindata = await loginInitate(decodedjwt);

    if (logindata.data) {
      localStorage.setItem("usertoken", logindata.data.token);
      setCookie("usertoken", logindata.data.token, 7);
      localStorage.setItem("labuser", JSON.stringify(logindata.data.user));
      localStorage.setItem("authStatus", true);
      localStorage.setItem("userEmail", decodedjwt.email);
      if (decodedjwt) {
        const logined = await adduser(decodedjwt);
        if (logined?.msg === "useradded" || "user already exist") {
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

          setsignout(false);
          setloading(false);
          window.location.href = "/";

          // const data = await webpushfunc();
        }
        setloading(false);

        window.location.href = "/";
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

            const data = await webpushfunc();

            await updateuser(res.credential, {
              endpoint: localStorage.endpoint,
              auth: localStorage.keys.auth,
              p256dh: localStorage.keys.p256dh,
              FCMtoken: localStorage.fcmToken,
            });
            setauthstatus(true);
            // router.push("/");
            setloading(false);

            window.location.href = "/";
          }
          setloading(false);

          // router.push("/");
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "20px",
              borderRadius: "8px",
              background: "var(--surface-100)",
            }}
          >
            <div
              style={{ fontWeight: "500" }}
              className="text-md text-teal-600"
            >
              {" "}
              {/* Login with <span className="text-lg font-bold">Ayum</span> using
            <span className="text-orange-500 text-lg font-bold"> Google </span> */}
              Login to Ayum using Google
            </div>
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "2rem",
                }}
              >
                <Image
                  src={"/loader.svg"}
                  width={30}
                  height={30}
                  alt="Loading..."
                />
              </div>
            )}
            <GoogleLogin
              onSuccess={(res) => onLoginSucess(res)}
              onError={(res) => onLoginError(res)}
            />
          </div>
        </div>
        <Dialog
          header="Session expired"
          visible={expired}
          onHide={() => {
            setexpired(false);
          }}
        >
          <span
            style={{
              color: "black",
            }}
            className="font-bold "
          >
            {" "}
            Time For Quick Health Checkup 🩵
          </span>{" "}
          <br />{" "}
          <span
            style={{
              textDecoration: "underline",
            }}
            onClick={() => setexpired(false)}
            className="text-blue-600 "
          >
            Please login again!
          </span>
        </Dialog>
      </div>
    </>
  );
};

export default UserRegistrationPage;
