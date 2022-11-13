import Head from "next/head";
import Image from "next/image";
import Footer from "../components/Footer";
import GetDoctor from "../components/GetDoctor";
import QuickSearch from "../components/QuickSearch";
import SearchBox from "../components/SearchBox";
import styles from "../styles/Home.module.css";

export const config = {
  unstable_runtimeJS: false,
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ayum</title>
        <meta name="title" content="ayum" />
        <meta
          name="description"
          content="Ayum is Online Doctor Appointment Booking Platform and Health Care Services Provider i,e Lab Reports , Medicine Delivery etc.  "
        />
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
              <Image
                width={"65px"}
                height={"65px"}
                loading="lazy"
                src={"/barkha.jpg"}
              />{" "}
              <span className={styles.name}>
                Barkha Upadhyay <br />
                <span>
                  Senior Technical Consultant <br />
                  (Jabalpur Incubation Center){" "}
                </span>
              </span>
            </div>
            <div className={styles.person}>
              <Image
                width={"65px"}
                height={"65px"}
                loading="lazy"
                src={"/bl.jpeg"}
              />{" "}
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
              <Image
                width={"65px"}
                height={"65px"}
                loading="lazy"
                src={"/dhreendra.jpeg"}
              />{" "}
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
  );
}
