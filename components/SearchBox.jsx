import React, { useContext } from "react";
import styles from "../styles/Searchinput.module.css";
import { useRouter } from "next/router";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/search";
import Hindi from "../public/locales/hi/search";

const SearchBox = () => {
  const router = useRouter();
  const { lang } = useContext(AccountContext);

  const clickserch = () => {
    router.push("/Search/Search");
  };

  return (
    <div
      style={{
        maxWidth: "1240px",
        margin: "auto",
      }}
      className="px-4"
      onClick={() => clickserch()}
    >
      <form className={`${styles.searchform}`} onSubmit={(e) => onSearch(e)}>
        <div className="relative">
          <input
            type="search"
            id="default-search"
            className={`${styles.searchinput}`}
            placeholder={lang == "en" ? English.placeholder : Hindi.placeholder}
          />
          <button type="button" className={`${styles.searchbtn}`}>
            {lang == "en" ? English.search : Hindi.search}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
