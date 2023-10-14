import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
import ThankyouCard from "../components/ThankyouCard";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/AccountProvider";
import Modal from "../components/Modal";
import Docphonebookbtn from "../components/Docphonebookbtn";
import Nashmukti from "../components/Nashmuktibtn";
import BloodDonatebtn from "../components/BloodDonatebtn";
import ReactGA from "react-ga4";
import Router, { useRouter } from "next/router";
import HorizontalScroll from "../components/DemoAd";

const SearchBox = dynamic(() => import("../components/SearchBox"));
const QuickSearch = dynamic(() => import("../components/QuickSearch"));
const GetDoctor = dynamic(() => import("../components/GetDoctor"));
const Footer = dynamic(() => import("../components/Footer"));
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import LanguageModal from "../components/LanguageModal";
// import Hindi from "/locales/hi/index";




import { firebaseApp } from "../firebase.config";
import useFcmToken from "../push-notification";
import { getMessaging, onMessage } from "firebase/messaging";

export default function Home(props) {
  const { thankmodal, setthankmodal, setscrollbox, setlang, lang, langmodal } =
    useContext(AccountContext);

  const [isOnline, setIsOnline] = useState(true);
  const [doctors, setdoctors] = useState([]);
  const [full, setfull] = useState(false);
  const [loading, setloading] = useState(false);
  const { fcmToken,notificationPermissionStatus } = useFcmToken();
  // Use the token as needed
  fcmToken && console.log('FCM token:', fcmToken);


  useEffect(() => {
    console.log("entring1")
    if ( 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      
    console.log("entring2")
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground push notification received:', payload);
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
      title: "Home Page",
    });
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("User is online");
    };
    const handleOffline = () => {
      setIsOnline(false);
      console.log("User is offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    if (props.newdata) {
      setdoctors(props.newdata && props.newdata);
    } else {
      setdoctors(null);
    }

    if (localStorage.getItem("thankmodal") == true) {
      setthankmodal(true);
      setTimeout(() => {
        localStorage.setItem("thankmodal", false);
        setthankmodal(false);
      }, 3000);
      // setauthstatus(false);
    }
  }, []);

  const Loadmore = async () => {
    setloading(true);
    const newdocdata = await axios({
      method: "get",
      url: "https://www.server.ayum.in/api/profile/showmoreDoc",
    });
    console.log("Data aa rha hai", newdocdata);
    if (newdocdata.data.length === 0) {
      setfull(true);
    }

    const finalstatedata = doctors.concat(newdocdata.data);
    console.log(finalstatedata, "Final data hai");

    setdoctors(finalstatedata);
    setloading(false);
  };

  Router.events.on("routeChangeStart", (url) => {
    setscrollbox(true);
  });

  useEffect(() => {
    let indexbox = document.getElementById("indexbox");
    // console.log(indexbox.scrollTop);
    indexbox.addEventListener("scroll", () => {
      let scrollTop = indexbox.scrollTop;
      if (scrollTop > 0) {
        setscrollbox(false);
      } else {
        setscrollbox(true);
      }
    });
  }, []);

  const handlelangchange = (lang) => {
    localStorage.setItem("locale", lang);
    setlang(lang);
  };
  if (!isOnline) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            flexDirection: "column",
          }}
        >
          <Image
            width={200}
            height={200}
            src="/offline.png"
            alt="Offline animation"
          />
          <h2 style={{ fontWeight: "bold", color: "red" }}>
            {lang == "en" ? English.online : Hindi.online}
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ayum</title>
        <meta name="title" content="ayum" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta
          name="description"
          content="Ayum is Online Doctor Appointment Booking Platform and Health Care Services Provider i,e Lab Reports , Medicine Delivery etc.  "
        />
        <meta
          name="google-site-verification"
          content="TZ_t3W3EZ4x4C5q8BPlZ_luCjIeWczMJwCyObT8AjYA"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-5Y9LBBR5S9"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date());

  gtag('config', 'G-5Y9LBBR5S9');
</script> */}

      {langmodal && <LanguageModal />}
      <div id="indexbox" className={styles.mainshell}>
        <SearchBox />
        <QuickSearch />
        <div className={styles.directorycontainer}>
          <Docphonebookbtn />
          <Nashmukti />
          <BloodDonatebtn />
        </div>

        <HorizontalScroll />

        {props.newdata ? (
          <main>
            {doctors ? (
              <GetDoctor getDoctor={doctors} />
            ) : (
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
                  width={40}
                  height={40}
                  alt="Loading..."
                />
              </div>
            )}
          </main>
        ) : (
          <p className="text-center">
            {lang == "en" ? English.loading : Hindi.loading}
          </p>
        )}

        {full ? (
          <div className="m-auto p-2 border border-gray-700 w-[14rem] text-center mt-9 text-cyan-600  font-bold  ">
            {lang == "en" ? English.thatsit : Hindi.thatsit}
          </div>
        ) : (
          <div
            onClick={() => !loading && Loadmore()}
            className="m-auto p-2 border border-gray-700 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer "
          >
            {loading ? (
              <span> {lang == "en" ? English.loading : Hindi.loading}</span>
            ) : (
              <span> {lang == "en" ? English.showmore : Hindi.showmore}</span>
            )}
          </div>
        )}

        <footer className={styles.footer}>
          <ThankyouCard />
          <Footer />
        </footer>
        {thankmodal && <Modal />}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let newdata;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/profile`
    );

    newdata = data;
  } catch (error) {
    newdata = "error";
  }

  return (
    newdata && {
      props: { newdata },
    }
  );
}
