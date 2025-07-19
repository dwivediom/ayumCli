import React from "react";
import styles from "./OrderConfirmation.module.css";
import { Button } from "primereact/button";
import { useRouter } from "next/router";

const OrderConfirmation = ({ lang, orderDetails, onClose }) => {
  const router = useRouter();

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Confetti or animated SVG */}
        <div className={styles.illustration}>
          <img src="/success.gif" alt="Order Success" />
        </div>
        <h2 className={styles.title}>
          {lang === "en" ? "Thank you!!" : "धन्यवाद!!"}
        </h2>
        <p className={styles.subtitle}>
          {lang === "en"
            ? "Your order is confirmed."
            : "आपका ऑर्डर सफलतापूर्वक बुक हो गया है।"}
        </p>
        <div className={styles.details}>
          <span>
            {lang === "en" ? "Order ID:" : "ऑर्डर आईडी:"}{" "}
            <b>{orderDetails?.orderId}</b>
          </span>
        </div>
        <Button
          label={lang === "en" ? "Back to Home" : "होम पर जाएं"}
          className={styles.homeBtn}
          onClick={() => {
            onClose?.();
            router.push("/");
          }}
        />
        <Button
          label={lang === "en" ? "View My Orders" : "मेरे ऑर्डर देखें"}
          className={styles.ordersBtn}
          onClick={() => {
            onClose?.();
            router.push("/medical/requests");
          }}
          outlined
        />
      </div>
      {/* Optionally, add confetti animation here */}
    </div>
  );
};

export default OrderConfirmation;
