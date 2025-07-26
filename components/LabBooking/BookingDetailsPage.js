import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import styles from "./styles.module.css";

const BookingDetailsPage = ({ booking, visible, onHide, onBack }) => {
  const toast = useRef(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [loadingResults, setLoadingResults] = useState({});
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_B_PORT || "http://localhost:5001";
  const apiUrl = `${baseUrl}/api/lab/user`;

  useEffect(() => {
    if (visible && booking) {
      fetchBookingDetails();
    }
  }, [visible, booking]);

  // NEW: Automatically fetch test results when booking details are loaded
  useEffect(() => {
    if (bookingDetails && bookingDetails.testsRequested) {
      // Automatically fetch results for completed tests that have result IDs
      bookingDetails.testsRequested.forEach((test) => {
        if (
          test.status === "completed" &&
          test.testResultId &&
          !testResults[test.testResultId]
        ) {
          fetchTestResult(test.testResultId, test.name);
        }
      });
    }
  }, [bookingDetails]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("usertoken");

      if (!authToken) {
        toast.current.show({
          severity: "error",
          summary: "Authentication Error",
          detail: "Please log in to continue",
          life: 3000,
        });
        return;
      }

      const response = await axios.get(
        `${apiUrl}/booking/details?bookingId=${booking._id}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );

      if (response.data && !response.data.error) {
        setBookingDetails(response.data.data);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch booking details",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch booking details",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResult = async (testResultId, testName) => {
    try {
      setLoadingResults((prev) => ({ ...prev, [testResultId]: true }));
      const authToken = localStorage.getItem("usertoken");

      if (!authToken) {
        toast.current.show({
          severity: "error",
          summary: "Authentication Error",
          detail: "Please log in to continue",
          life: 3000,
        });
        return;
      }

      const response = await axios.get(
        `${apiUrl}/result/details?resultId=${testResultId}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );

      if (response.data && !response.data.error) {
        setTestResults((prev) => ({
          ...prev,
          [testResultId]: response.data.data,
        }));
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `Failed to fetch results for ${testName}`,
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching test result:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to fetch results for ${testName}`,
        life: 3000,
      });
    } finally {
      setLoadingResults((prev) => ({ ...prev, [testResultId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
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

      const response = await axios.get(
        `${apiUrl}/booking/download?bookingId=${booking._id}`,
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
      link.setAttribute("download", `lab-booking-${booking._id}.pdf`);
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

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const shareViaWhatsApp = () => {
    const text = `Lab Booking Details\nBooking ID: ${booking._id}\nLab: ${
      bookingDetails?.labId?.name
    }\nDate: ${formatDate(booking.createdAt)}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setShowShareDialog(false);
  };

  const shareViaEmail = () => {
    const subject = `Lab Booking Details - ${booking._id}`;
    const body = `Lab Booking Details\n\nBooking ID: ${booking._id}\nLab: ${
      bookingDetails?.labId?.name
    }\nDate: ${formatDate(booking.createdAt)}\nPatient: ${
      bookingDetails?.patientDetails?.name
    }`;
    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(url);
    setShowShareDialog(false);
  };

  const copyToClipboard = () => {
    const text = `Lab Booking Details\nBooking ID: ${booking._id}\nLab: ${
      bookingDetails?.labId?.name
    }\nDate: ${formatDate(booking.createdAt)}\nPatient: ${
      bookingDetails?.patientDetails?.name
    }`;
    navigator.clipboard.writeText(text).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Copied",
        detail: "Booking details copied to clipboard",
        life: 2000,
      });
      setShowShareDialog(false);
    });
  };

  if (!visible) return null;

  return (
    <>
      <Toast ref={toast} />

      {/* Full Screen Container */}
      <div className={styles.fullScreenContainer}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <Button
              icon="pi pi-arrow-left"
              onClick={onBack}
              className={styles.backButton}
              text
            />
            <div className={styles.headerTitle}>
              <h1>Booking Details</h1>
              <p>#{booking._id.slice(-8)}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button
              icon="pi pi-print"
              onClick={handlePrint}
              className={styles.actionButton}
              tooltip="Print"
            />
            <Button
              icon="pi pi-download"
              onClick={handleDownload}
              loading={loading}
              className={styles.actionButton}
              tooltip="Download"
            />
            <Button
              icon="pi pi-share-alt"
              onClick={handleShare}
              className={styles.actionButton}
              tooltip="Share"
            />
          </div>
        </div>

        {/* Content */}
        <div className={styles.pageContent}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <i
                className="pi pi-spin pi-spinner"
                style={{ fontSize: "2rem" }}
              ></i>
              <p>Loading booking details...</p>
            </div>
          ) : bookingDetails ? (
            <>
              {/* Patient and Lab Info Cards */}
              <div className={styles.infoCardsSection}>
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <i className="pi pi-user"></i>
                    <h3>Patient Details</h3>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Name:</span>
                      <span className={styles.infoValue}>
                        {bookingDetails.patientDetails?.name || "N/A"}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Age:</span>
                      <span className={styles.infoValue}>
                        {bookingDetails.patientDetails?.age || "N/A"}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Phone:</span>
                      <span className={styles.infoValue}>
                        {bookingDetails.patientDetails?.phone || "N/A"}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Email:</span>
                      <span className={styles.infoValue}>
                        {bookingDetails.patientDetails?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <i className="pi pi-building"></i>
                    <h3>Lab Details</h3>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Lab Name:</span>
                      <span className={styles.infoValue}>
                        {bookingDetails.labId?.name || "N/A"}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Phone:</span>
                      <span className={styles.infoValue}>
                        {bookingDetails.labId?.phone || "N/A"}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>City:</span>
                      <span className={styles.infoValue}>
                        {bookingDetails.labId?.city || "N/A"}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Address:</span>
                      <span className={styles.infoValue}>
                        {bookingDetails.labId?.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tests Section */}
              <div className={styles.testsSection}>
                <h2>Tests & Results</h2>

                <div className={styles.testsList}>
                  {bookingDetails.testsRequested?.map((test, index) => (
                    <div key={index} className={styles.testCard}>
                      <div className={styles.testHeader}>
                        <div className={styles.testInfo}>
                          <h4>{test.name}</h4>
                          <p className={styles.testCategory}>
                            {test.category || "General"}
                          </p>
                        </div>
                        <div className={styles.testStatus}>
                          <Tag
                            value={test.status}
                            severity={getStatusSeverity(test.status)}
                          />
                        </div>
                      </div>

                      <div className={styles.testDetails}>
                        <div className={styles.testMeta}>
                          <span className={styles.testSample}>
                            Sample: {test.sampleType}
                          </span>
                        </div>

                        {/* Test Results - Automatically loaded */}
                        {test.status === "completed" && test.testResultId && (
                          <div className={styles.testResults}>
                            {loadingResults[test.testResultId] ? (
                              <div className={styles.loadingResults}>
                                <i className="pi pi-spin pi-spinner"></i>
                                <span>Loading results...</span>
                              </div>
                            ) : testResults[test.testResultId] ? (
                              <div className={styles.resultsContent}>
                                <div className={styles.resultsHeader}>
                                  <h5>Test Results</h5>
                                  <span className={styles.resultDate}>
                                    {formatDate(
                                      testResults[test.testResultId].testDate
                                    )}
                                  </span>
                                </div>

                                <div className={styles.resultsTable}>
                                  <div className={styles.tableHeader}>
                                    <span>Parameter</span>
                                    <span>Value</span>
                                    <span>Unit</span>
                                    <span>Reference Range</span>
                                    <span>Status</span>
                                  </div>
                                  {testResults[test.testResultId].results?.map(
                                    (result, resultIndex) => (
                                      <div
                                        key={resultIndex}
                                        className={`${styles.tableRow} ${
                                          styles[
                                            `status-${getStatusSeverity(
                                              result.status
                                            )}`
                                          ]
                                        }`}
                                      >
                                        <span className={styles.parameterName}>
                                          {result.name}
                                        </span>
                                        <span className={styles.parameterValue}>
                                          {result.value}
                                        </span>
                                        <span className={styles.parameterUnit}>
                                          {result.unit || "N/A"}
                                        </span>
                                        <span className={styles.parameterRange}>
                                          {result.referenceRange || "N/A"}
                                        </span>
                                        <span
                                          className={styles.parameterStatus}
                                        >
                                          <Tag
                                            value={result.status || "Normal"}
                                            severity={getStatusSeverity(
                                              result.status
                                            )}
                                          />
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>

                                {testResults[test.testResultId].notes && (
                                  <div className={styles.resultNotes}>
                                    <h6>Notes:</h6>
                                    <p>
                                      {testResults[test.testResultId].notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className={styles.noResults}>
                                <i className="pi pi-exclamation-triangle"></i>
                                <span>Results not available</span>
                              </div>
                            )}
                          </div>
                        )}

                        {test.status === "pending" && (
                          <div className={styles.pendingStatus}>
                            <i className="pi pi-clock"></i>
                            <span>
                              Test pending - Results will be available soon
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              <div className={styles.paymentSection}>
                <div className={styles.sectionHeader}>
                  <h2>Payment Information</h2>
                </div>
                <div className={styles.paymentCard}>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>Total Amount:</span>
                    <span className={styles.paymentValue}>
                      ₹{bookingDetails.payment?.totalAmount || 0}
                    </span>
                  </div>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>Payment Status:</span>
                    <span className={styles.paymentStatus}>
                      <Tag
                        value={
                          bookingDetails.payment?.paymentStatus || "pending"
                        }
                        severity={getStatusSeverity(
                          bookingDetails.payment?.paymentStatus
                        )}
                      />
                    </span>
                  </div>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>Payment Method:</span>
                    <span className={styles.paymentValue}>
                      {bookingDetails.payment?.paymentMethod || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.errorContainer}>
              <i
                className="pi pi-exclamation-triangle"
                style={{ fontSize: "2rem", color: "var(--red-500)" }}
              ></i>
              <p>Failed to load booking details</p>
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog
        header="Share Booking Details"
        visible={showShareDialog}
        onHide={() => setShowShareDialog(false)}
        style={{ width: "90vw", maxWidth: "400px" }}
        modal
        className={styles.shareDialog}
      >
        <div className={styles.shareOptions}>
          <Button
            label="Share via WhatsApp"
            icon="pi pi-whatsapp"
            onClick={shareViaWhatsApp}
            className={styles.whatsappButton}
          />
          <Button
            label="Share via Email"
            icon="pi pi-envelope"
            onClick={shareViaEmail}
            className={styles.emailButton}
          />
          <Button
            label="Copy to Clipboard"
            icon="pi pi-copy"
            onClick={copyToClipboard}
            className={styles.copyButton}
          />
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

export default BookingDetailsPage;
