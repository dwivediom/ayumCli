import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/AppSlider.module.css";
import { FaGooglePlay } from "react-icons/fa";

const AppSlider = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if popup should be shown
    const shouldShowPopup = () => {
      // Check if user has hidden the popup before
      const hasHiddenPopup = localStorage.getItem("ayum_app_popup_hidden");

      // Check if user is in PWA standalone mode
      const isPWAStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

      // Check if user is on mobile device
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // Show popup only if:
      // 1. User hasn't hidden it before
      // 2. Not in PWA standalone mode
      // 3. Is on mobile device
      return !hasHiddenPopup && !isPWAStandalone && isMobile;
    };

    // Show slider after a short delay if conditions are met
    const timer = setTimeout(() => {
      if (shouldShowPopup()) {
        setIsVisible(true);
      }
    }, 1000); // Increased delay to 1 second for better UX

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);

    // Save to localStorage that user has hidden the popup
    localStorage.setItem("ayum_app_popup_hidden", "true");

    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleDownload = () => {
    // Save to localStorage that user has clicked download
    localStorage.setItem("ayum_app_popup_hidden", "true");

    // Add your app download logic here
    console.log("Download app clicked");
    window.open(
      "https://play.google.com/store/apps/details?id=in.ayum.www.twa",
      "_blank"
    );

    // Close the popup after download
    handleClose();
  };

  // Don't render anything if popup shouldn't be shown
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
          <Image src="/ayumlogo.png" alt="Ayum Logo" width={150} height={150} />

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
