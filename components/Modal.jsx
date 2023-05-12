import Image from "next/image";
import React, { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import styles from "../styles/Home.module.css";
const Modal = () => {
  const { setthankmodal } = useContext(AccountContext);
  return (
    <>
      <div className={styles.modalback}>
        <div className={styles.modalbox}>
          <h1 className="text-center">Thankyou For Connecting With Ayum</h1>
          <img
            src="https://img.icons8.com/external-fauzidea-flat-fauzidea/64/null/external-success-online-learning-fauzidea-flat-fauzidea.png"
            alt="success"
          />
          <div
            onClick={() => {
              localStorage.setItem("thankmodal", false);
              setthankmodal(false);
            }}
            className={styles.closemodal}
          >
            Close
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
