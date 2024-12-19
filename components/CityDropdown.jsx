import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "../styles/Home.module.css";

const CityDropdown = (props) => {
  const cityoptions = [
    { label: "Rewa" },
    { label: "Jabalpur" },
    { label: "Indore" },
    { label: "Katni" },
    { label: "Lucknow" },
    { label: "Satna" },
    { label: "Sidhi" },
    { label: "Nagpur" },
    { label: "Gwalior" },
  ];
  const [value, setvalue] = useState();
  useEffect(() => {
    if (typeof window != "undefined") {
      let temp = window.localStorage.getItem("city");
      setvalue({ label: temp });
    }
  }, []);
  return (
    <Autocomplete
      disablePortal
      style={{
        // border: "2px solid red",
        height: "fit-content",
        borderRadius: "24px",
        background: "white",
      }}
      className={styles.autocomp}
      id="combo-box-demo"
      options={cityoptions}
      value={value}
      onChange={(e, val) => {
        console.log(val);
        typeof window != "undefined" &&
          window.localStorage.setItem("city", val?.label);
        setvalue({ label: val?.label });
        props?.getdocs && props?.getdocs();
      }}
      renderInput={(params) => (
        <TextField
          style={{ borderRadius: "24px" }}
          placeholder={value?.label ? value?.label : "Choose city"}
          {...params}
          label=""
        />
      )}
    />
  );
};

export default CityDropdown;
