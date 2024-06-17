import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";

const Loader = () => {
  const [count, setCount] = useState(29900);

  const totalUsers = 30000;
  useEffect(() => {
    if (count < totalUsers) {
      const interval = setInterval(() => {
        setCount((prev) => Math.min(prev + 10, totalUsers));
      }, 50); // Adjust the interval for animation speed

      return () => clearInterval(interval);
    }
  }, [count, totalUsers]);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        paddingTop: "10rem",
        // justifyContent: "center",
        gap: "10px",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Image src={"/loader.svg"} width={50} height={50} alt="Loading..." />
      <span
        style={{
          fontSize: "1.05rem",
          fontWeight: "600",
          color: "aqua",
          background: "#02323a",
          padding: "3px 8px",
          borderRadius: "24px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        {" "}
        Ayum Family is Now{" "}
        <span
          style={{
            fontSize: "1.2rem",
            color: "#fff",
            fontWeight: "600",
          }}
        >
          {count}+
        </span>
      </span>
    </div>
  );
};

export default Loader;
