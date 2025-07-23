import React, { useState, useEffect } from "react";
import PrescriptionSelector from "../medical/PrescriptionSelector";
import AddressSelector from "../medical/AddressSelector";

// Modal overlay styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  zIndex: 2000,
  // Removed alignItems/justifyContent for top-aligned modal
  overflowY: "auto",
};

const modalStyle = {
  background: "#fff",
  borderRadius: "16px",
  width: "95vw",
  maxWidth: 500,
  minHeight: 400,
  maxHeight: "100vh", // Ensures modal never exceeds viewport
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  padding: "32px 24px 24px 24px",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  margin: "32px auto", // Adds space at top/bottom on desktop
  overflowY: "auto", // Enables scrolling inside modal
};

const closeBtnStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  background: "none",
  border: "none",
  fontSize: 24,
  cursor: "pointer",
  color: "#888",
};

const buttonStyle = (enabled) => ({
  marginTop: "32px",
  width: "100%",
  padding: "14px 0",
  background: enabled ? "rgb(11, 168, 160)" : "rgb(176, 176, 176)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1.1rem",
  fontWeight: 600,
  cursor: enabled ? "pointer" : "not-allowed",
  transition: "background 0.2s",
});

const CheckoutFromPrescription = ({
  open,
  onClose,
  onConfirm,
  getAuthHeaders,
  ...props
}) => {
  const [show, setShow] = useState(open || false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    setShow(open);
  }, [open]);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    if (selectedPrescription && selectedAddress && onConfirm) {
      onConfirm({
        prescription: selectedPrescription,
        address: selectedAddress,
      });
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeBtnStyle} onClick={handleClose} aria-label="Close">
          &times;
        </button>
        <h2 style={{ marginBottom: 24, textAlign: "center" }}>
          Book Lab Test from Prescription
        </h2>
        <div style={{ marginBottom: 24 }}>
          <PrescriptionSelector
            value={selectedPrescription}
            onChange={setSelectedPrescription}
            getAuthHeaders={getAuthHeaders}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <AddressSelector
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </div>
        <button
          style={buttonStyle(selectedPrescription && selectedAddress)}
          disabled={!(selectedPrescription && selectedAddress)}
          onClick={handleConfirm}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default CheckoutFromPrescription;
