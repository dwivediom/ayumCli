import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Skeleton } from "primereact/skeleton";

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
        position: "relative",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          alt="logo"
          style={{
            position: "absolute",
            alignSelf: "center",
            top: "-35px",
            cursor: "pointer",
            left: "50%",
            width: "140px",
            height: "140px",
            transform: "translate(-50%)",
            zIndex: "100",
          }}
          src="/ayumlogormbg.png"
          height="40"
          className="mr-2"
        ></img>
        <Skeleton
          width="100vw"
          height="4rem"
          className="mt-[-3rem] shadow-md"
        ></Skeleton>
      </div>

      <Skeleton width="95vw" className="m-auto mt-4" height="3rem"></Skeleton>
      <span
        style={{
          fontSize: "1.05rem",
          fontWeight: "600",
          justifyContent: "center",
          padding: "3px 8px",
          borderRadius: "24px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          fontFamily: "sans-serif",
          width: "18rem",
          margin: "auto",
          marginTop: "1rem",
        }}
        className="shadow-md"
      >
        {" "}
        Ayum Family is Now{" "}
        <span
          style={{
            fontSize: "1.2rem",
            color: "teal",
            fontWeight: "600",
          }}
        >
          {count}+
        </span>
      </span>
      <div
        style={{
          padding: "3rem",
          paddingTop: "1.5rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Skeleton
          width="18rem"
          shape="square"
          height="10rem"
          className="mb-2"
        ></Skeleton>
        <Skeleton
          width="18rem"
          shape="square"
          height="10rem"
          className="mb-2"
        ></Skeleton>
        <Skeleton
          width="18rem"
          shape="square"
          height="10rem"
          className="mb-2"
        ></Skeleton>
        <Skeleton
          width="18rem"
          shape="square"
          height="10rem"
          className="mb-2"
        ></Skeleton>
        <Skeleton
          width="18rem"
          shape="square"
          height="10rem"
          className="mb-2"
        ></Skeleton>
        <Skeleton
          width="18rem"
          shape="square"
          height="10rem"
          className="mb-2"
        ></Skeleton>
        <Skeleton
          width="18rem"
          shape="square"
          height="10rem"
          className="mb-2"
        ></Skeleton>
      </div>
      {/* <Image src={"/loader.svg"} width={50} height={50} alt="Loading..." />
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
      </span> */}
    </div>
  );
};

export default Loader;
