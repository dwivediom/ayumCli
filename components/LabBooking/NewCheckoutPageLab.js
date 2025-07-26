import React, { useState, useRef, useEffect } from "react";
import { labBookingApi } from "../../config/api/labApi";
import { getAuthHeaders } from "../../config/api/labApi";
import { handleApiError } from "../../config/api/labApi";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "./styles.module.css";
import AddressSelector from "../medical/AddressSelector";
import PrescriptionSelector from "../medical/PrescriptionSelector";
import LabBookingSuccess from "./LabBookingSuccess";

const NewCheckoutPageLab = (props) => {
  const { selectedLab, selectedTests, onBookingComplete, onBack } = props;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    date: null,
    time: "10:00 AM",
    homeCollection: true,
  });

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [addressData, setAddressData] = useState({
    street: "",
    houseNumber: "",
    suburb: "",
    city: "",
    state: "",
    postalCode: "",
    formattedAddress: "",
  });

  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
  });

  const [usePreciseLocation, setUsePreciseLocation] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const toast = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successBookingDetails, setSuccessBookingDetails] = useState(null);

  // Handle browser back button and mobile back gesture
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      // Call the onBack function instead of allowing default navigation
      if (onBack) {
        onBack();
      }
    };

    // Add event listener for browser back button
    window.addEventListener("popstate", handlePopState);

    // Push a new state to prevent immediate back navigation
    window.history.pushState(null, null, window.location.pathname);

    // Cleanup function
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Custom back button handler
  const handleBackButtonClick = () => {
    if (onBack) {
      onBack();
    }
  };

  // Calculate totals based on ServiceSelection.js data structure
  const calculateSubtotal = () => {
    return selectedTests.reduce((total, test) => {
      return total + (test?.sellingPrice || 0);
    }, 0);
  };

  const calculateHomeCollectionCharge = () => {
    return formData.homeCollection ? 0 : 0; // ₹200 for home collection
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateHomeCollectionCharge();
  };

  const timeSlots = [
    { label: "10:00 AM", value: "10:00 AM" },
    { label: "11:00 AM", value: "11:00 AM" },
    { label: "12:00 PM", value: "12:00 PM" },
    { label: "1:00 PM", value: "1:00 PM" },
    { label: "2:00 PM", value: "2:00 PM" },
    { label: "3:00 PM", value: "3:00 PM" },
    { label: "4:00 PM", value: "4:00 PM" },
    { label: "5:00 PM", value: "5:00 PM" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTestIcon = (testName) => {
    const name = testName.toLowerCase();
    if (name.includes("cbc") || name.includes("blood"))
      return "/labicons/blood.png";
    if (name.includes("urine")) return "/labicons/urine.png";
    if (name.includes("package")) return "/labicons/all.png";
    if (name.includes("dengue") || name.includes("fever"))
      return "/labicons/blood.png";
    return "/labicons/blood.png";
  };

  useEffect(() => {
    if (selectedAddress) {
      console.log(selectedAddress, "selectedAddress");
      setFormData((prev) => ({
        ...prev,
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        gender: selectedAddress.gender,
        age: selectedAddress.age,
      }));
    }
  }, [selectedAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "Address", selectedAddress);
    if (!formData.name || !formData.phone) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please fill all required fields (Name, Age, Gender, Phone)",
        life: 3000,
      });
      return;
    }

    const authToken = localStorage.getItem("usertoken");

    if (!authToken) {
      toast.current.show({
        severity: "error",
        summary: "Authentication Error",
        detail: "Please log in to continue",
        life: 3000,
      });
      return;
    }

    // Get the labId from the selected lab
    const labId = "6877707ce00e458e6207dbb6";

    if (!labId) {
      console.error("Selected lab data:", selectedLab);
      toast.current.show({
        severity: "error",
        summary: "Lab ID Error",
        detail: "Lab ID is missing. Please try selecting the lab again.",
        life: 3000,
      });
      return;
    }

    // Prepare the booking request body according to the API specification
    const bookingDetails = {
      labId: labId,
      packageIds: selectedTests.map((test) => test._id),
      homeCollection: {
        required: formData.homeCollection,
      },
      patientDetails: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender || "male",
        phone: formData.phone,
        email: formData.email || "",
        street: selectedAddress?.street,
        houseNumber: selectedAddress?.houseNumber,
        suburb: selectedAddress?.suburb,
        city: selectedAddress?.city,
        state: selectedAddress?.state,
        postalCode: selectedAddress?.postalCode,
        formattedAddress: selectedAddress?.formattedAddress,
        preferredSlot: {
          date: formData.date.toISOString().split("T")[0],
          time: formData.time || "10:00 AM",
        },
      },
      prescription: selectedPrescription,
    };

    // Add preferred slot if date is selected
    if (formData.date) {
      bookingDetails.preferredSlot = {
        date: formData.date.toISOString().split("T")[0],
        time: formData.time || "10:00 AM",
      };
    }

    try {
      setFormLoading(true);

      console.log("Selected lab:", selectedLab);
      console.log("Booking payload:", JSON.stringify(bookingDetails, null, 2));

      const response = await axios.post(
        labBookingApi.createBooking(),
        bookingDetails,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.data.error) {
        setSuccessBookingDetails(response.data.booking || bookingDetails);
        setShowSuccess(true);
        // Optionally: onBookingComplete(bookingDetails, true);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Booking Failed",
          detail: response.data.message || "Failed to create booking",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
      }

      const errorResult = handleApiError(error);
      toast.current.show({
        severity: "error",
        summary: "Booking Failed",
        detail: errorResult.message || "Failed to create booking",
        life: 3000,
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <LabBookingSuccess
        bookingDetails={successBookingDetails}
        onClose={() => setShowSuccess(false)}
      />
    );
  }

  return (
    <div className={styles.modernServiceSelection}>
      <Toast ref={toast} />

      {/* Minimal Header */}
      <div
        className={styles.minimalHeader}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Button
          icon="pi pi-arrow-left"
          onClick={handleBackButtonClick}
          className={styles.backButton}
        />
        <h1 className={styles.minimalTitle}>Lab Test Checkout</h1>
      </div>

      <div className={styles.checkoutContainer}>
        {/* Selected Tests */}
        <div className={styles.cardHeader}>
          <i className="pi pi-list"></i>
          <h3>Selected Tests ({selectedTests?.length || 0})</h3>
        </div>
        {selectedTests?.map((test, index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                padding: "10px",
                gap: "5px",
                borderRadius: "5px",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                margin: "5px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  {test.name.charAt(0).toUpperCase() + test.name.slice(1)}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  {test.category || "General"}
                </div>
              </div>

              <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                ₹{test.sellingPrice || 0}
              </div>
            </div>
          );
        })}

        {/* Patient Details Form */}
        {/* <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <i className="pi pi-user"></i>
            <h3>Patient Details</h3>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Full Name *</label>
              <InputText
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter patient name"
                className={styles.inputField}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Age *</label>
                <InputNumber
                  value={formData.age}
                  onValueChange={(e) => handleInputChange("age", e.value)}
                  placeholder="Age"
                  min={0}
                  max={120}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Gender *</label>
                <Dropdown
                  value={formData.gender}
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" }
                  ]}
                  onChange={(e) => handleInputChange("gender", e.value)}
                  placeholder="Select gender"
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Phone *</label>
                <InputText
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone number"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Email</label>
                <InputText
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email address"
                  type="email"
                  className={styles.inputField}
                />
              </div>
            </div>
          </div>
        </div> */}

        <div
          style={{
            width: "fit-content",
            padding: "2px 10px",

            borderRadius: "24px",
            backgroundColor: "rgba(112, 248, 241, 0.1)",
            color: "rgb(0, 189, 180)",
            border: "1px solid rgb(8, 171, 163)",
            margin: "10px auto",
          }}
        >
          <i className="pi pi-check-circle"></i> Free Home Collection
        </div>

        {/* Date & Time Selection */}
        <div className={styles.formCard}>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Preferred Date</label>
              <Calendar
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.value)}
                placeholder="Select date"
                minDate={new Date()}
                className={styles.inputField}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Preferred Time</label>
              <Dropdown
                value={formData.time}
                options={timeSlots}
                onChange={(e) => handleInputChange("time", e.value)}
                placeholder="Select time"
                className={styles.inputField}
              />
            </div>

            {/* <div className={styles.checkboxField}>
              <Checkbox
                inputId="homeCollection"
                checked={formData.homeCollection}
                onChange={(e) => handleInputChange("homeCollection", e.checked)}
              />
              <label htmlFor="homeCollection" className={styles.checkboxLabel}>
                Home Collection Service
              </label>
            </div> */}
          </div>
        </div>
        <div className={styles.priceCard}>
          <div className={styles.cardHeader}>
            <i className="pi pi-credit-card"></i>
            <h3>Price Breakdown</h3>
          </div>

          <div className={styles.priceBreakdown}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Tests Subtotal</span>
              <span className={styles.priceValue}>₹{calculateSubtotal()}</span>
            </div>

            {formData.homeCollection && (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>
                  Home Collection Charge
                </span>
                <span className={styles.priceValue}>
                  ₹{calculateHomeCollectionCharge()}
                </span>
              </div>
            )}

            <Divider />

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Amount</span>
              <span className={styles.totalValue}>₹{calculateTotal()}</span>
            </div>
          </div>
        </div>
        <AddressSelector
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />

        {/* Home Collection Address */}

        {/* Price Breakdown */}

        {/* Book Now Button */}
        <div className={styles.bookButtonSection}>
          <Button
            style={{ width: "100%" }}
            label={
              formLoading ? (
                <div className={styles.loadingContent}>
                  <ProgressSpinner style={{ width: "20px", height: "20px" }} />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className={styles.buttonContent}>
                  <i className="pi pi-check-circle"></i>
                  <span>Confirm Booking</span>
                </div>
              )
            }
            onClick={handleSubmit}
            disabled={
              formLoading ||
              !selectedTests.length ||
              !formData.name ||
              !formData.phone
            }
            className={styles.bookButton}
          />
        </div>
      </div>
    </div>
  );
};

export default NewCheckoutPageLab;
