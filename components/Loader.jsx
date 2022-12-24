import React from "react";
import styles from "../styles/Home.module.css";

const Loader = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={`${styles.loadcontainer}`}>
        <div className={`${styles.loadbox1}`}></div>
        <div className={`${styles.loadbox2}`}></div>
        <div className={`${styles.loadbox3}`}></div>
      </div>
    </div>
  );
};

export default Loader;
