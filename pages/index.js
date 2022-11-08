import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import GetDoctor from "../components/GetDoctor";
import Navbar from "../components/Navbar";
import QuickSearch from "../components/QuickSearch";
import SearchBox from "../components/SearchBox";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ayum</title>
        <meta name="title" content="ayum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchBox />
      <QuickSearch />
      <main className={`${""} m-3`}>
        <GetDoctor />
      </main>

      <footer className={styles.footer}>
        <div className={styles.thankyouCard}>
          <h2>Special Thanks To 💖✨</h2>
          <h3>Supported By :</h3>
          <div>
            <div className={styles.person}>
              <img src="https://media-exp1.licdn.com/dms/image/C4E03AQFg4w0Im47BLQ/profile-displayphoto-shrink_800_800/0/1641879029231?e=1673481600&v=beta&t=zAEbhQnM6xhjjF95gvyKvzqGH5vWibgr0bK43dUBrzk" />{" "}
              <span className={styles.name}>
                Barkha Upadhyay <br />
                <span>
                  Senior Technical Consultant <br />
                  (Jabalpur Incubation Center){" "}
                </span>
              </span>
            </div>
            <div className={styles.person}>
              <img src="https://i.ibb.co/CHRw9nX/Whats-App-Image-2022-11-07-at-6-59-20-PM.jpg" />{" "}
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
      </footer>
    </div>
  );
}
