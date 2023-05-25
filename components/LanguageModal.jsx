import React from "react";
import styles from "../styles/extracss.module.css";
import { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";

const LanguageModal = () => {
  const { setlang, setlangmodal } = useContext(AccountContext);

  const handleClick = (e, lang) => {
    e.preventDefault();
    localStorage.setItem("locale", lang);
    setlang(lang);
    setlangmodal(false);
  };

  return (
    <div className={`${styles.languagediv}`}>
      <div className={`${styles.languagemodal}`}>
        <h1>
          Choose Language <br /> भाषा चुनें:
        </h1>
        <div
          onClick={(e) => handleClick(e, "hi")}
          className={`${styles.languagebtns}`}
        >
          हिन्दी
        </div>
        <div
          onClick={(e) => handleClick(e, "en")}
          className={`${styles.languagebtns}`}
        >
          English
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
