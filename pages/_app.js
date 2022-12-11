import "../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux/store/store";
import dynamic from "next/dynamic";
import { useEffect } from "react";
const BottomNav = dynamic(() => import("../components/BottomNav"));
const Navbar = dynamic(() => import("../components/Navbar"));
function MyApp({ Component, pageProps }) {
  // useEffect(() => {
  //   let deferredPrompt;

  //   window.addEventListener("beforeinstallprompt", (e) => {
  //     deferredPrompt = e;
  //   });
  //   const installApp = document.getElementById("installApp");

  //   installApp.addEventListener("click", async () => {
  //     if (deferredPrompt !== null) {
  //       console.log(deferredPrompt);
  //       deferredPrompt.prompt();
  //       const { outcome } = await deferredPrompt.userChoice;
  //       if (outcome === "accepted") {
  //         deferredPrompt = null;
  //       }
  //     }
  //   });
  // }, []);

  return (
    <ReduxProvider store={store}>
      <Navbar />
      <Component {...pageProps} />
      <BottomNav />
    </ReduxProvider>
  );
}

export default MyApp;
