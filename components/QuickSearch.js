import React from "react";
import styles from "../styles/quickSearch.module.css";
import { quickSearchaction } from "../redux/actions/searchAction";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";

const QuickSearch = () => {
  const router = useRouter();
  const [key, setkey] = useState(null);
  const dispatch = useDispatch();
  const qSearch = (e) => {
    e.preventDefault();
    let val = e.target.outerText;
    localStorage.setItem("skey", val);
    console.log("key data ", val);

    setkey(val);

    dispatch(quickSearchaction(val));
    router.push("/Search/Search");
  };

  return (
    <div
      style={{
        width: "98%",
        margin: "auto",
      }}
      className="grid lg:grid-cols-8 md:grid-cols-4 max-[760px]:grid-cols-4 gap-4 p-4"
    >
      <div
        value="Kideny"
        onClick={(e) => qSearch(e)}
        data="kideny"
        className={`${styles.btn1} `}
      >
        {" "}
        <span className={`${styles.divtext}`}>Kideny</span>{" "}
      </div>
      <div
        onClick={(e) => qSearch(e)}
        value="Dentist "
        className={`${styles.btn2} `}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>Dentist</span>
      </div>
      <div
        onClick={(e) => qSearch(e)}
        value="neuro"
        className={` ${styles.btn3} `}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>neuro</span>{" "}
      </div>
      <div
        onClick={(e) => qSearch(e)}
        value="surgery"
        className={`${styles.btn4} `}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>surgery</span>{" "}
      </div>
      <div
        onClick={(e) => qSearch(e)}
        value="Skin    "
        className={`${styles.btn5} `}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>Skin</span>
      </div>
      <div
        onClick={(e) => qSearch(e)}
        value="Bone"
        className={`${styles.btn6} `}
        // className="bg-gray-100 p-4"
      >
        <span className={`${styles.divtext}`}>Bone</span>{" "}
      </div>
      <div
        onClick={(e) => qSearch(e)}
        value="Gynae"
        className={`${styles.btn7} `}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>Gynae</span>{" "}
      </div>
      <div
        onClick={(e) => qSearch(e)}
        value="Medicine"
        className={`${styles.btn8} `}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>Medicine</span>
      </div>
    </div>
  );
};

export default React.memo(QuickSearch);
