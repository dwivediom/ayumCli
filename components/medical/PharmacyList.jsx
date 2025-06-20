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
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showMedicineSelection, setShowMedicineSelection] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedPharmacyForShare, setSelectedPharmacyForShare] =
    useState(null);
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

  const handleShare = (pharmacy) => {
    setSelectedPharmacyForShare(pharmacy);
    setShowShareDialog(true);
  };

  // Badge options for dynamic display
  const badgeOptions = [
    // { label: "Free Delivery", icon: "pi pi-truck" },
    // { label: "50% OFF", icon: "pi pi-percentage" },
    // { label: "24/7 Available", icon: "pi pi-clock" },
    { label: "Verified", icon: "pi pi-check-circle" },
    // { label: "Express Delivery", icon: "pi pi-bolt" },
    // { label: "Cash on Delivery", icon: "pi pi-money-bill" },
    // { label: "Discount Available", icon: "pi pi-tag" },
    // { label: "Home Delivery", icon: "pi pi-home" },
  ];

  // Function to get random badge
  const getRandomBadge = () => {
    // return badgeOptions[Math.floor(Math.random() * badgeOptions.length)];
    return badgeOptions[0];
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
    const randomBadge = getRandomBadge();
    const phoneNumber = pharmacy.phone || "9630330030"; // Fallback phone number

    return (
      <div className={styles.cleanPharmacyCard}>
        <Chip
          label={randomBadge.label}
          icon={randomBadge.icon}
          className={styles.cleanBadge}
        />

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
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <Button
                label="Call"
                icon="pi pi-phone"
                outlined
                onClick={() => makePhoneCall(phoneNumber)}
                className={`${styles.actionButton} ${styles.callButton}`}
              />
              <Button
                label="Directions"
                icon="pi pi-map-marker"
                outlined
                onClick={() => openDirections(pharmacy)}
                className={`${styles.actionButton} ${styles.directionsButton}`}
              />
            </div>
            <Button
              label={lang == "en" ? English.Select : Hindi.Select}
              icon="pi pi-check"
              onClick={() => handlePharmacySelect(pharmacy)}
              className={styles.selectButton}
            />
          </div>
        </div>

        {/* <div className={styles.cardFooter}>
          <div className={styles.footerItem}>
            <i className="pi pi-star-fill" style={{ color: "#FFD700" }}></i>
            <span>4.5</span>
          </div>
          <div className={styles.footerItem}>
            <i className="pi pi-clock" style={{ color: "#9C27B0" }}></i>
            <span>30-45 min</span>
          </div>
        </div> */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: "10px",
            }}
          >
            <InputText
              value={searchTerm}
              style={{
                width: "100%",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                lang == "en" ? English.searchpharmacy : Hindi.searchpharmacy
              }
            />
            {/* <i className="pi pi-search" /> */}
            <Button
              icon="pi pi-search"
              style={{
                height: "3rem",
                marginTop: "-10px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
              }}
              onClick={() => setShowFilters((prev) => !prev)}
              aria-label="Filters"
            />

            {/* <div className={styles.cityFilter}>
              <span className="p-input-icon-left w-full">
                <InputText
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={
                    lang == "en" ? English.EnterCity : Hindi.EnterCity
                  }
                  className={styles.cityInput}
                />
              </span>
            </div> */}
          </div>
          <div>
            <Dropdown
              options={[
                { name: "Rewa", code: "Rewa" },
                { name: "Bhopal", code: "Bhopal" },
                { name: "Indore", code: "Indore" },
                { name: "Jhansi", code: "Jhansi" },
                { name: "Gwalior", code: "Gwalior" },
              ]}
              optionLabel="name"
              itemTemplate={(option) => (
                <div className="flex align-items-center">
                  <i
                    className="pi pi-map-marker"
                    style={{ color: "#4CAF50" }}
                  ></i>
                  <span>{option.name}</span>
                </div>
              )}
              optionValue="code"
              value={city}
              onChange={(e) => setCity(e.value)}
              placeholder="Select a City"
              className="w-full"
              style={{
                borderRadius: "8px",
                // marginBottom: "10px",
                maxWidth: "12rem",
              }}
            />
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

          {/* <DataView
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
          /> */}
          <div className={styles.pharmacyDataView}>
            {pharmacies.map((pharmacy) => itemTemplate(pharmacy))}
          </div>

          <ShareDialog
            visible={showShareDialog}
            onHide={() => setShowShareDialog(false)}
            ayumUserName={selectedPharmacyForShare?.ayumUserName}
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
