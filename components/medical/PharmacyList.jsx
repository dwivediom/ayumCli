import React, { useState, useEffect, useRef, useContext } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import axios from "axios";
import styles from "./styles.module.css";
import { getAuthHeaders } from "../../config/api/labApi";
import MedicineSelection from "./MedicineSelection";
import English from "../../public/locales/en/index";
import Hindi from "../../public/locales/hi/index";
import { AccountContext } from "../../context/AccountProvider";

const PharmacyList = () => {
  const toast = useRef(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("Rewa");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showMedicineSelection, setShowMedicineSelection] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    fetchPharmacies();
  }, [city]);

  const fetchPharmacies = async (search = "") => {
    try {
      setLoading(true);

      const params = search ? { searchTerm: search } : { city };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/pharmacies`,
        {
          params,
          headers: getAuthHeaders(),
        }
      );

      if (response.data) {
        setPharmacies(response.data.pharmacies || []);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total,
        });
      } else {
        setPharmacies([]);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch pharmacies",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      setPharmacies([]);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch pharmacies. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPharmacies(searchTerm);
  };

  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowMedicineSelection(true);
  };

  const handleMedicinesSelected = (selectedMedicines) => {
    // Handle the selected medicines here
    console.log("Selected medicines:", selectedMedicines);
    // You can add your logic here to process the selected medicines
    setShowMedicineSelection(false);
    setSelectedPharmacy(null);
  };

  const itemTemplate = (pharmacy) => {
    return (
      <div className={styles.pharmacyCard}>
        <div className={styles.pharmacyHeader}>
          <div className={styles.pharmacyInfo}>
            <h3 className={styles.pharmacyName}>{pharmacy.buisnessname}</h3>
            {/* <Tag
              value={pharmacy.hospital}
              severity="info"
              className={styles.pharmacyTag}
            /> */}
          </div>
          <div className={styles.pharmacyDetails}>
            <div className={styles.detailItem}>
              <i className="pi pi-building" style={{ color: "#2196F3" }}></i>
              <span>{pharmacy.hospital}</span>
            </div>
            <div className={styles.detailItem}>
              <i className="pi pi-map-marker" style={{ color: "#4CAF50" }}></i>
              <span>{pharmacy.city}</span>
            </div>
          </div>
        </div>

        <div className={styles.pharmacyActions}>
          <Button
            label={lang == "en" ? English.Contact : Hindi.Contact}
            icon="pi pi-phone"
            // text
            // raised
            outlined
            // className={`p-button-outlined ${styles.actionButton}`}
          />
          <Button
            label={lang == "en" ? English.Select : Hindi.Select}
            icon="pi pi-check"
            // className={`p-button-success ${styles.actionButton}`}
            onClick={() => handlePharmacySelect(pharmacy)}
          />
        </div>
      </div>
    );
  };

  const [isMobile, setisMobile] = useState(false);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setisMobile(mobile.matches);
  }, []);
  const { lang } = useContext(AccountContext);
  return (
    <div className={styles.pharmacyList}>
      <Toast ref={toast} />

      {!showMedicineSelection ? (
        <>
          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <span className="p-input-icon-left w-full">
                <InputText
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    lang == "en" ? English.searchpharmacy : Hindi.searchpharmacy
                  }
                  className={styles.searchInput}
                />
                {/* <i className="pi pi-search" /> */}
              </span>
              <Button
                icon="pi pi-search"
                className={styles.filterButton}
                onClick={() => setShowFilters((prev) => !prev)}
                aria-label="Filters"
                style={{
                  marginTop: "1rem",
                }}
              />
            </div>

            <div className={styles.cityFilter}>
              <span className="p-input-icon-left w-full">
                {/* <i className="pi pi-map-marker" /> */}
                <InputText
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={
                    lang == "en" ? English.EnterCity : Hindi.EnterCity
                  }
                  className={styles.cityInput}
                />
              </span>
            </div>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "rgb(53, 53, 53)",
            }}
          >
            {lang == "en" ? English.ChoosePharmacy : Hindi.ChoosePharmacy}
          </p>

          <DataView
            value={pharmacies}
            itemTemplate={itemTemplate}
            paginator
            rows={8}
            style={{
              marginTop: "-1.5rem",
            }}
            totalRecords={pagination.total}
            loading={loading}
            className={styles.pharmacyDataView}
          />
        </>
      ) : (
        <MedicineSelection
          pharmacyId={selectedPharmacy._id}
          onMedicinesSelected={handleMedicinesSelected}
        />
      )}
    </div>
  );
};

export default PharmacyList;
