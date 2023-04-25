import React from "react";
import styles from "../styles/quickSearch.module.css";
import { quickSearchaction } from "../redux/actions/searchAction";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import ReactGA from "react-ga";

const QuickSearch = () => {
  const router = useRouter();

  const [key, setkey] = useState(null);
  const dispatch = useDispatch();
  const [showmore, setshow] = useState(false);
  const qSearch = (e) => {
    e.preventDefault();

    let val = e.target.outerText;

    ReactGA.event({
      category: "quick search button",
      action: "clicked",
      label: val,
      value: val,
    });
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
      className="grid  lg:grid-cols-8 md:grid-cols-4 max-[760px]:grid-cols-4 gap-4 p-4"
    >
      <div
        onClick={(e) => qSearch(e)}
        value="Kidney "
        className={`${styles.btn6} `}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>Kideny</span>
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
        value="Skin    "
        className={`${styles.btn5} `}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>Skin</span>
      </div>
      <div
        // value="Kideny"
        onClick={() => router.push("/Other/BloodBank")}
        // data="kideny"
        className={`${styles.btn1} `}
      >
        {" "}
        <span className={`${styles.divtext}`}>Blood Bank</span>{" "}
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
      <div
        onClick={(e) => qSearch(e)}
        value="ortho bone"
        className={`${styles.btn6} `}
        // className="bg-gray-100 p-4"
      >
        <span className={`${styles.divtext}`}>Ortho</span>{" "}
      </div>
      <div
        // value="Kideny"
        onClick={() => {
          if (router.pathname == "/Category/Category") {
            setshow(!showmore);
          } else {
            router.push("/Category/Category");
          }
        }}
        // data="kideny"
        className={`${styles.showbtn} `}
      >
        <span className={`${styles.divtext}`}>
          {" "}
          {showmore ? "Hide" : "Show More"}{" "}
        </span>{" "}
      </div>

      {showmore && (
        <>
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
            value="neuro"
            className={` ${styles.btn3} `}
            // className="bg-gray-100 p-4"
          >
            {" "}
            <span className={`${styles.divtext}`}>neuro</span>{" "}
          </div>
          <div
            onClick={(e) => qSearch(e)}
            value="physician"
            className={` ${styles.btn2} `}
            // className="bg-gray-100 p-4"
          >
            {" "}
            <span className={`${styles.divtext}`}>Physician</span>{" "}
          </div>
          <div
            onClick={(e) => qSearch(e)}
            value="cancer oncologist"
            className={` ${styles.btn5} `}
            // className="bg-gray-100 p-4"
          >
            {" "}
            <span className={`${styles.divtext}`}>Cancer</span>{" "}
          </div>
          <div
            onClick={(e) => qSearch(e)}
            value="children pedia"
            className={` ${styles.btn8} `}
            // className="bg-gray-100 p-4"
          >
            {" "}
            <span className={`${styles.divtext}`}>Children</span>{" "}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(QuickSearch);
