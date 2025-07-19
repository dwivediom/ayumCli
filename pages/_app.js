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

import { requestNotificationPermission } from "../push-notification";
import useDeviceId from "../utils/useDeviceId";
import Authverify from "../components/AuthVerify";
import { refreshFcmToken, ensureFcmToken } from "../push-notification";
import { registerDeviceToken } from "../routes/notify";
import { SocketProvider } from "../context/SocketContext";

const TRACKING_ID = "G-2S84NQ3JY0";
ReactGA.initialize(TRACKING_ID);
function MyApp({ Component, pageProps, AccountContext }) {
  const [loading, setLoading] = useState(true);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();

  // Use the token as needed
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || null;
    let local_fcm_token = fcmToken || localStorage.getItem("fcmToken") || null;
    useDeviceId(userEmail);
    if (fcmToken || local_fcm_token) {
      let deviceId = localStorage.getItem("deviceId");
      registerDeviceToken(deviceId, fcmToken);
    }

    if (fcmToken) {
      if (localStorage.fcmToken != fcmToken && localStorage.userjwt) {
        updateuser(localStorage.userjwt, { FCMtoken: fcmToken });

        const deviceId = localStorage.getItem("deviceId");
        let local_fcm_token = fcmToken || localStorage.getItem("fcmToken");
        registerDeviceToken(deviceId, fcmToken);
      } else {
        localStorage.setItem("fcmToken", fcmToken);
        let deviceId = localStorage.getItem("deviceId");
        let local_fcm_token = fcmToken || localStorage.getItem("fcmToken");
        registerDeviceToken(deviceId, local_fcm_token);
      }
    } else {
      console.log("unable  to get fcm token ");
    }
  }, [fcmToken]);

  // Send pageview with a custom path

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
      title: "Home Page",
    });
  }, []);

  useEffect(() => {
    const relod = async () => {
      if ("serviceWorker" in navigator) {
        // Register the custom service worker (next-pwa will output this as /service-worker.js)
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });

        // Listen for messages from the service worker.
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "REFRESH_TOKEN") {
            console.log("Received message from Service Worker: REFRESH_TOKEN");
            refreshFcmToken();
            // For example, call Firebase Messaging to get a new token and update your backend.
          }
        });
      }

      await notificationRequest();

      // await webpushfunc();
    };
    relod();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Check permission and ensure token exists
        const token = await ensureFcmToken();

        if (token) {
          const deviceId = localStorage.getItem("deviceId");
          if (!deviceId) {
            // Generate deviceId if it doesn't exist
            const newDeviceId =
              "device_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("deviceId", newDeviceId);
          }

          // Register token with backend
          await registerDeviceToken(deviceId || newDeviceId, token);

          // Update user if logged in
          // if (localStorage.userjwt) {
          //   await updateuser(localStorage.userjwt, { FCMtoken: token });
          // }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };
    let local_fcm_token = localStorage.getItem("fcmToken");
    if (!local_fcm_token) {
      verifyToken();
    }
  });

  useEffect(() => {
    // Call our robust notification permission request function on page load.
    requestNotificationPermission().then((permission) => {
      if (permission !== "granted") {
        // Optionally, show your own UI here to instruct the user to enable notifications manually.
        console.warn(
          "Notifications are not enabled. Please enable notifications in your browser settings for the best experience."
        );
      }
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
    console.log("loading", loading, router.pathname);
    setLoading(false);
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
  const SSRroutes = ["/", "/doctor"];
  const router = useRouter();
  return (
    <>
      <PrimeReactProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_B_GOOGLE_CLIENT_ID}
        >
          <AccountProvider>
            <SocketProvider>
              <ReduxProvider store={store}>
                {loading &&
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
                  (SSRroutes.includes(router.pathname) ? (
                    <Loader ssrRoute={SSRroutes} />
                  ) : (
                    ""
                  ))}

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
            </SocketProvider>
          </AccountProvider>
        </GoogleOAuthProvider>
      </PrimeReactProvider>
    </>
  );
}

export default MyApp;
