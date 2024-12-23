import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import styles from "./profilestyle.module.css";
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
  useEffect(() => {
    if (typeof window != "undefined") {
      let temp = window.localStorage.getItem("city");
      setSelectedCity({ label: temp });
    }
  }, []);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCity, setfilteredCity] = useState(null);

  const search = (event) => {
    // Timeout to emulate a network connection

    let _filteredCities;

    if (!event.query.trim().length) {
      _filteredCities = [...cityoptions];
    } else {
      _filteredCities = cityoptions.filter((city) => {
        return city.label.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }

    setfilteredCity(_filteredCities);
  };
  return (
    <>
      <AutoComplete
        style={{
          background: "teal",
          borderRadius: "8px",
          marginLeft: "5px",
          color: "white",
          marginTop: "5px",
          padding: "0px",
        }}
        value={selectedCity}
        className={`${styles.autocompletedrop}`}
        suggestions={cityoptions}
        field="label"
        completeMethod={search}
        onChange={(e) => {
          typeof window != "undefined" &&
            window.localStorage.setItem("city", e.value?.label);
          props?.getdocs && props?.getdocs();
          setSelectedCity(e.value);
        }}
        dropdown
      />
    </>
  );
};

export default CityDropdown;
