import dynamic from "next/dynamic";
import React from "react";

const Contact = dynamic(() => import("../components/Contact us/contact"));
const Contactpage = () => {
  return (
    <>
      <div
        style={{
          height: "100vh",
        }}
      >
        <Contact />
      </div>
    </>
  );
};

export default Contactpage;
