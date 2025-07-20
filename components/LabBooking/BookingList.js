import React, { useState, useEffect, useRef } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import axios from "axios";
import styles from "./styles.module.css";
import {
  labBookingApi,
  getAuthHeaders,
  handleApiError,
} from "../../config/api/labApi";

const BookingList = () => {
  const toast = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setBookings(response.data.data || []);
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

  const viewBookingDetails = async (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
    await fetchBookingDetails(booking._id);
  };

  const viewTestResult = (resultId) => {
    fetchTestResultDetails(resultId);
  };

  const viewTestResults = () => {
    setShowTestResults(true);
    fetchTestResults();
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
              <h3>{booking.labId?.name || "Lab Name"}</h3>
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
            <div>
              {booking.testsRequested?.slice(0, 3).map((test, index) => (
                <div key={index} className={styles.testItem}>
                  <div className={styles.testInfo}>
                    <span className={styles.testName}>{test.name}</span>
                    <span className={styles.testPrice}>₹{test.price}</span>
                  </div>
                  {test.status === "completed" && test.testResultId && (
                    <Button
                      label="View Result"
                      icon="pi pi-file"
                      onClick={() => viewTestResult(test.testResultId)}
                      className={styles.resultButton}
                    />
                  )}
                </div>
              ))}
              {booking.testsRequested?.length > 3 && (
                <div className={styles.moreTests}>
                  +{booking.testsRequested.length - 3} more tests
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
        style={{ width: "95%", maxWidth: "600px" }}
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
          <div className={styles.mobileBookingDetails}>
            <div className={styles.detailSection}>
              <h3>Patient Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.label}>Name:</span>
                <span className={styles.value}>
                  {bookingDetails.patientDetails?.name || "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Age:</span>
                <span className={styles.value}>
                  {bookingDetails.patientDetails?.age || "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>
                  {bookingDetails.patientDetails?.phone || "N/A"}
                </span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Lab Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.label}>Lab Name:</span>
                <span className={styles.value}>
                  {bookingDetails.labId?.name || "Unknown Lab"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>
                  {bookingDetails.labId?.phone || "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>City:</span>
                <span className={styles.value}>
                  {bookingDetails.labId?.city || "N/A"}
                </span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Tests Requested</h3>
              {bookingDetails.testsRequested?.map((test, index) => (
                <div key={index} className={styles.testDetailItem}>
                  <div className={styles.testDetailHeader}>
                    <span className={styles.testName}>{test.name}</span>
                    <span className={styles.testPrice}>₹{test.price}</span>
                  </div>
                  <div className={styles.testDetailInfo}>
                    <span>Sample: {test.sampleType}</span>
                    <Tag
                      value={test.status}
                      severity={getStatusSeverity(test.status)}
                    />
                  </div>
                  {test.status === "completed" && test.testResultId && (
                    <Button
                      label="View Result"
                      icon="pi pi-file"
                      onClick={() => viewTestResult(test.testResultId)}
                      className={styles.resultButton}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className={styles.detailSection}>
              <h3>Payment Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.label}>Total Amount:</span>
                <span className={styles.value}>
                  ₹{bookingDetails.payment?.totalAmount || 0}
                </span>
              </div>
              <div className={styles.detailItem}>
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
          <div className={styles.errorContainer}>
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

  const testResultDetailsDialog = () => {
    if (!selectedTestResult) return null;

    return (
      <Dialog
        header="Test Result Details"
        visible={showTestResultDetails}
        onHide={() => setShowTestResultDetails(false)}
        style={{ width: "95%", maxWidth: "600px" }}
        modal
        className={styles.mobileDialog}
      >
        {loadingTestResult ? (
          <div className={styles.loadingContainer}>
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
            <p>Loading test result details...</p>
          </div>
        ) : selectedTestResult ? (
          <div className={styles.mobileBookingDetails}>
            <div className={styles.detailSection}>
              <h3>Test Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.label}>Test Name:</span>
                <span className={styles.value}>
                  {selectedTestResult.testName || "Unknown Test"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Test Date:</span>
                <span className={styles.value}>
                  {selectedTestResult.testDate
                    ? formatDate(selectedTestResult.testDate)
                    : "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Status:</span>
                <Tag
                  value={selectedTestResult.status || "pending"}
                  severity={getStatusSeverity(selectedTestResult.status)}
                />
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Test Results</h3>
              {selectedTestResult.results?.map((result, index) => (
                <div key={index} className={styles.resultItem}>
                  <div className={styles.resultHeader}>
                    <span className={styles.parameterName}>
                      {result.name || "Unknown Parameter"}
                    </span>
                    <span className={styles.parameterValue}>
                      {result.value || "N/A"}
                    </span>
                  </div>
                  <div className={styles.resultDetails}>
                    <span>Unit: {result.unit || "N/A"}</span>
                    <span>Range: {result.referenceRange || "N/A"}</span>
                    <Tag
                      value={result.status || "normal"}
                      severity={getStatusSeverity(result.status)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.detailSection}>
              <h3>Download Report</h3>
              <Button
                label="Download Report"
                icon="pi pi-download"
                onClick={() =>
                  window.open(
                    `${apiUrl}/result/download?resultId=${selectedTestResult.resultId}`,
                    "_blank"
                  )
                }
                className={styles.downloadButton}
              />
            </div>
          </div>
        ) : (
          <div className={styles.errorContainer}>
            <i
              className="pi pi-exclamation-triangle"
              style={{ fontSize: "2rem", color: "var(--red-500)" }}
            ></i>
            <p>Failed to load test result details</p>
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
        style={{ width: "95%", maxWidth: "600px" }}
        modal
        className={styles.mobileDialog}
      >
        <div className={styles.mobileFilterSection}>
          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label>From Date</label>
              <Calendar
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.value)}
                dateFormat="yy-mm-dd"
                placeholder="Select From Date"
                className={styles.mobileCalendar}
              />
            </div>
            <div className={styles.filterItem}>
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
          <div className={styles.filterActions}>
            <Button
              label="Apply Filters"
              icon="pi pi-filter"
              onClick={() => fetchTestResults()}
              className={styles.applyButton}
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
              className={styles.clearButton}
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

      {/* Lab Bookings Header */}
      {/* <div className={styles.labBookingsHeader}>
        <h1>Lab Bookings</h1>
        <Button
          label="Create New Booking"
          icon="pi pi-plus"
          onClick={() => (window.location.href = "/lab")}
          className={styles.createBookingButton}
        />
      </div> */}

      {/* My Lab Bookings Section */}
      <div className={styles.myBookingsSection}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className={styles.sectionHeader}
        >
          <h2>My Lab Bookings</h2>
          <p>Manage and track your laboratory test bookings</p>
        </div>
        <div className={styles.sectionActions}>
          <Button
            label="View Test Results"
            icon="pi pi-file"
            onClick={viewTestResults}
            className={styles.viewResultsButton}
          />
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            onClick={fetchBookings}
            loading={loading}
            className={styles.refreshButton}
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className={styles.mobileFilterSection}>
        <div className={styles.filterChipsContainer}>
          <div className={styles.filterChips}>
            {[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ].map((status) => (
              <button
                key={status.value}
                className={`${styles.filterChip} ${
                  filters.status === status.value ? styles.filterChipActive : ""
                }`}
                onClick={() => handleFilterChange("status", status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Content */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
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

      {bookingDetailsDialog()}
      {testResultsDialog()}
      {testResultDetailsDialog()}
    </div>
  );
};

export default BookingList;
