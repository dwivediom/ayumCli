import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback,
} from "react";
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
import OrderConfirmation from "./OrderConfirmation";

// New Compact Selection Screen Component
const SelectionScreen = ({
  onSelectOption,
  lang,
  selectedPharmacy,
  setShowMedicineSelection,
}) => {
  const selectionOptions = [
    {
      id: "prescription",
      title:
        lang === "en"
          ? English.OrderviaPrescription
          : Hindi.OrderviaPrescription,
      subtitle:
        lang === "en" ? "Upload prescription" : "प्रिस्क्रिप्शन अपलोड करें",
      description:
        lang === "en"
          ? "Upload your doctor's prescription"
          : "अपने डॉक्टर का प्रिस्क्रिप्शन अपलोड करें",
      icon: "pi pi-file-pdf",
      image: "/prescription-icon.png", // We'll use a prescription document icon
      color: "#667eea",
      bgColor: "#f0f4ff",
    },
    {
      id: "search",
      title:
        lang === "en"
          ? English.Searchandaddmedicines
          : Hindi.Searchandaddmedicines,
      subtitle: lang === "en" ? "Browse medicines" : "दवाएं ब्राउज़ करें",
      description:
        lang === "en"
          ? "Search and add medicines to cart"
          : "दवाएं खोजें और कार्ट में जोड़ें",
      icon: "pi pi-search",
      image: "/searchill.png", // Using existing search image
      color: "#f093fb",
      bgColor: "#fef0ff",
    },
    {
      id: "call",
      title: lang === "en" ? English.Callme : Hindi.Callme,
      subtitle: lang === "en" ? "Expert consultation" : "विशेषज्ञ परामर्श",
      description:
        lang === "en"
          ? "Talk to pharmacy experts"
          : "फार्मेसी विशेषज्ञों से बात करें",
      icon: "pi pi-phone",
      image: "/phone-icon.png", // We'll use a phone icon
      color: "#4facfe",
      bgColor: "#f0f9ff",
    },
  ];

  return (
    <div className={styles.compactSelectionScreen}>
      {/* Compact Header */}
      <div
        style={{
          paddingTop: "0",
        }}
        className={styles.compactHeader}
      >
        <h1 className={styles.compactTitle}>
          {lang === "en"
            ? "How would you like to order?"
            : "आप कैसे ऑर्डर करना चाहते हैं?"}
        </h1>
        {/* <p className={styles.compactSubtitle}>
          {lang === "en"
            ? "Choose the most convenient way to get your medicines"
            : "अपनी दवाएं प्राप्त करने का सबसे सुविधाजनक तरीका चुनें"}
        </p> */}
      </div>

      {/* Compact Selection Cards */}
      <div className={styles.compactCardsGrid}>
        {selectionOptions.map((option) => (
          <div
            key={option.id}
            className={styles.compactCard}
            onClick={() => onSelectOption(option.id)}
          >
            {/* Card Image */}
            <div className={styles.cardImageSection}>
              <div
                className={styles.cardImageContainer}
                style={{ backgroundColor: option.bgColor }}
              >
                {option.id === "prescription" ? (
                  <div className={styles.prescriptionIcon}>
                    <i
                      className="pi pi-file-pdf"
                      style={{ color: option.color, fontSize: "2rem" }}
                    />
                  </div>
                ) : option.id === "search" ? (
                  <img
                    src={option.image}
                    alt="Search"
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.phoneIcon}>
                    <i
                      className="pi pi-phone"
                      style={{ color: option.color, fontSize: "2rem" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className={styles.compactCardContent}>
              <h3 className={styles.compactCardTitle}>{option.title}</h3>
              <p className={styles.compactCardSubtitle}>{option.subtitle}</p>
              <p className={styles.compactCardDescription}>
                {option.description}
              </p>

              {/* Compact Features */}
              <div className={styles.compactFeatures}>
                {option.id === "prescription" && (
                  <>
                    <span className={styles.featureTag}>Fast processing</span>
                    <span className={styles.featureTag}>
                      Expert verification
                    </span>
                  </>
                )}
                {option.id === "search" && (
                  <>
                    <span className={styles.featureTag}>Wide selection</span>
                    <span className={styles.featureTag}>Price comparison</span>
                  </>
                )}
                {option.id === "call" && (
                  <>
                    <span className={styles.featureTag}>
                      Expert consultation
                    </span>
                    <span className={styles.featureTag}>
                      Personalized advice
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Selection Indicator */}
            <div className={styles.selectionIndicator}>
              <i
                className="pi pi-arrow-right"
                style={{ color: option.color }}
              />
            </div>
          </div>
        ))}
        <div className={styles.compactFooter}>
          <div className={styles.footerBadge}>
            <i className="pi pi-check-circle" />
            <span>
              {lang === "en"
                ? "Free delivery on all orders"
                : "सभी ऑर्डर पर मुफ्त डिलीवरी"}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            padding: "10px",
            border: "1px solid #e0e0e0",
            backgroundColor: "#f0f0f0",
            color: "rgba(37, 37, 37, 0.87)",
            borderRadius: "5px",
            fontSize: "14px",
            borderRadius: "5px",
            margin: "10px",
          }}
        >
          <span>Pharmacy - {selectedPharmacy?.buisnessname}</span>
          <span>
            Address -{" "}
            {selectedPharmacy?.city
              ? selectedPharmacy?.city?.charAt(0).toUpperCase() +
                selectedPharmacy?.city?.slice(1)
              : selectedPharmacy?.address?.street?.toUpperCase() +
                selectedPharmacy?.address?.street?.slice(1)}
          </span>
          <span>DL No - {selectedPharmacy?.licenseNo}</span>
        </div>
      </div>

      {/* Compact Footer */}
      <div
        className={styles.compactFooter}
        onClick={() => {
          setShowMedicineSelection(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <div
          style={{
            background: "rgb(3, 171, 180)",
            color: "white",
            border: "1px solid rgb(3, 171, 180)",
            borderRadius: "24px",
            padding: "10px",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.18s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
          // className={styles.footerBadge}
        >
          <i className="pi pi-search" />
          <span>
            {lang === "en" ? "Explore More pharmacies" : "अधिक फार्मेसी खोजें"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Move SearchOrderPage outside the main component
const SearchOrderPage = React.memo(
  ({
    pharmacyId,
    loading,
    medicines,
    cart,
    handleAddToCart,
    handleQuantityChange,
    handleRemoveFromCart,
    lang,
    setCartVisible,
    setSelectionOption,
    setLoading,
    setMedicines,
    setPagination,
    toast,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const searchTimeoutRef = useRef(null);

    const fetchMedicines2 = useCallback(
      async (search = "") => {
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
      },
      [pharmacyId, setLoading, setMedicines, setPagination, toast]
    );

    const handleSearchChange = useCallback(
      (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Clear existing timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debounced API call
        searchTimeoutRef.current = setTimeout(() => {
          fetchMedicines2(value);
        }, 300);
      },
      [fetchMedicines2]
    );

    const handleClearSearch = useCallback(() => {
      setSearchTerm("");
      fetchMedicines2("");
    }, [fetchMedicines2]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, []);

    return (
      <div className={styles.searchOrderPage}>
        {/* Premium Header */}
        <div className={styles.searchHeader}>
          <div className={styles.headerTop}>
            <Button
              icon="pi pi-arrow-left"
              className="p-button-text p-button-rounded"
              onClick={() => setSelectionOption()}
              style={{
                marginRight: "1rem",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--surface-100)",
                border: "1px solid var(--surface-200)",
              }}
            />
            <div className={styles.headerContent}>
              <h1 className={styles.searchPageTitle}>
                {lang == "en"
                  ? English.Searchandaddmedicines
                  : Hindi.Searchandaddmedicines}
              </h1>
              <p className={styles.searchPageSubtitle}>
                {lang == "en"
                  ? "Find and order your medicines easily"
                  : "अपनी दवाएं आसानी से खोजें और ऑर्डर करें"}
              </p>
            </div>
            <div
              className={styles.cartButton}
              onClick={() => setCartVisible(true)}
            >
              <i className="pi pi-shopping-cart"></i>
              {cart.length > 0 && (
                <span className={styles.cartBadge}>{cart.length}</span>
              )}
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className={styles.searchBarContainer}>
            <InputText
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                border: "none",
                borderBottom: "1px solid #00b09b",

                borderRadius: "10px",
                width: "100%",
              }}
              placeholder={
                lang == "en"
                  ? "Search medicines, brands, or symptoms..."
                  : "दवाएं, ब्रांड या लक्षण खोजें..."
              }
            />
            {searchTerm && (
              <Button
                icon="pi pi-times"
                className="p-button-text p-button-rounded"
                onClick={handleClearSearch}
              />
            )}
          </div>
        </div>

        {/* Medicine Results - Now using memoized component */}
        <div className={styles.medicineResults}>
          <MedicineResults
            loading={loading}
            medicines={medicines}
            searchTerm={searchTerm}
            cart={cart}
            handleAddToCart={handleAddToCart}
            handleQuantityChange={handleQuantityChange}
            handleRemoveFromCart={handleRemoveFromCart}
            lang={lang}
          />
        </div>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <div
            className={styles.floatingCartButton}
            onClick={() => setCartVisible(true)}
          >
            <div className={styles.cartIcon}>
              <i className="pi pi-shopping-cart"></i>
              <span className={styles.cartCount}>{cart.length}</span>
            </div>
            <div className={styles.cartInfo}>
              <span className={styles.cartText}>
                {lang == "en" ? "View Cart" : "कार्ट देखें"}
              </span>
              <span className={styles.cartTotal}>
                ₹
                {cart.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchOrderPage.displayName = "SearchOrderPage";

// Move MedicineResults outside as well
const MedicineResults = React.memo(
  ({
    loading,
    medicines,
    searchTerm,
    cart,
    handleAddToCart,
    handleQuantityChange,
    handleRemoveFromCart,
    lang,
  }) => {
    const itemTemplate = (medicine) => {
      const cartItem = cart.find((item) => item._id === medicine._id);
      const isInCart = !!cartItem;

      return (
        <div
          className={styles.ecomCard}
          style={{
            margin: "auto",
          }}
        >
          {/* Product Image */}
          <div className={styles.ecomImageWrapper}>
            <div className={styles.ecomImageBg}>
              {medicine.category?.toLowerCase() === "tablet" ? (
                <img
                  src="/capsule.png"
                  alt="Tablet"
                  className={styles.ecomImage}
                />
              ) : medicine.category?.toLowerCase() === "syrup" ? (
                <img
                  src="/syrup.png"
                  alt="Syrup"
                  className={styles.ecomImage}
                />
              ) : medicine.category?.toLowerCase() === "injection" ? (
                <img
                  src="/injection.png"
                  alt="Injection"
                  className={styles.ecomImage}
                />
              ) : medicine.category?.toLowerCase() === "capsule" ? (
                <img
                  src="/capsule.png"
                  alt="Capsule"
                  className={styles.ecomImage}
                />
              ) : medicine.category?.toLowerCase() === "powder" ? (
                <img
                  src="/powder.png"
                  alt="Powder"
                  className={styles.ecomImage}
                />
              ) : medicine.category?.toLowerCase() === "ointment" ? (
                <img
                  src="/ointment.png"
                  alt="Ointment"
                  className={styles.ecomImage}
                />
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#f0f0f0" />
                  <path d="M12 8V16" stroke="#2ecc71" strokeWidth="2" />
                  <path d="M8 12H16" stroke="#2ecc71" strokeWidth="2" />
                </svg>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.ecomInfo}>
            <div className={styles.ecomTitleRow}>
              <span className={styles.ecomName}>
                {medicine.brandName || medicine.genericName}
              </span>
              <Tag
                value={medicine.category || "Other"}
                style={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  background: "#e0f7fa",
                  color: "#00b09b",
                  fontWeight: 600,
                  marginLeft: "8px",
                  border: "none",
                }}
                severity="info"
              />
            </div>
            <div className={styles.ecomBrandRow}>
              <span className={styles.ecomBrand}>
                Brand: {medicine.genericName}
              </span>
            </div>
            <div className={styles.ecomPriceRow}>
              <span className={styles.ecomPrice}>
                ₹{medicine.price?.toFixed(2) || "N/A"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.ecomActions}>
            {isInCart ? (
              <div className={styles.ecomQtyControls}>
                <Button
                  icon="pi pi-minus"
                  className={styles.ecomQtyBtn}
                  onClick={() =>
                    handleQuantityChange(medicine._id, cartItem.quantity - 1)
                  }
                  disabled={cartItem.quantity <= 1}
                />
                <span className={styles.ecomQty}>{cartItem.quantity}</span>
                <Button
                  icon="pi pi-plus"
                  className={styles.ecomQtyBtn}
                  onClick={() =>
                    handleQuantityChange(medicine._id, cartItem.quantity + 1)
                  }
                />
                <Button
                  icon="pi pi-trash"
                  className={styles.ecomRemoveBtn}
                  onClick={() => handleRemoveFromCart(medicine._id)}
                  tooltip="Remove"
                />
              </div>
            ) : (
              <Button
                label={lang == "en" ? English.AddToCart : Hindi.AddToCart}
                icon="pi pi-shopping-cart"
                className={styles.ecomAddBtn}
                onClick={() => handleAddToCart(medicine)}
              />
            )}
          </div>
        </div>
      );
    };

    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <i className="pi pi-spin pi-spinner"></i>
          </div>
          <p className={styles.loadingText}>
            {lang == "en" ? "Searching medicines..." : "दवाएं खोज रहे हैं..."}
          </p>
        </div>
      );
    }

    if (medicines.length > 0) {
      return (
        <div className={styles.medicineGrid}>{medicines.map(itemTemplate)}</div>
      );
    }

    if (searchTerm) {
      return (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>
            <i className="pi pi-search"></i>
          </div>
          <h3 className={styles.noResultsTitle}>
            {lang == "en" ? "No medicines found" : "कोई दवा नहीं मिली"}
          </h3>
          <p className={styles.noResultsText}>
            {lang == "en"
              ? "Try searching with different keywords or check spelling"
              : "अलग-अलग कीवर्ड से खोजें या स्पेलिंग जांचें"}
          </p>
        </div>
      );
    }

    return (
      <div className={styles.welcomeState}>
        <div className={styles.welcomeIcon}>
          <i className="pi pi-heart"></i>
        </div>
        <h3 className={styles.welcomeTitle}>
          {lang == "en"
            ? "Start searching for medicines"
            : "दवाओं की खोज शुरू करें"}
        </h3>
        <p className={styles.welcomeText}>
          {lang == "en"
            ? "Search for medicines by name, brand, or symptoms to get started"
            : "शुरू करने के लिए नाम, ब्रांड या लक्षणों से दवाएं खोजें"}
        </p>
      </div>
    );
  }
);

MedicineResults.displayName = "MedicineResults";

// Main component
const MedicineSelection = ({
  pharmacyId,
  onMedicinesSelected,
  showProfile = true,
  selectedPharmacy,
  setShowMedicineSelection,
}) => {
  const router = useRouter();
  const toast = useRef(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
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

  // Add new state for order confirmation
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Add a new ref for bottom nav timeout
  const bottomNavTimeout = useRef(null);

  // Add this ref
  const prevCartLength = useRef(0);

  // Add this ref at the top with other refs
  const prevBottomNavState = useRef(false);

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
    if (pharmacyId) {
      fetchMedicines();
    }
  }, [pharmacyId]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchMedicines(value);
    }, 300);
  }, []);

  const handleSearchButtonClick = () => {
    fetchMedicines(searchTerm);
  };

  const handleAddToCart = useCallback(
    (medicine) => {
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
    },
    [cart]
  );

  const handleRemoveFromCart = useCallback(
    (medicineId) => {
      setCart(cart.filter((item) => item._id !== medicineId));
    },
    [cart]
  );

  const handleQuantityChange = useCallback(
    (medicineId, quantity) => {
      if (quantity < 1) {
        handleRemoveFromCart(medicineId);
        return;
      }

      setCart(
        cart.map((item) =>
          item._id === medicineId ? { ...item, quantity } : item
        )
      );
    },
    [cart, handleRemoveFromCart]
  );

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

      // Calculate if any item is missing price

      const subtotal = cart.reduce(
        (sum, item) =>
          typeof item.price === "number" && !isNaN(item.price)
            ? sum + item.price * item.quantity
            : sum,
        0
      );

      const deliveryCharge = 22;
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + deliveryCharge + tax;

      const requestData = {
        pharmacyId,
        orderType:
          selectionOption == "prescription"
            ? "prescription_upload"
            : selectionOption == "call"
            ? "call_required"
            : "medicine_search",
        prescription:
          selectionOption == "prescription"
            ? selectedPrescription
            : selectionOption == "call"
            ? selectedCallPrescription
            : null,
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
        // Set order details and show confirmation
        setOrderDetails({
          orderId: response.data.orderId || response.data._id,
          items: items,
          total: total,
          deliveryAddress: deliveryAddress,
          orderType: requestData.orderType,
        });

        setShowCheckoutDialog(false);
        setShowOrderConfirmation(true);

        // Clear cart after successful order
        setCart([]);
        setSelectionOption();

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
    }
  };

  const checkoutDialogFooter = useMemo(
    () => (
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => setShowCheckoutDialog(false)}
          className="p-button-text"
        />
        <Button
          label="Create Order"
          icon="pi pi-check-circle"
          onClick={handleCheckoutSubmit}
          autoFocus
        />
      </div>
    ),
    [setShowCheckoutDialog, handleCheckoutSubmit]
  );

  const paymentMethods = [
    { label: "Cash on Delivery", value: "cash" },
    { label: "Online Payment", value: "online" },
  ];

  const itemTemplate = (medicine) => {
    const cartItem = cart.find((item) => item._id === medicine._id);
    const isInCart = !!cartItem;

    return (
      <div className={styles.ecomCard}>
        {/* Product Image */}
        <div className={styles.ecomImageWrapper}>
          <div className={styles.ecomImageBg}>
            {medicine.category?.toLowerCase() === "tablet" ? (
              <img
                src="/capsule.png"
                alt="Tablet"
                className={styles.ecomImage}
              />
            ) : medicine.category?.toLowerCase() === "syrup" ? (
              <img src="/syrup.png" alt="Syrup" className={styles.ecomImage} />
            ) : medicine.category?.toLowerCase() === "injection" ? (
              <img
                src="/injection.png"
                alt="Injection"
                className={styles.ecomImage}
              />
            ) : medicine.category?.toLowerCase() === "capsule" ? (
              <img
                src="/capsule.png"
                alt="Capsule"
                className={styles.ecomImage}
              />
            ) : medicine.category?.toLowerCase() === "powder" ? (
              <img
                src="/powder.png"
                alt="Powder"
                className={styles.ecomImage}
              />
            ) : medicine.category?.toLowerCase() === "ointment" ? (
              <img
                src="/ointment.png"
                alt="Ointment"
                className={styles.ecomImage}
              />
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#f0f0f0" />
                <path d="M12 8V16" stroke="#2ecc71" strokeWidth="2" />
                <path d="M8 12H16" stroke="#2ecc71" strokeWidth="2" />
              </svg>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.ecomInfo}>
          <div className={styles.ecomTitleRow}>
            <span className={styles.ecomName}>
              {medicine.brandName || medicine.genericName}
            </span>
            <Tag
              value={medicine.category || "Other"}
              style={{
                fontSize: "12px",
                borderRadius: "8px",
                background: "#e0f7fa",
                color: "#00b09b",
                fontWeight: 600,
                marginLeft: "8px",
                border: "none",
              }}
              severity="info"
            />
          </div>
          <div className={styles.ecomBrandRow}>
            <span className={styles.ecomBrand}>
              Brand: {medicine.genericName}
            </span>
          </div>
          <div className={styles.ecomPriceRow}>
            <span className={styles.ecomPrice}>
              ₹{medicine.price?.toFixed(2) || "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.ecomActions}>
          {isInCart ? (
            <div className={styles.ecomQtyControls}>
              <Button
                icon="pi pi-minus"
                className={styles.ecomQtyBtn}
                onClick={() =>
                  handleQuantityChange(medicine._id, cartItem.quantity - 1)
                }
                disabled={cartItem.quantity <= 1}
              />
              <span className={styles.ecomQty}>{cartItem.quantity}</span>
              <Button
                icon="pi pi-plus"
                className={styles.ecomQtyBtn}
                onClick={() =>
                  handleQuantityChange(medicine._id, cartItem.quantity + 1)
                }
              />
              <Button
                icon="pi pi-trash"
                className={styles.ecomRemoveBtn}
                onClick={() => handleRemoveFromCart(medicine._id)}
                tooltip="Remove"
              />
            </div>
          ) : (
            <Button
              label={lang == "en" ? English.AddToCart : Hindi.AddToCart}
              icon="pi pi-shopping-cart"
              className={styles.ecomAddBtn}
              onClick={() => handleAddToCart(medicine)}
            />
          )}
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
  const prescriptionDialogFooter = useMemo(
    () => (
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
    ),
    [
      setSelectionOption,
      setShowPrescriptionDialog,
      handlePrescriptionOrderSubmit,
      selectedPrescription,
      selectedAddress,
    ]
  );

  // Open call dialog when radio selected
  useEffect(() => {
    if (selectionOption === "call") {
      setShowCallDialog(true);
    }
  }, [selectionOption]);

  const [orderLoading, setOrderLoading] = useState(false);
  const handleCallOrderSubmit = async () => {
    try {
      setOrderLoading(true);
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
        // Set order details and show confirmation
        setOrderDetails({
          orderId: response.data.orderId || response.data._id,
          items: [],
          total: 0,
          deliveryAddress: deliveryAddress,
          orderType: "call_required",
        });

        setShowCallDialog(false);
        setShowOrderConfirmation(true);

        // Clear form data
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
        setSelectionOption();

        toast.current?.show({
          severity: "success",
          summary: "Request Created",
          detail: "Your call request has been created!",
          life: 3000,
        });
        setOrderLoading(false);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create call request",
        life: 3000,
      });
      setOrderLoading(false);
    } finally {
      setOrderLoading(false);
    }
  };

  // Add back the handlePrescriptionOrderSubmit function
  const handlePrescriptionOrderSubmit = async () => {
    if (!selectedPrescription) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a prescription",
        life: 3000,
      });
      return;
    }
    try {
      setOrderLoading(true);
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
        // Set order details and show confirmation
        setOrderDetails({
          orderId: response.data.orderId || response.data._id,
          items: [],
          total: 0,
          deliveryAddress: deliveryAddress,
          orderType: "prescription_upload",
        });

        setShowPrescriptionDialog(false);
        setShowOrderConfirmation(true);

        // Clear form data
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
        setSelectionOption();

        toast.current?.show({
          severity: "success",
          summary: "Order Created",
          detail: "Your prescription order has been created!",
          life: 3000,
        });
        setOrderLoading(false);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create order",
        life: 3000,
      });
      setOrderLoading(false);
    } finally {
      setOrderLoading(false);
    }
  };
  const { lang, sethidebottomnav2, hidebottomnav2 } =
    useContext(AccountContext);

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
    sethidebottomnav2(true);
    return () => {
      sethidebottomnav2(false);
    };
  }, []);
  const [showcartbottomnav, setshowcartbottomnav] = useState(false);
  useEffect(() => {
    const currentCartLength = cart.length;
    const shouldHideBottomNav = currentCartLength > 0;

    // Only update if cart length actually changed AND bottom nav state needs to change
    if (prevCartLength.current !== currentCartLength) {
      if (shouldHideBottomNav !== prevBottomNavState.current) {
        setshowcartbottomnav(shouldHideBottomNav);
        prevBottomNavState.current = shouldHideBottomNav;
      }
      prevCartLength.current = currentCartLength;
    }

    // Set mobile state only once
    if (typeof window !== "undefined" && !isMobile) {
      setIsMobile(window.innerWidth < 768);
    }
  }, [cart.length]);

  // Add this useEffect for cleanup
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectionOption) {
      window.history.pushState({ selectionOption }, "");
    }

    const onPopState = (event) => {
      if (selectionOption) {
        setSelectionOption(null);
      } else {
        router.back();
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [selectionOption, router]);

  // Custom selection cards component
  const SelectionCards = () => {
    const cards = [
      {
        id: "prescription",
        title:
          lang == "en"
            ? English.OrderviaPrescription
            : Hindi.OrderviaPrescription,
        subtitle:
          lang == "en"
            ? "Upload your prescription"
            : "अपना प्रिस्क्रिप्शन अपलोड करें",
        description:
          lang == "en"
            ? "Simply upload your doctor's prescription and we'll deliver your medicines right to your doorstep"
            : "बस अपने डॉक्टर का प्रिस्क्रिप्शन अपलोड करें और हम आपकी दवाएं आपके घर तक पहुंचा देंगे",
        icon: "pi pi-file-pdf",
        gradient: "linear-gradient(135deg, #4c63d2 0%, #5a3d8a 100%)",
        iconBg: "rgba(76, 99, 210, 0.15)",
        iconColor: "#4c63d2",
        features: [
          lang == "en" ? "Fast processing" : "तेज प्रोसेसिंग",
          lang == "en" ? "Expert verification" : "विशेषज्ञ सत्यापन",
          lang == "en" ? "Same day delivery" : "स्वयं दिन डिलीवरी",
        ],
      },
      {
        id: "search",
        title:
          lang == "en"
            ? English.Searchandaddmedicines
            : Hindi.Searchandaddmedicines,
        subtitle:
          lang == "en"
            ? "Browse and select medicines"
            : "दवाओं को ब्राउज़ करें और चुनें",
        description:
          lang == "en"
            ? "Search through our extensive medicine catalog and add items to your cart for easy ordering"
            : "हमारे विस्तृत दवा कैटलॉग में खोजें और आसान ऑर्डरिंग के लिए आइटम को अपनी कार्ट में जोड़ें",
        icon: "pi pi-search",
        gradient: "linear-gradient(135deg, #d63384 0%, #dc3545 100%)",
        iconBg: "rgba(214, 51, 132, 0.15)",
        iconColor: "#d63384",
        features: [
          lang == "en" ? "Wide selection" : "विस्तृत चयन",
          lang == "en" ? "Price comparison" : "मूल्य तुलना",
          lang == "en" ? "Stock availability" : "स्टॉक उपलब्धता",
        ],
      },
      {
        id: "call",
        title: lang == "en" ? English.Callme : Hindi.Callme,
        subtitle:
          lang == "en"
            ? "Get expert consultation"
            : "विशेषज्ञ परामर्श प्राप्त करें",
        description:
          lang == "en"
            ? "Speak directly with our pharmacy experts for personalized medicine recommendations and guidance"
            : "व्यक्तिगत दवा सिफारिशों और मार्गदर्शन के लिए हमारे फार्मेसी विशेषज्ञों से सीधे बात करें",
        icon: "pi pi-phone",
        gradient: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
        iconBg: "rgba(13, 110, 253, 0.15)",
        iconColor: "#0d6efd",
        features: [
          lang == "en" ? "Expert consultation" : "विशेषज्ञ परामर्श",
          lang == "en" ? "Personalized advice" : "व्यक्तिगत सलाह",
          lang == "en" ? "Flexible timing" : "लचीला समय",
        ],
      },
    ];

    return (
      <div className={styles.selectionCardsContainer}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={styles.selectionCard}
            onClick={() => {
              setSelectionOption(card.id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              background: card.gradient,
              cursor: "pointer",
              transform:
                selectionOption === card.id ? "scale(1.02)" : "scale(1)",
              boxShadow:
                selectionOption === card.id
                  ? "0 20px 40px rgba(0,0,0,0.25)"
                  : "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <div className={styles.cardHeader}>
              <div
                className={styles.cardIcon}
                style={{
                  backgroundColor: card.iconBg,
                  color: card.iconColor,
                }}
              >
                <i className={card.icon}></i>
              </div>
              <div className={styles.cardBadge}>
                {selectionOption === card.id && (
                  <i
                    className="pi pi-check-circle"
                    style={{ color: "white" }}
                  ></i>
                )}
              </div>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.cardAction}>
                <span>{lang == "en" ? "Select Option" : "विकल्प चुनें"}</span>
                <i className="pi pi-arrow-right"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Premium Prescription Order Page
  const PrescriptionOrderPage = ({
    lang,
    English,
    Hindi,
    selectionOption,
    setSelectionOption,
    selectedPrescription,
    setSelectedPrescription,
    toast,
    selectedAddress,
    setSelectedAddress,
    prescriptionForm,
    setPrescriptionForm,
    handlePrescriptionOrderSubmit,
    handleCallOrderSubmit,
    setCartVisible,
    handleProceed,
  }) => (
    <div className={styles.premiumPageClean}>
      <div className={styles.pageHeaderClean}>
        <Button
          icon="pi pi-arrow-left"
          className="p-button-text p-button-rounded"
          onClick={() => setSelectionOption()}
          style={{
            marginRight: "1rem",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--surface-100)",
            border: "1px solid var(--surface-200)",
          }}
        />
        <div className={styles.headerContentClean}>
          <h1 className={styles.pageTitleClean}>
            {lang == "en"
              ? English.OrderviaPrescription
              : Hindi.OrderviaPrescription}
          </h1>
          <p className={styles.pageSubtitleClean}>
            {lang == "en"
              ? "Upload your prescription and we'll take care of the rest"
              : "अपना प्रिस्क्रिप्शन अपलोड करें और हम बाकी का ध्यान रखेंगे"}
          </p>
        </div>
      </div>

      <div className={styles.pageContentClean}>
        <div className={styles.sectionClean}>
          <div className={styles.sectionHeaderClean}>
            <div className={styles.sectionIconClean}>
              <i className="pi pi-file-pdf"></i>
            </div>
            <div>
              <h2 className={styles.sectionTitleClean}>
                {lang == "en"
                  ? "Upload Prescription"
                  : "प्रिस्क्रिप्शन अपलोड करें"}
              </h2>
              <p className={styles.sectionDescriptionClean}>
                {lang == "en"
                  ? "Upload a clear image or PDF of your doctor's prescription"
                  : "अपने डॉक्टर के प्रिस्क्रिप्शन की स्पष्ट छवि या PDF अपलोड करें"}
              </p>
            </div>
          </div>

          <div className={styles.uploadSectionClean}>
            <PrescriptionSelector
              value={selectedPrescription}
              onChange={(file) => {
                setSelectedPrescription(file);
                console.log(file, "filedata2");
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
        </div>

        <div className={styles.sectionClean}>
          <div className={styles.sectionHeaderClean}>
            <div className={styles.sectionIconClean}>
              <i className="pi pi-map-marker"></i>
            </div>
            <div>
              <h2 className={styles.sectionTitleClean}>
                {lang == "en" ? "Delivery Address" : "डिलीवरी पता"}
              </h2>
              <p className={styles.sectionDescriptionClean}>
                {lang == "en"
                  ? "Where should we deliver your medicines?"
                  : "हम आपकी दवाएं कहां पहुंचाएं?"}
              </p>
            </div>
          </div>

          <div className={styles.addressSectionClean}>
            <AddressSelector
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </div>
        </div>

        <div className={styles.sectionClean}>
          <div className={styles.sectionHeaderClean}>
            <div className={styles.sectionIconClean}>
              <i className="pi pi-comment"></i>
            </div>
            <div>
              <h2 className={styles.sectionTitleClean}>
                {lang == "en" ? "Additional Notes" : "अतिरिक्त नोट्स"}
              </h2>
              <p className={styles.sectionDescriptionClean}>
                {lang == "en"
                  ? "Any special instructions or preferences?"
                  : "कोई विशेष निर्देश या प्राथमिकताएं?"}
              </p>
            </div>
          </div>

          <div className={styles.notesSectionClean}>
            <InputText
              // value={prescriptionForm.notes}

              onMouseOut={(e) => {
                setPrescriptionForm({
                  ...prescriptionForm,
                  notes: e.target.value,
                });
              }}
              placeholder={
                prescriptionForm.notes != ""
                  ? prescriptionForm.notes
                  : "Enter any additional notes or instructions..."
              }
              className={styles.notesInputClean}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          bottom: "0",
          width: "100%",
          background: "white",
          padding: "10px",
          borderTop: "1px solid #e0e0e0",
          zIndex: "1000",
        }}
      >
        <Button
          label={lang == "en" ? "Place Order" : "ऑर्डर करें"}
          icon="pi pi-check-circle"
          onClick={() => {
            if (selectionOption === "prescription") {
              handlePrescriptionOrderSubmit();
            } else if (selectionOption === "call") {
              handleCallOrderSubmit();
            } else {
              setCartVisible(false);
              handleProceed();
            }
          }}
          style={{
            width: "15rem",
          }}
          loading={orderLoading}
          className={styles.submitButtonClean}
        />
      </div>
    </div>
  );

  // Premium Call Request Page
  const CallRequestPage = () => (
    <div className={styles.premiumPageClean}>
      <div className={styles.pageHeaderClean}>
        <Button
          icon="pi pi-arrow-left"
          className="p-button-text p-button-rounded"
          onClick={() => setSelectionOption()}
          style={{
            marginRight: "1rem",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--surface-100)",
            border: "1px solid var(--surface-200)",
          }}
        />
        <div className={styles.headerContentClean}>
          <h1 className={styles.pageTitleClean}>
            {lang == "en" ? English.Callme : Hindi.Callme}
          </h1>
          <p className={styles.pageSubtitleClean}>
            {lang == "en"
              ? "Get expert consultation and personalized medicine recommendations"
              : "विशेषज्ञ परामर्श और व्यक्तिगत दवा सिफारिशें प्राप्त करें"}
          </p>
        </div>
      </div>

      <div className={styles.pageContentClean}>
        <div className={styles.sectionClean}>
          <div className={styles.sectionHeaderClean}>
            <div className={styles.sectionIconClean}>
              <i className="pi pi-file-pdf"></i>
            </div>
            <div>
              <h2 className={styles.sectionTitleClean}>
                {lang == "en"
                  ? "Prescription (Optional)"
                  : "प्रिस्क्रिप्शन (वैकल्पिक)"}
              </h2>
              <p className={styles.sectionDescriptionClean}>
                {lang == "en"
                  ? "Upload your prescription if you have one for better consultation"
                  : "बेहतर परामर्श के लिए यदि आपके पास है तो अपना प्रिस्क्रिप्शन अपलोड करें"}
              </p>
            </div>
          </div>

          <div className={styles.uploadSectionClean}>
            <PrescriptionSelector
              value={selectedCallPrescription}
              onChange={(file) => {
                setSelectedCallPrescription(file);
                console.log(file, "filedata");
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
        </div>

        <div className={styles.sectionClean}>
          <div className={styles.sectionHeaderClean}>
            <div className={styles.sectionIconClean}>
              <i className="pi pi-map-marker"></i>
            </div>
            <div>
              <h2 className={styles.sectionTitleClean}>
                {lang == "en" ? "Contact Information" : "संपर्क जानकारी"}
              </h2>
              <p className={styles.sectionDescriptionClean}>
                {lang == "en"
                  ? "Where can we reach you for consultation?"
                  : "हम आपसे परामर्श के लिए कहां संपर्क कर सकते हैं?"}
              </p>
            </div>
          </div>

          <div className={styles.addressSectionClean}>
            <AddressSelector
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </div>
        </div>
      </div>

      <div className={styles.pageFooterClean}>
        <Button
          label={lang == "en" ? "Request Call" : "कॉल का अनुरोध करें"}
          icon="pi pi-phone"
          onClick={handleCallOrderSubmit}
          disabled={!selectedAddress?.phone || !selectedAddress?.street}
          className={styles.submitButtonClean}
        />
      </div>
    </div>
  );

  const handleSelectionOption = (option) => {
    setSelectionOption(option);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToSelection = () => {
    setSelectionOption(null);
    setCart([]);
    setSelectedPrescription(null);
    setSelectedCallPrescription(null);
    setSelectedAddress(null);
  };
  const hasMissingPrice = cart.some(
    (item) => typeof item.price !== "number" || isNaN(item.price)
  );

  return (
    <div className={styles.container}>
      <Toast ref={toast} />

      {showOrderConfirmation ? (
        <OrderConfirmation
          lang={lang}
          soundType="default"
          orderDetails={orderDetails}
          onClose={() => {
            setShowOrderConfirmation(false);
            setOrderDetails(null);
            router.push("/medical/requests");
          }}
        />
      ) : (
        <>
          {showProfile && (
            <div className={styles.profileSection}>{/* Profile content */}</div>
          )}

          <div className={styles.medicineSelectionSection}>
            {!selectionOption ? (
              <SelectionScreen
                onSelectOption={handleSelectionOption}
                lang={lang}
                selectedPharmacy={selectedPharmacy}
                setShowMedicineSelection={setShowMedicineSelection}
              />
            ) : selectionOption === "prescription" ? (
              <PrescriptionOrderPage
                lang={lang}
                English={English}
                Hindi={Hindi}
                selectionOption={selectionOption}
                setSelectionOption={setSelectionOption}
                selectedPrescription={selectedPrescription}
                setSelectedPrescription={setSelectedPrescription}
                toast={toast}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                prescriptionForm={prescriptionForm}
                setPrescriptionForm={setPrescriptionForm}
                handlePrescriptionOrderSubmit={handlePrescriptionOrderSubmit}
                handleCallOrderSubmit={handleCallOrderSubmit}
                setCartVisible={setCartVisible}
                handleProceed={handleProceed}
              />
            ) : selectionOption === "call" ? (
              <CallRequestPage />
            ) : (
              <SearchOrderPage
                pharmacyId={pharmacyId}
                loading={loading}
                medicines={medicines}
                cart={cart}
                handleAddToCart={handleAddToCart}
                handleQuantityChange={handleQuantityChange}
                handleRemoveFromCart={handleRemoveFromCart}
                lang={lang}
                setCartVisible={setCartVisible}
                setSelectionOption={handleBackToSelection}
                setLoading={setLoading}
                setMedicines={setMedicines}
                setPagination={setPagination}
                toast={toast}
              />
            )}
          </div>

          {/* Enhanced Cart Sidebar */}
          <Sidebar
            visible={cartVisible}
            position="right"
            onHide={() => setCartVisible(false)}
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "linear-gradient(135deg, #f8fafc 0%, #e0f7fa 100%)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
              borderTopLeftRadius: "24px",
              borderBottomLeftRadius: "24px",
              padding: 0,
            }}
            className={styles.premiumCartSidebar}
          >
            {/* Themed Header */}
            <div
              style={{
                background: "linear-gradient(90deg, #00b09b 0%, #117768 100%)",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                padding: "1.2rem 1.5rem 1rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(17,119,104,0.10)",
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "#fff",
                  margin: 0,
                  letterSpacing: "0.5px",
                }}
              >
                {lang == "en" ? "Shopping Cart" : "शॉपिंग कार्ट"}
              </h2>
              <Button
                icon="pi pi-times"
                className="p-button-text p-button-rounded"
                onClick={() => setCartVisible(false)}
                style={{
                  color: "#fff",
                  background: "transparent",
                  fontSize: "1.3rem",
                }}
              />
            </div>

            {/* Cart Content */}
            {cart.length === 0 ? (
              <div
                style={{
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  color: "#888",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    color: "#b2dfdb",
                    marginBottom: "1rem",
                  }}
                >
                  <i className="pi pi-shopping-cart"></i>
                </div>
                <h3
                  style={{
                    fontWeight: 600,
                    color: "#117768",
                    marginBottom: "0.5rem",
                  }}
                >
                  {lang == "en" ? "Your cart is empty" : "आपकी कार्ट खाली है"}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "1rem",
                  }}
                >
                  {lang == "en"
                    ? "Add some medicines to get started"
                    : "शुरू करने के लिए कुछ दवाएं जोड़ें"}
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    maxHeight: "55vh",
                    overflowY: "auto",
                    padding: "1rem 1.5rem 0 1.5rem",
                  }}
                >
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "16px",
                        boxShadow: "0 2px 12px rgba(17,119,104,0.08)",
                        marginBottom: "1.2rem",
                        padding: "1.1rem 1rem 0.7rem 1rem",
                        border: "1px solid #e0f2f1",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.7rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: "12px",
                            background: "#e0f2f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={
                              item.category?.toLowerCase() === "tablet"
                                ? "/capsule.png"
                                : item.category?.toLowerCase() === "syrup"
                                ? "/syrup.png"
                                : item.category?.toLowerCase() === "injection"
                                ? "/injection.png"
                                : "/capsule.png"
                            }
                            alt={item.brandName}
                            style={{
                              width: 38,
                              height: 38,
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "1.08rem",
                              color: "#117768",
                              marginBottom: 2,
                              whiteSpace: "normal", // show full name
                              overflow: "visible",
                            }}
                          >
                            {item.brandName || item.genericName}
                          </div>
                          <div
                            style={{
                              fontSize: "0.97rem",
                              color: "#666",
                              marginBottom: 2,
                            }}
                          >
                            {item.genericName}
                          </div>
                          <div
                            style={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            {typeof item.price === "number" &&
                            !isNaN(item.price) ? (
                              <span style={{ color: "#009688" }}>
                                ₹{item.price.toFixed(2)}
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  background: "#e0f7fa",
                                  color: "#117768",
                                  fontSize: "0.92rem",
                                  borderRadius: "16px",
                                  padding: "2px 10px 2px 8px",
                                  fontWeight: 600,
                                  letterSpacing: "0.2px",
                                  whiteSpace: "nowrap",
                                  border: "1px solid #b2dfdb",
                                  marginLeft: "-2px",
                                }}
                                title="Price will be calculated after request confirmation"
                              >
                                <i
                                  className="pi pi-info-circle"
                                  style={{
                                    fontSize: "1rem",
                                    marginRight: "5px",
                                    color: "#00b09b",
                                  }}
                                />
                                Price: -
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Second row: quantity controls and delete */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "0.2rem",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#e0f2f1",
                            borderRadius: "8px",
                            padding: "2px 10px",
                            gap: "0.3rem",
                          }}
                        >
                          <Button
                            icon="pi pi-minus"
                            className="p-button-rounded p-button-text"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            style={{
                              color: "#117768",
                              fontWeight: 700,
                            }}
                          />
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#117768",
                              minWidth: 22,
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            icon="pi pi-plus"
                            className="p-button-rounded p-button-text"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            style={{
                              color: "#117768",
                              fontWeight: 700,
                            }}
                          />
                        </div>
                        <Button
                          icon="pi pi-trash"
                          className="p-button-rounded p-button-danger p-button-text"
                          onClick={() => handleRemoveFromCart(item._id)}
                          style={{
                            color: "#e57373",
                            background: "transparent",
                            fontSize: "1.1rem",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div
                  style={{
                    padding: "1.2rem 1.5rem 0.5rem 1.5rem",
                    borderTop: "1px solid #e0e0e0",
                    background: "rgba(255,255,255,0.95)",
                    borderBottomLeftRadius: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      color: "#117768",
                      marginBottom: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <span>Subtotal</span>
                    {hasMissingPrice ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background: "#e0f7fa",
                          color: "#117768",
                          fontSize: "0.92rem",
                          borderRadius: "16px",
                          padding: "2px 10px 2px 8px",
                          fontWeight: 600,
                          letterSpacing: "0.2px",
                          whiteSpace: "nowrap",
                          border: "1px solid #b2dfdb",
                        }}
                        title="Subtotal will be calculated after request confirmation"
                      >
                        <i
                          className="pi pi-info-circle"
                          style={{
                            fontSize: "1rem",
                            marginRight: "5px",
                            color: "#00b09b",
                          }}
                        />
                        -
                      </span>
                    ) : (
                      <span>₹{subtotal.toFixed(2)}</span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: "#888",
                      marginBottom: "0.7rem",
                      fontStyle: "italic",
                      textAlign: "center",
                      background: "#f0f4f8",
                      borderRadius: "8px",
                      padding: "6px 10px",
                      marginTop: "0.2rem",
                    }}
                  >
                    <i
                      className="pi pi-info-circle"
                      style={{ color: "#00b09b", marginRight: "5px" }}
                    />
                    Some prices are unavailable. You can still proceed—final
                    total will be shared in your invoice after request
                    confirmation.
                  </div>
                  <div
                    style={{
                      height: 1,
                      background:
                        "linear-gradient(90deg, #00b09b 0%, #117768 100%)",
                      opacity: 0.2,
                      margin: "0.5rem 0 1rem 0",
                      borderRadius: 2,
                    }}
                  />
                  <Button
                    label={lang == "en" ? "Proceed to Checkout" : "चेकआउट करें"}
                    icon="pi pi-shopping-bag"
                    onClick={() => {
                      setCartVisible(false);
                      handleProceed();
                    }}
                    className={styles.checkoutButton}
                    style={{
                      width: "100%",
                      background:
                        "linear-gradient(90deg, #00b09b 0%,rgb(12, 190, 163) 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      border: "none",
                      borderRadius: "10px",
                      boxShadow: "0 2px 8px rgba(17,119,104,0.10)",
                      padding: "1rem",
                      margin: "auto",
                      marginTop: "0.5rem",
                      transition: "background 0.2s",
                    }}
                  />
                </div>
              </>
            )}
          </Sidebar>

          <div
            style={{
              display: showcartbottomnav ? "flex" : "none",
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
          <Dialog
            header={
              lang == "en" ? English.CheckoutDetails : Hindi.CheckoutDetails
            }
            visible={showCheckoutDialog}
            style={{ width: isMobile ? "100vw" : "50vw" }}
            footer={
              selectionOption == "prescription"
                ? prescriptionDialogFooter
                : selectionOption == "call"
                ? checkoutDialogFooter
                : checkoutDialogFooter
            }
            onHide={() => setShowCheckoutDialog(false)}
          >
            <AddressSelector
              setSelectedAddress={setSelectedAddress}
              selectedAddress={selectedAddress}
            />
            <div className={styles.checkoutForm}>
              <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                <label htmlFor="paymentMethod">Payment Method</label>
                {/* <Dropdown
                    id="paymentMethod"
                    value={checkoutForm.paymentMethod}
                    options={paymentMethods}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        paymentMethod: e.value,
                      })
                    }
                    placeholder={
                      lang == "en"
                        ? English.SelectPaymentMethod
                        : Hindi.SelectPaymentMethod
                    }
                  /> */}
                <div
                  style={{
                    background: "#f0f4f8",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    marginTop: "0.2rem",
                    width: "100%",
                  }}
                >
                  {" "}
                  <i
                    className="pi pi-info-circle"
                    style={{ color: "#00b09b", marginRight: "5px" }}
                  />{" "}
                  Cash On Delivery
                </div>
              </div>

              <div
                style={{ marginTop: "-1rem" }}
                className={styles.formSection}
              >
                <h3>Additional Information</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="notes">Notes</label>
                  <InputText
                    id="notes"
                    value={checkoutForm.notes}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
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
          </Dialog>
        </>
      )}
    </div>
  );
};

export default MedicineSelection;
