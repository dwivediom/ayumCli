import React from "react";
import dynamic from "next/dynamic";
const About = dynamic(() => import("../../components/About us/About"));

const Aboutpage = () => {
  return (
    <div>
      <About />
    </div>
  );
};

export default Aboutpage;
