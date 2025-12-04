import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/extracss.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

const checkout = () => {
  const router = useRouter();
  const toast = useRef(null);

  const [payPayload, setpayPayload] = useState({
    name: "",
    phone: "",
    amount: "",
  });

  const [planinfo, setplaninfo] = useState(null);
  const [docdata, setdocdata] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    phone: false,
  });

  // Validate phone number
  const validatePhoneNumber = (phoneNumber) => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    if (!cleanedPhoneNumber) {
      return { valid: false, message: "Phone number is required" };
    }

    if (!/^\d+$/.test(cleanedPhoneNumber)) {
      return { valid: false, message: "Phone number must contain only digits" };
    }

    if (cleanedPhoneNumber.length !== 10) {
      return { valid: false, message: "Phone number must be 10 digits" };
    }

    if (/^(\d)\1+$/.test(cleanedPhoneNumber)) {
      return {
        valid: false,
        message: "Phone number cannot be all same digits",
      };
    }

    return { valid: true, message: "" };
  };

  // Handle phone input change with validation
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setpayPayload({ ...payPayload, phone: value });

    if (value) {
      const validation = validatePhoneNumber(value);
      setValidationErrors({
        ...validationErrors,
        phone: !validation.valid,
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        phone: false,
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {
      phone: false,
    };

    if (!payPayload.phone) {
      errors.phone = true;
      setValidationErrors(errors);
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please enter your phone number",
        life: 3000,
      });
      return false;
    }

    const phoneValidation = validatePhoneNumber(payPayload.phone);
    if (!phoneValidation.valid) {
      errors.phone = true;
      setValidationErrors(errors);
      toast.current.show({
        severity: "error",
        summary: "Invalid Phone Number",
        detail: phoneValidation.message,
        life: 3000,
      });
      return false;
    }

    if (!payPayload.amount || payPayload.amount <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Invalid Amount",
        detail: "Please wait while we load plan details",
        life: 3000,
      });
      return false;
    }

    if (!payPayload.name) {
      toast.current.show({
        severity: "error",
        summary: "Missing Information",
        detail: "Name is required. Please refresh the page.",
        life: 3000,
      });
      return false;
    }

    setValidationErrors({ phone: false });
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_B_PORT}/api/doctor/checkoutsubscription`,
        headers: {
          "x-auth-token": router.query.doc,
        },

        data: {
          ...payPayload,
          transactionid: "T" + Date.now(),
          MUIDW: "MUIDW" + Date.now(),
          planid: router.query.plan,
        },
      });

      const redirecturl =
        response.data?.data?.data.instrumentResponse.redirectInfo.url;

      if (redirecturl) {
        toast.current.show({
          severity: "success",
          summary: "Redirecting",
          detail: "Redirecting to payment gateway...",
          life: 2000,
        });

        // Small delay to show success message
        setTimeout(() => {
          window.location.href = redirecturl;
        }, 500);
      } else {
        throw new Error("No redirect URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to process payment. Please try again.";

      toast.current.show({
        severity: "error",
        summary: "Payment Error",
        detail: errorMessage,
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const GetPlans = async () => {
    try {
      setLoading(true);
      const plandata = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/doctor/getplanbyid?planid=${router.query.plan}`,
        {}
      );
      let finaldata = plandata.data?.data;

      if (finaldata) {
        const totalAmount =
          finaldata?.planPricePerMonth * finaldata?.planDurationinMonth;
        setpayPayload((prev) => ({
          ...prev,
          amount: totalAmount,
        }));
        setplaninfo(finaldata);
      }
    } catch (error) {
      console.error("Error loading plan:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load plan details. Please refresh the page.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.plan) {
      GetPlans();
    }

    const doctor = JSON.parse(localStorage.getItem("DocData") || "null");
    if (doctor) {
      setdocdata(doctor);
      setpayPayload((prev) => ({
        ...prev,
        name: doctor?.name || "",
      }));
    }
  }, [router.query]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={styles.checkoutdiv}>
      <Toast ref={toast} />

      <Card
        style={{
          width: isMobile ? "100%" : "600px",
          maxWidth: "100%",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        }}
        className="p-shadow-8"
      >
        {loading && !planinfo ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem",
              gap: "1rem",
            }}
          >
            <ProgressSpinner />
            <p style={{ color: "var(--text-color-secondary)", margin: 0 }}>
              Loading plan details...
            </p>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  margin: 0,
                  marginBottom: "0.5rem",
                  color: "var(--text-color)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                }}
              >
                Checkout
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-color-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                Complete your subscription payment
              </p>
            </div>

            <Divider />

            {/* Plan Information */}
            {planinfo && (
              <div
                style={{
                  background: "var(--surface-50)",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "var(--text-color)",
                    }}
                  >
                    {planinfo?.planName || "Subscription Plan"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-color-secondary)",
                  }}
                >
                  Duration: {planinfo?.planDurationinMonth} month
                  {planinfo?.planDurationinMonth > 1 ? "s" : ""}
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--text-color)",
                }}
              >
                Customer Information
              </h3>

              {/* Name Display */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "var(--text-color)",
                  }}
                >
                  Name
                </label>
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "var(--surface-100)",
                    borderRadius: "6px",
                    color: "var(--text-color)",
                    fontSize: "1rem",
                    border: "1px solid var(--surface-200)",
                  }}
                >
                  {payPayload.name || "Not available"}
                </div>
              </div>

              {/* Phone Input */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  htmlFor="phone"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "var(--text-color)",
                  }}
                >
                  Phone Number <span style={{ color: "red" }}>*</span>
                </label>
                <InputText
                  id="phone"
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={payPayload.phone}
                  onChange={handlePhoneChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "1rem",
                    border: validationErrors.phone
                      ? "2px solid #e24c4c"
                      : "1px solid var(--surface-300)",
                  }}
                  className={validationErrors.phone ? "p-invalid" : ""}
                  maxLength={10}
                />
                {validationErrors.phone && (
                  <small
                    style={{
                      display: "block",
                      marginTop: "0.5rem",
                      color: "#e24c4c",
                      fontSize: "0.85rem",
                    }}
                  >
                    Please enter a valid 10-digit phone number
                  </small>
                )}
              </div>
            </div>

            <Divider />

            {/* Payment Summary */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--text-color)",
                }}
              >
                Payment Summary
              </h3>

              <div
                style={{
                  background: "var(--surface-50)",
                  padding: "1.25rem",
                  borderRadius: "8px",
                }}
              >
                {planinfo && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                      fontSize: "0.95rem",
                      color: "var(--text-color-secondary)",
                    }}
                  >
                    <span>
                      ₹{planinfo?.planPricePerMonth} ×{" "}
                      {planinfo?.planDurationinMonth} month
                      {planinfo?.planDurationinMonth > 1 ? "s" : ""}
                    </span>
                    <span>₹{payPayload.amount || 0}</span>
                  </div>
                )}

                <Divider style={{ margin: "0.75rem 0" }} />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--text-color)",
                  }}
                >
                  <span>Total Amount</span>
                  <span style={{ color: "var(--primary-color)" }}>
                    ₹{payPayload.amount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              label={loading ? "Processing..." : "Proceed to Payment"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-credit-card"}
              onClick={handleSubmit}
              disabled={loading || !planinfo}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
                marginTop: "1rem",
              }}
              className="p-button-raised"
            />

            {/* Security Note */}
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.8rem",
                color: "var(--text-color-secondary)",
                textAlign: "center",
                marginBottom: 0,
              }}
            >
              <i className="pi pi-lock" style={{ marginRight: "0.5rem" }}></i>
              Your payment is secure and encrypted
            </p>
          </>
        )}
      </Card>
    </div>
  );
};

export default checkout;
