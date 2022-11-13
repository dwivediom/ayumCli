import "../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux/store/store";
import dynamic from "next/dynamic";
const BottomNav = dynamic(() => import("../components/BottomNav"));
const Navbar = dynamic(() => import("../components/Navbar"));
function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <Navbar />
      <Component {...pageProps} />
      <BottomNav />
    </ReduxProvider>
  );
}

export default MyApp;
