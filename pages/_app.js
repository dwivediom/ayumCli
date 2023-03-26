import "../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import Router from "next/router";
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
function MyApp({ Component, pageProps, AccountContext }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const relod = async () => {
      await webpushfunc();
    };
    relod();
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
                alignSelf: "center",
                justifySelf: "center",
                maxWidth: "1350px",
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
