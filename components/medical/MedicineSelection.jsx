import React, { useState, useEffect, useRef, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { getAuthHeaders } from "../../config/api/labApi";
import { RadioButton } from "primereact/radiobutton";
import PdfViewer from "./PdfViewer";
import PrescriptionSelector from "./PrescriptionSelector";
import { SelectButton } from "primereact/selectbutton";
import { Sidebar } from "primereact/sidebar";
import { AccountContext } from "../../context/AccountProvider";
import English from "../../public/locales/en";
import Hindi from "../../public/locales/hi";
import AddressSelector from "./AddressSelector";

const MedicineSelection = ({ pharmacyId, onMedicinesSelected, showProfile = true }) => {
  const router = useRouter();
  const toast = useRef(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  useEffect(() => {
    console.log(cart);
  }, [cart]);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    notes: "",
    paymentMethod: "cash",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const searchTimeout = useRef(null);
  const [selectionOption, setSelectionOption] = useState();
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    notes: "",
    paymentMethod: "cash",
  });
  const prescriptionFileInputRef = useRef(null);
  const [enlargedFile, setEnlargedFile] = useState(null);
  const [showEnlargeDialog, setShowEnlargeDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callForm, setCallForm] = useState({
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    notes: "",
    paymentMethod: "cash",
    preferredCallTime: "",
  });
  const [selectedCallPrescription, setSelectedCallPrescription] =
    useState(null);
  const [cartVisible, setCartVisible] = useState(false);

  const getMedicineTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "capsule":
        return "pi pi-circle-fill";
      case "tablet":
        return "pi pi-stop";
      case "injection":
        return "pi pi-arrow-up-right";
      case "syrup":
        return "pi pi-bottle";
      default:
        return "pi pi-question-circle";
    }
  };

  const getMedicineTypeLabel = (type) => {
    return type || "_";
  };

  const fetchMedicines = async (search = "") => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/pharmacy/medicines`,
        {
          params: {
            pharmacyId,
            searchTerm: search,
          },
          headers: getAuthHeaders(),
        }
      );

      if (response.data) {
        setMedicines(response.data.medicines || []);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total,
        });
      } else {
        setMedicines([]);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch medicines",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setMedicines([]);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch medicines. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [pharmacyId]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchMedicines(value);
    }, 500);
  };

  const handleSearchButtonClick = () => {
    fetchMedicines(searchTerm);
  };

  const handleAddToCart = (medicine) => {
    const existingItem = cart.find((item) => item._id === medicine._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }

    toast.current.show({
      severity: "success",
      summary: "Added to Cart",
      detail: `${medicine.brandName || medicine.genericName} added to cart`,
      life: 2000,
    });
  };

  const handleRemoveFromCart = (medicineId) => {
    setCart(cart.filter((item) => item._id !== medicineId));
  };

  const handleQuantityChange = (medicineId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(medicineId);
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const handleProceed = () => {
    setShowCheckoutDialog(true);
  };

  const handleCheckoutSubmit = async () => {
    try {
      const deliveryAddress = {
        customerName: selectedAddress?.name || "",
        street: selectedAddress?.street || "",
        city: selectedAddress?.city,
        state: selectedAddress?.state,
        pincode: selectedAddress?.pincode,
        landmark: selectedAddress?.landmark,
      };

      const items = cart.map((item) => ({
        medicineId: item._id,
        quantity: item.quantity,
        name: item.brandName,
        price: item.price,
        total: item.price * item.quantity,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const deliveryCharge = 40;
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + deliveryCharge + tax;

      const requestData = {
        pharmacyId,
        orderType: "medicine_search",
        contactNumber: selectedAddress?.phone || "",
        deliveryAddress,
        payment: {
          method: checkoutForm.paymentMethod,
          amount: {
            subtotal,
            discount: 0,
            deliveryCharge,
            tax,
            total,
          },
        },
        items,
        notes: checkoutForm.notes,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/create`,
        requestData,
        { headers: getAuthHeaders() }
      );

      if (response.data) {
        toast.current.show({
          severity: "success",
          summary: "Order Created",
          detail: "Your medicine request has been created successfully!",
          life: 3000,
        });
        setShowCheckoutDialog(false);
        setTimeout(() => {
          router.push("/medical/requests");
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating medicine request:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create medicine request. Please try again.",
        life: 3000,
      });
    }
  };

  const checkoutDialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setShowCheckoutDialog(false)}
        className="p-button-text"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={handleCheckoutSubmit}
        autoFocus
      />
    </div>
  );

  const paymentMethods = [
    { label: "Cash on Delivery", value: "cash" },
    { label: "Online Payment", value: "online" },
  ];

  const itemTemplate = (medicine) => {
    const cartItem = cart.find((item) => item._id === medicine._id);
    const isInCart = !!cartItem;

    return (
      <div className={styles.medicineCard}>
        <div className={styles.medicineContent}>
          {/* Product Image Section */}
          <div className={styles.medicineImage}>
            {medicine.category?.toLowerCase() === "tablet" ? (
              <img src="/capsule.png" alt="Tablet" width="60" height="60" />
            ) : medicine.category?.toLowerCase() === "syrup" ? (
              <img src="/syrup.png" alt="Syrup" width="60" height="60" />
            ) : medicine.category?.toLowerCase() === "injection" ? (
              <img
                src="/injection.png"
                alt="Injection"
                width="60"
                height="60"
              />
            ) : medicine.category?.toLowerCase() === "capsule" ? (
              <img src="/capsule.png" alt="Capsule" width="60" height="60" />
            ) : medicine.category?.toLowerCase() === "powder" ? (
              <img src="/powder.png" alt="Powder" width="60" height="60" />
            ) : medicine.category?.toLowerCase() === "ointment" ? (
              <img src="/ointment.png" alt="Ointment" width="60" height="60" />
            ) : (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="#2ecc71"
                  stroke="#2ecc71"
                  strokeWidth="2"
                />
                <path d="M12 8V16" stroke="white" strokeWidth="2" />
                <path d="M8 12H16" stroke="white" strokeWidth="2" />
              </svg>
            )}
          </div>

          {/* Product Info Section */}
          <div className={styles.medicineInfo}>
            <div className={styles.medicineHeader}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3
                  className={styles.medicineName}
                  style={{
                    fontWeight: "600",
                    color: "rgba(0,0,0,0.87)",
                  }}
                >
                  {medicine.brandName || medicine.genericName}
                </h3>
                <h3
                  className={styles.medicineName}
                  style={{
                    fontSize: "14px",
                    color: "gray",
                  }}
                >
                  Brand: {medicine.genericName}
                </h3>
              </div>

              <Tag
                value={medicine.category || "Other"}
                style={{
                  padding: "5px",
                  borderRadius: "4px",
                  fontSize: "16px",
                }}
                severity="info"
              />
            </div>

            {/* <div className={styles.medicineDetails}>
              <div className={styles.detailItem}>
                <i className="pi pi-tag" style={{ color: "#2ecc71" }}></i>
                <span className={styles.price}>
                  ₹{medicine.packaging?.split(" ")[1] || "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <i className="pi pi-box" style={{ color: "#2ecc71" }}></i>
                <span>{medicine.packaging?.split(" ")[0] || "N/A"} units</span>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className={styles.medicineActions}>
              {isInCart ? (
                <div className={styles.quantityControls}>
                  <div className={styles.quantityInput}>
                    <Button
                      icon="pi pi-minus"
                      className="p-button-rounded p-button-text"
                      onClick={() =>
                        handleQuantityChange(
                          medicine._id,
                          cartItem.quantity - 1
                        )
                      }
                    />
                    <InputNumber
                      value={cartItem.quantity}
                      onValueChange={(e) =>
                        handleQuantityChange(medicine._id, e.value)
                      }
                      showButtons={false}
                      min={1}
                      max={100}
                      className={styles.quantityNumber}
                    />
                    <Button
                      icon="pi pi-plus"
                      className="p-button-rounded p-button-text"
                      onClick={() =>
                        handleQuantityChange(
                          medicine._id,
                          cartItem.quantity + 1
                        )
                      }
                    />
                  </div>
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => handleRemoveFromCart(medicine._id)}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "flex-end",
                    padding: "5px",
                    background: "var(--surface-50)",
                    borderRadius: "4px",
                  }}
                >
                  <Button
                    label={lang == "en" ? English.AddToCart : Hindi.AddToCart}
                    icon="pi pi-shopping-cart"
                    onClick={() => handleAddToCart(medicine)}
                    style={{ backgroundColor: "var(--teal-600)" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const cartItemTemplate = (item) => (
    <div key={item._id} className={styles.cartItem}>
      <div className={styles.cartItemContent}>
        <div className={styles.cartItemHeader}>
          <h4>{item.brandName || item.genericName}</h4>
        </div>
        <div className={styles.quantityControls}>
          <div className={styles.quantityInput}>
            <Button
              label="-"
              className="p-button-text"
              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
            />
            <InputNumber
              value={item.quantity}
              onValueChange={(e) => handleQuantityChange(item._id, e.value)}
              showButtons={false}
              min={1}
              max={100}
            />
            <Button
              label="+"
              className="p-button-text"
              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
            />
          </div>
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => handleRemoveFromCart(item._id)}
          />
        </div>
      </div>
    </div>
  );

  // Update the useEffect for prescription dialog
  useEffect(() => {
    if (selectionOption === "prescription") {
      setShowPrescriptionDialog(true);
    }
  }, [selectionOption]);

  // Dialog JSX
  const prescriptionDialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          setSelectionOption();
          setShowPrescriptionDialog(false);
        }}
        className="p-button-text"
      />
      <Button
        icon="pi pi-check-circle"
        label="Order"
        onClick={() => handlePrescriptionOrderSubmit()}
        disabled={
          !selectedPrescription ||
          !selectedAddress?.phone ||
          !selectedAddress?.street ||
          !selectedAddress?.city ||
          !selectedAddress?.state ||
          !selectedAddress?.pincode
        }
        autoFocus
      />
    </div>
  );

  // Open call dialog when radio selected
  useEffect(() => {
    if (selectionOption === "call") {
      setShowCallDialog(true);
    }
  }, [selectionOption]);

  const handleCallOrderSubmit = async () => {
    try {
      const deliveryAddress = {
        customerName: selectedAddress?.name || "",
        street: selectedAddress?.street || "",
        city: selectedAddress?.city || "",
        state: selectedAddress?.state || "",
        pincode: selectedAddress?.pincode || "",
        landmark: selectedAddress?.landmark || "",
      };
      const requestData = {
        pharmacyId,
        orderType: "call_required",
        contactNumber: selectedAddress?.phone || "",
        deliveryAddress,
        payment: {
          method: callForm.paymentMethod,
          amount: {
            subtotal: 0.0,
            discount: 0.0,
            deliveryCharge: 0.0,
            tax: 0.0,
            total: 0.0,
          },
        },
        prescription: selectedCallPrescription
          ? {
              url:
                selectedCallPrescription.url ||
                selectedCallPrescription.fileUrl,
            }
          : undefined,
        preferredCallTime: callForm.preferredCallTime,
        notes: callForm.notes,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/create`,
        requestData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        toast.current?.show({
          severity: "success",
          summary: "Request Created",
          detail: "Your call request has been created!",
          life: 3000,
        });
        setShowCallDialog(false);
        setSelectedCallPrescription();
        setCallForm({
          contactNumber: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          landmark: "",
          notes: "",
          paymentMethod: "cash",
          preferredCallTime: "",
        });
        setTimeout(() => router.push("/medical/requests"), 1000);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create call request",
        life: 3000,
      });
    }
  };

  // Add back the handlePrescriptionOrderSubmit function
  const handlePrescriptionOrderSubmit = async () => {
    if (!selectedPrescription) return;
    try {
      const deliveryAddress = {
        customerName: selectedAddress?.name || "",
        street: selectedAddress?.street || "",
        city: selectedAddress?.city || "",
        state: selectedAddress?.state || "",
        pincode: selectedAddress?.pincode || "",
        landmark: selectedAddress?.landmark || "",
      };
      console.log(
        deliveryAddress,
        pharmacyId,
        selectedPrescription,
        prescriptionForm,
        "value22"
      );

      const requestData = {
        pharmacyId,
        prescription: {
          url: selectedPrescription?.url || selectedPrescription?.fileUrl,
        },
        orderType: "prescription_upload",
        contactNumber: selectedAddress?.phone || "",
        deliveryAddress,
        payment: { method: prescriptionForm?.paymentMethod },
        notes: prescriptionForm?.notes,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/create`,
        requestData,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );
      if (response.data) {
        toast.current?.show({
          severity: "success",
          summary: "Order Created",
          detail: "Your prescription order has been created!",
          life: 3000,
        });
        setShowPrescriptionDialog(false);
        setSelectedPrescription(null);
        setPrescriptionForm({
          contactNumber: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          landmark: "",
          notes: "",
          paymentMethod: "cash",
        });
        setTimeout(() => router.push("/medical/requests"), 1000);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create order",
        life: 3000,
      });
    }
  };
  const { lang, sethidebottomnav, hidebottomnav } = useContext(AccountContext);

  const [value, setValue] = useState(null);
  const items = [
    {
      name:
        lang == "en"
          ? English.OrderviaPrescription
          : Hindi.OrderviaPrescription,
      value: "prescription",
    },
    {
      name:
        lang == "en"
          ? English.Searchandaddmedicines
          : Hindi.Searchandaddmedicines,
      value: "search",
    },
    { name: lang == "en" ? English.Callme : Hindi.Callme, value: "call" },
  ];
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (cart.length > 0) {
      sethidebottomnav(true);
    } else {
      sethidebottomnav(false);
    }
    setIsMobile(window.innerWidth < 768);
  }, [cart.length]);

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      {showProfile && (
        <div className={styles.profileSection}>
          {/* Profile content will be moved to a separate component */}
        </div>
      )}
      
      <div className={styles.medicineSelectionSection}>


        <div
          style={{
            marginTop: selectionOption ? "0" : "5rem",
            transition: "margin-top 0.3s ease-in-out",
          }}
          className="card flex justify-content-center"
        >
          <SelectButton
            value={selectionOption}
            onChange={(e) => setSelectionOption(e.value)}
            optionLabel="name"
            options={items}
          />
        </div>

        {selectionOption === "search" && selectionOption && (
          <>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: "0",
                zIndex: "1000",
                background: "white",
                borderRadius: "10px",
                // boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
              }}
              className={styles.searchSection}
            >
              <div className={styles.searchInput}>
                <InputText
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={
                    lang == "en" ? English.SearchMedicines : Hindi.SearchMedicines
                  }
                  className="w-full"
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
                <Button
                  label={isMobile ? "" : "Search"}
                  icon="pi pi-search"
                  onClick={handleSearchButtonClick}
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--teal-600)",
                  height: "40px",
                  marginTop: "10px",
                  width: "50px",
                  borderRadius: "50%",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => setCartVisible(true)}
              >
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: "white",
                    position: "absolute",
                    top: "0%",
                    right: "-10px",
                    transform: "translate(-5%, -50%)",
                    background: "var(--orange-500)",
                    padding: "5px",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                  }}
                >
                  {cart.length}
                </span>
                <i
                  style={{
                    fontSize: "1.5rem",
                    color: "white",
                  }}
                  className="pi pi-shopping-cart"
                ></i>
              </div>
            </div>

            {medicines.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  padding: "1rem",
                }}
                // className={styles.medicineDataView}
              >
                {medicines.map(itemTemplate)}
              </div>
            )}
          </>
        )}

        <Dialog
          header={lang == "en" ? English.CheckoutDetails : Hindi.CheckoutDetails}
          visible={showCheckoutDialog}
          style={{ width: isMobile ? "100vw" : "50vw" }}
          footer={checkoutDialogFooter}
          onHide={() => setShowCheckoutDialog(false)}
        >
          <div className={styles.checkoutForm}>
            {/* <div className={styles.formSection}>
              <h3>Contact Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="contactNumber">
                  {lang == "en" ? English.ContactNumber : Hindi.ContactNumber}
                </label>
                <InputText
                  id="contactNumber"
                  value={checkoutForm.contactNumber}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      contactNumber: e.target.value,
                    })
                  }
                  placeholder={
                    lang == "en"
                      ? English.EnterContactNumber
                      : Hindi.EnterContactNumber
                  }
                />
              </div>
            </div> */}

            <AddressSelector
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
            {/* <div className={styles.formSection}>
              <h3>Delivery Address</h3>
              <div className={styles.formGroup}>
                <label htmlFor="street">Street Address</label>
                <InputText
                  id="street"
                  value={checkoutForm.street}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, street: e.target.value })
                  }
                  placeholder={
                    lang == "en"
                      ? English.EnterStreetAddress
                      : Hindi.EnterStreetAddress
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <InputText
                  id="city"
                  value={checkoutForm.city}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, city: e.target.value })
                  }
                  placeholder={lang == "en" ? English.EnterCity : Hindi.EnterCity}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="state">State</label>
                <InputText
                  id="state"
                  value={checkoutForm.state}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, state: e.target.value })
                  }
                  placeholder={
                    lang == "en" ? English.EnterState : Hindi.EnterState
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="pincode">Pincode</label>
                <InputText
                  id="pincode"
                  value={checkoutForm.pincode}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, pincode: e.target.value })
                  }
                  placeholder={
                    lang == "en" ? English.EnterPincode : Hindi.EnterPincode
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="landmark">Landmark</label>
                <InputText
                  id="landmark"
                  value={checkoutForm.landmark}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, landmark: e.target.value })
                  }
                  placeholder={
                    lang == "en" ? English.EnterLandmark : Hindi.EnterLandmark
                  }
                />
              </div>
            </div> */}

            <div style={{ marginTop: "-1rem" }} className={styles.formSection}>
              <h3>Payment Details</h3>
              <div className={styles.formGroup}>
                <label htmlFor="paymentMethod">Payment Method</label>
                <Dropdown
                  id="paymentMethod"
                  value={checkoutForm.paymentMethod}
                  options={paymentMethods}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, paymentMethod: e.value })
                  }
                  placeholder={
                    lang == "en"
                      ? English.SelectPaymentMethod
                      : Hindi.SelectPaymentMethod
                  }
                />
              </div>
            </div>

            <div style={{ marginTop: "-1rem" }} className={styles.formSection}>
              <h3>Additional Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes</label>
                <InputText
                  id="notes"
                  value={checkoutForm.notes}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, notes: e.target.value })
                  }
                  placeholder={
                    lang == "en" ? English.AdditionalNotes : Hindi.AdditionalNotes
                  }
                />
              </div>
            </div>
          </div>
        </Dialog>

        <Dialog
          header={
            lang == "en"
              ? English.OrderviaPrescription
              : Hindi.OrderviaPrescription
          }
          visible={showPrescriptionDialog}
          style={{ width: isMobile ? "100vw" : "60vw", maxWidth: 700 }}
          footer={prescriptionDialogFooter}
          onHide={() => {
            setShowPrescriptionDialog(false);
            setSelectedPrescription(null);
            setSelectionOption();
          }}
        >
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3>Choose Prescription</h3>
              <PrescriptionSelector
                value={selectedPrescription}
                onChange={(file) => {
                  setSelectedPrescription(file);
                  if (file) {
                    toast.current?.show({
                      severity: "success",
                      summary: "Selected",
                      detail: "Prescription selected",
                      life: 2000,
                    });
                  }
                }}
                getAuthHeaders={getAuthHeaders}
              />
            </div>
            <div style={{ flex: 2, minWidth: 300 }}>
              <h3>Order Details</h3>
              <div className={styles.checkoutForm}>
                {/* <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="presc-contactNumber">
                      {lang == "en" ? English.Contactnumber : Hindi.Contactnumber}
                    </label>
                    <InputText
                      id="presc-contactNumber"
                      value={prescriptionForm.contactNumber}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          contactNumber: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en" ? English.Contactnumber : Hindi.Contactnumber
                      }
                    />
                  </div>
                </div> */}
                <AddressSelector
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                />
                {/* <div
                  style={{
                    marginTop: "-1rem",
                    width: "100%",
                  }}
                  className={styles.formSection}
                >
                  <div className={styles.formGroup}>
                    <label htmlFor="presc-street">Street Address</label>
                    <InputText
                      id="presc-street"
                      value={prescriptionForm.street}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          street: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en"
                          ? English.EnterStreetAddress
                          : Hindi.EnterStreetAddress
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="presc-city">City</label>
                    <InputText
                      id="presc-city"
                      value={prescriptionForm.city}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          city: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en" ? English.EnterCity : Hindi.EnterCity
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="presc-state">State</label>
                    <InputText
                      id="presc-state"
                      value={prescriptionForm.state}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          state: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en" ? English.EnterState : Hindi.EnterState
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="presc-pincode">Pincode</label>
                    <InputText
                      id="presc-pincode"
                      value={prescriptionForm.pincode}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          pincode: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en" ? English.EnterPincode : Hindi.EnterPincode
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="presc-landmark">Landmark</label>
                    <InputText
                      id="presc-landmark"
                      value={prescriptionForm.landmark}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          landmark: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en" ? English.EnterLandmark : Hindi.EnterLandmark
                      }
                    />
                  </div>
                </div> */}
                {/* <div
                  style={{ marginTop: "-1rem" }}
                  className={styles.formSection}
                >
                  <div className={styles.formGroup}>
                    <label htmlFor="presc-paymentMethod">Payment Method</label>
                    <Dropdown
                      id="presc-paymentMethod"
                      value={prescriptionForm.paymentMethod}
                      options={paymentMethods}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          paymentMethod: e.value,
                        })
                      }
                      placeholder={
                        lang == "en"
                          ? English.SelectPaymentMethod
                          : Hindi.SelectPaymentMethod
                      }
                    />
                  </div>
                </div> */}
                <div
                  style={{ marginTop: "-1rem" }}
                  className={styles.formSection}
                >
                  <div className={styles.formGroup}>
                    <label htmlFor="presc-notes">Notes</label>
                    <InputText
                      id="presc-notes"
                      value={prescriptionForm.notes}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          notes: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en"
                          ? English.AdditionalNotes
                          : Hindi.AdditionalNotes
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Enlarge Dialog */}
        <Dialog
          header={enlargedFile ? enlargedFile.fileName || "Preview" : "Preview"}
          visible={showEnlargeDialog}
          style={{ width: "90vw", maxWidth: 900 }}
          onHide={() => {
            setShowEnlargeDialog(false);
            setEnlargedFile(null);
          }}
          modal
        >
          {enlargedFile &&
            (enlargedFile.fileFormat &&
            enlargedFile.fileFormat.startsWith("image") ? (
              <img
                src={enlargedFile.fileUrl}
                alt={enlargedFile.fileName}
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            ) : (
              <PdfViewer url={enlargedFile.fileUrl} />
            ))}
        </Dialog>

        <Dialog
          header={
            lang == "en" ? English.CallMeForDetails : Hindi.CallMeForDetails
          }
          visible={showCallDialog}
          style={{ width: isMobile ? "100vw" : "60vw", maxWidth: 700 }}
          footer={
            <div>
              <Button
                label={lang == "en" ? English.Cancel : Hindi.Cancel}
                icon="pi pi-times"
                onClick={() => {
                  setShowCallDialog(false);
                  setSelectedCallPrescription(null);
                  setSelectionOption();
                }}
                className="p-button-text"
              />
              <Button
                label={lang == "en" ? English.Submit : Hindi.Submit}
                icon="pi pi-check"
                onClick={handleCallOrderSubmit}
                disabled={
                  !selectedAddress?.phone ||
                  !selectedAddress?.street ||
                  !selectedAddress?.city ||
                  !selectedAddress?.state ||
                  !selectedAddress?.pincode
                }
                autoFocus
              />
            </div>
          }
          onHide={() => {
            setShowCallDialog(false);
            setSelectedCallPrescription(null);
            setSelectionOption();
          }}
        >
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3>Prescription</h3>
              <PrescriptionSelector
                value={selectedCallPrescription}
                onChange={(file) => {
                  setSelectedCallPrescription(file);
                  if (file) {
                    toast.current?.show({
                      severity: "success",
                      summary: "Selected",
                      detail: "Prescription selected",
                      life: 2000,
                    });
                  }
                }}
                getAuthHeaders={getAuthHeaders}
              />
            </div>
            <div style={{ flex: 2, minWidth: 300 }}>
              <h3>Call Request Details</h3>
              <div className={styles.checkoutForm}>
                {/* <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-contactNumber">Contact Number</label>
                    <InputText
                      id="call-contactNumber"
                      value={callForm.contactNumber}
                      onChange={(e) =>
                        setCallForm({
                          ...callForm,
                          contactNumber: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en"
                          ? English.EnterContactNumber
                          : Hindi.EnterContactNumber
                      }
                    />
                  </div>
                </div> */}
                <AddressSelector
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                />
                {/* <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-street">Street Address</label>
                    <InputText
                      id="call-street"
                      value={callForm.street}
                      onChange={(e) =>
                        setCallForm({ ...callForm, street: e.target.value })
                      }
                      placeholder={
                        lang == "en"
                          ? English.EnterStreetAddress
                          : Hindi.EnterStreetAddress
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-city">City</label>
                    <InputText
                      id="call-city"
                      value={callForm.city}
                      onChange={(e) =>
                        setCallForm({ ...callForm, city: e.target.value })
                      }
                      placeholder={
                        lang == "en" ? English.EnterCity : Hindi.EnterCity
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-state">State</label>
                    <InputText
                      id="call-state"
                      value={callForm.state}
                      onChange={(e) =>
                        setCallForm({ ...callForm, state: e.target.value })
                      }
                      placeholder={
                        lang == "en" ? English.EnterState : Hindi.EnterState
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-pincode">Pincode</label>
                    <InputText
                      id="call-pincode"
                      value={callForm.pincode}
                      onChange={(e) =>
                        setCallForm({ ...callForm, pincode: e.target.value })
                      }
                      placeholder={
                        lang == "en" ? English.EnterPincode : Hindi.EnterPincode
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-landmark">Landmark</label>
                    <InputText
                      id="call-landmark"
                      value={callForm.landmark}
                      onChange={(e) =>
                        setCallForm({ ...callForm, landmark: e.target.value })
                      }
                      placeholder={
                        lang == "en" ? English.EnterLandmark : Hindi.EnterLandmark
                      }
                    />
                  </div>
                </div>
                {/* <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-paymentMethod">Payment Method</label>
                    <Dropdown
                      id="call-paymentMethod"
                      value={callForm.paymentMethod}
                      options={paymentMethods}
                      onChange={(e) =>
                        setCallForm({ ...callForm, paymentMethod: e.value })
                      }
                      placeholder={
                        lang == "en"
                          ? English.SelectPaymentMethod
                          : Hindi.SelectPaymentMethod
                      }
                    />
                  </div>
                </div>
                <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-preferredCallTime">
                      Preferred Call Time
                    </label>
                    <InputText
                      id="call-preferredCallTime"
                      value={callForm.preferredCallTime}
                      onChange={(e) =>
                        setCallForm({
                          ...callForm,
                          preferredCallTime: e.target.value,
                        })
                      }
                      placeholder={
                        lang == "en"
                          ? English.EnterPreferredCallTime
                          : Hindi.EnterPreferredCallTime
                      }
                    />
                  </div>
                </div> */}
                {/* <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="call-notes">Notes</label>
                    <InputText
                      id="call-notes"
                      value={callForm.notes}
                      onChange={(e) =>
                        setCallForm({ ...callForm, notes: e.target.value })
                      }
                      placeholder={
                        lang == "en"
                          ? English.AdditionalNotes
                          : Hindi.AdditionalNotes
                      }
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </Dialog>

        <Sidebar
          visible={cartVisible}
          position="right"
          onHide={() => setCartVisible(false)}
          style={{ width: "400px" }}
          className="p-sidebar-lg"
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              {lang == "en"
                ? English.ShoppingCart.replace("{count}", cart.length)
                : Hindi.ShoppingCart.replace("{count}", cart.length)}
            </h2>

            {cart.length === 0 ? (
              <div className="text-center p-4">
                <i className="pi pi-shopping-cart text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div
                  className="cart-items"
                  style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}
                >
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="mb-4 p-3 border-round surface-100"
                    >
                      <div className="flex justify-content-between align-items-center mb-2">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <h3
                            className={styles.medicineName}
                            style={{
                              fontWeight: "600",
                              color: "rgba(0,0,0,0.87)",
                            }}
                          >
                            {item.brandName || item.genericName}
                          </h3>
                          <h3
                            className={styles.medicineName}
                            style={{
                              fontSize: "14px",
                              color: "gray",
                            }}
                          >
                            Brand: {item.genericName}
                          </h3>
                        </div>
                        <Button
                          icon="pi pi-trash"
                          className="p-button-rounded p-button-danger p-button-text"
                          onClick={() => handleRemoveFromCart(item._id)}
                        />
                      </div>

                      <div className="flex align-items-center justify-content-between">
                        <div className="flex align-items-center">
                          <Button
                            icon="pi pi-minus"
                            className="p-button-rounded p-button-text"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                          />
                          <InputText
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item._id,
                                parseInt(e.target.value)
                              )
                            }
                            showButtons={false}
                            min={1}
                            max={100}
                            className="mx-2"
                            style={{ maxWidth: "5rem" }}
                          />
                          <Button
                            icon="pi pi-plus"
                            className="p-button-rounded p-button-text"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top-1 surface-border pt-3 mt-3">
                  <p className="text-sm text-center text-gray-500 mb-2">
                    {lang == "en"
                      ? English.OrderTotalMessage
                      : Hindi.OrderTotalMessage}
                  </p>
                  <div className="flex justify-content-between mb-2">
                    <span>
                      {lang == "en"
                        ? English.DeliveryCharge
                        : Hindi.DeliveryCharge}
                      :
                    </span>
                    <span>₹22</span>
                  </div>

                  <Button
                    label={
                      lang == "en"
                        ? English.ProceedToCheckout
                        : Hindi.ProceedToCheckout
                    }
                    icon="pi pi-shopping-bag"
                    className="w-full "
                    style={{
                      marginTop: "1rem",
                    }}
                    onClick={() => {
                      setCartVisible(false);
                      handleProceed();
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </Sidebar>

        {/* Bottom Nav  */}
        <div
          style={{
            display: hidebottomnav ? "flex" : "none",
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            background: "white",
            zIndex: "1000",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            width: "100vw",
            borderTopLeftRadius: "14px",
            borderTopRightRadius: "14px",
            height: "70px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="pi pi-home"
              style={{
                fontSize: "28px",
                color: "var(--teal-600)",
              }}
              onClick={() => {
                router.push("/");
              }}
            ></i>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <i className="pi pi-shopping-cart"></i> */}
            <span
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginRight: "1rem",
                color: "var(--surface-600)",
                background: "var(--surface-50)",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                boxShadow: "0px 0px 5px  rgba(0, 0, 0, 0.1)",
              }}
            >
              {cart.length}
            </span>
            <div
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: "6px",
                background:
                  "linear-gradient(to right, #00b09b,rgb(17, 119, 104))",
                color: "white",
                fontWeight: "600",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "2px 3px 5px  rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => {
                setCartVisible(true);
              }}
            >
              Buy Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineSelection;
