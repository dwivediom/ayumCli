import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import styles from "./profilestyle.module.css";

// Add custom scrollbar styles for PrimeReact dropdown
const dropdownPanelStyles = `
  .city-dropdown-panel .p-autocomplete-panel {
    max-height: 200px !important;
    overflow-y: auto !important;
  }
  .city-dropdown-panel .p-autocomplete-panel::-webkit-scrollbar {
    width: 6px;
  }
  .city-dropdown-panel .p-autocomplete-panel::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }
  .city-dropdown-panel .p-autocomplete-panel::-webkit-scrollbar-thumb {
    background: #b2f5ea;
    border-radius: 3px;
  }
  .city-dropdown-panel .p-autocomplete-panel::-webkit-scrollbar-thumb:hover {
    background: #008080;
  }
`;
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
    { label: "Lucknow" },
  ];
  useEffect(() => {
    console.log(selectedCity, "selectedcity");
  }, [selectedCity]);
  useEffect(() => {
    if (typeof window != "undefined") {
      let temp = localStorage.getItem("city");
      console.log(temp, selectedCity, "settingcity");
      if (temp) {
        setSelectedCity({ label: temp });
      } else {
        console.log(cityoptions, "cityoptions");
        setSelectedCity(cityoptions[0]);

        localStorage.setItem("city", cityoptions[0]?.label);
      }
    }
  }, [typeof window]);
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
      <style dangerouslySetInnerHTML={{ __html: dropdownPanelStyles }} />
      <AutoComplete
        style={{
          background: "teal",
          borderRadius: "8px",
          marginLeft: "5px",
          color: "white",
          marginTop: "5px",
          padding: "0px",
        }}
        value={selectedCity ? selectedCity : cityoptions[0]}
        className={`${styles.autocompletedrop}`}
        suggestions={cityoptions}
        field="label"
        completeMethod={search}
        onChange={(e) => {
          if (e.value) {
            typeof window != "undefined" &&
              window.localStorage.setItem("city", e.value?.label);
            props?.getdocs && props?.getdocs();
            setSelectedCity(e.value);
          }
        }}
        onSelect={(e) => {
          // Ensure dropdown closes after selection
          setTimeout(() => {
            const panel = document.querySelector('.p-autocomplete-panel');
            if (panel) {
              panel.style.display = 'none';
            }
          }, 100);
        }}
        dropdown
        scrollHeight="200px"
        panelClassName="city-dropdown-panel"
      />
    </>
  );
};

export default CityDropdown;
