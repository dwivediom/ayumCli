import "../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { store } from "../redux/store/store";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../components/Loader";
const BottomNav = dynamic(() => import("../components/BottomNav"));
const Navbar = dynamic(() => import("../components/Navbar"));

function Loading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  return loading && <Loader />;
}
function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <Loading />
      <ReduxProvider store={store}>
        <div style={loading ? { display: "block" } : { display: "none" }}>
          <Loader />
        </div>
        <div style={loading ? { display: "none" } : { display: "block" }}>
          <Navbar />
          <Component {...pageProps} />
          <BottomNav />
        </div>
      </ReduxProvider>
    </>
  );
}

export default MyApp;
