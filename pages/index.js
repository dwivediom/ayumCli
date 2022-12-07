import Head from "next/head";
import Image from "next/image";
import { getdoctor } from "./api/DoctorApi/DocApi";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
const SearchBox = dynamic(() => import("../components/SearchBox"));
const QuickSearch = dynamic(() => import("../components/QuickSearch"));
const GetDoctor = dynamic(() => import("../components/GetDoctor"));
const Footer = dynamic(() => import("../components/Footer"));

export default function Home(props) {
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
  );
}

export async function getServerSideProps(context) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_B_PORT}/api/profile`
  );
  console.log(data);
  return {
    props: { data }, // will be passed to the page component as props
  };
}
