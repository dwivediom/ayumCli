import dynamic from "next/dynamic";
import React from "react";
const Contact = dynamic(() => import("../components/Contact us/contact"));
const Contactpage = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default Contactpage;
