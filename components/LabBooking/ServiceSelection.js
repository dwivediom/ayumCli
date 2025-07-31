import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import axios from "axios";
import styles from "./styles.module.css";
import BottomNav from "../BottomNav";
import {
  labTestApi,
  getAuthHeaders,
  handleApiError,
  labBookingApi,
} from "../../config/api/labApi";
import { AccountContext } from "../../context/AccountProvider";
import CheckoutFromPrescription from "./CheckoutFromPrescription";
import { useRouter } from "next/router";

const ServiceSelection = ({
  onTestsSelected,
  selectedTests,
  setSelectedTests,
  onBookingComplete,
}) => {
  const toast = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [city, setCity] = useState("Rewa");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageno, setPageno] = useState(1);
  const [lang, setLang] = useState("en");
  const [showcheckout, setShowcheckout] = useState(false);
  const [showTestDetails, setShowTestDetails] = useState(false);
  const [selectedTestForDetails, setSelectedTestForDetails] = useState(null);

  // Infinite scroll refs
  const observerRef = useRef();
  const loadingRef = useRef();

  // Predefined categories with icons
  const predefinedCategories = [
    { id: "all", name: "All", icon: "/labicons/all.png", icontype: "png" },
    {
      id: "full body",
      name: "Full Body Checkup",
      icontype: "svg",
      icon: "/fullbody.svg",
    },
    {
      id: "cbc",
      name: "Blood",
      icon: "/labicons/blood.png",
      icontype: "png",
    },
    {
      id: "urine",
      name: "Urine",
      icon: "/labicons/urine.png",
      icontype: "png",
    },
    {
      id: "Gynac",
      name: "Gynae",
      icon: "/labicons/gynae.png",
      icontype: "png",
    },
    {
      id: "thyroid",
      name: "Thyroid",
      icon: "/labicons/thyroid.png",
      icontype: "png",
    },
    {
      id: "liver",
      name: "Liver (LFT)",
      icon: "/labicons/liver.png",
      icontype: "png",
    },
    {
      id: "lipid",
      name: "Lipid Profile",
      icon: "/labicons/lipidprofile.png",
      icontype: "png",
    },
  ];

  // Filter options
  const filterOptions = [];

  useEffect(() => {
    fetchCategories();
    fetchAllTests(true); // Reset tests when component mounts
  }, []);

  // Reset tests when category, search, or city changes
  useEffect(() => {
    setPageno(1);
    setTests([]);
    setHasMore(true);
    fetchAllTests(true);
  }, [selectedCategory, searchText, city]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log("Fetching categories...");

      const response = await axios.get(labTestApi.getTestCategories(), {
        headers: getAuthHeaders(),
      });

      console.log("Categories response:", response.data);

      if (response.data && !response.data.error) {
        setCategories(response.data.data || []);
      } else {
        setCategories([]);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.data.message || "Failed to fetch test categories",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching test categories:", error);
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorResult.message || "Failed to fetch test categories",
        life: 3000,
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTests = async (reset = false) => {
    try {
      console.log("Fetching tests with params:", {
        reset,
        searchText,
        selectedCategory,
        city,
        pageno: reset ? 1 : pageno,
      });

      if (reset) {
        setLoading(true);
        setPageno(1);
      } else {
        setLoadingMore(true);
      }

      const currentPage = reset ? 1 : pageno;

      // Build query parameters
      const params = new URLSearchParams({
        city: city,
        page: currentPage.toString(),
        limit: "10",
      });

      // Add search text if present
      if (searchText.trim()) {
        params.append("searchText", searchText.trim());
      }

      // Add category if not "all"
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const url = `${labTestApi.getAllOfferedTests()}?${params.toString()}`;
      console.log("API URL:", url);

      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });

      console.log("Tests response:", response.data);

      if (response.data && !response.data.error) {
        const newTests = response.data.data || [];

        // FIXED: Always reset tests when reset=true, or when there's a search/category filter
        if (reset || searchText.trim() !== "" || selectedCategory !== "all") {
          console.log("Resetting tests with new data:", newTests.length);
          setTests(newTests);
        } else {
          console.log("Appending tests to existing list:", newTests.length);
          setTests((prevTests) => [...prevTests, ...newTests]);
        }

        // Check if there are more tests to load
        setHasMore(newTests.length === 10);

        if (!reset) {
          setPageno((prev) => prev + 1);
        }
      } else {
        if (reset) {
          setTests([]);
        }
        setHasMore(false);

        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.data.message || "Failed to fetch tests",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      if (reset) {
        setTests([]);
      }
      setHasMore(false);

      const errorResult = handleApiError(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          errorResult.message || "Failed to fetch tests. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Infinite scroll callback
  const lastTestElementRef = useCallback(
    (node) => {
      if (loadingMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Loading more tests...");
          fetchAllTests(false);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  const handleCategorySelect = (categoryId) => {
    console.log("Category selected:", categoryId);
    setSelectedCategory(categoryId);
  };

  const handleSearch = () => {
    console.log("Search triggered with text:", searchText);
    // Search is handled by useEffect when searchText changes
  };

  const handleTestSelection = (test) => {
    const isSelected = selectedTests.some((t) => t._id === test._id);

    if (isSelected) {
      const updatedTests = selectedTests.filter((t) => t._id !== test._id);
      setSelectedTests(updatedTests);
      localStorage.setItem("selectedTests", JSON.stringify(updatedTests));
      console.log("Test removed:", test.name);
    } else {
      const updatedTests = [...selectedTests, test];
      setSelectedTests(updatedTests);
      localStorage.setItem("selectedTests", JSON.stringify(updatedTests));
      console.log("Test added:", test.name);
    }
  };

  const handleProceed = () => {
    if (selectedTests.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select at least one test",
        life: 3000,
      });
      return;
    }

    console.log("Proceeding with tests:", selectedTests);
    onTestsSelected(selectedTests, city);
  };

  const handleShowTestDetails = (test) => {
    setSelectedTestForDetails(test);
    setShowTestDetails(true);
  };

  const handleCloseTestDetails = () => {
    setShowTestDetails(false);
    setSelectedTestForDetails(null);
  };

  const router = useRouter();

  const handleConfirm = async (prescription, address) => {
    try {
      console.log("Creating booking with:", { prescription, address });

      const labId = "6877707ce00e458e6207dbb6";
      const bookingDetails = {
        prescription: prescription,
        patientDetails: {
          name: address.name || "",
          phone: address.phone || "",
          email: address.email || "",
        },
        orderbyprescription: true,
        address: address,
        city: city,
        tests: selectedTests,
        labId: labId,
      };

      console.log("Booking details:", bookingDetails);

      const response = await axios.post(
        labBookingApi.createBooking(),
        bookingDetails,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Booking response:", response.data);

      if (response.data && !response.data.error) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Booking created successfully",
        });

        if (onBookingComplete) {
          onBookingComplete(bookingDetails, true);
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.data.message || "Failed to create booking",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorResult.message || "Failed to create booking",
        life: 3000,
      });
    }
  };

  const { hidebottomnav2, sethidebottomnav2 } = useContext(AccountContext);
  useEffect(() => {
    sethidebottomnav2(true);
  }, []);

  const getTestIcon = (testName) => {
    const name = testName?.toLowerCase();
    if (name?.includes("cbc") || name?.includes("blood"))
      return "/labicons/blood.png";
    if (name?.includes("urine")) return "/labicons/urine.png";
    if (name?.includes("package")) return "/labicons/all.png";
    if (name?.includes("dengue") || name?.includes("fever"))
      return "/labicons/blood.png";
    return "/labicons/blood.png";
  };

  const getTestDetails = (test) => {
    const name = test?.name?.toLowerCase();
    if (name?.includes("cbc")) {
      return { testCount: 21, reportTime: "18 hours" };
    } else if (name?.includes("urine")) {
      return { testCount: 19, reportTime: "18 hours" };
    } else if (name?.includes("dengue")) {
      return { testCount: 1, reportTime: "18 hours" };
    } else if (name?.includes("fever package")) {
      return { testCount: 49, reportTime: "18 hours", isPackage: true };
    }
    return { testCount: 1, reportTime: "18 hours" };
  };

  const getOriginalPrice = (currentPrice) => {
    const price = parseInt(currentPrice) || 300;
    const discount = Math.floor(price * 0.1);
    return price + discount;
  };

  const itemTemplate = (test, index) => {
    const isSelected = selectedTests.some((t) => t._id === test._id);
    const bestLab = test.labs && test.labs.length > 0 ? test.labs[0] : null;
    const testDetails = getTestDetails(test);
    const originalPrice = getOriginalPrice(bestLab?.price);
    const discount = Math.round(
      ((originalPrice - bestLab?.price) / originalPrice) * 100
    );

    const isLastElement = index === tests.length - 1;
    const cardRef = isLastElement ? lastTestElementRef : null;

    return (
      <div ref={cardRef} className={styles.newTestCard} key={test._id}>
        {/* Icon and Test Name */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <img
            src={getTestIcon(test.name)}
            alt={test.name}
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
              boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              padding: "5px",
              backgroundColor: "#fff",
            }}
          />

          <h3
            style={{
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {test.name.charAt(0).toUpperCase() + test.name.slice(1)}
            <span
              style={{
                marginLeft: "0.5rem",
                padding: "0.15rem 0.6rem",
                borderRadius: "1rem",
                background: test.type === "package" ? "#ffe082" : "#b3e5fc",
                color: "#333",
                fontWeight: 600,
                fontSize: "0.75rem",
                border: "1px solid #ccc",
                textTransform: "capitalize",
              }}
            >
              {test.type}
            </span>
          </h3>
        </div>

        {/* Test Details */}
        <div className={styles.testDetails}>
          <div
            className={styles.testDetailRow}
            onClick={() => handleShowTestDetails(test)}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.testDetailLabel}>Contains</span>
            <span className={styles.testDetailValue}>
              {test?.tests?.length || test?.testIds?.length || 0} tests
            </span>
            <i
              className="pi pi-chevron-down"
              style={{ fontSize: "0.75rem", color: "#9ca3af" }}
            ></i>
          </div>
          <div className={styles.testDetailRow}>
            <span className={styles.testDetailLabel}>Report</span>
            <span className={styles.testDetailValue}>
              within {test?.turnaroundTime}
            </span>
          </div>
        </div>

        {/* Pricing and Book Button */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className={styles.pricingSection}>
            <div className={styles.currentPrice}>
              ₹{test?.sellingPrice ? test?.sellingPrice : "N/A"}
            </div>

            <div className={styles.priceInfo}>
              <span className={styles.originalPrice}>₹{test.price}</span>
              <span className={styles.discount}>
                {(
                  ((test.price - test.sellingPrice) / test.price) *
                  100
                ).toFixed(0)}
                % off
              </span>
            </div>
          </div>
          <Button
            label="BOOK"
            style={{
              height: "2.5rem",
              width: "7rem",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleTestSelection(test);
            }}
            outlined
          />
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className={styles.selectionIndicator}>
            <i className="pi pi-check"></i>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.modernServiceSelection}>
      <Toast ref={toast} />

      {/* Book By Prescription Card */}
      <div className={styles.prescriptionCard}>
        <div className={styles.prescriptionCardContent}>
          <img
            src="/icons/icon-99x99.png"
            alt="Prescription"
            className={styles.prescriptionIcon}
          />
          <div>
            {lang === "hi"
              ? "प्रिस्क्रिप्शन से बुक करें"
              : "Book Lab Test By Prescription"}
          </div>
          <div>
            {lang === "hi"
              ? "अपने डॉक्टर की प्रिस्क्रिप्शन अपलोड करें और बाकी हम संभाल लेंगे!"
              : "Upload your doctor's prescription and let us handle the rest!"}
          </div>
          <Button
            label={
              lang === "hi" ? "प्रिस्क्रिप्शन अपलोड करें" : "Upload And Book"
            }
            icon="pi pi-upload"
            onClick={() => setShowcheckout(true)}
          />
        </div>
      </div>

      {/* OR Divider */}
      <div
        className={styles.orDivider}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "1rem", fontWeight: "500" }}>OR</span>
      </div>

      {/* User-friendly line */}
      <div
        className={styles.userLine}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "rgb(61, 64, 69)",
          }}
        >
          Choose Best Packages
        </span>
      </div>

      {/* Test Categories Grid */}
      <div className={styles.categoriesSection}>
        <div className={styles.categoriesGrid}>
          {predefinedCategories.map((category) => (
            <div
              key={category.id}
              className={`${styles.categoryItem} ${
                selectedCategory === category.id ? styles.selectedCategory : ""
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className={styles.categoryIcon}>
                <img src={category.icon} alt={category.name} />
              </div>
              <span className={styles.categoryName}>{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <div className={styles.searchIcon}>
            <i className="pi pi-search"></i>
          </div>
          <InputText
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search tests"
            className={styles.searchInput}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      {/* Tests Display */}
      <div className={styles.testsSection}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
            <p>Loading tests...</p>
          </div>
        ) : tests.length > 0 ? (
          <>
            <div className={styles.testsList}>
              {tests?.map((test, index) => itemTemplate(test, index))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {loadingMore && (
              <div
                ref={loadingRef}
                className={styles.loadingMoreContainer}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem",
                  marginTop: "1rem",
                }}
              >
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                ></i>
                <span>Loading more tests...</span>
              </div>
            )}

            {/* End of results indicator */}
            {!hasMore && tests.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 1rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                }}
              >
                <i
                  className="pi pi-check-circle"
                  style={{ marginRight: "0.5rem" }}
                ></i>
                You've reached the end of available tests
              </div>
            )}
          </>
        ) : (
          <div className={styles.noResults}>
            <p>No tests found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Selected Tests Summary */}
      {selectedTests.length > 0 && (
        <div className={styles.selectedTestsSummary}>
          <h3>Selected Tests ({selectedTests.length})</h3>
          <div className={styles.selectedTestsList}>
            {selectedTests.map((test) => (
              <div key={test._id} className={styles.selectedTestItem}>
                <span>{test.name}</span>
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={() => handleTestSelection(test)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <div className={styles.proceedSection}>
        <div
          style={{
            width: "100%",
            padding: "1rem 0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className={styles.proceedContent}
        >
          <div
            className={styles.selectedCount}
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: "#fff",
              backgroundColor: "#00b9af",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
            onClick={() => {
              router.push("/");
              setShowcheckout(false);
              setShowTestDetails(false);
              sethidebottomnav2(false);
            }}
          >
            <i className="pi pi-home"></i>
          </div>
          <div
            className={styles.selectedCount}
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              border: "1px solid #00b9af",
              color: "#00b9af",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <i className="pi pi-check"></i>
            {selectedTests.length}
          </div>
          <Button
            label={`Book ${selectedTests.length > 1 ? "Tests" : "Test"}`}
            icon="pi pi-arrow-right"
            className={styles.proceedButton}
            style={{
              marginTop: "-0.3rem",
              width: "15rem",
              marginRight: "0.5rem",
              backgroundColor: "#00b9af",
            }}
            onClick={handleProceed}
            disabled={selectedTests.length === 0}
          />
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav />

      {/* Prescription Upload Modal */}
      {showcheckout && (
        <CheckoutFromPrescription
          open={showcheckout}
          onClose={() => setShowcheckout(false)}
          onConfirm={({ prescription, address }) => {
            handleConfirm(prescription, address);
          }}
          getAuthHeaders={getAuthHeaders}
        />
      )}

      {/* Test Details Bottom Slider */}
      {showTestDetails && selectedTestForDetails && (
        <div className={styles.testDetailsSlider}>
          <div
            className={styles.sliderOverlay}
            onClick={handleCloseTestDetails}
          ></div>
          <div className={styles.sliderContent}>
            <div className={styles.sliderHeader}>
              <div className={styles.sliderTitle}>
                <img
                  src={getTestIcon(selectedTestForDetails.name)}
                  alt={selectedTestForDetails.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    padding: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <div>
                  <h3
                    style={{
                      margin: "0",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                    }}
                  >
                    {selectedTestForDetails.name}
                  </h3>
                  <span
                    style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: "1rem",
                      background:
                        selectedTestForDetails.type === "package"
                          ? "#ffe082"
                          : "#b3e5fc",
                      color: "#333",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      border: "1px solid #ccc",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      minWidth: "fit-content",
                    }}
                  >
                    {selectedTestForDetails.type}
                  </span>
                </div>
              </div>
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text"
                onClick={handleCloseTestDetails}
                style={{ fontSize: "1.5rem" }}
              />
            </div>

            <div className={styles.sliderBody}>
              <div className={styles.testSummary}>
                <div className={styles.summaryItem}>
                  <i className="pi pi-list" style={{ color: "#00b9af" }}></i>
                  <span>
                    Total Tests:{" "}
                    {selectedTestForDetails.tests?.length ||
                      selectedTestForDetails.testIds?.length ||
                      0}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <i className="pi pi-clock" style={{ color: "#00b9af" }}></i>
                  <span>
                    Report Time: {selectedTestForDetails.turnaroundTime}
                  </span>
                </div>
                {selectedTestForDetails.tests &&
                  selectedTestForDetails.tests.length > 0 && (
                    <div className={styles.summaryItem}>
                      <i className="pi pi-tag" style={{ color: "#00b9af" }}></i>
                      <span>
                        Categories:{" "}
                        {
                          [
                            ...new Set(
                              selectedTestForDetails.tests
                                .map((t) => t.category)
                                .filter(Boolean)
                            ),
                          ].length
                        }
                      </span>
                    </div>
                  )}
              </div>

              <div className={styles.testsList}>
                <h4
                  style={{
                    margin: "1rem 0 0.5rem 0",
                    color: "#333",
                    fontSize: "1rem",
                  }}
                >
                  Included Tests
                </h4>
                {selectedTestForDetails.tests &&
                selectedTestForDetails.tests.length > 0 ? (
                  selectedTestForDetails.tests.map((test, index) => (
                    <div key={index} className={styles.testItem}>
                      <div className={styles.testItemHeader}>
                        <img
                          src={getTestIcon(test.name || test.category)}
                          alt={test.name}
                          style={{
                            width: "24px",
                            height: "24px",
                            objectFit: "contain",
                            borderRadius: "4px",
                            padding: "4px",
                            backgroundColor: "#f8f9fa",
                          }}
                        />
                        <div className={styles.testItemInfo}>
                          <span className={styles.testItemName}>
                            {test.name}
                          </span>
                          <div className={styles.testItemMeta}>
                            {test.category && (
                              <span className={styles.testItemCategory}>
                                {test.category}
                              </span>
                            )}
                            {test.disease && (
                              <span className={styles.testItemDisease}>
                                {test.disease}
                              </span>
                            )}
                          </div>
                        </div>
                        {test.turnaroundTime && (
                          <span className={styles.testItemTime}>
                            {test.turnaroundTime} hrs
                          </span>
                        )}
                      </div>
                      {test.keywords && test.keywords.trim() && (
                        <div className={styles.testItemKeywords}>
                          {test.keywords
                            .split(",")
                            .slice(0, 3)
                            .map((keyword, idx) => (
                              <span key={idx} className={styles.keywordTag}>
                                {keyword.trim()}
                              </span>
                            ))}
                          {test.keywords.split(",").length > 3 && (
                            <span className={styles.keywordMore}>
                              +{test.keywords.split(",").length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={styles.noTestsMessage}>
                    <i
                      className="pi pi-info-circle"
                      style={{ fontSize: "2rem", color: "#9ca3af" }}
                    ></i>
                    <p>No detailed test information available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
