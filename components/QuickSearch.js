import React, { useContext, useEffect } from "react";
import styles from "../styles/quickSearch.module.css";
import { quickSearchaction } from "../redux/actions/searchAction";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import ReactGA from "react-ga4";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/search";
import Hindi from "../public/locales/hi/search";

const QuickSearch = () => {
  const router = useRouter();
  const { lang } = useContext(AccountContext);
  const dispatch = useDispatch();
  const [showmore, setshow] = useState(false);
  const qSearch = (val) => {
    ReactGA.event({
      category: "quick search button",
      action: "clicked",
      label: val,
      value: val,
    });
    // dispatch(quickSearchaction(val));
    router.push(`/Search/Search?type=${val}`);
  };

  useEffect(() => {
    if (router.pathname == "/Category/Category") {
      setshow(true);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        margin: "auto",
        padding: "5px 10px",
        paddingTop: "10px",
        color: "teal",
        // height: "10rem",
        // marginTop: "-10px",
      }}
      className="grid lg:grid-cols-8 md:grid-cols-4 max-[760px]:grid-cols-4 gap-1"
    >
      <div
        onClick={() => qSearch(English.kidney)}
        value="Kidney "
        className={`${styles.btn6} p-3 rounded-lg shadow-md text-center `}
        // className="bg-gray-100 p-4"d
      >
        {" "}
        <span className={`${styles.divtext}`}>
          {lang == "en" ? English.kidney : Hindi.kidney}
        </span>
      </div>
      <div
        onClick={() => qSearch("dentist,orthodontics,oral")}
        value="Dentist "
        className={`${styles.btn2} p-3 rounded-lg shadow-md text-center`}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>
          {" "}
          {lang == "en" ? English.dentist : Hindi.dentist}
        </span>
      </div>

      <div
        onClick={() => qSearch("skin,derma")}
        value="Skin"
        // className="p-3 shadow-md text-center"
        className={`${styles.btn5} p-3 rounded-lg shadow-md text-center`}
        // className="bg-gray-100 p-4"
      >
        {" "}
        <span className={`${styles.divtext}`}>
          {" "}
          {lang == "en" ? English.skin : Hindi.skin}
        </span>
      </div>
      <div
        // value="Kideny"
        onClick={() => router.push("/Other/BloodBank")}
        // data="kideny"
        // className="p-3 shadow-md text-center"
        className={`${styles.btn1} p-3 rounded-lg shadow-md text-center `}
      >
        {" "}
        <span className={`${styles.divtext}`}>
          {" "}
          {lang == "en" ? English.bloodbank : Hindi.bloodbank}
        </span>{" "}
      </div>

      <div
        onClick={() => qSearch("gynae,gyno")}
        value="Gynae"
        className={`${styles.btn7} p-3 rounded-lg shadow-md text-center `}
        // className="bg-gray-100 p-4"
        // className="p-3 shadow-md text-center"
      >
        {" "}
        <span className={`${styles.divtext}`}>
          {" "}
          {lang == "en" ? English.gynae : Hindi.gynae}
        </span>{" "}
      </div>
      <div
        onClick={() => qSearch("md,medicine")}
        value="Medicine"
        className={`${styles.btn8} p-3 rounded-lg shadow-md text-center `}
        // className="bg-gray-100 p-4"
        // className="p-3 shadow-md text-center"
      >
        {" "}
        <span className={`${styles.divtext}`}>
          {" "}
          {lang == "en" ? English.medicine : Hindi.medicine}
        </span>
      </div>
      <div
        onClick={() => qSearch("bone,ortho")}
        value="ortho bone"
        className={`${styles.btn6} p-3 rounded-lg shadow-md text-center `}
        // className="bg-gray-100 p-4"
        // className="p-3 shadow-md text-center"
      >
        <span className={`${styles.divtext}`}>
          {" "}
          {lang == "en" ? English.bone : Hindi.bone}
        </span>{" "}
      </div>
      {router.pathname != "/Category/Category" && (
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
          // className="p-3 shadow-md text-center"
          className={`${styles.showbtn} p-3 rounded-lg shadow-md text-center `}
        >
          {showmore ? (
            <span> {lang == "en" ? English.hide : Hindi.hide}</span>
          ) : (
            <span> {lang == "en" ? English.showmore : Hindi.showmore}</span>
          )}
        </div>
      )}

      {showmore && (
        <>
          <div
            onClick={() => qSearch("surgery,operation")}
            value="surgery"
            className={`${styles.btn4} p-3 rounded-lg shadow-md text-center `}
            // className="bg-gray-100 p-4"
            // className="p-3 shadow-md text-center"
          >
            {" "}
            <span className={`${styles.divtext}`}>
              {" "}
              {lang == "en" ? English.surgery : Hindi.surgery}
            </span>{" "}
          </div>
          <div
            onClick={() => qSearch(English.neuro)}
            value="neuro"
            className={` ${styles.btn3} p-3 rounded-lg shadow-md text-center `}
            // className="bg-gray-100 p-4"
            // className="p-3 shadow-md text-center"
          >
            {" "}
            <span className={`${styles.divtext}`}>
              {" "}
              {lang == "en" ? English.neuro : Hindi.neuro}
            </span>{" "}
          </div>
          <div
            onClick={() => qSearch("physio,physician")}
            value="physician"
            className={` ${styles.btn2} p-3 rounded-lg shadow-md text-center`}
            // className="bg-gray-100 p-4"
            // className="p-3 shadow-md text-center"
          >
            {" "}
            <span className={`${styles.divtext}`}>
              {" "}
              {lang == "en" ? English.physician : Hindi.physician}
            </span>{" "}
          </div>
          <div
            onClick={() => qSearch(English.cancer)}
            value="cancer oncologist"
            className={` ${styles.btn7} p-3 rounded-lg shadow-md text-center `}
            // className="bg-gray-100 p-4"
            // className="p-3 shadow-md text-center"
          >
            {" "}
            <span className={`${styles.divtext}`}>
              {" "}
              {lang == "en" ? English.cancer : Hindi.cancer}
            </span>{" "}
          </div>
          <div
            onClick={() => qSearch("children,paed")}
            value="children pedia"
            className={` ${styles.btn8} p-3 rounded-lg shadow-md text-center `}
            // className="p-3 shadow-md text-center"
            // className="bg-gray-100 p-4"
          >
            {" "}
            <span className={`${styles.divtext}`}>
              {" "}
              {lang == "en" ? English.children : Hindi.children}
            </span>{" "}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(QuickSearch);
