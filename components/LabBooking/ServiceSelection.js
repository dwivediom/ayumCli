import React, { useState, useEffect, useRef, useContext } from "react";
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
} from "../../config/api/labApi";
import { AccountContext } from "../../context/AccountProvider";

const ServiceSelection = ({
  onTestsSelected,
  selectedTests,
  setSelectedTests,
}) => {
  const toast = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [city, setCity] = useState("Rewa");
  const [tests, setTests] = useState([]);
  // const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });

  // Predefined categories with icons
  const predefinedCategories = [
    { id: "all", name: "All", icon: "/labicons/all.png" },
    { id: "cbc", name: "Blood", icon: "/labicons/blood.png" },
    { id: "urine", name: "Urine", icon: "/labicons/urine.png" },
    { id: "gynae", name: "Gynae", icon: "/labicons/gynae.png" },
    { id: "thyroid", name: "Thyroid", icon: "/labicons/thyroid.png" },
    { id: "liver", name: "Liver (LFT)", icon: "/labicons/liver.png" },
    { id: "lipid", name: "Lipid Profile", icon: "/labicons/lipidprofile.png" },
    { id: "kidney", name: "Kidney", icon: "/labicons/kidney.png" },
  ];

  // Filter options
  const filterOptions = [
    { id: "sort", label: "Sort By", icon: "pi pi-sort" },
    // { id: "filters", label: "All filters", icon: "pi pi-filter" },
    { id: "sameDay", label: "Same day report", icon: "pi pi-clock" },
  ];

  useEffect(() => {
    fetchCategories();
    fetchAllTests();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(labTestApi.getTestCategories(), {
        headers: getAuthHeaders(),
      });

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

  const fetchAllTests = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/lab/user/tests/all-offered?city=${city}&searchText=${searchText}&category=${selectedCategory}&page=${pagination.page}&limit=10`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data && !response.data.error) {
        const transformedTests = response.data.data.map((test) => ({
          _id: test.testTemplateId,
          name: test.testName,
          category: test.category,
          sampleRequirements:
            typeof test.sampleRequirements === "string"
              ? test.sampleRequirements
              : `${test.sampleRequirements.sampleType} (${test.sampleRequirements.volume}) - ${test.sampleRequirements.specialInstructions}`,
          labs: test.offeredBy
            ? test.offeredBy.map((lab) => ({
                labId: lab.labId,
                labName: lab.labName,
                price: lab.price,
                turnaroundTime: lab.turnaroundTime,
                additionalInfo: lab.additionalInfo,
                homeCollectionAvailable: lab.homeCollectionAvailable,
              }))
            : [],
        }));

        setTests(transformedTests);
        setPagination({
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          pages: response.data.pagination.pages,
        });
      } else {
        setTests([]);
        setPagination({
          total: 0,
          page: 1,
          pages: 1,
        });
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.data.message || "Failed to fetch tests",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      setTests([]);
      setPagination({
        total: 0,
        page: 1,
        pages: 1,
      });
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch tests. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchAllTests();
  };

  const handleSearch = () => {
    fetchAllTests();
  };

  const handleTestSelection = (test) => {
    const isSelected = selectedTests.some((t) => t._id === test._id);

    if (isSelected) {
      setSelectedTests(selectedTests.filter((t) => t._id !== test._id));
    } else {
      setSelectedTests([...selectedTests, test]);
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

    onTestsSelected(selectedTests, city);
  };

  const { hidebottomnav, sethidebottomnav } = useContext(AccountContext);
  useEffect(() => {
    sethidebottomnav(true);
  }, []);

  const getTestIcon = (testName) => {
    // Determine icon based on test name or category
    const name = testName.toLowerCase();
    if (name.includes("cbc") || name.includes("blood"))
      return "/labicons/blood.png";
    if (name.includes("urine")) return "/labicons/urine.png";
    if (name.includes("package")) return "/labicons/all.png";
    if (name.includes("dengue") || name.includes("fever"))
      return "/labicons/blood.png";
    return "/labicons/blood.png"; // default
  };

  const getTestDetails = (test) => {
    // Generate test details based on test name
    const name = test.name.toLowerCase();
    if (name.includes("cbc")) {
      return { testCount: 21, reportTime: "18 hours" };
    } else if (name.includes("urine")) {
      return { testCount: 19, reportTime: "18 hours" };
    } else if (name.includes("dengue")) {
      return { testCount: 1, reportTime: "18 hours" };
    } else if (name.includes("fever package")) {
      return { testCount: 49, reportTime: "18 hours", isPackage: true };
    }
    return { testCount: 1, reportTime: "18 hours" };
  };

  const getOriginalPrice = (currentPrice) => {
    // Calculate original price with some discount
    const price = parseInt(currentPrice) || 300;
    const discount = Math.floor(price * 0.1); // 10% discount
    return price + discount;
  };

  const itemTemplate = (test) => {
    const isSelected = selectedTests.some((t) => t._id === test._id);
    const bestLab = test.labs && test.labs.length > 0 ? test.labs[0] : null;
    const testDetails = getTestDetails(test);
    const originalPrice = getOriginalPrice(bestLab?.price);
    const discount = Math.round(
      ((originalPrice - bestLab?.price) / originalPrice) * 100
    );

    return (
      <div className={styles.newTestCard}>
        {/* Icon and Test Name */}
        <div className={styles.testHeader}>
          <div className={styles.testIcon}>
            <img src={getTestIcon(test.name)} alt={test.name} />
          </div>
          <div className={styles.testInfo}>
            <h3 className={styles.testName}>{test.name}</h3>
          </div>
        </div>

        {/* Test Details */}
        <div className={styles.testDetails}>
          <div className={styles.testDetailRow}>
            <span className={styles.testDetailLabel}>Contains</span>
            <span className={styles.testDetailValue}>
              {testDetails.testCount} tests
            </span>
            <i
              className="pi pi-chevron-down"
              style={{ fontSize: "0.75rem", color: "#9ca3af" }}
            ></i>
          </div>
          <div className={styles.testDetailRow}>
            <span className={styles.testDetailLabel}>Report</span>
            <span className={styles.testDetailValue}>
              within {testDetails.reportTime}
            </span>
          </div>
        </div>

        {/* Pricing and Book Button */}
        <div className={styles.cardFooter}>
          <div className={styles.pricingSection}>
            <div className={styles.currentPrice}>
              ₹{bestLab ? bestLab.price : "N/A"}
            </div>
            {discount > 0 && (
              <div className={styles.priceInfo}>
                <span className={styles.originalPrice}>₹{originalPrice}</span>
                <span className={styles.discount}>{discount}% off</span>
              </div>
            )}
          </div>
          <Button
            label="BOOK"
            // className={styles.bookButton}
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

      {/* Filter Chips */}
      <div className={styles.filterSection}>
        <div className={styles.filterChips}>
          {filterOptions.map((filter) => (
            <div key={filter.id} className={styles.filterChip}>
              <i className={filter.icon}></i>
              <span>{filter.label}</span>
            </div>
          ))}
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
          <div className={styles.testsList}>
            {tests.map((test) => itemTemplate(test))}
          </div>
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
    </div>
  );
};

export default ServiceSelection;
