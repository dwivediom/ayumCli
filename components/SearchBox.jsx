import React from "react";
import styles from "../styles/Search.module.css";
import { useRouter } from "next/router";
// import { bgSecColor, bgPriColor } from "./theam/theam";

const SearchBox = () => {
  const router = useRouter();

  const clickserch = () => {
    router.push("/Search/Search");
  };

  return (
    <div className="px-4" onClick={() => clickserch()}>
      <form className={`${styles.searchform}`} onSubmit={(e) => onSearch(e)}>
        <div className="relative">
          {/* <div className={`${styles.searchicon}`}>
            <svg
              aria-hidden="true"
              className="w-5 h-5  text-gray-300"
              fill="none"
              stroke="rgb(0, 154, 171)"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div> */}
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
