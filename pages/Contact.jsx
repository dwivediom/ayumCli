import dynamic from "next/dynamic";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../components/Loader";
const Contact = dynamic(() => import("../components/Contact us/contact"));
const Contactpage = () => {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 2000);
  });
  return <>{loading ? <Loader /> : <Contact />}</>;
};

export default Contactpage;
