import React, { useState, useEffect } from "react";
import styles from "./TypeWriteAnimate.module.css";

const texts = [
  "Free 30 min Home Delivery in Rewa",
  "Same Day Delivery in Sidhi and Churhat",
  "Trusted by 1000+ customers",
];

const TypeWriteAnimate = () => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    if (!isDeleting && index < currentText.length) {
      // Typing phase
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + currentText[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && index >= currentText.length) {
      // Wait 2 seconds after typing is complete
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayed.length > 0) {
      // Deleting phase
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev.slice(0, -1));
      }, 30);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayed.length === 0) {
      // Move to next text
      setIsDeleting(false);
      setIndex(0);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }
  }, [index, displayed, isDeleting, textIndex]);

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
