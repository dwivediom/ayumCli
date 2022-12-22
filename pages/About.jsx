import Head from "next/head";
import React from "react";
import Aboutus from "../components/Aboutus";

const Aboutpage = () => {
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
      <Aboutus />
    </>
  );
};

export default Aboutpage;
