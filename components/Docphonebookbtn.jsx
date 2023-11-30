import { useRouter } from "next/router";
import React, { useContext } from "react";
import styles from "../styles/Phonebook.module.css";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
const Docphonebookbtn = () => {
  const router = useRouter();
  const { lang } = useContext(AccountContext);
  return (
    <div
      onClick={() => router.push("/DoctorDirectory")}
      className={`${styles.docphonebookbtn1}  `}
    >
      <div
        className={`${styles.phonebookbtn} rounded-lg shadow-md text-center`}
      >
        <div className={`${styles.callimg}`}>
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/phone.png"
            alt="phone"
          />
        </div>
        {lang == "en" ? English.docbtntxt : Hindi.docbtntxt}
      </div>
    </div>
  );
};

export default Docphonebookbtn;
