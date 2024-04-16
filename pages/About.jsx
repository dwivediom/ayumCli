import Head from "next/head";
import React from "react";
import Aboutus from "../components/Aboutus";
import Navbar from "../components/Navbar";
import NewAboutComp from "../components/NewAboutComp";

const About = () => {
  return (
    <>
      {/* <Navbar /> */}
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
      <NewAboutComp />
      {/* <Aboutus /> */}
    </>
  );
};

export default About;
