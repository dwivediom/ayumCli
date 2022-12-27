import Head from "next/head";
import React from "react";
import Aboutus from "../components/Aboutus";

const About = () => {
  return (
    <>
      <Head>
        <title>About Us- Ayum</title>
        <meta name="title" content="About Us- Ayum " />
        <meta
          name="description"
          content="Ayum is an One Stop Online platform that provides the facility
          to Book Appointments and using Ayum you can also get your Lab
          tests report in your smartphone..."
        />
      </Head>
      <Aboutus />
    </>
  );
};

export default About;
