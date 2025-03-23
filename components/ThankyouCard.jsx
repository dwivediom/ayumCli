import Image from "next/image";
import React from "react";
import styles from "../styles/Home.module.css";

const ThankyouCard = () => {
  return (
    <>
      <div className={`${styles.thankyouframe}`}>
        <h1>Special Thanks To 💖 </h1>
        <div className={`${styles.thankyoucontainer}`}></div>
      </div>
    </>
  );
};

export default ThankyouCard;
