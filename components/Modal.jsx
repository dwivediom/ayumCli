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
          <h1>Thankyou For Connecting With Ayum</h1>
          <Image src={"/success.svg"} width={40} height={40} alt={"success"} />
          <div
            onClick={() => setthankmodal(false)}
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
