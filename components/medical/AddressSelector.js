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
      temp.address = temp?.address?.map((address, index) => ({
        ...address,
        id: index,
      }));
    }

    setaddresslist(temp?.address || []);
    GetuserData();
  }, []);

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };
  const GetuserData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/getuser`;
      axios
        .get(url, {
          headers: {
            "x-auth-token": localStorage.usertoken,
          },
        })
        .then((data) => {
          console.log(data, "userappos");
          data.data.address = data?.data?.address?.map((address, index) => ({
            ...address,
            id: index,
          }));
          setaddresslist(data?.data?.address || []);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  };

  const handleAddAddress = async () => {
    try {
      // Create the new address with a temporary ID
      const newAddressWithId = { ...newAddress, id: addresslist?.length };

      // Update local state immediately for better UX
      const updatedAddressList = [...(addresslist || []), newAddressWithId];
      setaddresslist(updatedAddressList);

      // Set the selected address immediately
      setSelectedAddress(newAddressWithId);

      // Clear the form
      setNewAddress({});
      setShowAddressForm(false);

      // Update localStorage
      const temp = JSON.parse(localStorage.getItem("labuser"));
      temp.address = updatedAddressList;
      localStorage.setItem("labuser", JSON.stringify(temp));

      // Save to server
      const result = await updateuser(updatedAddressList);

      // Only refresh from server if the update was successful
      if (result && !result.error) {
        // Fetch fresh data from server to ensure consistency
        await GetuserData();

        // Find the newly added address in the fresh data and select it
        const freshAddressList = await getFreshAddressList();
        if (freshAddressList) {
          // Find the address that matches our newly added address (by comparing content, not ID)
          const matchingAddress = freshAddressList.find(
            (addr) =>
              addr.name === newAddressWithId.name &&
              addr.phone === newAddressWithId.phone &&
              addr.street === newAddressWithId.street &&
              addr.city === newAddressWithId.city
          );

          if (matchingAddress) {
            setSelectedAddress(matchingAddress);
          }
        }
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add address. Please try again.",
        life: 3000,
      });
    }
  };

  // Helper function to get fresh address list
  const getFreshAddressList = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/getuser`;
      const response = await axios.get(url, {
        headers: {
          "x-auth-token": localStorage.usertoken,
        },
      });
      return response?.data?.address || [];
    } catch (error) {
      console.error("Error fetching fresh address list:", error);
      return null;
    }
  };

  const [updateload, setupdateload] = useState(false);

  // Update the updateuser function to return a result
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
          detail: "Address added successfully",
          life: 3000,
        });
        setupdateload(false);
        return result.data;
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong!",
          life: 3000,
        });
        setupdateload(false);
        return { error: true };
      }
    } catch (error) {
      setupdateload(false);
      return { error: true };
    }
  };

  const handleDeleteAddress = (index) => {
    const temp = [...(addresslist || [])];
    temp.splice(index, 1);
    const user = JSON.parse(localStorage.getItem("labuser"));
    user.address = temp;
    localStorage.setItem("labuser", JSON.stringify(user));
    setaddresslist(temp);
    setSelectedAddress(null);
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
        {addresslist?.map((address, index) => (
          <div
            key={index}
            className={`address-card ${
              selectedAddress?.id === address?.id ? "selected" : ""
            }`}
            onClick={() => {
              console.log(address, "address");
              if (selectedAddress && selectedAddress?.id === address?.id) {
                setSelectedAddress(null);
              } else {
                setSelectedAddress({ ...address, id: index });
              }
            }}
          >
            <div className="address-content">
              <div className="address-row">
                <span className="icon">
                  <i className="pi pi-user" />
                </span>
                <span className="address-main">{address?.name}</span>
                <span className="icon" style={{ marginLeft: 8 }}>
                  <i className="pi pi-phone" />
                </span>
                <span className="address-phone">{address?.phone}</span>
              </div>
              <div className="address-row">
                <span className="icon">
                  <i className="pi pi-map-marker" />
                </span>
                <span className="address-street">{address?.street}</span>
              </div>
              <div className="address-row">
                <span className="icon">
                  <i className="pi pi-compass" />
                </span>
                <span className="address-location">
                  {address?.city}, {address?.state} - {address?.pincode}
                </span>
              </div>
              {address?.landmark && (
                <div className="address-row">
                  <span className="icon">
                    <i className="pi pi-flag" />
                  </span>
                  <span className="address-landmark">{address?.landmark}</span>
                </div>
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
                rounded
                severity="danger"
                tooltip="Delete Address"
                className="delete-btn"
                style={{ fontSize: "1.1rem", padding: 4 }}
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
          padding: 0.75rem 0.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }
        .address-header h2 {
          font-size: 1.1rem;
          color: var(--text-color);
          margin-bottom: 1rem;
        }
        .address-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .address-card {
          background: #fff;
          padding: 0.6rem 0.8rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          cursor: pointer;
          transition: box-shadow 0.2s, border 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border: 1.5px solid transparent;
        }
        .address-card.selected {
          border: 1.5px solid var(--primary-color);
          background: #f0f7ff;
        }
        .address-content {
          flex: 1;
          min-width: 0;
        }
        .address-row {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          margin-bottom: 2px;
          color: var(--text-color-secondary);
        }
        .address-main {
          font-weight: 500;
          color: var(--text-color);
          margin-right: 0.5rem;
        }
        .icon {
          color: var(--primary-color);
          font-size: 1.1em;
          margin-right: 0.3em;
        }
        .address-actions {
          display: flex;
          align-items: flex-start;
          margin-left: 0.5rem;
        }
        .delete-btn {
          margin: 0;
        }
        .add-address-button {
          margin-top: 1rem;
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
