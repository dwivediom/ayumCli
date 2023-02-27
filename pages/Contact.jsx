import dynamic from "next/dynamic";
import React from "react";
import Navbar from "../components/Navbar";

const Contact = dynamic(() => import("../components/Contact us/contact"));
const Contactpage = () => {
  return (
    <>
      <div>
        <Navbar />
        <Contact />
      </div>
    </>
  );
};

export default Contactpage;
