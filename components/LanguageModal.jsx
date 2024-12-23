import React, { useState } from "react";
import styles from "../styles/extracss.module.css";
import { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import axios from "axios";
import CityDropdown from "./CityDropdown";
import { Button } from "primereact/button";
// import TextField from "@mui/material/TextField";
// import { Button } from "@mui/material";

const LanguageModal = (props) => {
  const { setlang, setlangmodal, lang } = useContext(AccountContext);
  const [validerr, setvaliderr] = useState(false);
  const [validphone, setvalidphone] = useState(false);

  function validatePhoneNumber(phoneNumber) {
    // Remove all non-digit characters from the input
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    // Check if the cleaned phone number contains only digits
    if (!/^\d+$/.test(cleanedPhoneNumber)) {
      return false;
    }

    // Check if the phone number has a valid length (10 or 11 digits)
    if (cleanedPhoneNumber.length !== 10 && cleanedPhoneNumber.length !== 11) {
      return false;
    }

    // Check if the phone number doesn't consist of repeating digits (e.g., "1111111111")
    if (/^(\d)\1+$/.test(cleanedPhoneNumber)) {
      return false;
    }

    // Check if the phone number doesn't consist of consecutive digits (e.g., "12345")
    for (let i = 0; i < cleanedPhoneNumber.length - 4; i++) {
      const slice = cleanedPhoneNumber.slice(i, i + 5);
      if (
        /^12345|23456|34567|45678|56789|98765|87654|76543|65432|54321$/.test(
          slice
        )
      ) {
        return false;
      }
    }

    // All checks passed; the phone number is valid
    return true;
  }

  const handleClick = (e, lang) => {
    e.preventDefault();
    setlangchanged(true);
    setlang(lang);
    localStorage.setItem("locale", lang);
  };
  const [number, setnumber] = useState("");
  const handleChange = (e) => {
    // setvaliderr(false);
    // setvalidphone(false);
    const validphone = validatePhoneNumber(e.target.value);
    if (!validphone) {
      setvaliderr(true);
      setvalidphone(false);
    } else {
      setvalidphone(true);
      setvaliderr(false);
    }
    setnumber(e.target.value);
  };

  const handleSubmit = async () => {
    const validphone = validatePhoneNumber(number);
    if (!validphone) {
      setvaliderr(true);
      return;
    } else {
      setvalidphone(true);
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/phones`;
      try {
        let savephone = await axios.post(url, { phoneNumber: number });
        console.log(savephone);
        localStorage.setItem("locale", lang);
        setlangmodal(false);
      } catch (error) {
        console.log("Err", error);
        localStorage.setItem("locale", lang);
        setlangmodal(false);
      }
    }
  };
  const cityoptions = [
    { label: "Rewa" },
    { label: "Satna" },
    { label: "Sidhi" },
    { label: "Jabalpur" },
    { label: "Nagpur" },
    { label: "Gwalior" },
  ];
  const [langchanged, setlangchanged] = useState(false);
  return (
    <div className={`${styles.languagediv}`}>
      <div className={`${styles.languagemodal}`}>
        <div
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "24px",
            boxShadow: "inset 0 0 5px rgba(0,0,0,0,3)",
          }}
        >
          <h1>
            Choose Language <br /> भाषा चुनें
          </h1>
          <div className={`${styles.languagebtngrp}`}>
            <div
              onClick={(e) => handleClick(e, "hi")}
              className={`${styles.languagebtns}`}
            >
              {lang == "hi" && langchanged && (
                <div className={`${styles.checksvg}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="96"
                    height="96"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#20c997"
                      strokeMiterlimit="10"
                      d="M7.5 1A6.51 6.51 0 001 7.5 6.51 6.51 0 007.5 14 6.51 6.51 0 0014 7.5 6.51 6.51 0 007.5 1zm0 1C10.543 2 13 4.457 13 7.5S10.543 13 7.5 13A5.493 5.493 0 012 7.5C2 4.457 4.457 2 7.5 2zm2.645 3.148L6.5 8.793 4.852 7.148l-.704.704L6.5 10.207l4.355-4.355z"
                      fontFamily="none"
                      fontSize="none"
                      fontWeight="none"
                      textAnchor="none"
                      transform="scale(16)"
                    ></path>
                  </svg>{" "}
                </div>
              )}
              हिन्दी
            </div>
            <div
              onClick={(e) => handleClick(e, "en")}
              className={`${styles.languagebtns}`}
            >
              {lang == "en" && langchanged && (
                <div className={`${styles.checksvg}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="96"
                    height="96"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#20c997"
                      strokeMiterlimit="10"
                      d="M7.5 1A6.51 6.51 0 001 7.5 6.51 6.51 0 007.5 14 6.51 6.51 0 0014 7.5 6.51 6.51 0 007.5 1zm0 1C10.543 2 13 4.457 13 7.5S10.543 13 7.5 13A5.493 5.493 0 012 7.5C2 4.457 4.457 2 7.5 2zm2.645 3.148L6.5 8.793 4.852 7.148l-.704.704L6.5 10.207l4.355-4.355z"
                      fontFamily="none"
                      fontSize="none"
                      fontWeight="none"
                      textAnchor="none"
                      transform="scale(16)"
                    ></path>
                  </svg>{" "}
                </div>
              )}
              English
            </div>
          </div>
        </div>
        <h1>
          Choose City <br /> शहर चुनें
        </h1>
        <CityDropdown {...props} />

        <Button
          label="Submit"
          onClick={() => {
            setlangmodal(false);
          }}
          raised
          style={{ padding: "10px", background: "teal", minHeight: "2rem" }}
        />

        {/* <Button
          style={{ background: "teal" }}
          variant="contained"
          color="success"
          onClick={() => {
            setlangmodal(false);
          }}
        >
          Submit
        </Button> */}
        {/* {langchanged && (
          <div className={`${styles.numberinput}`} style={{ width: "100%" }}>
            <input
              placeholder="Enter Your Number"
              value={number}
              className={`${styles.phoneinput}`}
              type="number"
              onChange={(e) => handleChange(e)}
            />
            {validerr && (
              <p style={{ marginTop: "10px", color: "red" }}>
                *Enter Valid Phone Number
              </p>
            )}
            {validphone && (
              <p style={{ marginTop: "10px", color: "green" }}>
                *Phone number is valid
              </p>
            )}
          </div>
        )} */}

        {/* {number != "" && validphone && (
          <div
            onClick={() => handleSubmit()}
            className={`${styles.submitintro}`}
          >
            Submit
          </div>
        )} */}
      </div>
    </div>
  );
};

export default LanguageModal;
