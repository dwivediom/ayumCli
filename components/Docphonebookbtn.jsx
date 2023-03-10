import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Phonebook.module.css";

const Docphonebookbtn = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/DoctorDirectory")}
      className={`${styles.docphonebookbtn}`}
    >
      <div className={`${styles.phonebookbtn}`}>
        <div className={`${styles.callimg}`}>
          <img src="https://img.icons8.com/ios-filled/50/FFFFFF/phone.png" />
        </div>
        Doctors PhoneBook
      </div>
    </div>
  );
};

export default Docphonebookbtn;
