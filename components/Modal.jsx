import React, { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import styles from "../styles/Home.module.css";
const Modal = () => {
  const { setthankmodal } = useContext(AccountContext);
  return (
    <>
      <div className={styles.modalback}>
        <div className={styles.modalbox}>
          <div>
            <span className=" text-orange-500">
              Thankyou For Connecting With{" "}
              <span className="  text-cyan-600">Ayum</span>{" "}
            </span>
            <br />
            <span className="text-green-500">
              {" "}
              Now you can use all the Services
            </span>
          </div>
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
