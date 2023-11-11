import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Phonebook.module.css";

const Nashmukti = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/Other/Nashmukti")}
      className={`${styles.docphonebookbtn2} `}
    >
      <div className={`${styles.nsmimgbtn}  rounded-lg shadow-md text-center`}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className={`${styles.nsmimg}`}></div>
          नशा मुक्ति अभियान
        </div>
      </div>
    </div>
  );
};

export default Nashmukti;
