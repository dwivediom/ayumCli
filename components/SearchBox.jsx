import React from "react";
import styles from "../styles/Searchinput.module.css";
import { useRouter } from "next/router";

const SearchBox = () => {
  const router = useRouter();

  const clickserch = () => {
    router.push("/Search/Search");
  };

  return (
    <div className="px-4" onClick={() => clickserch()}>
      <form className={`${styles.searchform}`} onSubmit={(e) => onSearch(e)}>
        <div className="relative">
          <input
            type="search"
            id="default-search"
            className={`${styles.searchinput}`}
            placeholder="Search Doctors, Specialist , Clinics..."
          />
          <button type="button" className={`${styles.searchbtn}`}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
