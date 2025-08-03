import React, { useState, useEffect, useRef } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import styles from "./styles.module.css";
import {
  labBookingApi,
  getAuthHeaders,
  handleApiError,
} from "../../config/api/labApi";
import LabResult from "./LabResult";
import BookingDetailsPage from "./BookingDetailsPage";

const BookingList = () => {
  const toast = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showTestResults, setShowTestResults] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    fromDate: null,
    toDate: null,
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedTestResult, setSelectedTestResult] = useState(null);
  const [showTestResultDetails, setShowTestResultDetails] = useState(false);
  const [loadingTestResult, setLoadingTestResult] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_B_PORT || "http://localhost:5001";
  const apiUrl = `${baseUrl}/api/lab/user`;

  useEffect(() => {
    fetchBookings();
  }, [filters, pagination.page, pagination.limit]);

  const fetchBookings = async () => {
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

      const queryParams = new URLSearchParams();
      if (filters.status !== "all")
        queryParams.append("status", filters.status);
      if (filters.fromDate)
        queryParams.append("fromDate", formatDateForAPI(filters.fromDate));
      if (filters.toDate)
        queryParams.append("toDate", formatDateForAPI(filters.toDate));
      queryParams.append("page", pagination.page);
      queryParams.append("limit", pagination.limit);

      const response = await axios.get(
        `${apiUrl}/bookings/list?${queryParams.toString()}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );

      if (response.data && !response.data.error) {
        // Show all bookings in the same list
        setBookings(response.data.data || []);
        setCancelledBookings([]); // No longer needed
        setPagination({
          page: response.data.pagination.page,
          limit: pagination.limit,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        });
      } else {
        setBookings([]);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch bookings",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch bookings",
        life: 3000,
      });
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      setLoadingDetails(true);
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
        `${apiUrl}/booking/details?bookingId=${bookingId}`,
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
      setLoadingDetails(false);
    }
  };

  const fetchTestResultDetails = async (resultId) => {
    try {
      setLoadingTestResult(true);
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
        `${apiUrl}/result/details?resultId=${resultId}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );

      if (response.data && !response.data.error) {
        setSelectedTestResult(response.data.data);
        setShowTestResultDetails(true);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch test result details",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching test result details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch test result details",
        life: 3000,
      });
    } finally {
      setLoadingTestResult(false);
    }
  };

  const fetchTestResults = async () => {
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

      const queryParams = new URLSearchParams();
      if (filters.fromDate)
        queryParams.append("fromDate", formatDateForAPI(filters.fromDate));
      if (filters.toDate)
        queryParams.append("toDate", formatDateForAPI(filters.toDate));
      queryParams.append("page", filters.page);
      queryParams.append("limit", filters.limit);

      const response = await axios.get(
        `${apiUrl}/results/list?${queryParams.toString()}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );

      if (response.data && !response.data.error) {
        setTestResults(response.data.data || []);
        setTotalRecords(response.data.total || 0);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch test results",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching test results:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch test results",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateForAPI = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const getStatusSeverity = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "info";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const viewBookingDetails = async (booking) => {
    setSelectedBooking(booking);
    setShowDetailsPage(true);
    localStorage.setItem("bookingData", JSON.stringify(booking));
    await fetchBookingDetails(booking._id);
  };

  const handleBackFromDetails = () => {
    setShowDetailsPage(false);
    setSelectedBooking(null);
    setBookingDetails(null);
    setTestResults({});
  };

  const viewTestResult = (resultId) => {
    fetchTestResultDetails(resultId);
  };

  const viewTestResults = () => {
    setShowTestResults(true);
    fetchTestResults();
  };

  const showCancelConfirmation = (bookingId) => {
    setBookingToCancel(bookingId);
    confirmDialog({
      message: "Are you sure you want to cancel this booking?",
      header: "Cancel Booking",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => cancelBooking(bookingId),
      reject: () => {
        setBookingToCancel(null);
        console.log("User cancelled the operation");
      },
    });
  };

  const cancelBooking = async (bookingId) => {
    try {
      console.log("Attempting to cancel booking:", bookingId);
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

      console.log("Sending cancel request to:", `${apiUrl}/booking/cancel`);
      const response = await axios.post(
        `${apiUrl}/booking/cancel`,
        {
          bookingId: bookingId,
        },
        {
          headers: {
            "x-auth-token": authToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Cancel API response:", response.data);

      if (response.data && !response.data.error) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data.message || "Booking cancelled successfully",
          life: 3000,
        });
        
        // Refresh the bookings list
        await fetchBookings();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.data.message || "Failed to cancel booking",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to cancel booking",
        life: 3000,
      });
    } finally {
      setBookingToCancel(null);
    }
  };

  const isBookingCancelled = (booking) => {
    // Check if booking is cancelled based on status or cancelledAt field
    const isCancelled = booking.status === "cancelled" || booking.cancelledAt;
    console.log(`Booking ${booking._id} cancelled status:`, {
      status: booking.status,
      cancelledAt: booking.cancelledAt,
      isCancelled: isCancelled
    });
    return isCancelled;
  };



  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const handlePageChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      page: event.page + 1,
      limit: event.rows,
    }));
  };

  const itemTemplate = (booking) => {
    const isCancelled = isBookingCancelled(booking);
    
    if (isCancelled) {
      // Simplified template for cancelled bookings
      return (
        <div className={styles.modernBookingCard}>
          <div className={styles.cardHeader}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
              className={styles.labInfo}
            >
              <div className={styles.labIcon}>
                <i className="pi pi-building"></i>
              </div>
              <div className={styles.labDetails}>
                <h3>
                  {booking?.packageDetails &&
                  booking?.packageDetails[0]?.packageName
                    ? booking?.packageDetails[0]?.packageName
                    : booking?.testsRequested?.[0]?.name || "N/A"}
                </h3>
                <p className={styles.bookingId}>#{booking._id.slice(-8)}</p>
              </div>
            </div>
            <div className={styles.statusBadge}>
              <Tag
                value="Cancelled"
                severity="danger"
              />
            </div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.cancelledInfo}>
              <div className={styles.cancelledDate}>
                <i className="pi pi-calendar-times"></i>
                <span>Cancelled on {formatDate(booking.cancelledAt)}</span>
              </div>
              <div className={styles.cancelledTime}>
                <i className="pi pi-clock"></i>
                <span>{formatTime(booking.cancelledAt)}</span>
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <Button
              label="View Details"
              icon="pi pi-eye"
              onClick={() => viewBookingDetails(booking)}
              className={styles.viewButton}
            />
          </div>
        </div>
      );
    }

    // Original template for active bookings
    const totalTests = booking.testsRequested?.length || 0;
    const completedTests =
      booking.testsRequested?.filter((test) => test.status === "completed")
        .length || 0;

    return (
      <div className={styles.modernBookingCard}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
            className={styles.labInfo}
          >
            <div className={styles.labIcon}>
              <i className="pi pi-building"></i>
            </div>
            <div className={styles.labDetails}>
              <h3>
                {booking?.packageDetails &&
                booking?.packageDetails[0]?.packageName
                  ? booking?.packageDetails[0]?.packageName
                  : "N/A"}
              </h3>
              <p className={styles.bookingId}>#{booking._id.slice(-8)}</p>
            </div>
          </div>
          <div className={styles.statusBadge}>
            <Tag
              value={booking.payment?.paymentStatus || "pending"}
              severity={getStatusSeverity(booking.payment?.paymentStatus)}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className={styles.cardContent}>
          {/* Summary Row */}
          <div
            style={{
              display: "flex",
              // flexDirection: "column",
              // justifyContent: "center",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",
                alignItems: "center",
                textAlign: "center",
              }}
              className={styles.summaryItem}
            >
              <i className="pi pi-calendar"></i>
              <span>{formatDate(booking.createdAt)}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",
                alignItems: "center",
                textAlign: "center",
              }}
              className={styles.summaryItem}
            >
              <i className="pi pi-list"></i>
              <span>
                {totalTests} tests ({completedTests} completed)
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",
                alignItems: "center",
                textAlign: "center",
              }}
              className={styles.summaryItem}
            >
              <i className="pi pi-money-bill"></i>
              <span>₹{booking.payment?.totalAmount || 0}</span>
            </div>
          </div>

          {/* Tests Section */}
          <div className={styles.testsSection}>
            <h4>Tests</h4>
            <div className={styles.testsGrid}>
              {booking.testsRequested?.slice(0, 6).map((test, index) => (
                <div key={index} className={styles.testCard}>
                  <div className={styles.testCardContent}>
                    <div className={styles.testCardHeader}>
                      <span className={styles.testCardName}>{test.name}</span>
                    </div>
                    {test.status === "completed" && test.testResultId && (
                      <Button
                        label="View Result"
                        icon="pi pi-file"
                        onClick={() => viewTestResult(test.testResultId)}
                        className={styles.testCardButton}
                      />
                    )}
                  </div>
                </div>
              ))}
              {booking.testsRequested?.length > 6 && (
                <div className={styles.moreTestsCard}>
                  <div className={styles.moreTestsContent}>
                    <i className="pi pi-plus-circle"></i>
                    <span>+{booking.testsRequested.length - 6} more tests</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className={styles.cardFooter}>
          <Button
            label="View Details"
            icon="pi pi-eye"
            onClick={() => viewBookingDetails(booking)}
            className={styles.viewButton}
          />
          <Button
            label="Cancel Booking"
            icon="pi pi-times"
            onClick={() => showCancelConfirmation(booking._id)}
            className={styles.cancelButton}
            severity="danger"
          />
        </div>
      </div>
    );
  };

  const testResultTemplate = (result) => {
    return (
      <div className={styles.mobileBookingCard}>
        <div className={styles.labHeader}>
          <div className={styles.labName}>
            <h3>{result.testName || "Test Name"}</h3>
            <p className={styles.bookingId}>#{result._id.slice(-8)}</p>
          </div>
          <div className={styles.statusTag}>
            <Tag
              value={result.status || "pending"}
              severity={getStatusSeverity(result.status)}
            />
          </div>
        </div>

        <div className={styles.bookingSummary}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
            className={styles.summaryItem}
          >
            <i className="pi pi-calendar"></i>
            <span>{formatDate(result.createdAt)}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
            className={styles.summaryItem}
          >
            <i className="pi pi-building"></i>
            <span>{result.labName || "Unknown Lab"}</span>
          </div>
        </div>

        <div className={styles.resultPreview}>
          <h4>Result Preview</h4>
          <div className={styles.resultContent}>
            {result.resultDetails ? (
              <div dangerouslySetInnerHTML={{ __html: result.resultDetails }} />
            ) : (
              <p>No result details available</p>
            )}
          </div>
        </div>

        <div className={styles.cardActions}>
          <Button
            label="Download Report"
            icon="pi pi-download"
            onClick={() => window.open(result.reportUrl, "_blank")}
            className={styles.downloadButton}
            disabled={!result.reportUrl}
          />
        </div>
      </div>
    );
  };

  const bookingDetailsDialog = () => {
    if (!selectedBooking) return null;

    return (
      <Dialog
        header="Booking Details"
        visible={showDetails}
        onHide={() => setShowDetails(false)}
        style={{ width: "100vw", height: "100vh" }}
        modal
        className={styles.mobileDialog}
      >
        {loadingDetails ? (
          <div className={styles.loadingContainer}>
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
            <p>Loading booking details...</p>
          </div>
        ) : bookingDetails ? (
          <div style={{ padding: "1rem" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <h3>Patient Information</h3>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <span className={styles.label}>Name:</span>
                <span className={styles.value}>
                  {bookingDetails.patientDetails?.name || "N/A"}
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <span className={styles.label}>Age:</span>
                <span className={styles.value}>
                  {bookingDetails.patientDetails?.age || "N/A"}
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>
                  {bookingDetails.patientDetails?.phone || "N/A"}
                </span>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <h3>Lab Information</h3>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <span className={styles.label}>Lab Name:</span>
                <span className={styles.value}>
                  {bookingDetails.labId?.name || "Unknown Lab"}
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>
                  {bookingDetails.labId?.phone || "N/A"}
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <span className={styles.label}>City:</span>
                <span className={styles.value}>
                  {bookingDetails.labId?.city || "N/A"}
                </span>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <h3>Tests Requested</h3>
              {bookingDetails.testsRequested?.map((test, index) => (
                <div key={index} className={styles.testDetailItem}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "1rem",
                    }}
                  >
                    <span className={styles.testName}>{test.name}</span>
                    <span className={styles.testPrice}>₹{test.price}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "1rem",
                    }}
                  >
                    <span>Sample: {test.sampleType}</span>
                    <Tag
                      value={test.status}
                      severity={getStatusSeverity(test.status)}
                    />
                  </div>

                  {/* Test Results Section - Show directly below test name */}
                  {test.status === "completed" && test.testResultId && (
                    <div className={styles.testResultsSection}>
                      {/* Test Result Details */}
                      {selectedTestResult &&
                      selectedTestResult.testId === test.testResultId ? (
                        <div className={styles.testResultDetails}>
                          <div className={styles.resultSummary}>
                            <div className={styles.resultItem}>
                              <span className={styles.resultLabel}>
                                Test Date:
                              </span>
                              <span className={styles.resultValue}>
                                {selectedTestResult.testDate
                                  ? formatDate(selectedTestResult.testDate)
                                  : "N/A"}
                              </span>
                            </div>
                            <div className={styles.resultItem}>
                              <span className={styles.resultLabel}>
                                Status:
                              </span>
                              <Tag
                                value={selectedTestResult.status || "pending"}
                                severity={getStatusSeverity(
                                  selectedTestResult.status
                                )}
                              />
                            </div>
                          </div>

                          {/* Test Parameters */}
                          <div className={styles.testParameters}>
                            <h5>Test Parameters</h5>
                            <div className={styles.parametersTable}>
                              <div className={styles.parameterHeader}>
                                <span>Parameter</span>
                                <span>Value</span>
                                <span>Unit</span>
                                <span>Reference Range</span>
                                <span>Status</span>
                              </div>
                              {selectedTestResult.results?.map(
                                (result, resultIndex) => (
                                  <div
                                    key={resultIndex}
                                    className={styles.parameterRow}
                                  >
                                    <span className={styles.parameterName}>
                                      {result.name || "Unknown Parameter"}
                                    </span>
                                    <span className={styles.parameterValue}>
                                      {result.value || "N/A"}
                                    </span>
                                    <span className={styles.parameterUnit}>
                                      {result.unit || "N/A"}
                                    </span>
                                    <span className={styles.parameterRange}>
                                      {result.referenceRange || "N/A"}
                                    </span>
                                    <span className={styles.parameterStatus}>
                                      <Tag
                                        value={result.status || "normal"}
                                        severity={getStatusSeverity(
                                          result.status
                                        )}
                                      />
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Additional Notes */}
                          {selectedTestResult.notes && (
                            <div className={styles.testNotes}>
                              <h5>Notes</h5>
                              <p>{selectedTestResult.notes}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.loadTestResults}>
                          <Button
                            label="Load Test Results"
                            icon="pi pi-eye"
                            onClick={() => viewTestResult(test.testResultId)}
                            className={styles.loadResultsButton}
                            loading={loadingTestResult}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <h3>Payment Information</h3>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <span className={styles.label}>Total Amount:</span>
                <span className={styles.value}>
                  ₹{bookingDetails.payment?.totalAmount || 0}
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <span className={styles.label}>Payment Status:</span>
                <Tag
                  value={bookingDetails.payment?.paymentStatus || "pending"}
                  severity={getStatusSeverity(
                    bookingDetails.payment?.paymentStatus
                  )}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.fullScreenError}>
            <i
              className="pi pi-exclamation-triangle"
              style={{ fontSize: "2rem", color: "var(--red-500)" }}
            ></i>
            <p>Failed to load booking details</p>
          </div>
        )}
      </Dialog>
    );
  };

  const testResultsDialog = () => {
    return (
      <Dialog
        header="Test Results"
        visible={showTestResults}
        onHide={() => setShowTestResults(false)}
        style={{ width: "100vw", height: "100vh" }}
        modal
        className={styles.mobileDialog}
      >
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <label>From Date</label>
              <Calendar
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.value)}
                dateFormat="yy-mm-dd"
                placeholder="Select From Date"
                className={styles.mobileCalendar}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <label>To Date</label>
              <Calendar
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.value)}
                dateFormat="yy-mm-dd"
                placeholder="Select To Date"
                className={styles.mobileCalendar}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <Button
              label="Apply Filters"
              icon="pi pi-filter"
              onClick={() => fetchTestResults()}
              className={styles.primaryButton}
              style={{ width: "100%" }}
            />
            <Button
              label="Clear"
              icon="pi pi-times"
              onClick={() =>
                setFilters({
                  status: "all",
                  fromDate: null,
                  toDate: null,
                  page: 1,
                  limit: 10,
                })
              }
              className={styles.secondaryButton}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
            <p>Loading test results...</p>
          </div>
        ) : testResults.length > 0 ? (
          <>
            <DataView
              value={testResults}
              itemTemplate={testResultTemplate}
              paginator={false}
              emptyMessage="No test results found"
            />
            <Paginator
              first={(pagination.page - 1) * pagination.limit}
              rows={pagination.limit}
              totalRecords={pagination.total}
              onPageChange={handlePageChange}
              rowsPerPageOptions={[5, 10, 20]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </>
        ) : (
          <div className={styles.noResults}>
            <p>No test results found for the selected criteria</p>
          </div>
        )}
      </Dialog>
    );
  };

  return (
    <div className={styles.mobileBookingListContainer}>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Show Booking Details Page when active */}
      {showDetailsPage && selectedBooking && (
        <BookingDetailsPage
          booking={selectedBooking}
          visible={showDetailsPage}
          onHide={() => setShowDetailsPage(false)}
          onBack={handleBackFromDetails}
        />
      )}

      {/* Show main booking list when details page is not active */}
      {!showDetailsPage && (
        <>
          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            My Lab Tests Bookings
          </p>

          {/* Bookings Content */}
          {loading ? (
            <div className={styles.loadingContainer}>
              <i
                className="pi pi-spin pi-spinner"
                style={{ fontSize: "2rem" }}
              ></i>
              <p>Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <i className="pi pi-calendar-times"></i>
              </div>
              <h3>No Bookings Found</h3>
              <p>
                You don't have any lab bookings yet. Start by booking your first
                test.
              </p>
              <Button
                label="Book New Test"
                icon="pi pi-plus"
                onClick={() => (window.location.href = "/lab")}
                className={styles.primaryButton}
              />
            </div>
          ) : (
            <div className={styles.bookingsContainer}>
              <DataView
                value={bookings}
                itemTemplate={itemTemplate}
                paginator={false}
                loading={loading}
                emptyMessage="No bookings found"
              />
              <div className={styles.paginationContainer}>
                <Paginator
                  first={(pagination.page - 1) * pagination.limit}
                  rows={pagination.limit}
                  totalRecords={pagination.total}
                  onPageChange={handlePageChange}
                  rowsPerPageOptions={[5, 10, 20]}
                  template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                />
              </div>
            </div>
          )}

          {testResultsDialog()}
          <LabResult
            resultData={selectedTestResult}
            visible={showTestResultDetails}
            onHide={() => setShowTestResultDetails(false)}
          />
        </>
      )}
    </div>
  );
};

export default BookingList;
