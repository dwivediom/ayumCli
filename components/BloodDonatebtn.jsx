import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SearchDoc } from "../routes/directory";
import styles from "../styles/Phonebook.module.css";
import { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";

const BloodDonatebtn = () => {
  const router = useRouter();
  const { lang } = useContext(AccountContext);
  return (
    <div
      onClick={() => router.push("/Other/BloodRequest")}
      className={`${styles.docphonebookbtn3}`}
      //   className="grid grid-cols-3"
    >
      <div className={`${styles.bloodimgbtn} rounded-lg shadow-md text-center`}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className={`${styles.bloodimg}`}></div>
          {lang == "en" ? English.bloodbtntxt : Hindi.bloodbtntxt}
        </div>
      </div>
    </div>
  );
};

export default BloodDonatebtn;
