import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef } from "react";
import { useGeolocation } from "react-use";

const AddressSelector = (props) => {
  const { selectedAddress, setSelectedAddress } = props;
  const [addresslist, setaddresslist] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const toast = useRef(null);
  const state = useGeolocation();

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem("labuser"));
    if (temp) {
      temp.address = temp.address.map((address, index) => ({
        ...address,
        id: index,
      }));
    }

    setaddresslist(temp?.address || []);
  }, [addresslist]);

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = () => {
    setaddresslist([...addresslist, newAddress]);
    setNewAddress({});
    const temp = JSON.parse(localStorage.getItem("labuser"));
    temp.address = [...addresslist, newAddress];
    localStorage.setItem("labuser", JSON.stringify(temp));
    console.log([...addresslist, newAddress], "useraddressdetails");
    setSelectedAddress({ ...newAddress, id: addresslist.length });
    updateuser([...addresslist, newAddress]);
    setShowAddressForm(false);
  };

  const [updateload, setupdateload] = useState(false);

  const updateuser = async (addresstosave) => {
    setupdateload(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/update`;
      const result = await axios.post(
        url,
        {
          address: addresstosave,
        },
        {
          headers: {
            "x-auth-token": localStorage.usertoken,
          },
        }
      );
      if (!result.data.error) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Profile Saved Successfully",
          life: 3000,
        });
        setupdateload(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong!",
          life: 3000,
        });
        setupdateload(false);
      }
    } catch (error) {}
  };

  const handleDeleteAddress = (index) => {
    const temp = [...addresslist];
    temp.splice(index, 1);
    const user = JSON.parse(localStorage.getItem("labuser"));
    user.address = temp;
    localStorage.setItem("labuser", JSON.stringify(user));
    setaddresslist(temp);
    updateuser(temp);
  };

  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // First check if geolocation is supported
      if (!navigator.geolocation) {
        toast.current.show({
          severity: "error",
          summary: "Location Error",
          detail: "Geolocation is not supported by your browser.",
        });
        return;
      }

      // Get current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      // Show loading toast
      toast.current.show({
        severity: "info",
        summary: "Getting Location",
        detail: "Fetching address details...",
      });

      // Reverse geocoding to get address from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address details");
      }

      const data = await response.json();

      if (!data || !data.address) {
        throw new Error("Invalid address data received");
      }

      setNewAddress({
        ...newAddress,
        latitude,
        longitude,
        street: data.display_name.split(",")[0] || "",
        city:
          data.address.city || data.address.town || data.address.village || "",
        state: data.address.state || "",
        pincode: data.address.postcode || "",
      });

      toast.current.show({
        severity: "success",
        summary: "Location Found",
        detail: "Your location has been successfully added!",
      });
    } catch (error) {
      console.error("Location error:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error.message || "Failed to get location details. Please try again.",
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="address-selector">
      <Toast ref={toast} />
      <div className="address-header">
        <h2>Select Address</h2>
      </div>

      <div className="address-list">
        {addresslist.map((address, index) => (
          <div
            key={index}
            className={`address-card ${
              selectedAddress?.id === address.id ? "selected" : ""
            }`}
            onClick={() => {
              if (selectedAddress && selectedAddress.id === address.id) {
                setSelectedAddress(null);
              } else {
                setSelectedAddress({ ...address, id: index });
              }
            }}
          >
            <div className="address-content">
              <h3>{address.name}</h3>
              <p className="phone">{address.phone}</p>
              <p className="street">{address.street}</p>
              <p className="location">
                {address.city}, {address.state} - {address.pincode}
              </p>
              {address.landmark && (
                <p className="landmark">Landmark: {address.landmark}</p>
              )}
            </div>
            <div className="address-actions">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(index);
                }}
                icon="pi pi-trash"
                text
                severity="danger"
                tooltip="Delete Address"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="add-address-button">
        <Button
          onClick={() => setShowAddressForm(true)}
          label="Add New Address"
          icon="pi pi-plus"
          severity="primary"
        />
      </div>

      <Dialog
        header="Add New Address"
        style={{ width: isMobile ? "100vw" : "500px", height: "100vh" }}
        visible={showAddressForm}
        onHide={() => setShowAddressForm(false)}
        className="address-dialog"
      >
        <div className="address-form">
          <div className="form-row">
            <InputText
              value={newAddress.name}
              onChange={handleAddressChange}
              style={{ fontSize: "1rem", width: "100%" }}
              placeholder="Full Name"
              name="name"
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-row">
            <InputText
              value={newAddress.phone}
              onChange={handleAddressChange}
              style={{ fontSize: "1rem", width: "100%" }}
              placeholder="Phone Number"
              name="phone"
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-row">
            <Dropdown
              value={newAddress.gender}
              style={{ fontSize: "1rem", width: "100%" }}
              options={[
                { name: "Male", value: "male" },
                { name: "Female", value: "female" },
                { name: "Other", value: "other" },
              ]}
              onChange={(e) => {
                setNewAddress({ ...newAddress, gender: e.value });
              }}
              placeholder="Gender"
              name="name"
              optionLabel="name"
              optionValue="value"
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-row">
            <InputText
              value={newAddress.age}
              onChange={handleAddressChange}
              style={{ fontSize: "1rem", width: "100%" }}
              placeholder="Age"
              name="age"
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-row">
            <Button
              onClick={handleGetLocation}
              icon="pi pi-map-marker"
              style={{ fontSize: "1rem", width: "100%" }}
              label={
                isLoadingLocation
                  ? "Getting Location..."
                  : "Get Current Location"
              }
              loading={isLoadingLocation}
              className="location-button"
              disabled={isLoadingLocation}
            />
          </div>
          <div className="form-row">
            <InputText
              value={newAddress.street}
              onChange={handleAddressChange}
              placeholder="Street Address"
              name="street"
              style={{ fontSize: "1rem", width: "100%" }}
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-row">
            <InputText
              value={newAddress.city}
              onChange={handleAddressChange}
              placeholder="City"
              name="city"
              style={{ fontSize: "1rem", width: "100%" }}
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-row">
            <InputText
              value={newAddress.state}
              onChange={handleAddressChange}
              placeholder="State"
              name="state"
              style={{ fontSize: "1rem", width: "100%" }}
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-row">
            <InputText
              value={newAddress.pincode}
              onChange={handleAddressChange}
              placeholder="Pincode"
              name="pincode"
              style={{ fontSize: "1rem", width: "100%" }}
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-row">
            <InputText
              value={newAddress.landmark}
              onChange={handleAddressChange}
              placeholder="Landmark (Optional)"
              name="landmark"
              style={{ fontSize: "1rem", width: "100%" }}
              className="p-inputtext-lg"
            />
          </div>
          <div className="form-actions">
            <Button
              onClick={handleAddAddress}
              label="Save Address"
              icon="pi pi-check"
              style={{ fontSize: "1rem" }}
            />
          </div>
        </div>
      </Dialog>

      <style jsx>{`
        .address-selector {
          background-color: var(--surface-50);
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .address-header h2 {
          font-size: 1.5rem;
          color: var(--text-color);
          margin-bottom: 1.5rem;
        }

        .address-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .address-card {
          background: white;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .address-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .address-card.selected {
          border: 2px solid var(--primary-color);
          background-color: var(--surface-50);
        }

        .address-content h3 {
          margin: 0 0 0.5rem 0;
          color: var(--text-color);
        }

        .address-content p {
          margin: 0.25rem 0;
          color: var(--text-color-secondary);
        }

        .form-row {
          margin-bottom: 1rem;
        }

        .location-button {
          width: 100%;
          margin-bottom: 1rem;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .add-address-button {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }

        .address-dialog {
          width: 90%;
          max-width: 500px;
        }
      `}</style>
    </div>
  );
};

export default AddressSelector;
