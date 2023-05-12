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
const UserRegistrationPage = () => {
  const { setauthstatus, setsignout, setthankmodal, setscrollbox } =
    useContext(AccountContext);
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
    console.log("decoded jwt ", decodedjwt);
    if (logindata.data) {
      localStorage.setItem("usertoken", logindata.data.token);
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

          router.push("/");

          await updateuser(res.credential, {
            endpoint: localStorage.endpoint,
            auth: localStorage.auth,
            p256dh: localStorage.p256dh,
            picture: decodedjwt.picture,
            name: decodedjwt.name,
          });
          const data = await webpushfunc();
        }
        router.push("/");
      }
    }

    if (logindata.error) {
      const registerData = await registerinitate(decodedjwt);
      if (registerData.data) {
        localStorage.setItem("labuser", JSON.stringify(decodedjwt));
        localStorage.setItem("usertoken", registerData.data.token);
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
    setscrollbox(false);
  }, []);
  return (
    <>
      <div className={`${styles.authbox}`}>
        <div className={`${styles.authdiv}`}>
          <div className="w-[65%]">
            <h1 className="text-lg text-center font-bold">
              Hello, Welcome To Ayum <br />{" "}
              <span className="text-sm ">
                Making Health Care More Convenient
              </span>{" "}
            </h1>
          </div>
          <div className="text-md text-cyan-600">
            {" "}
            Login with <span className="text-lg font-bold">Ayum</span> using
            <span className="text-orange-500 text-lg font-bold"> Google </span>
          </div>

          <GoogleLogin onSuccess={onLoginSucess} onError={onLoginError} />
        </div>
      </div>
    </>
  );
};

export default UserRegistrationPage;
