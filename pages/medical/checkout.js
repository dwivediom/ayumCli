import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Message } from "primereact/message";
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

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    address: false,
    prescription: false,
    cart: false,
  });

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
      confirmDialog({
        message: "Are you sure you want to remove this item from your cart?",
        header: "Remove Item",
        icon: "pi pi-exclamation-triangle",
        accept: () => handleRemoveFromCart(medicineId),
        rejectClassName: "p-button-text",
      });
      return;
    }

    if (newQuantity > 100) {
      toast.current.show({
        severity: "warn",
        summary: "Maximum Quantity",
        detail: "Maximum quantity per item is 100",
        life: 3000,
      });
      return;
    }

    const updatedCart = cart.map((item) =>
      item._id === medicineId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    saveCartToStorage(updatedCart);

    toast.current.show({
      severity: "success",
      summary: "Updated",
      detail: "Cart updated successfully",
      life: 2000,
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = (medicineId) => {
    const item = cart.find((item) => item._id === medicineId);
    const updatedCart = cart.filter((item) => item._id !== medicineId);
    setCart(updatedCart);
    saveCartToStorage(updatedCart);

    toast.current.show({
      severity: "info",
      summary: "Item Removed",
      detail: `${item?.brandName || "Item"} removed from cart`,
      life: 2000,
    });
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

  // Validate checkout form
  const validateCheckout = () => {
    const errors = {
      address: false,
      prescription: false,
      cart: false,
    };

    if (!selectedAddress) {
      errors.address = true;
      setValidationErrors(errors);
      toast.current.show({
        severity: "error",
        summary: "Address Required",
        detail: "Please select a delivery address to continue",
        life: 3000,
      });
      return false;
    }

    if (orderType === "prescription_upload" && !selectedPrescription) {
      errors.prescription = true;
      setValidationErrors(errors);
      toast.current.show({
        severity: "error",
        summary: "Prescription Required",
        detail: "Please upload your prescription to continue",
        life: 3000,
      });
      return false;
    }

    if (cart.length === 0) {
      errors.cart = true;
      setValidationErrors(errors);
      toast.current.show({
        severity: "error",
        summary: "Empty Cart",
        detail: "Please add items to your cart before checkout",
        life: 3000,
      });
      return false;
    }

    // Validate cart items
    const invalidItems = cart.filter(
      (item) =>
        !item.price || item.price <= 0 || !item.quantity || item.quantity <= 0
    );
    if (invalidItems.length > 0) {
      errors.cart = true;
      setValidationErrors(errors);
      toast.current.show({
        severity: "error",
        summary: "Invalid Items",
        detail:
          "Some items in your cart have invalid data. Please refresh and try again.",
        life: 3000,
      });
      return false;
    }

    setValidationErrors({ address: false, prescription: false, cart: false });
    return true;
  };

  // Handle checkout submit
  const handleCheckoutSubmit = async () => {
    if (!validateCheckout()) {
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
        <p className={styles.loadingHint}>
          Please wait while we prepare your order
        </p>
      </div>
    );
  }

  if (!pharmacyId || !orderType) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <i className="pi pi-exclamation-triangle" />
        </div>
        <h3>Invalid Checkout</h3>
        <p>Missing required parameters. Please try again.</p>
        <Button
          label="Go Back"
          onClick={() => router.back()}
          icon="pi pi-arrow-left"
          className={styles.errorButton}
        />
      </div>
    );
  }

  if (cart.length === 0 && pharmacy) {
    return (
      <div className={styles.container}>
        <Toast ref={toast} position="top-right" />
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <i className="pi pi-arrow-left" />
          </button>
          <div className={styles.headerContent}>
            <h1>Checkout</h1>
          </div>
        </div>
        <div className={styles.emptyCheckoutContainer}>
          <div className={styles.emptyCheckoutCard}>
            <i className="pi pi-shopping-cart" />
            <h2>Your cart is empty</h2>
            <p>Add medicines to your cart to proceed with checkout</p>
            <Button
              label="Continue Shopping"
              icon="pi pi-arrow-left"
              onClick={() => router.back()}
              className={styles.continueShoppingBtn}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />

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
              <>
                {validationErrors.cart && (
                  <Message
                    severity="error"
                    text="Please ensure all cart items are valid"
                    className={styles.validationMessage}
                  />
                )}
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
                            disabled={item.quantity <= 1}
                            title="Decrease quantity"
                          >
                            <i className="pi pi-minus" />
                          </button>
                          <span className={styles.quantity}>
                            {item.quantity}
                          </span>
                          <button
                            className={styles.quantityBtn}
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            disabled={item.quantity >= 100}
                            title="Increase quantity"
                          >
                            <i className="pi pi-plus" />
                          </button>
                        </div>

                        <div className={styles.itemPrice}>
                          <span className={styles.price}>
                            ₹{item.price?.toFixed(2)}
                          </span>
                          <span className={styles.totalPrice}>
                            ₹{(item.price * item.quantity)?.toFixed(2)}
                          </span>
                        </div>

                        <button
                          className={styles.removeBtn}
                          onClick={() => {
                            confirmDialog({
                              message: `Are you sure you want to remove "${item.brandName}" from your cart?`,
                              header: "Remove Item",
                              icon: "pi pi-exclamation-triangle",
                              accept: () => handleRemoveFromCart(item._id),
                              rejectClassName: "p-button-text",
                            });
                          }}
                          title="Remove item"
                        >
                          <i className="pi pi-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.emptyCart}>
                <i className="pi pi-shopping-cart" />
                <p>No items in cart</p>
                <p className={styles.hint}>
                  Add medicines to your cart to proceed
                </p>
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

              {validationErrors.prescription && (
                <Message
                  severity="error"
                  text="Please upload your prescription"
                  className={styles.validationMessage}
                />
              )}

              {selectedPrescription ? (
                <div className={styles.prescriptionPreview}>
                  <div className={styles.prescriptionHeader}>
                    <span className={styles.prescriptionStatus}>
                      <i className="pi pi-check-circle" />
                      Prescription uploaded
                    </span>
                  </div>
                  <PdfViewer file={selectedPrescription} />
                </div>
              ) : (
                <div className={styles.noPrescription}>
                  <i className="pi pi-file-pdf" />
                  <p>No prescription uploaded</p>
                  <p className={styles.hint}>
                    Click "Upload" to add your prescription
                  </p>
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

              {validationErrors.address && (
                <Message
                  severity="error"
                  text="Please select a delivery address"
                  className={styles.validationMessage}
                />
              )}

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
                      <p className={styles.landmark}>
                        <i className="pi pi-compass" />{" "}
                        {selectedAddress.landmark}
                      </p>
                    )}
                    <p className={styles.phone}>
                      <i className="pi pi-phone" /> {selectedAddress.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.noAddress}>
                  <i className="pi pi-map-marker" />
                  <p>No address selected</p>
                  <p className={styles.hint}>
                    Click "Select" to choose an address
                  </p>
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
              <h4>
                <i className="pi pi-shopping-bag" />
                Order Summary
              </h4>
              <div className={styles.summaryContent}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    Subtotal ({cart.length}{" "}
                    {cart.length === 1 ? "item" : "items"})
                  </span>
                  <span className={styles.summaryValue}>
                    ₹{totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    <i className="pi pi-truck" />
                    Delivery Charge
                  </span>
                  <span className={styles.summaryValue}>
                    ₹{totals.deliveryCharge.toFixed(2)}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    <i className="pi pi-percentage" />
                    Tax (5%)
                  </span>
                  <span className={styles.summaryValue}>
                    ₹{totals.tax.toFixed(2)}
                  </span>
                </div>
                <div className={styles.summaryRowTotal}>
                  <span className={styles.totalLabel}>Total Amount</span>
                  <span className={styles.totalValue}>
                    ₹{totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Validation Summary */}
            {(!selectedAddress ||
              (orderType === "prescription_upload" && !selectedPrescription) ||
              cart.length === 0) && (
              <div className={styles.validationSummary}>
                <Message
                  severity="warn"
                  text={
                    !selectedAddress
                      ? "Please select a delivery address"
                      : orderType === "prescription_upload" &&
                        !selectedPrescription
                      ? "Please upload your prescription"
                      : "Please add items to your cart"
                  }
                  className={styles.summaryMessage}
                />
              </div>
            )}

            {/* Place Order Button */}
            <Button
              label={loading ? "Processing..." : "Place Order"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
              onClick={handleCheckoutSubmit}
              disabled={
                !selectedAddress ||
                cart.length === 0 ||
                loading ||
                (orderType === "prescription_upload" && !selectedPrescription)
              }
              loading={loading}
              className={styles.placeOrderBtn}
            />

            {totals.total > 0 && (
              <p className={styles.orderNote}>
                <i className="pi pi-info-circle" />
                By placing this order, you agree to our terms and conditions
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address Selector Dialog */}
      <Dialog
        visible={showAddressSelector}
        onHide={() => {
          setShowAddressSelector(false);
          if (selectedAddress) {
            setValidationErrors({ ...validationErrors, address: false });
          }
        }}
        header="Select Delivery Address"
        modal
        className={styles.dialog}
        maximizable
        style={{ width: "90vw", maxWidth: "700px" }}
      >
        <AddressSelector
          selectedAddress={selectedAddress}
          setSelectedAddress={(address) => {
            setSelectedAddress(address);
            if (address) {
              setValidationErrors({ ...validationErrors, address: false });
              setShowAddressSelector(false);
              toast.current.show({
                severity: "success",
                summary: "Address Selected",
                detail: "Delivery address has been selected",
                life: 2000,
              });
            }
          }}
        />
      </Dialog>

      {/* Prescription Selector Dialog */}
      <Dialog
        visible={showPrescriptionSelector}
        onHide={() => {
          setShowPrescriptionSelector(false);
          if (selectedPrescription) {
            setValidationErrors({ ...validationErrors, prescription: false });
          }
        }}
        header="Upload Prescription"
        modal
        className={styles.dialog}
        maximizable
        style={{ width: "90vw", maxWidth: "800px" }}
      >
        <PrescriptionSelector
          value={selectedPrescription}
          selectedPrescription={selectedPrescription}
          setSelectedPrescription={(prescription) => {
            setSelectedPrescription(prescription);
            if (prescription) {
              setValidationErrors({ ...validationErrors, prescription: false });
              setShowPrescriptionSelector(false);
              toast.current.show({
                severity: "success",
                summary: "Prescription Uploaded",
                detail: "Prescription has been uploaded successfully",
                life: 2000,
              });
            }
          }}
          onChange={(e) => {
            setSelectedPrescription(e);
            if (e) {
              setValidationErrors({ ...validationErrors, prescription: false });
            }
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
