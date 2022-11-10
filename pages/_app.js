import "../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux/store/store";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import Footer from "../components/Footer";
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
