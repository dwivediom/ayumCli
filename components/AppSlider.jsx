import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/AppSlider.module.css";
import { FaGooglePlay } from "react-icons/fa";

const AppSlider = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Show slider after a short delay when app opens
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleDownload = () => {
    // Add your app download logic here
    console.log("Download app clicked");
    window.open(
      "https://play.google.com/store/apps/details?id=in.ayum.www.twa",
      "_blank"
    );
    // You can redirect to app store or trigger download
    // Example: window.open('https://play.google.com/store/apps/details?id=your.app.id', '_blank');
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.sliderOverlay} ${isClosing ? styles.closing : ""}`}
    >
      <div
        className={`${styles.sliderContainer} ${
          isVisible && !isClosing ? styles.slideIn : ""
        }`}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          ✕
        </button>

        <div className={styles.content}>
          {/* <div className={styles.logoContainer}> */}
          <Image
            src="/ayumlogo.png" // Make sure this logo exists in your public folder
            alt="Ayum Logo"
            width={150}
            height={150}
            // className={styles.logo}
          />
          {/* </div> */}

          <h2 className={styles.title}>Get better experience on app</h2>

          <p className={styles.subtitle}>
            Download our mobile app for a seamless experience
          </p>

          <button className={styles.downloadButton} onClick={handleDownload}>
            <FaGooglePlay
              className={styles.googlePlayIcon}
              style={{
                marginRight: "10px",
                marginBottom: "-3px",
              }}
            />
            Download From Play Store
            <div className={styles.buttonGradient}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSlider;
