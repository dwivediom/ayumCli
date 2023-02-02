import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
import ThankyouCard from "../components/ThankyouCard";

const SearchBox = dynamic(() => import("../components/SearchBox"));
const QuickSearch = dynamic(() => import("../components/QuickSearch"));
const GetDoctor = dynamic(() => import("../components/GetDoctor"));
const Footer = dynamic(() => import("../components/Footer"));

export default function Home(props) {
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
        <SearchBox />
        <QuickSearch />
        <main>
          <GetDoctor getDoctor={props.data} />
        </main>
        <footer className={styles.footer}>
          <ThankyouCard />
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
