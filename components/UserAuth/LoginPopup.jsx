import React, { useContext, useRef, useState } from "react";

import jwt_decode from "jwt-decode";
import { AccountContext } from "../../context/AccountProvider";
import { GoogleLogin } from "@react-oauth/google";
import { loginInitate, registerinitate } from "../../routes/UserRegistration";
import { adduser, updateuser } from "../../routes/user";
import { webpushfunc } from "../../utils/notification";
import { useRouter } from "next/router";
import Image from "next/image";
import { setCookie } from "../../public/utils/Utils";

import { Toast } from "primereact/toast";

import { Sidebar } from "primereact/sidebar";

const LoginPopup = ({ open, setOpen }) => {
  // const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  const [loading, setloading] = useState(false);

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
  const {
    isLoginDrawerOpen,
    openDrawer,
    closeDrawer,
    setauthstatus,
    setsignout,
    closingdrawerallowed,
    setthankmodal,
    setscrollbox,
    lang,
  } = useContext(AccountContext);
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
      localStorage.setItem("labuser", JSON.stringify(decodedjwt));
      localStorage.setItem("authStatus", true);
      if (decodedjwt) {
        const logined = await adduser(decodedjwt);
        if (logined?.msg === "useradded" || "user already exist") {
          localStorage.setItem("thankmodal", true);
          // setauthstatus(true);
          // setthankmodal(true);

          await updateuser(res.credential, {
            endpoint: localStorage.endpoint,
            auth: localStorage.auth,
            p256dh: localStorage.p256dh,
            picture: decodedjwt.picture,
            name: decodedjwt.name,
            FCMtoken: localStorage.fcmToken,
          });

          setsignout(false);

          // const data = await webpushfunc();
        }
        toastref.current.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Logged in",
        });
        setloading(false);
        closeDrawer();
        return;
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
          }

          // router.push("/");
          setloading(false);

          toastref.current.show({
            severity: "success",
            summary: "Success",
            detail: "Successfully Logged in",
          });
          closeDrawer();

          return;
        }
      }
      console.log("registerdata ", registerData);
    }
  };
  const onLoginError = (res) => {
    console.log(res.message);
    toastref.current.show({
      severity: "error",
      summary: "Login Error",
      detail: "Something went wrong!",
    });
    setloading(false);
    closeDrawer();
  };
  const toastref = useRef();
  return (
    <div>
      {/* <Snackbar
        open={showsnackbar}
        autoHideDuration={6000}
        onClose={() => {
          setshowsnackbar(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={"top" + "right"}
      >
        <Alert
          onClose={() => setshowsnackbar(false)}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackmsg}
        </Alert>
      </Snackbar> */}
      {/* <Drawer
        anchor="bottom"
        open={isLoginDrawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            backgroundColor: (theme) => theme.palette.background.paper, // Set background color
            height: "40%",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
          },
        }}
      >
        <List>
          <ListItem onClick={closeDrawer}>
            <ListItemIcon>X</ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
          <div>
            <h2
              style={{
                padding: "4px",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.1rem",
              }}
            >
              Please Be Our Family! 😇
            </h2>
            <h2 style={{ padding: "4px", textAlign: "center" }}>
              Click below to Login
            </h2>
          </div>
          <div
            style={{
              width: "20rem",
              margin: "auto",
              padding: "6px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              boxShadow: "2px 4px 8px rgba(0,0,0,0.3)",
              alignItems: "center",
            }}
          >
            {loading ? (
              <div
              // style={{
              //   display: "flex",
              //   alignItems: "center",
              //   justifyContent: "center",
              //   minWidth: "20rem",
              //   width: "100%",
              //   paddingTop: "2rem",
              // }}
              >
                <Image
                  src={"/loader.svg"}
                  width={30}
                  height={30}
                  alt="Loading..."
                />
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(res) => onLoginSucess(res)}
                onError={(res) => onLoginError(res)}
              />
            )}
          </div>
        </List>
      </Drawer> */}
      <Toast ref={toastref} />
      <Sidebar
        visible={isLoginDrawerOpen}
        onHide={() => {
          console.log(closingdrawerallowed, "allowed");
          if (closingdrawerallowed) {
            closeDrawer();
          } else {
            return;
          }
        }}
        header={""}
        position="bottom"
        style={{ height: "40%" }}
      >
        <div>
          <h2
            style={{
              padding: "4px",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "1.1rem",
            }}
          >
            Please Be Our Family! 😇
          </h2>
          <h2 style={{ padding: "4px", textAlign: "center" }}>
            Click below to Login
          </h2>
        </div>
        <div
          style={{
            width: "20rem",
            margin: "auto",
            padding: "6px",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            boxShadow: "2px 4px 8px rgba(0,0,0,0.3)",
            alignItems: "center",
          }}
        >
          {loading ? (
            <div
            // style={{
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   minWidth: "20rem",
            //   width: "100%",
            //   paddingTop: "2rem",
            // }}
            >
              <Image
                src={"/loader.svg"}
                width={30}
                height={30}
                alt="Loading..."
              />
            </div>
          ) : (
            <GoogleLogin
              onSuccess={(res) => onLoginSucess(res)}
              onError={(res) => onLoginError(res)}
            />
          )}
        </div>
      </Sidebar>
      <main style={{ marginTop: "64px" }}>
        {" "}
        {/* Adjust margin based on AppBar height */}
        {/* Your main content here */}
      </main>
    </div>
  );
};

export default LoginPopup;
