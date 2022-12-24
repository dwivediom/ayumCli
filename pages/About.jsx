import Head from "next/head";
import React, { useEffect, useState } from "react";
import Aboutus from "../components/Aboutus";
import Loader from "../components/Loader";

const Aboutpage = () => {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 2000);
  });
  return (
    <>
      <Head>
        <title>AboutUs - Ayum</title>
        <meta name="title" content="ayum-about" />
        <meta
          name="description"
          content="Ayum Team's include Founder Om dhar dwivedi and Co-Founder Anurag Singh and Ayum makes the hectic procedure of booking doctor's appointement and getting lab tests report into an simple task ."
        />
        <meta
          name="google-site-verification"
          content="TZ_t3W3EZ4x4C5q8BPlZ_luCjIeWczMJwCyObT8AjYA"
        />
      </Head>
      {loading ? <Loader /> : <Aboutus />}
    </>
  );
};

export default Aboutpage;
