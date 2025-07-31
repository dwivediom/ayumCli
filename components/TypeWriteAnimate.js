import React, { useState, useEffect } from "react";
import styles from "./TypeWriteAnimate.module.css";

const text = "Free 30 min Home Delivery in Rewa";

const TypeWriteAnimate = () => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div
      style={{
        height: "100px",
      }}
      className={styles.typewriter}
    >
      {displayed}
      <span className={styles.cursor} />
    </div>
  );
};

export default TypeWriteAnimate;
