import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SearchDoc } from "../routes/directory";
import styles from "../styles/Phonebook.module.css";

const BloodDonatebtn = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/Other/BloodBank")}
      className={`${styles.docphonebookbtn}`}
      //   className="grid grid-cols-3"
    >
      <div className={`${styles.bloodimgbtn}`}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className={`${styles.bloodimg}`}></div>
          Blood Bank Info!
        </div>
      </div>
    </div>
  );
};

export default BloodDonatebtn;
