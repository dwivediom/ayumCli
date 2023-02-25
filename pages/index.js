import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
import ThankyouCard from "../components/ThankyouCard";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/AccountProvider";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";

const SearchBox = dynamic(() => import("../components/SearchBox"));
const QuickSearch = dynamic(() => import("../components/QuickSearch"));
const GetDoctor = dynamic(() => import("../components/GetDoctor"));
const Footer = dynamic(() => import("../components/Footer"));

export default function Home(props) {
  const { authstatus, setauthstatus, thankmodal, setthankmodal } =
    useContext(AccountContext);
  console.log(authstatus);

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (authstatus) {
      // alert("Thankyou For Registering with Ayum");
      setthankmodal(true);
      setauthstatus(false);
    }
  });

  console.log(props.newdata, "Data");

  if (!isOnline || props.newdata == "error") {
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

      <div className={styles.container}>
        <Navbar />
        <SearchBox />
        <QuickSearch />
        {props.newdata ? (
          <main>
            <GetDoctor getDoctor={props.newdata} />
          </main>
        ) : (
          <p className="text-center">Loading...</p>
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
