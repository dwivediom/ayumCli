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
import  {googleClientId} from "../utils/googleClientId"; 
import { GoogleOAuthProvider } from "@react-oauth/google";
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
    <GoogleOAuthProvider clientId= "546426590582-i87n4u2efdi9qupcuovdblf73h1h5rak.apps.googleusercontent.com">
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
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
