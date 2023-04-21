import React, { useState } from "react";
import styles from "../styles/Phonebook.module.css";

const DirectoryCard = ({ item, key }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{
        height: show && "fit-content",
      }}
      key={key}
      className={`${styles.directorycard}`}
    >
      <div>
        <div className={`${styles.cardname}`}>{item.name}</div>
      </div>
      <div className={`${styles.carddeatilbox}`}>
        <div>
          {" "}
          <span className="font-bold">City :</span> {item.city}
        </div>

        <div>
          {" "}
          <span className="font-bold">Phone :</span> {item.phone}
        </div>

        <div>
          <span className="font-bold">Time :</span> {item.timeing}
        </div>
        <div>
          <span className="font-bold">Specialist :</span> {item.specialist}{" "}
        </div>
        <div className={`${styles.showmorebox}`}>
          <span onClick={() => setShow(!show)} className={`${styles.showmore}`}>
            {show ? "Hide details" : "More details..."}{" "}
            <span className="text-lg">&#x2193;</span>
          </span>
        </div>

        <div style={{ display: !show && "none" }}>
          <span className="font-bold">Address :</span> {item.address}
        </div>
      </div>
    </div>
  );
};

export default DirectoryCard;
