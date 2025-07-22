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
import ShareDialog from "./ShareDialog";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";
import { Chip } from "primereact/chip";

const PharmacyList = () => {
  const toast = useRef(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState();
  const [selectedPharmacy, setSelectedPharmacy] = useState({});
  const [showMedicineSelection, setShowMedicineSelection] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedPharmacyForShare, setSelectedPharmacyForShare] =
    useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  // Filter options for chip filters
  const filterOptions = [
    { id: "verified", label: "Verified", icon: "pi pi-check-circle" },
    { id: "homeDelivery", label: "Home Delivery", icon: "pi pi-home" },
    { id: "expressDelivery", label: "Express Delivery", icon: "pi pi-bolt" },
    // {
    //   id: "cashOnDelivery",
    //   label: "Cash on Delivery",
    //   icon: "pi pi-money-bill",
    // },
    { id: "discount", label: "Discount Available", icon: "pi pi-tag" },
  ];

  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    GetAyumPharmacyParams();
    fetchPharmacies();
  }, [city]);

  const GetAyumPharmacyParams = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/ayumpartner`,
      { headers: getAuthHeaders() }
    );
    const ayumPharmacy = response.data.data;
    setSelectedPharmacy(ayumPharmacy);
    setShowMedicineSelection(true);
  };

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
    console.log("Selected medicines:", selectedMedicines);
    setShowMedicineSelection(false);
    setSelectedPharmacy(null);
  };

  const handleShare = (pharmacy) => {
    setSelectedPharmacyForShare(pharmacy);
    setShowShareDialog(true);
  };

  const handleFilterToggle = (filterId) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Function to open Google Maps directions
  const openDirections = (pharmacy) => {
    const address = `${pharmacy.hospital}, ${pharmacy.city}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
      "_blank"
    );
  };

  // Function to make phone call
  const makePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, "_self");
    }
  };

  const itemTemplate = (pharmacy) => {
    const phoneNumber = pharmacy.phone || "9425681022";

    return (
      <div className={styles.cleanPharmacyCard}>
        <div className={styles.cardHeader}>
          {pharmacy.verified && (
            <Chip
              label="Verified"
              icon="pi pi-check-circle"
              className={styles.verifiedBadge}
            />
          )}
        </div>

        <div className={styles.cardBody}>
          <div className={styles.mainInfo}>
            <Avatar
              image={
                pharmacy.picture?.replace(/=s\d+-c/, "") || "/deafaultpro.jpg"
              }
              className={styles.pharmacyAvatar}
              size="large"
              shape="square"
            />
            <div className={styles.textInfo}>
              <h3 className={styles.pharmacyName}>{pharmacy.buisnessname}</h3>
              <div className={styles.metaInfo}>
                <div className={styles.metaItem}>
                  <i
                    className="pi pi-building"
                    style={{ color: "#2196F3" }}
                  ></i>
                  <span>{pharmacy.hospital}</span>
                </div>
                <div className={styles.metaItem}>
                  <i
                    className="pi pi-map-marker"
                    style={{ color: "#4CAF50" }}
                  ></i>
                  <span>{pharmacy.city}</span>
                </div>
                <div className={styles.metaItem}>
                  <i className="pi pi-phone" style={{ color: "#FF9800" }}></i>
                  <span>{phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <Button
                label="Call"
                icon="pi pi-phone"
                outlined
                onClick={() => makePhoneCall(phoneNumber)}
                // className={styles.actionButton}
                style={{
                  width: "10rem",
                }}
              />
              <Button
                label="Directions"
                icon="pi pi-map-marker"
                outlined
                onClick={() => openDirections(pharmacy)}
                // className={styles.actionButton}
                style={{
                  width: "10rem",
                }}
              />
            </div>
            <Button
              label={lang == "en" ? English.Select : Hindi.Select}
              icon="pi pi-check"
              onClick={() => {
                handlePharmacySelect(pharmacy);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              // className={styles.selectButton}
              style={{
                width: "100%",
              }}
            />
          </div>
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
          <div className={styles.pharmacyListAppContainer}>
            {/* Search Section */}
            <div
              style={{
                height: "4.5rem",
              }}
              className={styles.searchSection}
            >
              <div
                className={styles.searchBarContainer}
                style={{
                  // border: "2px solid red",
                  height: "3rem",
                }}
              >
                <div className={styles.searchIcon}>
                  <i className="pi pi-search" />
                </div>
                <InputText
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    lang == "en" ? English.searchpharmacy : Hindi.searchpharmacy
                  }
                  className={styles.searchInput}
                  // className={styles.searchInput}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {searchTerm && (
                  <Button
                    icon="pi pi-times"
                    className={styles.clearButton}
                    onClick={() => setSearchTerm("")}
                    text
                    rounded
                    aria-label="Clear"
                  />
                )}
                <Button
                  icon="pi pi-filter"
                  className={styles.filterButton}
                  text
                  style={{
                    // border: "2px solid red",
                    // height: "3rem",
                    minWidth: "3rem",
                  }}
                  rounded
                  aria-label="Filters"
                />
              </div>
            </div>

            {/* City Filter */}
            <div className={styles.cityDropdownContainer}>
              <Dropdown
                options={[
                  { name: "Rewa", code: "Rewa" },
                  { name: "Bhopal", code: "Bhopal" },
                  { name: "Indore", code: "Indore" },
                  { name: "Jhansi", code: "Jhansi" },
                  { name: "Gwalior", code: "Gwalior" },
                ]}
                optionLabel="name"
                value={city}
                onChange={(e) => setCity(e.value)}
                placeholder={lang == "en" ? "Select City" : "शहर चुनें"}
                className={styles.cityDropdown}
                itemTemplate={(option) => (
                  <div className={styles.dropdownItem}>
                    <i
                      className="pi pi-map-marker"
                      style={{ color: "#4CAF50" }}
                    />
                    <span>{option.name}</span>
                  </div>
                )}
              />
            </div>

            {/* Filter Chips */}
            <div className={styles.filterChipsSection}>
              <div className={styles.filterChips}>
                {filterOptions.map((filter) => (
                  <div
                    key={filter.id}
                    className={`${styles.filterChip} ${
                      activeFilters.includes(filter.id)
                        ? styles.activeFilterChip
                        : ""
                    }`}
                    onClick={() => handleFilterToggle(filter.id)}
                  >
                    <i className={filter.icon}></i>
                    <span>{filter.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Page Title */}
            <div className={styles.pageTitle}>
              <h2>
                {lang == "en" ? English.ChoosePharmacy : Hindi.ChoosePharmacy}
              </h2>
            </div>

            {/* Pharmacy List */}
            <div className={styles.pharmacyDataView}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <i
                    className="pi pi-spin pi-spinner"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p>Loading pharmacies...</p>
                </div>
              ) : pharmacies.length > 0 ? (
                pharmacies.map((pharmacy) => itemTemplate(pharmacy))
              ) : (
                <div className={styles.noResults}>
                  <p>
                    No pharmacies found. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>

            <ShareDialog
              visible={showShareDialog}
              onHide={() => setShowShareDialog(false)}
              ayumUserName={selectedPharmacyForShare?.ayumUserName}
            />
          </div>
        </>
      ) : (
        <MedicineSelection
          pharmacyId={selectedPharmacy?._id}
          onMedicinesSelected={handleMedicinesSelected}
          selectedPharmacy={selectedPharmacy}
          setShowMedicineSelection={setShowMedicineSelection}
        />
      )}
    </div>
  );
};

export default PharmacyList;
