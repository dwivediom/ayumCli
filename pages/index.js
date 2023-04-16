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
import Slider from "../components/AdComp2";
import ReactGA from "react-ga";

const SearchBox = dynamic(() => import("../components/SearchBox"));
const QuickSearch = dynamic(() => import("../components/QuickSearch"));
const GetDoctor = dynamic(() => import("../components/GetDoctor"));
const Footer = dynamic(() => import("../components/Footer"));

export default function Home(props) {
  const { authstatus, thankmodal, setthankmodal } = useContext(AccountContext);

  const [isOnline, setIsOnline] = useState(true);
  const [doctors, setdoctors] = useState([]);
  const [full, setfull] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
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

    if (authstatus) {
      setthankmodal(true);
      setTimeout(() => {
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
            Please Connect To Internet !
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

      <div className="absolute">
        <SearchBox />
        <QuickSearch />
        <div className={styles.directorycontainer}>
          <Docphonebookbtn />
          <Nashmukti />
          <BloodDonatebtn />
        </div>

        <div>
          <Slider />
        </div>

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
          <p className="text-center">Loading...</p>
        )}

        {full ? (
          <div className="m-auto p-2 border border-gray-700 w-[14rem] text-center mt-9 text-cyan-600  font-bold  ">
            Thats All For Now!
          </div>
        ) : (
          <div
            onClick={() => !loading && Loadmore()}
            className="m-auto p-2 border border-gray-700 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer "
          >
            {loading ? "Loading..." : "Show More"}
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
