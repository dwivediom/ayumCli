import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import { AccountContext } from "../../context/AccountProvider";
import { getAuthHeaders } from "../../config/api/labApi";
import AddressSelector from "../../components/medical/AddressSelector";
import OrderConfirmation from "../../components/medical/OrderConfirmation";
import PdfViewer from "../../components/medical/PdfViewer";
import PrescriptionSelector from "../../components/medical/PrescriptionSelector";
import styles from "./checkout.module.css";

const Checkout = () => {
  const router = useRouter();
  const { orderType, pharmacyId } = router.query;
  const { account } = useContext(AccountContext);
  const toast = useRef(null);

  // State management
  const [loading, setLoading] = useState(false);
  const [pharmacy, setPharmacy] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [showPrescriptionSelector, setShowPrescriptionSelector] =
    useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    paymentMethod: "cash",
    notes: "",
  });

  // Payment methods
  const paymentMethods = [
    { label: "Cash on Delivery", value: "cash", icon: "pi pi-money-bill" },
    { label: "Online Payment", value: "online", icon: "pi pi-credit-card" },
  ];

  // Load pharmacy details and cart from localStorage
  useEffect(() => {
    if (pharmacyId) {
      loadPharmacyDetails();
      loadCartFromStorage();
    }
  }, [pharmacyId]);

  // Load pharmacy details
  const loadPharmacyDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/pharmacy/${pharmacyId}`,
        { headers: getAuthHeaders() }
      );
      if (response.data) {
        setPharmacy(response.data);
      }
    } catch (error) {
      console.error("Error loading pharmacy details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load pharmacy details",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load cart from localStorage
  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem(`cart_${pharmacyId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  // Save cart to localStorage
  const saveCartToStorage = (newCart) => {
    localStorage.setItem(`cart_${pharmacyId}`, JSON.stringify(newCart));
  };

  // Handle quantity change
  const handleQuantityChange = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(medicineId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item._id === medicineId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  // Handle remove from cart
  const handleRemoveFromCart = (medicineId) => {
    const updatedCart = cart.filter((item) => item._id !== medicineId);
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryCharge = 22;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryCharge + tax;

    return { subtotal, deliveryCharge, tax, total };
  }, [cart]);

  // Handle checkout submit
  const handleCheckoutSubmit = async () => {
    if (!selectedAddress) {
      toast.current.show({
        severity: "warn",
        summary: "Address Required",
        detail: "Please select a delivery address",
        life: 3000,
      });
      return;
    }

    if (orderType === "prescription_upload" && !selectedPrescription) {
      toast.current.show({
        severity: "warn",
        summary: "Prescription Required",
        detail: "Please upload your prescription",
        life: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const deliveryAddress = {
        customerName: selectedAddress?.name || "",
        street: selectedAddress?.street || "",
        city: selectedAddress?.city,
        state: selectedAddress?.state,
        pincode: selectedAddress?.pincode,
        landmark: selectedAddress?.landmark,
        geoUrl: selectedAddress?.geoUrl,
      };

      const items = cart.map((item) => ({
        medicineId: item._id,
        quantity: item.quantity,
        name: item.brandName,
        price: item.price,
        total: item.price * item.quantity,
      }));

      const requestData = {
        pharmacyId,
        orderType,
        prescription:
          orderType === "prescription_upload" ? selectedPrescription : null,
        contactNumber: selectedAddress?.phone || "",
        deliveryAddress,
        payment: {
          method: checkoutForm.paymentMethod,
          amount: totals,
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
        setOrderDetails({
          orderId: response.data.orderId || response.data._id,
          items: items,
          total: totals.total,
          deliveryAddress: deliveryAddress,
          orderType: orderType,
        });

        setShowOrderConfirmation(true);
        setCart([]);
        saveCartToStorage([]);

        toast.current.show({
          severity: "success",
          summary: "Order Created",
          detail: "Your medicine request has been created successfully!",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating medicine request:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create medicine request. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get order type display text
  const getOrderTypeText = () => {
    const types = {
      prescription_upload: "Prescription Upload",
      call_required: "Call Required",
      medicine_search: "Medicine Search",
    };
    return types[orderType] || orderType;
  };

  // Get medicine icon
  const getMedicineIcon = (category) => {
    const icons = {
      tablet: "/capsule.png",
      syrup: "/syrup.png",
      injection: "/injection.png",
      capsule: "/capsule.png",
      powder: "/powder.png",
      ointment: "/ointment.png",
    };
    return icons[category?.toLowerCase()] || null;
  };

  if (loading && !pharmacy) {
    return (
      <div className={styles.loadingContainer}>
        <ProgressSpinner size="large" />
        <p>Loading checkout details...</p>
      </div>
    );
  }

  if (!pharmacyId || !orderType) {
    return (
      <div className={styles.errorContainer}>
        <i className="pi pi-exclamation-triangle" />
        <h3>Invalid Checkout</h3>
        <p>Missing required parameters. Please try again.</p>
        <Button label="Go Back" onClick={() => router.back()} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Toast ref={toast} />

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <i className="pi pi-arrow-left" />
        </button>
        <div className={styles.headerContent}>
          <h1>Checkout</h1>
          <Tag value={getOrderTypeText()} className={styles.orderTypeTag} />
        </div>
      </div>

      <div className={styles.content}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          {/* Pharmacy Info */}
          {pharmacy && (
            <div className={styles.pharmacyCard}>
              <div className={styles.pharmacyInfo}>
                <div className={styles.pharmacyAvatar}>
                  <i className="pi pi-building" />
                </div>
                <div className={styles.pharmacyDetails}>
                  <h3>{pharmacy.name}</h3>
                  <p>{pharmacy.address}</p>
                  <div className={styles.pharmacyMeta}>
                    <span>
                      <i className="pi pi-phone" /> {pharmacy.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className={styles.cartSection}>
            <div className={styles.sectionHeader}>
              <h3>Order Items</h3>
              <span className={styles.itemCount}>({cart.length})</span>
            </div>

            {cart.length > 0 ? (
              <div className={styles.cartItems}>
                {cart.map((item) => (
                  <div key={item._id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      {getMedicineIcon(item.category) ? (
                        <img
                          src={getMedicineIcon(item.category)}
                          alt={item.category}
                        />
                      ) : (
                        <div className={styles.defaultIcon}>
                          <i className="pi pi-pills" />
                        </div>
                      )}
                    </div>

                    <div className={styles.itemDetails}>
                      <h4>{item.brandName}</h4>
                      <p>{item.genericName}</p>
                      <Tag
                        value={item.category || "Other"}
                        className={styles.categoryTag}
                      />
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                        >
                          <i className="pi pi-minus" />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                        >
                          <i className="pi pi-plus" />
                        </button>
                      </div>

                      <div className={styles.itemPrice}>
                        <span className={styles.price}>₹{item.price}</span>
                        <span className={styles.totalPrice}>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemoveFromCart(item._id)}
                      >
                        <i className="pi pi-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyCart}>
                <i className="pi pi-shopping-cart" />
                <p>No items in cart</p>
                <button
                  className={styles.continueBtn}
                  onClick={() => router.back()}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Prescription Upload */}
          {orderType === "prescription_upload" && (
            <div className={styles.prescriptionSection}>
              <div className={styles.sectionHeader}>
                <h3>Prescription</h3>
                <button
                  className={styles.uploadBtn}
                  onClick={() => setShowPrescriptionSelector(true)}
                >
                  <i className="pi pi-upload" />
                  {selectedPrescription ? "Change" : "Upload"}
                </button>
              </div>

              {selectedPrescription && (
                <div className={styles.prescriptionPreview}>
                  <PdfViewer file={selectedPrescription} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.checkoutCard}>
            <h3>Delivery Details</h3>

            {/* Address Selection */}
            <div className={styles.addressSection}>
              <div className={styles.sectionHeader}>
                <h4>Delivery Address</h4>
                <button
                  className={styles.selectBtn}
                  onClick={() => setShowAddressSelector(true)}
                >
                  <i className="pi pi-map-marker" />
                  {selectedAddress ? "Change" : "Select"}
                </button>
              </div>

              {selectedAddress ? (
                <div className={styles.selectedAddress}>
                  <div className={styles.addressIcon}>
                    <i className="pi pi-map-marker" />
                  </div>
                  <div className={styles.addressInfo}>
                    <h5>{selectedAddress.name}</h5>
                    <p>{selectedAddress.street}</p>
                    <p>
                      {selectedAddress.city}, {selectedAddress.state} -{" "}
                      {selectedAddress.pincode}
                    </p>
                    {selectedAddress.landmark && (
                      <p>Landmark: {selectedAddress.landmark}</p>
                    )}
                    <p>
                      <i className="pi pi-phone" /> {selectedAddress.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.noAddress}>
                  <i className="pi pi-map-marker" />
                  <p>No address selected</p>
                </div>
              )}
            </div>

            <div className={styles.divider} />

            {/* Payment Method */}
            <div className={styles.paymentSection}>
              <h4>Payment Method</h4>
              <div className={styles.paymentOptions}>
                {paymentMethods.map((method) => (
                  <div key={method.value} className={styles.paymentOption}>
                    <RadioButton
                      inputId={method.value}
                      name="paymentMethod"
                      value={method.value}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          paymentMethod: e.value,
                        })
                      }
                      checked={checkoutForm.paymentMethod === method.value}
                    />
                    <label
                      htmlFor={method.value}
                      className={styles.paymentLabel}
                    >
                      <i className={method.icon} />
                      {method.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.divider} />

            {/* Order Notes */}
            <div className={styles.notesSection}>
              <h4>Order Notes (Optional)</h4>
              <InputTextarea
                value={checkoutForm.notes}
                onChange={(e) =>
                  setCheckoutForm({ ...checkoutForm, notes: e.target.value })
                }
                placeholder="Any special instructions for delivery..."
                rows={3}
                className={styles.notesInput}
              />
            </div>

            <div className={styles.divider} />

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <h4>Order Summary</h4>
              <div className={styles.summaryRow}>
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Charge</span>
                <span>₹{totals.deliveryCharge.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax (5%)</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Total</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              label="Place Order"
              icon="pi pi-check"
              onClick={handleCheckoutSubmit}
              disabled={!selectedAddress || cart.length === 0 || loading}
              loading={loading}
              className={styles.placeOrderBtn}
            />
          </div>
        </div>
      </div>

      {/* Address Selector Dialog */}
      <Dialog
        visible={showAddressSelector}
        onHide={() => setShowAddressSelector(false)}
        header="Select Delivery Address"
        modal
        className={styles.dialog}
        maximizable
      >
        {/* <AddressSelector
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        /> */}
      </Dialog>

      {/* Prescription Selector Dialog */}
      <Dialog
        visible={showPrescriptionSelector}
        onHide={() => setShowPrescriptionSelector(false)}
        header="Upload Prescription"
        modal
        className={styles.dialog}
        maximizable
      >
        <PrescriptionSelector
          value={selectedPrescription}
          selectedPrescription={selectedPrescription}
          setSelectedPrescription={setSelectedPrescription}
          onChange={(e) => {
            console.log(e);
            setSelectedPrescription(e);
          }}
          getAuthHeaders={getAuthHeaders}
        />
      </Dialog>

      {/* Order Confirmation */}
      {showOrderConfirmation && orderDetails && (
        <OrderConfirmation
          orderDetails={orderDetails}
          onClose={() => {
            setShowOrderConfirmation(false);
            router.push("/medical/requests");
          }}
        />
      )}
    </div>
  );
};

export default Checkout;
