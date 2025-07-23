import React from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import styles from "./styles.module.css";

const LabBookingSuccess = ({ bookingDetails, onClose }) => {
  const router = useRouter();
  const { lang } = useContext(AccountContext);

  const handleGoToBookings = () => {
    onClose?.();
    router.push("/lab/bookings");
  };

  const handleGoToHome = () => {
    onClose?.();
    router.push("/");
  };

  return (
    <div className={styles.successOverlay}>
      <div className={styles.successCard}>
        {/* Success Animation */}
        <div className={styles.successIllustration}>
          <div className={styles.successIcon}>
            <i className="pi pi-check-circle"></i>
          </div>
          <div className={styles.confettiContainer}>
            <div className={styles.confetti}></div>
            <div className={styles.confetti}></div>
            <div className={styles.confetti}></div>
            <div className={styles.confetti}></div>
            <div className={styles.confetti}></div>
          </div>
        </div>
        <h2 className={styles.successTitle}>
          {lang === "en" ? "Booking Confirmed!" : "बुकिंग सफल!"}
        </h2>
        <p className={styles.successSubtitle}>
          {lang === "en"
            ? "Your lab test has been booked successfully."
            : "आपकी लैब टेस्ट बुकिंग सफल रही।"}
        </p>
        <div className={styles.successDetails}>
          <span>
            {lang === "en" ? "Booking ID:" : "बुकिंग आईडी:"}{" "}
            <b>{bookingDetails?.bookingId || bookingDetails?._id}</b>
          </span>
        </div>
        <Button
          label={lang === "en" ? "Go to My Bookings" : "मेरी बुकिंग्स देखें"}
          className={styles.homeBtn}
          onClick={handleGoToBookings}
        />
        <Button
          label={lang === "en" ? "Go to Home" : "होम पेज पर जाएं"}
          className={styles.ordersBtn}
          onClick={handleGoToHome}
          outlined
        />
      </div>
    </div>
  );
};

export default LabBookingSuccess;
