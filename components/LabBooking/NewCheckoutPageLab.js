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

const NewCheckoutPageLab = (props) => {
  const { selectedLab, selectedTests, onBookingComplete, onBack } = props;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    date: null,
    time: "10:00 AM",
    homeCollection: true,
  });

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
      const bestLab = test.labs && test.labs.length > 0 ? test.labs[0] : null;
      return total + (bestLab?.price || 0);
    }, 0);
  };

  const calculateHomeCollectionCharge = () => {
    return formData.homeCollection ? 200 : 0; // ₹200 for home collection
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.phone) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please fill all required fields",
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

    // Check if labId is available
    if (!selectedLab) {
      toast.current.show({
        severity: "error",
        summary: "Lab Selection Error",
        detail: "Please select a lab before booking",
        life: 3000,
      });
      return;
    }

    // Get the labId from the selected lab
    const labId = selectedLab.labId;

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
      tests: selectedTests.map((test) => ({
        name: test.name,
        templateId: test._id,
        testId: test._id,
      })),
      homeCollection: formData.homeCollection,
      patientDetails: {
        name: formData.name,
        age: formData.age,
        phone: formData.phone,
      },
    };

    // Add preferred slot if date is selected
    if (formData.date) {
      bookingDetails.preferredSlot = {
        date: formData.date.toISOString().split("T")[0],
        time: formData.time || "10:00 AM",
      };
    }

    // Add address and coordinates to patient details if home collection is selected
    if (formData.homeCollection) {
      if (
        usePreciseLocation &&
        locationData.latitude &&
        locationData.longitude
      ) {
        bookingDetails.patientDetails.address =
          addressData.formattedAddress ||
          `${addressData.street}, ${addressData.houseNumber}, ${addressData.suburb}, ${addressData.city}, ${addressData.state} - ${addressData.postalCode}`;

        bookingDetails.patientDetails.coordinates = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };
      } else {
        if (!addressData.street || !addressData.city) {
          toast.current.show({
            severity: "warn",
            summary: "Warning",
            detail:
              "Please provide at least street and city for home collection",
            life: 3000,
          });
          return;
        }

        bookingDetails.patientDetails.address =
          addressData.formattedAddress ||
          `${addressData.street}, ${addressData.houseNumber}, ${addressData.suburb}, ${addressData.city}, ${addressData.state} - ${addressData.postalCode}`;
      }
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

      if (response.data && !response.data.error) {
        toast.current.show({
          severity: "success",
          summary: "Booking Successful",
          detail: "Your lab test has been booked successfully",
          life: 3000,
        });

        onBookingComplete(bookingDetails, true);
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
        <div className={styles.testsCard} style={{ height: "fit-content" }}>
          <div className={styles.cardHeader}>
            <i className="pi pi-list"></i>
            <h3>Selected Tests ({selectedTests?.length || 0})</h3>
          </div>

          <div className={styles.testsList}>
            {selectedTests?.map((test, index) => {
              const bestLab =
                test.labs && test.labs.length > 0 ? test.labs[0] : null;
              return (
                <div key={index} className={styles.testItem}>
                  <div className={styles.testIcon}>
                    <img src={getTestIcon(test.name)} alt={test.name} />
                  </div>
                  <div className={styles.testInfo}>
                    <h4 className={styles.testName}>{test.name}</h4>
                    <p className={styles.testCategory}>
                      {test.category || "General"}
                    </p>
                  </div>
                  <div className={styles.testPrice}>
                    <span className={styles.price}>₹{bestLab?.price || 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Patient Details Form */}
        <div className={styles.formCard}>
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
                <label className={styles.fieldLabel}>Phone *</label>
                <InputText
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone number"
                  className={styles.inputField}
                />
              </div>
            </div>
          </div>
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

        {/* Home Collection Address */}
        {formData.homeCollection && (
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <i className="pi pi-map-marker"></i>
              <h3>Collection Address</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formRow}>
                {/* <div className={styles.formField}>
                  <label className={styles.fieldLabel}>House/Flat No.</label>
                  <InputText
                    value={addressData.houseNumber}
                    onChange={(e) =>
                      handleAddressChange("houseNumber", e.target.value)
                    }
                    placeholder="House/Flat No."
                    className={styles.inputField}
                  />
                </div> */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Street *</label>
                  <InputText
                    value={addressData.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    placeholder="Street address"
                    className={styles.inputField}
                  />
                </div>
              </div>

              {/* <div className={styles.formField}>
                <label className={styles.fieldLabel}>Area/Locality</label>
                <InputText
                  value={addressData.suburb}
                  onChange={(e) =>
                    handleAddressChange("suburb", e.target.value)
                  }
                  placeholder="Area/Locality"
                  className={styles.inputField}
                />
              </div> */}

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>City *</label>
                  <InputText
                    value={addressData.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    placeholder="City"
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>State</label>
                  <InputText
                    value={addressData.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    placeholder="State"
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Postal Code</label>
                <InputText
                  value={addressData.postalCode}
                  onChange={(e) =>
                    handleAddressChange("postalCode", e.target.value)
                  }
                  placeholder="Postal Code"
                  className={styles.inputField}
                />
              </div>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
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

        {/* Book Now Button */}
        <div className={styles.bookButtonSection}>
          <Button
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
            disabled={formLoading}
            className={styles.bookButton}
          />
        </div>
      </div>
    </div>
  );
};

export default NewCheckoutPageLab;
