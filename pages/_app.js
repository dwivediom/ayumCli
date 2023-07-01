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

const TRACKING_ID = "G-2S84NQ3JY0";
ReactGA.initialize(TRACKING_ID);
function MyApp({ Component, pageProps, AccountContext }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const relod = async () => {
      await webpushfunc();
    };
    relod();
  }, []);

  // Send pageview with a custom path
ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: `${window.location.href} Page` });


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

  return (
    <>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_B_GOOGLE_CLIENT_ID}
      >
        <AccountProvider>
          <ReduxProvider store={store}>
            {loading && (
              <div
                style={{
                  width: "100vw",
                  height: "50vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={"/loader.svg"}
                  width={50}
                  height={50}
                  alt="Loading..."
                />
              </div>
            )}

            <div
              style={{
                display: loading ? "none" : "block",
                margin: "auto !important",
              }}
            >
              <Navbar />
              <Component {...pageProps} />
              <BottomNav />
            </div>
          </ReduxProvider>
        </AccountProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
