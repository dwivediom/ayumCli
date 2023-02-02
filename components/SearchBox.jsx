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
            // onChange={(e) => handleChange(e)}
            id="default-search"
            className={`${styles.searchinput}`}
            placeholder="Search Doctors, Specialist , Clinics..."
            required
          />
          <button
            type="button"
            // onClick={(e) => onSearch(e)}
            className={`${styles.searchbtn}`}
            // className={`text-white absolute right-2.5 bottom-2.5 ${bgPriColor} hover:bg-cyan-800 focus:ring-7 focus:outline-none focus:ring-cyan-50 font-medium rounded-lg text-sm px-4 py-2 dark:bg-cyan-500 dark:hover:bg-cyan-500 dark:focus:ring-cyan-500`}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
