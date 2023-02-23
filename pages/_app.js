import "../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import styles from "../styles/Home.module.css";
import Router, { useRouter } from "next/router";
import { store } from "../redux/store/store";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../components/Loader";
import Image from "next/image";
const BottomNav = dynamic(() => import("../components/BottomNav"));
import Navbar from "../components/Navbar";
import { googleClientId } from "../utils/googleClientId";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AccountProvider from "../context/AccountProvider";
function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
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
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_B_GOOGLE_CLIENT_ID}>
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

            <Navbar />
            <div style={{ display: loading ? "none" : "block" }}>
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
