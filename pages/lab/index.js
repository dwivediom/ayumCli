import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import axios from "axios";
import ServiceSelection from "../../components/LabBooking/ServiceSelection";
import LabList from "../../components/LabBooking/LabList";
import BookingForm from "../../components/LabBooking/BookingForm";
import styles from "../../components/LabBooking/styles.module.css";
import NewCheckoutPageLab from "../../components/LabBooking/NewCheckoutPageLab";
import WithAuth1 from "../../components/WithAuth1";

const LabBookingPage = () => {
  const router = useRouter();
  const toast = useRef(null);
  const [step, setStep] = useState(1);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [city, setCity] = useState("Rewa");
  const [loading, setLoading] = useState(false);

  // Get base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_B_PORT || "http://localhost:5001";
  useEffect(() => {
    const selectedTests = localStorage.getItem("selectedTests");
    if (selectedTests) {
      setSelectedTests(JSON.parse(selectedTests));
    }
  }, []);

  const handleTestSelection = (tests, selectedCity) => {
    setSelectedTests(tests);
    localStorage.setItem("selectedTests", JSON.stringify(tests));
    setCity(selectedCity);
    setStep(2);
  };

  const handleLabSelection = (lab) => {
    setSelectedLab(lab);
    setStep(3);
  };

  const handleBookingComplete = async (
    bookingDetails,
    apiCallAlreadyMade = false
  ) => {
    try {
      setLoading(true);

      // Only make the API call if it wasn't already made in the BookingForm component
      if (!apiCallAlreadyMade) {
        const response = await axios.post(
          `${baseUrl}/api/lab/user/booking/create`,
          bookingDetails,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("usertoken"),
            },
          }
        );

        if (!response.data || response.data.error) {
          toast.current.show({
            severity: "error",
            summary: "Booking Failed",
            detail: response.data?.message || "Failed to create booking",
            life: 3000,
          });
          return;
        }
      }

      toast.current.show({
        severity: "success",
        summary: "Booking Successful",
        detail: "Your lab test has been booked successfully",
        life: 3000,
      });

      window.location.href = "/lab/bookings";
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Booking Failed",
        detail: error.response?.data?.message || "Failed to create booking",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      {step === 1 && (
        <ServiceSelection
          onTestsSelected={handleTestSelection}
          selectedTests={selectedTests}
          setSelectedTests={setSelectedTests}
        />
      )}
      {step === 2 && (
        <>
          <NewCheckoutPageLab
            selectedLab={selectedLab}
            selectedTests={selectedTests}
            onBookingComplete={handleBookingComplete}
            onBack={() => setStep(1)}
          />
          {/* <LabList
              selectedTests={selectedTests}
              city={city}
              onLabSelected={handleLabSelection}
            /> */}
        </>
      )}
    </div>
  );
};

export default WithAuth1(LabBookingPage);
