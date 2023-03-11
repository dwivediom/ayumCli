import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Phonebook.module.css";

const EmailBanner = ({ logged, loggedmail }) => {
  const router = useRouter();
  return (
    <div
      // onClick={() => router.push("/DoctorDirectory")}
      className={`${styles.docphonebookbtn}`}
    >
      {logged ? (
        <div className={`${styles.emailbtn}`}>
          <div className={`${styles.emailimg}`}>
            <img
              src="https://img.icons8.com/3d-fluency/94/null/gmail.png"
              alt="email"
            />{" "}
          </div>
          {loggedmail}
        </div>
      ) : (
        <div
          className={`${styles.emailbtn}`}
          onClick={() => router.push("/User/UserRegistrationPage")}
        >
          <div className={`${styles.emailimg}`}>
            <img
              src="https://img.icons8.com/3d-fluency/94/null/gmail.png"
              alt="email"
            />{" "}
          </div>
          Sign Up Needed!
        </div>
      )}
    </div>
  );
};

export default EmailBanner;
