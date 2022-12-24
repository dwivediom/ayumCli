import "../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import styles from "../styles/Home.module.css";

import { store } from "../redux/store/store";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../components/Loader";
const BottomNav = dynamic(() => import("../components/BottomNav"));
const Navbar = dynamic(() => import("../components/Navbar"));
function MyApp({ Component, pageProps }) {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 3000);
  });
  return (
    <>
      <ReduxProvider store={store}>
        <Navbar />
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <div>
            <Component {...pageProps} />
            <BottomNav />
          </div>
        )}
      </ReduxProvider>
    </>
  );
}

export default MyApp;
