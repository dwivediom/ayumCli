import "../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import Router, { useRouter } from "next/router";
import { store } from "../redux/store/store";
import dynamic from "next/dynamic";
import { useContext, useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
const BottomNav = dynamic(() => import("../components/BottomNav"));
import Navbar from "../components/Navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AccountProvider, { AccountContext } from "../context/AccountProvider";
import { webpushfunc } from "../utils/notification";
import ReactGA from "react-ga4";
import { firebaseApp } from "../firebase.config";
import useFcmToken, { notificationRequest } from "../push-notification";
import { getMessaging, onMessage } from "firebase/messaging";
import { sendnotification } from "../routes/notify";
import { updateuser } from "../routes/user";
import LoginPopup from "../components/UserAuth/LoginPopup";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import NewNavbar from "../components/NewNavbar";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-teal/theme.css";
import "../styles/globals.css"; // Load global styles last, if needed

import Authverify from "../components/AuthVerify";

const TRACKING_ID = "G-2S84NQ3JY0";
ReactGA.initialize(TRACKING_ID);
function MyApp({ Component, pageProps, AccountContext }) {
  const [loading, setLoading] = useState(true);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();

  // Use the token as needed
  useEffect(() => {
    if (fcmToken) {
      if (localStorage.fcmToken != fcmToken && localStorage.userjwt) {
        updateuser(localStorage.userjwt, { FCMtoken: fcmToken });
      } else {
        localStorage.setItem("fcmToken", fcmToken);
      }
    }
  }, [fcmToken]);

  useEffect(() => {
    const relod = async () => {
      await notificationRequest();

      // await webpushfunc();
    };
    relod();
  }, []);

  // Send pageview with a custom path

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
      title: "Home Page",
    });
  }, []);

  useEffect(() => {
    // Check if the Web Push API is supported
    if (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      // Request permission for notifications
      Notification.requestPermission();
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
  });

  // Define public routes
  const publicRoutes = [
    "/clinics",
    "/User/BookAppointmentPage",
    "/User/userAppo",
  ]; // Add your public routes here
  const router = useRouter();
  return (
    <>
      <PrimeReactProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_B_GOOGLE_CLIENT_ID}
        >
          <AccountProvider>
            <ReduxProvider store={store}>
              {loading && (
                // <div
                //   style={{
                //     width: "100vw",
                //     height: "50vh",
                //     display: "flex",
                //     alignItems: "center",
                //     justifyContent: "center",
                //   }}
                // >
                //   <Image
                //     src={"/loader.svg"}
                //     width={50}
                //     height={50}
                //     alt="Loading..."
                //   />
                // </div>
                <Loader />
              )}

              <div
                style={{
                  display: loading ? "none" : "block",
                  margin: "auto !important",
                }}
              >
                {/* <Navbar /> */}
                {/* {publicRoutes.includes(router.pathname) && <Authverify />} */}

                <NewNavbar />
                <Component {...pageProps} />
                <LoginPopup />
                <Footer />
                <BottomNav />
              </div>
            </ReduxProvider>
          </AccountProvider>
        </GoogleOAuthProvider>
      </PrimeReactProvider>
    </>
  );
}

export default MyApp;
