import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import styles from "./styles.module.css";

const OrderConfirmation = ({
  lang = "en",
  soundType = "default",
  orderDetails = null,
  onClose = null,
}) => {
  const router = useRouter();
  const audioRef = useRef(null);

  // Sound configurations for different customer types
  const soundConfigs = {
    default: {
      file: "/successnoti.mp3",
      fallback: "programmatic", // Use programmatic sound if file fails
    },
    premium: {
      file: "/sounds/premium-success.mp3",
      fallback: "programmatic",
    },
    vip: {
      file: "/sounds/vip-success.mp3",
      fallback: "programmatic",
    },
    business: {
      file: "/sounds/business-success.mp3",
      fallback: "programmatic",
    },
  };

  // Animation: add a class after mount for checkmark
  useEffect(() => {
    const check = document.getElementById("checkmark-circle");
    if (check) {
      setTimeout(() => check.classList.add(styles.animated), 100);
    }
  }, []);

  // Play success sound when component mounts
  useEffect(() => {
    const playSuccessSound = async () => {
      const config = soundConfigs[soundType] || soundConfigs.default;

      try {
        // Try to play sound file first
        await playSoundFile(config.file);
      } catch (error) {
        console.log("Sound file failed, using fallback:", error);
        // Fallback to programmatic sound
        if (config.fallback === "programmatic") {
          playProgrammaticSound();
        }
      }
    };

    // Function to play sound file
    const playSoundFile = async (soundPath) => {
      return new Promise((resolve, reject) => {
        const audio = new Audio(soundPath);

        audio.oncanplaythrough = () => {
          audio
            .play()
            .then(() => {
              console.log("Sound file played successfully");
              resolve();
            })
            .catch(reject);
        };

        audio.onerror = () => {
          reject(new Error("Failed to load sound file"));
        };

        // Set a timeout in case the file doesn't load
        setTimeout(() => {
          reject(new Error("Sound file load timeout"));
        }, 3000);
      });
    };

    // Function to play programmatic sound (fallback)
    const playProgrammaticSound = async () => {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Different sound patterns based on customer type
        const soundPatterns = {
          default: {
            frequencies: [800, 1200, 600],
            duration: 0.5,
            volume: 0.3,
          },
          premium: {
            frequencies: [1000, 1400, 800, 1200],
            duration: 0.8,
            volume: 0.4,
          },
          vip: {
            frequencies: [1200, 1600, 1000, 1400, 800],
            duration: 1.2,
            volume: 0.5,
          },
          business: {
            frequencies: [600, 900, 1200, 900],
            duration: 0.6,
            volume: 0.35,
          },
        };

        const pattern = soundPatterns[soundType] || soundPatterns.default;
        const timeStep = pattern.duration / pattern.frequencies.length;

        pattern.frequencies.forEach((freq, index) => {
          oscillator.frequency.setValueAtTime(
            freq,
            audioContext.currentTime + index * timeStep
          );
        });

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          pattern.volume,
          audioContext.currentTime + 0.05
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + pattern.duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + pattern.duration);

        oscillator.onended = () => {
          oscillator.disconnect();
          gainNode.disconnect();
        };
      } catch (error) {
        console.log("Programmatic sound failed:", error);
      }
    };

    // Play sound after a small delay
    const soundTimer = setTimeout(playSuccessSound, 200);

    return () => {
      clearTimeout(soundTimer);
    };
  }, [soundType]);

  // Texts
  const texts = {
    en: {
      thank: "Thank you for ordering!",
      ayum: "Ayum",
      soon: "Order price will be shared soon by medical store.",
      goto: "Go to My Orders",
      placed: "Order Initiated",
      orderId: "Order ID",
      orderType: "Order Type",
      deliveryAddress: "Delivery Address",
      items: "Items",
      total: "Total",
      close: "Close",
    },
    hi: {
      thank: "ऑर्डर करने के लिए धन्यवाद!",
      ayum: "आयुम",
      soon: "ऑर्डर की कीमत जल्द ही मेडिकल द्वारा साझा की जाएगी।",
      goto: "मेरे ऑर्डर देखें",
      placed: "ऑर्डर शुरू हो गया",
      orderId: "ऑर्डर आईडी",
      orderType: "ऑर्डर प्रकार",
      deliveryAddress: "डिलीवरी पता",
      items: "आइटम",
      total: "कुल",
      close: "बंद करें",
    },
  }[lang];

  const getOrderTypeText = (orderType) => {
    const types = {
      en: {
        prescription_upload: "Prescription Upload",
        call_required: "Call Required",
        medicine_search: "Medicine Search",
      },
      hi: {
        prescription_upload: "प्रिस्क्रिप्शन अपलोड",
        call_required: "कॉल आवश्यक",
        medicine_search: "दवा खोज",
      },
    };
    return types[lang][orderType] || orderType;
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/medical/requests");
    }
  };

  return (
    <div className={styles.orderConfirmScreen}>
      <div className={styles.orderConfirmHeader}>
        <span className={styles.ayumText}>{texts.ayum}</span>
      </div>
      <div className={styles.checkmarkContainer}>
        <svg
          id="checkmark-circle"
          className={styles.checkmark}
          viewBox="0 0 52 52"
        >
          <circle
            className={styles.checkmarkCircle}
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className={styles.checkmarkCheck}
            fill="none"
            d="M14 27l7 7 16-16"
          />
        </svg>
      </div>
      <div className={styles.orderConfirmText}>
        <h2 className={styles.orderPlaced}>{texts.placed} ✔</h2>
        <p className={styles.thankYou}>{texts.thank}</p>
        <p className={styles.soon}>{texts.soon}</p>
      </div>

      {/* Order Details Section */}
      {orderDetails && (
        <div className={styles.orderDetailsSection}>
          <div className={styles.orderDetailItem}>
            <span className={styles.orderDetailLabel}>{texts.orderId}:</span>
            <span className={styles.orderDetailValue}>
              {orderDetails.orderId}
            </span>
          </div>

          <div className={styles.orderDetailItem}>
            <span className={styles.orderDetailLabel}>{texts.orderType}:</span>
            <span className={styles.orderDetailValue}>
              {getOrderTypeText(orderDetails.orderType)}
            </span>
          </div>

          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className={styles.orderDetailItem}>
              <span className={styles.orderDetailLabel}>{texts.items}:</span>
              <div className={styles.orderItemsList}>
                {orderDetails.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {orderDetails.total > 0 && (
            <div className={styles.orderDetailItem}>
              <span className={styles.orderDetailLabel}>{texts.total}:</span>
              <span className={styles.orderDetailValue}>
                ₹{orderDetails.total}
              </span>
            </div>
          )}

          {orderDetails.deliveryAddress && (
            <div className={styles.orderDetailItem}>
              <span className={styles.orderDetailLabel}>
                {texts.deliveryAddress}:
              </span>
              <div className={styles.deliveryAddress}>
                <p>{orderDetails.deliveryAddress.customerName}</p>
                <p>{orderDetails.deliveryAddress.street}</p>
                <p>
                  {orderDetails.deliveryAddress.city},{" "}
                  {orderDetails.deliveryAddress.state} -{" "}
                  {orderDetails.deliveryAddress.pincode}
                </p>
                {orderDetails.deliveryAddress.landmark && (
                  <p>Landmark: {orderDetails.deliveryAddress.landmark}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.orderConfirmActions}>
        <Button
          label={texts.goto}
          icon="pi pi-list"
          onClick={() => router.push("/medical/requests")}
          className={styles.gotoOrdersBtn}
        />

        {onClose && (
          <Button
            label={texts.close}
            icon="pi pi-times"
            onClick={handleClose}
            className="p-button-text"
            style={{ marginTop: "1rem" }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
