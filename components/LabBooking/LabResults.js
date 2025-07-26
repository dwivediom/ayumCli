import React from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import styles from "./styles.module.css";

const LabResults = ({ testRequested, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case "normal":
        return "success";
      case "high":
      case "elevated":
        return "danger";
      case "low":
        return "warning";
      case "pending":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "normal":
        return "#10b981";
      case "high":
      case "elevated":
        return "#ef4444";
      case "low":
        return "#f59e0b";
      case "pending":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  if (!testRequested) {
    return (
      <div className={styles.labResultsContainer}>
        <div className={styles.noResults}>
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#6b7280" }}
          ></i>
          <p>No test results available</p>
        </div>
      </div>
    );
  }

  // Group results by main test category
  const groupedResults = {};
  testRequested.results?.forEach((result) => {
    const category = result.category || "General";
    if (!groupedResults[category]) {
      groupedResults[category] = [];
    }
    groupedResults[category].push(result);
  });

  return (
    <div className={styles.labResultsContainer}>
      {/* Header */}
      <div className={styles.resultsHeader}>
        <div className={styles.headerContent}>
          <div className={styles.labLogo}>
            <div className={styles.logoCircle}>
              <i className="pi pi-flask"></i>
            </div>
            <div>
              <h2>{testRequested.labName || "Laboratory"}</h2>
              <p>Test Report</p>
            </div>
          </div>
          <div className={styles.reportInfo}>
            <h1>Laboratory Test Report</h1>
            <div className={styles.reportMeta}>
              <span>Report ID: #{testRequested._id?.slice(-8) || "N/A"}</span>
              <span>
                Date:{" "}
                {formatDate(testRequested.testDate || testRequested.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Patient & Lab Information */}
      <div className={styles.infoSection}>
        <div className={styles.infoGrid}>
          {/* Patient Information */}
          <div className={styles.infoColumn}>
            <h3>Patient Information</h3>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.infoValue}>
                {testRequested.patientDetails?.name || "N/A"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Age:</span>
              <span className={styles.infoValue}>
                {testRequested.patientDetails?.age || "N/A"} years
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Gender:</span>
              <span className={styles.infoValue}>
                {testRequested.patientDetails?.gender || "N/A"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Phone:</span>
              <span className={styles.infoValue}>
                {testRequested.patientDetails?.phone || "N/A"}
              </span>
            </div>
          </div>

          {/* Lab Information */}
          <div className={styles.infoColumn}>
            <h3>Laboratory Information</h3>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Lab Name:</span>
              <span className={styles.infoValue}>
                {testRequested.labName || "N/A"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Test Date:</span>
              <span className={styles.infoValue}>
                {formatDate(testRequested.testDate || testRequested.createdAt)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status:</span>
              <span className={styles.infoValue}>
                <Tag
                  value={testRequested.status || "pending"}
                  severity={getStatusSeverity(testRequested.status)}
                />
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Report Date:</span>
              <span className={styles.infoValue}>
                {formatDate(
                  testRequested.reportDate || testRequested.updatedAt
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className={styles.resultsSection}>
        <h2>Test Results</h2>

        {Object.keys(groupedResults).length > 0 ? (
          Object.entries(groupedResults).map(([category, results]) => (
            <div key={category} className={styles.resultCategory}>
              <h3>{category}</h3>
              <div className={styles.resultsTable}>
                <div className={styles.tableHeader}>
                  <span>Test Parameter</span>
                  <span>Result</span>
                  <span>Unit</span>
                  <span>Reference Range</span>
                  <span>Status</span>
                </div>
                {results.map((result, index) => (
                  <div key={index} className={styles.tableRow}>
                    <span className={styles.testName}>
                      {result.name || "Unknown Parameter"}
                    </span>
                    <span className={styles.testValue}>
                      {result.value || "N/A"}
                    </span>
                    <span className={styles.testUnit}>
                      {result.unit || "N/A"}
                    </span>
                    <span className={styles.testRange}>
                      {result.referenceRange || "N/A"}
                    </span>
                    <span className={styles.testStatus}>
                      <Tag
                        value={result.status || "normal"}
                        severity={getStatusSeverity(result.status)}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <i
              className="pi pi-info-circle"
              style={{ fontSize: "2rem", color: "#6b7280" }}
            ></i>
            <p>No detailed test results available</p>
          </div>
        )}
      </div>

      {/* Additional Notes */}
      {testRequested.notes && (
        <div className={styles.notesSection}>
          <h3>Additional Notes</h3>
          <div className={styles.notesContent}>
            <p>{testRequested.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={styles.resultFooter}>
        <div className={styles.footerInfo}>
          <p>
            This report is generated electronically and is valid without
            signature.
          </p>
          <p>For any queries, please contact the laboratory.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Button
          label="Print Report"
          icon="pi pi-print"
          onClick={() => window.print()}
          className={styles.printButton}
        />
        {testRequested.reportUrl && (
          <Button
            label="Download PDF"
            icon="pi pi-download"
            onClick={() => window.open(testRequested.reportUrl, "_blank")}
            className={styles.downloadButton}
          />
        )}
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={onClose}
          className={styles.closeButton}
        />
      </div>
    </div>
  );
};

export default LabResults;
