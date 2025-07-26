import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import styles from "./styles.module.css";

const LabResult = ({ resultData, visible, onHide }) => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to get status severity
  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case "normal":
        return "success";
      case "high":
      case "elevated":
        return "warning";
      case "low":
      case "decreased":
        return "info";
      case "critical":
        return "danger";
      default:
        return "info";
    }
  };

  // Helper function to categorize test results
  const categorizeResults = (results) => {
    const categories = {
      Hematology: [],
      Biochemistry: [],
      "Liver Function": [],
      "Kidney Function": [],
      Electrolytes: [],
      "Thyroid Function": [],
      Other: [],
    };

    results?.forEach((result) => {
      const testName = result.name?.toLowerCase() || "";

      if (
        testName.includes("cbc") ||
        testName.includes("hemoglobin") ||
        testName.includes("platelet") ||
        testName.includes("wbc") ||
        testName.includes("rbc")
      ) {
        categories["Hematology"].push(result);
      } else if (
        testName.includes("glucose") ||
        testName.includes("creatinine") ||
        testName.includes("urea") ||
        testName.includes("cholesterol")
      ) {
        categories["Biochemistry"].push(result);
      } else if (
        testName.includes("alt") ||
        testName.includes("ast") ||
        testName.includes("alp") ||
        testName.includes("bilirubin") ||
        testName.includes("albumin")
      ) {
        categories["Liver Function"].push(result);
      } else if (testName.includes("gfr") || testName.includes("bun")) {
        categories["Kidney Function"].push(result);
      } else if (
        testName.includes("sodium") ||
        testName.includes("potassium") ||
        testName.includes("calcium")
      ) {
        categories["Electrolytes"].push(result);
      } else if (
        testName.includes("tsh") ||
        testName.includes("t4") ||
        testName.includes("thyroid")
      ) {
        categories["Thyroid Function"].push(result);
      } else {
        categories["Other"].push(result);
      }
    });

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([key, value]) => value.length > 0)
    );
  };

  const handlePrint = () => {
    setShowPrintDialog(true);
    setTimeout(() => {
      window.print();
      setShowPrintDialog(false);
    }, 100);
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("usertoken");

      if (!authToken) {
        toast.current.show({
          severity: "error",
          summary: "Authentication Error",
          detail: "Please log in to download the report",
          life: 3000,
        });
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_B_PORT || "http://localhost:5001";
      const response = await axios.get(
        `${baseUrl}/api/lab/user/result/download?resultId=${resultData?.resultId}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `lab-report-${resultData?.resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Report downloaded successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to download report",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const categorizedResults = categorizeResults(resultData?.results || []);

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        header="Lab Test Results"
        visible={visible}
        onHide={onHide}
        style={{ width: "95vw", maxWidth: "1200px" }}
        modal
        className={styles.labResultDialog}
      >
        <div className={styles.labResultContainer}>
          {/* Header Section */}
          <div className={styles.labResultHeader}>
            <div className={styles.labLogo}>
              <div className={styles.logoCircle}>
                <span>M</span>
              </div>
              <h2>Metropolis</h2>
            </div>
            <div className={styles.reportTitle}>
              <h1>Blood Test Results</h1>
            </div>
          </div>

          {/* Information Section */}
          <div className={styles.infoSection}>
            <div className={styles.infoGrid}>
              {/* Patient Information */}
              <div className={styles.infoColumn}>
                <h3>Patient Information</h3>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Name:</span>
                  <span className={styles.infoValue}>
                    {resultData?.patientDetails?.name || "N/A"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Age:</span>
                  <span className={styles.infoValue}>
                    {resultData?.patientDetails?.age || "N/A"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Gender:</span>
                  <span className={styles.infoValue}>
                    {resultData?.patientDetails?.gender || "N/A"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>
                    {resultData?.patientDetails?.email || "N/A"}
                  </span>
                </div>
              </div>

              {/* Processing Details */}
              <div className={styles.infoColumn}>
                <h3>Processing Details</h3>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Sample:</span>
                  <span className={styles.infoValue}>
                    {formatDate(resultData?.sampleDetails?.collectedAt)}{" "}
                    {formatTime(resultData?.sampleDetails?.collectedAt)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Results:</span>
                  <span className={styles.infoValue}>
                    {formatDate(resultData?.testDate)}{" "}
                    {formatTime(resultData?.testDate)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Sample ID:</span>
                  <span className={styles.infoValue}>
                    {resultData?.sampleDetails?.sampleId || "N/A"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Sample Type:</span>
                  <span className={styles.infoValue}>
                    {resultData?.sampleDetails?.sampleType || "N/A"}
                  </span>
                </div>
              </div>

              {/* Lab Information */}
              <div className={styles.infoColumn}>
                <h3>Laboratory Information</h3>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Lab Name:</span>
                  <span className={styles.infoValue}>
                    {resultData?.labDetails?.name || "N/A"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>City:</span>
                  <span className={styles.infoValue}>
                    {resultData?.labDetails?.city || "N/A"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Result ID:</span>
                  <span className={styles.infoValue}>
                    {resultData?.resultId || "N/A"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Status:</span>
                  <span className={styles.infoValue}>
                    <Tag
                      value={resultData?.status || "pending"}
                      severity={getStatusSeverity(resultData?.status)}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Results Section */}
          <div className={styles.resultsSection}>
            <h2>Test Results</h2>

            {Object.entries(categorizedResults).map(([category, results]) => (
              <div key={category} className={styles.resultCategory}>
                <h3>{category}</h3>
                <div className={styles.resultsTable}>
                  <div className={styles.tableHeader}>
                    <span>TEST</span>
                    <span>UNIT</span>
                    <span>REFERENCE RANGE</span>
                    <span>RESULT</span>
                    <span>RESULT STATUS</span>
                  </div>
                  {results.map((result, index) => (
                    <div key={index} className={styles.tableRow}>
                      <span className={styles.testName}>{result.name}</span>
                      <span className={styles.testUnit}>
                        {result.unit || "N/A"}
                      </span>
                      <span className={styles.testRange}>
                        {result.referenceRange || "N/A"}
                      </span>
                      <span className={styles.testValue}>{result.value}</span>
                      <span className={styles.testStatus}>
                        <Tag
                          value={result.status || "Normal"}
                          severity={getStatusSeverity(result.status)}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={styles.resultFooter}>
            <div className={styles.footerInfo}>
              <p>
                Report generated on: {formatDate(new Date())} at{" "}
                {formatTime(new Date())}
              </p>
              <p>
                This report is for informational purposes only. Please consult
                with your healthcare provider for medical interpretation.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Button
              label="Print Report"
              icon="pi pi-print"
              onClick={handlePrint}
              className={styles.printButton}
            />
            <Button
              label="Download PDF"
              icon="pi pi-download"
              onClick={handleDownload}
              loading={loading}
              className={styles.downloadButton}
            />
            <Button
              label="Close"
              icon="pi pi-times"
              onClick={onHide}
              className={styles.closeButton}
            />
          </div>
        </div>
      </Dialog>

      {/* Print Dialog */}
      <Dialog
        header="Printing Report"
        visible={showPrintDialog}
        onHide={() => setShowPrintDialog(false)}
        style={{ width: "300px" }}
        modal
      >
        <div className={styles.printDialog}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
          <p>Preparing report for printing...</p>
        </div>
      </Dialog>
    </>
  );
};

export default LabResult;
