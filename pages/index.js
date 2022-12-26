import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../components/Loader";

const SearchBox = dynamic(() => import("../components/SearchBox"));
const QuickSearch = dynamic(() => import("../components/QuickSearch"));
const GetDoctor = dynamic(() => import("../components/GetDoctor"));
const Footer = dynamic(() => import("../components/Footer"));

const mystyle = {
  visibility: "hidden",
};

export default function Home(props) {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 3000);
  }, [props.data]);

  return (
    <>
      <Head>
        <title>Ayum</title>
        <meta name="title" content="ayum" />
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
      <div style={loading ? { display: "block" } : { display: "none" }}>
        <Loader />
      </div>
      <div
        style={loading ? { display: "none" } : { display: "block" }}
        className={styles.container}
      >
        <SearchBox />
        <QuickSearch />
        <main className={`${""} m-3`}>
          <GetDoctor getDoctor={props.data} />
        </main>

        <footer className={styles.footer}>
          <div className={styles.thankyouCard}>
            <h2>Special Thanks To 💖✨</h2>
            <h3>Supported By :</h3>
            <div>
              <div className={styles.person}>
                <div style={{ margin: "auto" }}>
                  <Image
                    width={65}
                    height={65}
                    loading="lazy"
                    src={"/barkha.jpg"}
                    alt={"Barkha Upadhyay"}
                  />{" "}
                </div>
                <span className={styles.name}>
                  Barkha Upadhyay <br />
                  <span>
                    Senior Technical Consultant <br />
                    (Jabalpur Incubation Center){" "}
                  </span>
                </span>
              </div>
              <div className={styles.person}>
                <div style={{ margin: "auto" }}>
                  <Image
                    width={65}
                    height={65}
                    loading="lazy"
                    src={"/bl.jpeg"}
                    alt={"Dr BL Mishra"}
                  />
                </div>
                <span className={styles.name}>
                  Dr BL Mishra
                  <br />
                  <span>
                    CMHO Rewa ,sidhi <br />
                    (Medical specialist at kushabahu thakre rewa)
                  </span>
                </span>
              </div>
              <div className={styles.person}>
                <div style={{ margin: "auto" }}>
                  <Image
                    width={65}
                    height={65}
                    loading="lazy"
                    src={"/dhreendra.jpeg"}
                    alt={"Dr Dheerendra Mishra"}
                  />
                </div>
                <span className={styles.name}>
                  Dr Dheerendra Mishra <br />
                  <span>
                    MD , DNB <br /> (Asso. Member of International headache
                    society , London)
                  </span>
                </span>
              </div>
            </div>
          </div>
          <Footer />
        </footer>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_B_PORT}/api/profile`
  );
  return {
    props: { data }, // will be passed to the page component as props
  };
}
